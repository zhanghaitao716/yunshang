(function($){
    $.fn.creatmenu = function(options){
        var option = options;
        if (!option) {
            return;
        }

        var str = '';

        var _this = $(this);

        function initMenu(){

            creatMenu(option);
            _this.html('').append(str);
            _this.find('li').find('ul').css('display','none');
        }
        initMenu();

        function creatMenu(data){
            str += "<ul>";
            for(var i = 0; i < data.length;i++){
                if(data[i]["children"] && data[i]["children"].length > 0){
                    str += "<li><span class='"+ data[i]['class'] +"'>"+ data[i]['name']+"</span>";
                    creatMenu(data[i]['children']);
                    str +="</li>"
                }else{
                    str += "<li><span class='"+ data[i]['class'] +"' url='"+ data[i]['url'] +"'>"+ data[i]['name']+"</span>";
                    str +="</li>";
                }
            }
            str += "</ul>";
        }

        function clickSpan(){
            if($(this).siblings('ul').length > 0){
                if($(this).siblings('ul').css('display') !== 'none'){
                    $(this).siblings('ul').slideUp(150);
                    $(this).removeClass('bksxfed-active');
                }else{
                    $(this).siblings('ul').slideDown(150);
                    _this.find('.bksxfed-active').removeClass('bksxfed-active');
                    $(this).addClass('bksxfed-active');
                    addActive($(this));
                    $(this).parent('li').siblings('li').children('ul').slideUp(150);
                }
            }else{
                _this.find('.bksxfed-active').removeClass('bksxfed-active');
                $(this).addClass('bksxfed-active');
                addActive($(this));
                $('iframe').attr('src',$(this).attr('url'));
            }
        }

        function addActive(_this){
            if(_this.parent('li').parent('ul').siblings('span').length > 0){
                _this.parent('li').parent('ul').siblings('span').addClass('bksxfed-active');
                addActive(_this.parent('li').parent('ul').siblings('span'));
            }
        }

        _this.on('click','span',clickSpan);
    }
})($);


$(function(){
    //点击全部未读消息

    $('.bksxfed-all-new a').click(function(){
        var target = $(this).attr('target');
        $('iframe').attr('src',target);
    });

    //关闭未读消息查看框
    $(document).on('click','.bksxfed-full-news .bksxfed-close',function(){
        $(document).find('.bksxfed-full-news').remove();
    });

    //关闭图片查看框
    $(document).on('click','.bksxfed-full-pic .bksxfed-close',function(){
        $(document).find('.bksxfed-full-pic').remove();
    });

    //页面滚动到顶部
    $(document).on('click','.bksxfed-full-news .bksxfed-top',function(){
        $(window.frames['iframess'].document).find('.bksxfed-xiaoxi').animate({scrollTop:0},200);
    });

    //点击header的图标，样式改变
    $('.bksxfed-header-icon p').click(function(){
        $(this).siblings('p').removeClass('bksxfed-active');
        if($(this).hasClass('bksxfed-active')){
            $(this).removeClass('bksxfed-active');
        }else{
            $(this).addClass('bksxfed-active');

        }
    });

    //点击header的未读消息图标显示或隐藏未读消息
    $('.bksxfed-header-icon-wdxx').click(function(){
        $(this).siblings('p').removeClass('bksxfed-active');
        $('.bksxfed-portrait').removeClass('bksxfed-active');
        $('.bksxfed-header-select').fadeOut(150);
        if($(this).hasClass('bksxfed-active')){
            $('.bksxfed-header-new').fadeOut(150);
            $(this).removeClass('bksxfed-active');
        }else{
            $('.bksxfed-header-new').fadeIn(150);
            $(this).addClass('bksxfed-active');
        }

        if(event.stopPropagation){
            event.stopPropagation();
        }else if(window.event){
            window.event.cancelBubble = true;
        }

    });

    //点击header的头像
    $('.bksxfed-portrait').click(function(event){
        $('.bksxfed-header-right .bksxfed-header-icon-wdxx').removeClass('bksxfed-active');
        $('.bksxfed-header-new').fadeOut(150);
        if($('.bksxfed-header-select').css('display') !== 'none'){
            $(this).removeClass('bksxfed-active');
            $('.bksxfed-header-select').fadeOut(150);
        }else{
            $('.bksxfed-header-select').fadeIn(150);
            $(this).addClass('bksxfed-active');
        }
        if(event.stopPropagation){
            event.stopPropagation();
        }else if(window.event){
            window.event.cancelBubble = true;
        }
    });



    $(document).click(function(event){
        close(event);
    });
});

//关闭头像下拉框
function close(event){
    $('.bksxfed-portrait').removeClass('bksxfed-active');
    $('.bksxfed-header-select').fadeOut(150);
    $('.bksxfed-header-right .bksxfed-header-icon-03').removeClass('bksxfed-active');
    $('.bksxfed-header-new').fadeOut(150);
}

//判断图片的大小
function setpic(src){

    var str =   '<div class="bksxfed-full-pic">'+
        '<div class="bksxfed-close"></div> '+
        '<div class="bksxfed-opacity"></div>'+
        '<div class="bksxfed-pic">'+
        '<img src="'+ src +'">'+
        '</div>'+
        '</div>';

    $('body').append(str);
    var _this = $(document).find('.bksxfed-full-pic');
    _this.find('img').load(function(){
        var imgW = _this.find('img').width();
        var imgH = _this.find('img').height();

        var picW = _this.find('.bksxfed-pic').width();
        var picH = _this.find('.bksxfed-pic').height();

        if(picW > imgW && picH > imgH){
            //图片小

            var imgW = _this.find('img').eq(0).width();
            var imgH = _this.find('img').eq(0).height();
            _this.find('img').css('marginTop',(picH - imgH)/2);
            _this.find('img').css('marginLeft',(picW - imgW)/2);


        }else if(picW > imgW && picH < imgH){
            //特别高
            _this.find('img').css('height','100%');
            var picW = _this.find('.bksxfed-pic').width();
            var imgW = _this.find('img').width();
            _this.find('img').css('marginLeft',(picW - imgW)/2);

        }else if(picW < imgW && picH > imgH){
            //特别宽
            _this.find('img').css('width','100%');
            var picH = _this.find('.bksxfed-pic').height();
            var imgH = _this.find('img').height();
            _this.find('img').css('marginTop',(picH - imgH)/2);
        }else{
            //特别大
            //判断比例
            if(picH / picW < imgH / imgW){
                _this.find('img').css('height','100%');
                var picW = _this.find('.bksxfed-pic').width();
                var imgW = _this.find('img').width();
                _this.find('img').css('marginLeft',(picW - imgW)/2);
            }else{
                _this.find('img').css('width','100%');
                var picH = _this.find('.bksxfed-pic').height();
                var imgH = _this.find('img').height();
                _this.find('img').css('marginTop',(picH - imgH)/2);
            }
        }

        var close = _this.find('.bksxfed-close');



        var left = parseInt(_this.find('.bksxfed-pic').css('left')) + parseInt(_this.find('img').css('marginLeft')) + parseInt(_this.find('img').width()) + 10;
        var top = parseInt(_this.find('.bksxfed-pic').css('top')) + parseInt(_this.find('img').css('marginTop'))  + 10;

        close.css({
            "left":left,
            "top":top
        })

    });



}