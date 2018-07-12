$(function(){
    /**
     * 高拍仪拍照
     * @type {string}
     */
    suffix = "jpg";//上传文件的后缀名
    imagebase64str = "";//base64照片
    filename = "";//上传文件名称
    info = '拍照完毕,正在跳转卡面信息核对页面!';

    /*  //初始化信息
      $(function () {
          //开启高拍仪
          start_preview();
          var ifr = document.getElementById('ifr');
          $(ifr).load(function () {
              filename = $(window.frames["ifr"].document).find("input[name='temp-data']").val();
              //隐藏拍照显示控件
              if (filename != "" && filename != "ok" && filename != undefined) {
                  $('#area_photo').hide();
                  $('#pzan').hide();
                  $("#area_show").show();
                  //回显拍照的相片
                  $('#img_show').attr("src", "http://192.168.120.115:9008/zpfw/readimage?filename=" + filename);
                  $('#scCp').show();
              }
          });
      });*/
    //    }
    //初始化高拍仪
    $(function () {
        /* function start_preview() {*/
        var num = LaCtrl.btnGetCameraCount_Click('01');
        if (num != 3) {
            mjnotie.alert( "请先连接高拍仪!");
            return;
        }
        LaCtrl.btnEnableDelBack_Click(false);
        LaCtrl.btnSetDefaultResolution_Click(2);//设置默认分辨率 2 1200*1600
        LaCtrl.btnOpenSub_Click('01');
        /*  }*/
    });

    //拍照--获取base64
    function capturebase64() {
        LaCtrl.btnEnableDelBack_Click(false);
        imagebase64str = LaCtrl.btnCaptureSubBase64_Click("gpypz.JPG");
        //上传照片服务器  临时文件 并且回显照片
        if (imagebase64str == "") {
            alert("获取照片信息失败,请稍后再试!");
            return;
        }
        $("input[name='base64str']").val(imagebase64str);

        // $('#form1').submit();
        //提交form表单
        $.ajax({
            url : "http://192.168.120.115:9008/zpfw/upload",
            type : "POST",
            data : $('#form1').serialize(),
            success : function(data) {
                console.log(data.info)
                var ifr = document.getElementById('ifr');
                filename = data.info;
                if (filename != "" && filename != "ok" && filename != undefined) {
                    $('#area_photo').hide();
                    $('#pzan').hide();
                    $("#area_show").show();
                    //回显拍照的相片
                    $('#img_show').attr("src", "http://192.168.120.115:9008/zpfw/readimage?filename=" + filename);
                    $('#scCp').show();
                }
            },
            error:function(e){
                // console.log(e);
            }
        });
        $("#pzan").hide();
        $("#area_photo").hide();

    }
    //关闭页面释放高拍仪资源
    window.onbeforeunload = function () {
        stop_preview();
    }

    //关闭资源
    function stop_preview() {
        LaCtrl.btnCloseSub_Click();
    }

    //弱光环境拍照
    function dodark() {
        LaCtrl.btnLowLight_Click();
    }

    //强光环境拍照
    function dobright() {
        LaCtrl.btnHightLight_Click();
    }

    //自动光线拍照
    function setauto() {
        LaCtrl.btnAuto_Click();
    }

    //重拍
    function chongpai() {
        $('#area_show').hide();//隐藏会显照片区
        $('#img_show').src = "";//重置照片
        $('#scCp').hide();//隐藏确认按钮
        $('#area_photo').show();//显示拍照区
        $('#pzan').show();//显示拍照按钮
        filename = "";//重置文件名,
        $('#sc_btn').hide();
        $('#xszp').hide();
    }

    //确认
    function queren() {
        $("#gpyzp").prop("src", "http://192.168.120.115:9008/zpfw/readimage?filename=" + filename);
        $('#scCp').hide();
        $('#area_show').hide();
        $('#sc_btn').show();
        $('#zpmc').val(filename);
        $("#pzbase64").val(imagebase64str);

    }


    /**
     * 读取证卡信息
     */
    function ksdk(){
        if(!residence_permit.OpenDevice(0x10C482CD, 0, "01")) {
            alert('设备打开失败！');
            return;
        }
        yzPsamMm();
        if(!residence_permit.CloseDevice()) {
            alert('设备关闭失败!');
            return;
        }
    }

    function  yzPsamMm(){
        if (!residence_permit.ActiveDevice()) {
            alert( '请在高拍仪上放置证件!');
            return;
        }
        var kh=residence_permit.PsamCardId;
        if(kh){
            var kpassword= "";
            $.ajax( {
                type : "POST",
                async: false,
                url  : "http://192.168.120.115:8086/yun_community/access/gpyyz",
                data : {
                    "kh" : kh
                },
                success : function(data) {
                    if(data){
                        kpassword = data;
                    }else{
                        alert('此PSAM卡无效！');
                        return;
                    }
                },
                error : function() {
                    alert('网络错误，请重试!');
                }
            });
            if (!residence_permit.InternalAuth(kpassword)) {
                alert('内部认证失败!');
                return;
            }
            //得到证件类型 00 居住证，01登记凭证
            var rdType = residence_permit.RdType;

            if (rdType == null) {
                alert('获取卡类型失败!');
                return;
            }
            var ryxx = residence_permit.ReadData("wef24", rdType);
            var yxks_jzrq = residence_permit.ReadData("wef25", rdType);
            var dzxx = residence_permit.ReadData("wef26", rdType);
            ryxx = $.parseJSON(ryxx);
            var xb = ryxx.A3;
            if (xb == "1") {
                xb = "男";
            } else {
                xb = "女";
            }
            //获取姓名
            document.getElementById("xm").value = ryxx.A2.replace(/^\s+|\s+$/g, "");
            //获取身份证号码
            document.getElementById("sfz").value = ryxx.A1.replace(/^\s+|\s+$/g, "");

            var kdf = residence_permit.Factor;
            document.getElementById("kdf").value = kdf;
            //获取照片渲染到标签中
            var zpxx = ryxx.A12;
            document.getElementById('zkzp').src = 'data:image/jpg;base64,' + zpxx;//注ie6，7时无法显示
            $('#zkzp').attr('width', '137px');
            $('#zkzp').attr('height', '178px');
            document.getElementById("kpbase64").value =zpxx;
        }
    }

    /**
     * 表单提交，授权
     */
    function sub(){
        $.ajax({
            url : "http://192.168.120.115:8086/yun_community/access/gpysq",
            type : "POST",
            data : $('#sq').serialize(),
            success : function(data) {
                alert(data.returnMsg);
            },
            error:function(e){
                alert(e);
            }
        });
    }


    $(".start").on("click",function () {
        ksdk();
    })



})