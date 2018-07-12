(function($){
    $.fn.setOperat = function(option){
        var _this = $(this);
        var options = option;
        function init(){
            $('.bksxfed-detail-caozuo-warp').remove();
            _this.append('<div class="bksxfed-detail-caozuo-warp" style="display: none"><ul></ul></div>');
            for(var i = 0; i < options.length; i++){
                var deal = options[i];
                $('<li><a>'+ deal["name"] +'</a></li>').appendTo(_this.find('ul')).click(function(){
                    var d = deal["deal"];
                    d($(this).parent('ul').parent('.bksxfed-detail-caozuo-warp').parent());
                });
            }

        }
        init();

        _this.mouseover(function(){
            $(this).find('.bksxfed-detail-caozuo-warp').fadeIn(150);
            $(this).mouseleave(function(){
                $(this).find('.bksxfed-detail-caozuo-warp').fadeOut(150);
            });
        });
    }

})($);
(function($){
    var bksx = {
        "alert_fail": function(options){
            var option = options;
            function init(){
                var str = '<div class="bksxfed-full-alert" id="alert_fail">'+
                    '<div class="bksxfed-alert-opacity"></div>'+
                    '<div class="bksxfed-alert-half bksxfed-alert-lan-half">'+
                    '<div class="bksxfed-alert-middle bksxfed-alert-half-middle">'+
                    '<div class="bksxfed-alert-hong-top"></div>'+
                    '<div class="bksxfed-alert-hong-pic"></div>'+
                    '<div class="bksxfed-alert-m-lan-title">是否进行该操作？</div>'+
                    '<div class="bksxfed-alert-m-lan-text">'+ option +'</div>'+
                    '<input type="button" class="bksxfed-btn-default bksxfed-alert-m-zdl" value="知道了">'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $('body').append(str);
                $('body', parent.document).append('<div class="bksxfed-full-warp"></div>');
                $('body', parent.document).find('.bksxfed-full-warp').css({
                    "background": "#969696",
                    "opacity": "0.4",
                    "filter":"alpha(opacity=40)",
                    "-moz-opacity":"0.4",
                    "-khtml-opacity": "0.4",
                    "position": "fixed",
                    "left": "0",
                    "right": "0",
                    "top":"0",
                    "bottom": "0"
                });

            }
            init();

            $('.bksxfed-alert-m-zdl').click(function(){
                $('.bksxfed-full-alert').remove();
                $('body', parent.document).find('.bksxfed-full-warp').remove();

            });
        },
        "alert_success": function(options){
            var option = options;
            function init(){
                var str = '<div class="bksxfed-full-alert" id="alert_success">'+
                    '<div class="bksxfed-alert-opacity"></div>'+
                    '<div class="bksxfed-alert-half bksxfed-alert-lan-half">'+
                    '<div class="bksxfed-alert-middle bksxfed-alert-half-middle">'+
                    '<div class="bksxfed-alert-lv-top"></div>'+
                    '<div class="bksxfed-alert-lv-pic"></div>'+
                    '<div class="bksxfed-alert-m-lan-title">是否进行该操作？</div>'+
                    '<div class="bksxfed-alert-m-lan-text">'+ option +'</div>'+
                    '<input type="button" class="bksxfed-btn-default bksxfed-alert-m-zdl" value="知道了">'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $('body').append(str);
                $('body', parent.document).append('<div class="bksxfed-full-warp"></div>');
                $('body', parent.document).find('.bksxfed-full-warp').css({
                    "background": "#969696",
                    "opacity": "0.4",
                    "filter":"alpha(opacity=40)",
                    "-moz-opacity":"0.4",
                    "-khtml-opacity": "0.4",
                    "position": "fixed",
                    "left": "0",
                    "right": "0",
                    "top":"0",
                    "bottom": "0"
                });

            }
            init();

            $('.bksxfed-alert-m-zdl').click(function(){
                $('.bksxfed-full-alert').remove();
                $('body', parent.document).find('.bksxfed-full-warp').remove();

            });
        },
        "alert_prompt": function(options){
            var option = options;
            function init(){
                var str =      '<div class="bksxfed-full-alert" id="alert_prompt">'+
                    '<div class="bksxfed-alert-opacity"></div>'+
                    '<div class="bksxfed-alert-half bksxfed-alert-lan-half">'+
                    '<div class="bksxfed-alert-middle bksxfed-alert-half-middle">'+
                    '<div class="bksxfed-alert-lan-top"></div>'+
                    '<div class="bksxfed-alert-lan-pic"></div>'+
                    '<div class="bksxfed-alert-m-lan-title">是否进行该操作？</div>'+
                    '<div class="bksxfed-alert-m-lan-text">'+ option +'</div>'+
                    '<input type="button" class="bksxfed-btn-default bksxfed-alert-m-zdl" value="知道了">'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $('body').append(str);
                $('body', parent.document).append('<div class="bksxfed-full-warp"></div>');
                $('body', parent.document).find('.bksxfed-full-warp').css({
                    "background": "#969696",
                    "opacity": "0.4",
                    "filter":"alpha(opacity=40)",
                    "-moz-opacity":"0.4",
                    "-khtml-opacity": "0.4",
                    "position": "fixed",
                    "left": "0",
                    "right": "0",
                    "top":"0",
                    "bottom": "0"
                });

            }
            init();

            $('.bksxfed-alert-m-zdl').click(function(){
                $('.bksxfed-full-alert').remove();
                $('body', parent.document).find('.bksxfed-full-warp').remove();

            });
        },
        "alert_confirm":function(options){
            var option = options;
            function init(){
                var str = '<div class="bksxfed-full-alert" id="alert_confirm">'+
                    '<div class="bksxfed-alert-opacity"></div>'+
                    '<div class="bksxfed-alert-half">'+
                    '<div class="bksxfed-alert-middle">'+
                    '<div class="bksxfed-alert-m-top"></div>'+
                    '<div class="bksxfed-alert-m-close"></div>'+
                    '<div class="bksxfed-alert-m-title">是否进行该操作？</div>'+
                    '<div class="bksxfed-alert-m-text">'+ option.text +'</div>'+
                    '<input type="button" class="bksxfed-btn-primary bksxfed-alert-m-shi" value="是">'+
                    '<input type="button" class="bksxfed-btn-default bksxfed-alert-m-fou" value="否">'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $('body').append(str);
                $('body', parent.document).append('<div class="bksxfed-full-warp"></div>');
                $('body', parent.document).find('.bksxfed-full-warp').css({
                    "background": "#969696",
                    "opacity": "0.4",
                    "filter":"alpha(opacity=40)",
                    "-moz-opacity":"0.4",
                    "-khtml-opacity": "0.4",
                    "position": "fixed",
                    "left": "0",
                    "right": "0",
                    "top":"0",
                    "bottom": "0"
                });

            }
            init();

            $('.bksxfed-alert-m-shi').click(function(){
                $('.bksxfed-full-alert').remove();
                $('body', parent.document).find('.bksxfed-full-warp').remove();
                option.confirm();

            });

            $('.bksxfed-alert-m-fou').click(function(){
                $('.bksxfed-full-alert').remove();
                $('body', parent.document).find('.bksxfed-full-warp').remove();
                option.cancel();

            });

            $('.bksxfed-alert-m-close').click(function(){
                $('.bksxfed-full-alert').remove();
                $('body', parent.document).find('.bksxfed-full-warp').remove();
            });
        }
    };
    $.extend(bksx);
})($);

$(function () {

    //点击图片，显示大图片
    $('.bksxfed-pic-warp').click(function(){


        var src = $(this).find('img').attr('src');
        parent.setpic(src);


    });

    //切换tab标签
    $('.bksxfed-tab li').click(function(){
        if(!$(this).hasClass('bksxfed-active')){
            $(this).siblings('li').removeClass('bksxfed-active');
            $(this).addClass('bksxfed-active');
            var target = $(this).attr('target');
            $('.bksxfed-main').css('display','none');
            $(target).css('display','');
        }
    });

    //点击显示隐藏搜索条件
    $('.bksxfed-btn-more').click(function(){
        if($(this).hasClass('bksxfed-active')){
            $(this).removeClass('bksxfed-active')
            $('.bksxfed-cx-hide').slideUp(150);
        }else{
            $(this).addClass('bksxfed-active')
            $('.bksxfed-cx-hide').slideDown(150);
        }

    })

    $('.bksxfed-news-text').click(function(){
        var target = $(this).attr('target');
        var str =   '<div class="bksxfed-full-news">'+
            '<div class="bksxfed-opacity"></div>'+
            '<div class="bksxfed-close"></div>'+
            '<div class="bksxfed-top"></div>'+
            '<div class="bksxfed-new">'+
            '<iframe width="100%" height="100%" scrolling="yes" name="iframess" src="'+ target +'" frameborder="0"></iframe>'+
            '</div>'+
            '</div>';
        $('body', parent.document).append(str);
    });
});

function closeParent(){
    $(document).click(function(event){
        parent.close(event);
    });
}
closeParent();
