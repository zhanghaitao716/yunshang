var gulp = require('gulp');
var connect = require('gulp-connect');//server
var proxy = require('http-proxy-middleware');//cross-domain
var htmlmin = require('gulp-htmlmin');//compress html
var cleancss = require('gulp-clean-css');//compress css
var autoprefixer = require('gulp-autoprefixer');//css compatible padding
var imagemin = require('gulp-imagemin');//compress image
var jshint = require('gulp-jshint');//javascript grammar check
var cache = require('gulp-cached');//file cache
var uglify = require('gulp-uglify');//compress javascript
var spriter = require('gulp-css-spriter');//image sprite
var pngquant = require('imagemin-pngquant');//compress image
var replace = require('gulp-replace');
var cheerio = require('gulp-cheerio');
var glob = require("glob");
var modifyCssUrls = require('gulp-modify-css-urls');
var minimist = require('minimist');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var fileinclude = require('gulp-file-include');
var serverConfig = require('./server.config.js');
var opn = require('opn');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');



//get arg
var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'dev' }
};

var options = minimist(process.argv.slice(2), knownOptions);


//position link
const lj = (serverConfig.protocol || 'http')  + '://' + serverConfig.host  + ((serverConfig.port === '' || serverConfig.port === '80' || serverConfig.port === undefined) ? '' : ':' + serverConfig.port) + '/';





gulp.task('image',function(){

    var jpgmin = imageminJpegRecompress({
        accurate: true,
        quality: "high",
        method: "smallfry",
        min: 70,
        loops: 0,
        progressive: false,
        subsample: "default"
    });

    var pngmin = pngquant();

    gulp.src('./app/**/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            use: [jpgmin, pngmin]
        })))
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});


gulp.task('css', function() {
    gulp.src('./app/**/*.css')
        .pipe(plumber())
        .pipe(spriter({
            'spriteSheet': './build/images/spritesheet.png',
            'pathToSpriteSheetFromCSS': '../images/spritesheet.png'
        }))
        .pipe(autoprefixer())
        .pipe(replace(/(\.\.\/)+/g,lj))
        .pipe(gulpif(options.env !== 'dev', cleancss({
            advanced: false,
            compatibility: 'ie8',
            keepBreaks: true,
            keepSpecialComments: '*'
        })))
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

gulp.task('script',function(){
    gulp.src('./app/**/*.js')
        .pipe(plumber())
        .pipe(gulpif(options.env !== 'dev', uglify({
            ie8:true
        })))
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});


gulp.task('html',function(){

    var option = {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
    };

    glob('./app/**/*.html', function (er, files) {

        for(var i = 0; i <files.length; i++){
            var paths = files[i].split('app');
            var path1 = paths[1].split('/');
            var newPath1 = '';
            for(var k = 0; k < path1.length - 1; k++){
                newPath1 += path1[k] + '/';
            }

            var bool = /include/igm.test(files[i]);
            gulp.src(files[i])
                .pipe(gulpif(!bool, fileinclude({
                    prefix: '@@',
                    basepath: '@file'
                })))
                .pipe(plumber())
                .pipe(gulpif(options.env !== 'dev', cheerio(function($,file){

                    $('script').each(function(){
                        if($(this)['0']['children'].length > 0){

                            if($(this)['0']['children'][0]['data'].indexOf('node_modules') > 0){
                                var str = $(this)['0']['children'][0]['data'];
                                var splitnode = str.split('node_modules');
                                var newStr = '';
                                for(var i = 0; i < splitnode.length - 1; i++){
                                    if(splitnode[i].substring(splitnode[i].length - 3) === '../'){

                                        var node = splitnode[i+1].substring(0,splitnode[i+1].indexOf('"'));
                                        if(node){
                                            gulp.src('node_modules/**'+ node)
                                                .pipe(gulp.dest('build/node_modules'));
                                        }
                                        splitnode[i] = splitnode[i].substring(0,splitnode[i].length - 3);
                                    }
                                    newStr += splitnode[i] + 'node_modules';
                                }
                                newStr += splitnode[splitnode.length - 1];

                                $(this)['0']['children'][0]['data'] = newStr;
                            }
                        }

                        var _this_src = $(this).attr('src');
                        if(_this_src){
                            if(_this_src.indexOf('node_modules') > -1){
                                var _src = _this_src.split('node_modules');
                                if(_src.length === 2){
                                    $(this).attr('src',lj + 'node_modules' + _src[_src.length-1]);
                                }
                                var _srcs = _this_src.split('/');
                                gulp.src('node_modules/**/'+ _srcs[_srcs.length-1])
                                    .pipe(uglify())
                                    .pipe(gulp.dest('build/node_modules'));

                            }else if(_this_src.indexOf('javascript') > -1){
                                var _src = _this_src.split('javascript');
                                if(_src.length === 2){
                                    $(this).attr('src',lj + 'javascript' + _src[_src.length-1]);
                                }
                            }

                        }
                    });

                    $('link').each(function(){
                        var _this_href = $(this).attr('href');
                        if(_this_href){
                            if(_this_href.indexOf('node_modules') > -1){

                                //添加绝对路径
                                var _href = _this_href.split('node_modules');
                                if(_href.length === 2){
                                    $(this).attr('href',lj + 'node_modules' + _href[_href.length-1]);
                                }

                                //将node_modules里面的css放入build
                                var _hrefs = _this_href.split('/');

                                //将css文件中的图片放入build
                                gulp.src('node_modules/**/'+ _hrefs[_hrefs.length-1])
                                    .pipe(modifyCssUrls({
                                        modify: function (url, filePath) {

                                            var urlss = url.split('/');

                                            urlss_length = 0;
                                            for(var i = 0;i < urlss.length; i++){
                                                if(urlss[i] === '..'){
                                                    urlss_length++
                                                }
                                            }

                                            var filePathss = filePath.split('node_modules');

                                            var filePathss01 = filePathss[1].split('\\');
                                            var filePathfinal01 = '';

                                            for(var i = 0; i < filePathss01.length - urlss_length - 1; i++){
                                                filePathfinal01 += filePathss01[i] + '/';
                                            }

                                            for(var i = 0;i < urlss.length - 1; i++){
                                                if(urlss[i] != '..'){
                                                    filePathfinal01 += urlss[i] +'/';
                                                }
                                            }
                                            gulp.src('node_modules'+ filePathfinal01 + urlss[urlss.length - 1])
                                                .pipe(gulp.dest('build/node_modules'+ filePathfinal01));

                                            return lj + 'node_modules'+ filePathfinal01 + urlss[urlss.length - 1];
                                        }

                                    }))
                                    .pipe(gulp.dest('build/node_modules'));


                            }else if(_this_href.indexOf('styles') > -1){
                                var _href = _this_href.split('styles');
                                if(_href.length === 2){
                                    $(this).attr('href',lj + 'styles' + _href[_href.length-1]);

                                }
                            }else if(_this_href.indexOf('images') > -1){
                                var _href1 = _this_href.split('images');
                                if(_href1.length === 2){
                                    $(this).attr('href',lj + 'images' + _href1[_href1.length-1]);

                                }
                            }

                        }
                    });

                    $('img').each(function(){
                        var _this_src = $(this).attr('src');
                        if(_this_src){

                            var _src = _this_src.split('images');
                            if(_src.length === 2){
                                $(this).attr('src',lj + 'images' + _src[_src.length-1]);
                            }
                        }
                    });

                    if($('a').length > 0){
                        var base = file['base'].split('\\app\\');
                        $('a').each(function(){
                            if($(this).attr('href')){
                                var _this_href = $(this).attr('href').split('/');

                                if(_this_href.length > 1){
                                    var dian_length = 0;
                                    for(var i = 0 ;i < _this_href.length ; i++){
                                        if(_this_href[i] === '..'){
                                            dian_length++;
                                        }
                                    }
                                    var baseUrl = base[1].split('\\');
                                    var urls = '';
                                    for(var i = 0; i < baseUrl.length - dian_length - 1; i++){
                                        urls += baseUrl[i] + '/';
                                    }
                                    $(this).attr('href', lj + urls + _this_href[_this_href.length - 1]);
                                }
                            }

                        });
                    }
                })))
                .pipe(gulpif(options.env !== 'dev', htmlmin(option)))
                .pipe(gulpif(!bool, gulp.dest(paths[0] +'build' + newPath1)))
                .pipe(connect.reload());
        }

    });


});
gulp.task('serverBin',function(){
    gulpif(options.env === 'dev',serverConfig.root = ['./']);
    connect.server(serverConfig);

});
gulp.task('watch',function(){
    gulp.watch('app/**/*.html',['html']);
    gulp.watch('app/**/*.css',['css']);
    gulp.watch('app/**/*.{png,jpg,gif,svg}',['image']);
    gulp.watch('app/**/*.js',['script']);
    opn(lj+'/app', {app: ['chrome'],wait:true});

});
gulp.task('default',['html','image','css','script','serverBin','watch']);
