var proxy = require('http-proxy-middleware');
//服务配置
module.exports = {
    host: "127.0.0.1",
    root:['./build/'],
    port:8888,
    livereload: true,
    middleware:function(connect, opt){
        return [
            proxy('/api',  {
                target: 'http://127.0.0.1:36742',
                changeOrigin:true
            }),
            proxy('/upload',  {
                target: 'http://130.10.7.127:8080/fileupload',
                changeOrigin:true
            })
        ];
    }
}


