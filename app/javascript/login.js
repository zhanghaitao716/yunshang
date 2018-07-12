// function rememberUser(){
//
//     var user = $('#lg_user').val();
//     var pass = $('#lg_password').val();
//     localStorage.setItem('lg_user',user);
//     if($('#lg_rem_true').is(':checked')){
//         localStorage.setItem('lg_pass',pass);
//         localStorage.setItem('lg_remember','true');
//     }else{
//         localStorage.removeItem('lg_pass');
//         localStorage.removeItem('lg_remember');
//     }
// }

$(function(){
    // var lg_user = localStorage.getItem('lg_user');
    // var lg_pass = localStorage.getItem('lg_pass');
    // var lg_remember = localStorage.getItem('lg_remember');
    // if(lg_user){
    //     $("#lg_user").val(lg_user);
    // }
    // if(lg_pass){
    //     $("#lg_password").val(lg_pass);
    // }
    //
    // if(lg_remember){
    //     $("#lg_rem_true").attr("checked", true);
    // }

    //切换用户登陆和其他登陆
    $('.bksxfed-tab').click(function(){
        $(this).addClass('bksxfed-active');
        $(this).siblings('.bksxfed-tab').removeClass('bksxfed-active');
        if($(this).hasClass('bksxfed-left')){
            $('.bksxfed-yhdl').css('display','');
            $('.bksxfed-qtdl').css('display','none');
        }else{
            $('.bksxfed-yhdl').css('display','none');
            $('.bksxfed-qtdl').css('display','');
        }
    });
})