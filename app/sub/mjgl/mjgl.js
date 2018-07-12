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
            //证卡信息
            var ryxx = residence_permit.ReadData("wef24", rdType);
            var wef24 = JSON.parse(residence_permit.ReadData("wef24", rdType))
            var yxks_jzrq = residence_permit.ReadData("wef25", rdType);
            var dzxx = residence_permit.ReadData("wef26", rdType);
            var wef26 = JSON.parse(residence_permit.ReadData("wef26", rdType));
            var w26 = wef26.A1 + " ";
            ryxx = $.parseJSON(ryxx);
            //性别
            var xb = ryxx.A3;
            //民族
            var mz=wef24.A4;
            //户籍所在地
            var hjszd=ryxx.A6;
            var aaaa=wef24.A9;
            //判断性别
            if (xb == "1") {
                xb = "男";
            } else {
                xb = "女";
            }
            //判断民族
            switch(mz){ //民族代码
                case '01':  mz='汉族'; break;
                case '02':  mz='蒙古族'; break;
                case '03':  mz='回族'; break;
                case '04':  mz='藏族'	; break;
                case '05':  mz='维吾尔族'	; break;
                case '06':  mz='苗族'	; break;
                case '07':  mz='彝族'	; break;
                case '08':  mz='壮族'	; break;
                case '09':  mz='布依族'	; break;
                case '10':  mz='朝鲜族'	; break;
                case '11':  mz='满族'	; break;
                case '12':  mz='侗族'	; break;
                case '13':  mz='瑶族'	; break;
                case '14':  mz='白族'	; break;
                case '15':  mz='土家族'	; break;
                case '16':  mz='哈尼族'	; break;
                case '17':  mz='哈萨克族'	; break;
                case '18':  mz='傣族'	; break;
                case '19':  mz='黎族'	; break;
                case '20':  mz='傈僳族'	; break;
                case '21':  mz='佤族'	; break;
                case '22':  mz='畲族'	; break;
                case '23':  mz='高山族'	; break;
                case '24':  mz='拉祜族'	; break;
                case '25':  mz='水族'	; break;
                case '26':  mz='东乡族'	; break;
                case '27':  mz='纳西族'	; break;
                case '28':  mz='景颇族'	; break;
                case '29':  mz='柯尔克孜族'; break;
                case '30':  mz='土族'; break;
                case '31':  mz='达斡尔族'; break;
                case '32':  mz='仫佬族'	; break;
                case '33':  mz='羌族'; break;
                case '34':  mz='布朗族'	; break;
                case '35':  mz='撒拉族'	; break;
                case '36':  mz='毛南族'	; break;
                case '37':  mz='仡佬族'	; break;
                case '38':  mz='锡伯族'	; break;
                case '39':  mz='阿昌族'	; break;
                case '40':  mz='普米族'	; break;
                case '41':  mz='塔吉克族'; break;
                case '42':  mz='怒族'	; break;
                case '43':  mz='乌孜别克族'; break;
                case '44':  mz='俄罗斯族'; break;
                case '45':  mz='鄂温克族'; break;
                case '46':  mz='德昂族'	; break;
                case '47':  mz='保安族'	; break;
                case '48':  mz='裕固族'	; break;
                case '49':  mz='京族'	; break;
                case '50':  mz='塔塔尔族'; break;
                case '51':  mz='独龙族'	; break;
                case '52':  mz='鄂伦春族'; break;
                case '53':  mz='赫哲族'	; break;
                case '54':  mz='门巴族'	; break;
                case '55':  mz='珞巴族'	; break;
                case '56':  mz='基诺族'	; break;
                case '57':  mz='穿青族'  ;  break;
            }



            // function Toyyyy_MM_dd(wef24.A10);


            //获取姓名
            document.getElementById("xm").value = ryxx.A2.replace(/^\s+|\s+$/g, "");
            //获取身份证号码
            document.getElementById("sfz").value = ryxx.A1.replace(/^\s+|\s+$/g, "");
            //获取性别
            document.getElementById("sex").value = xb.replace(/^\s+|\s+$/g, "");
            //获取民族
            document.getElementById("nation").value = mz;
            //户籍所在地
            document.getElementById("site").value = wef24.A6;
            //现住地址
            document.getElementById("now_site").value = w26;
            //开始有效日期
            document.getElementById("start_time").value = wef24.A9;
            //截至有效日期
            document.getElementById("end_time").value = wef24.A10;


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
    //时间格式化函数

    function Toyyyy_MM_dd(setDate){
        if(setDate.length == 8){
            valDate=setDate.substring(0, 4) + "-" + setDate.substring(4, 6) + "-"+ setDate.substring(6, 8);
            return valDate;
        }else if(setDate.length == 6){
            valDate=setDate.substring(0, 4) + "-" + setDate.substring(4, 6);
            return valDate;
        }
        return valDate;
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

    //读取信息
    $(".start").on("click",function () {
        ksdk();
    })
    //现场拍照
    $(".photo").on("click",function () {
        $(".layer").css('display',"block")
    })
    //拍照
    $(".pz_btn").on("click",function () {
        capturebase64();
    })
    //确认照片
    $(".qr_btn").on("click",function () {
        queren();
        $(".layer").css('display',"none")
    })
    //确认照片
    $(".cp_btn").on("click",function () {
        chongpai();
        $(".layer").css('display',"block")
    })
    //提交信息
   /* $(".sub_btn").on("click",function () {
        $.ajax({
            url : "http://192.168.120.115:8086/yun_community/access/gpysq",
            type : "POST",
            data : {
                sfz:,
                kdf:,
                pzbase64:,
                zpmc:,
            },
            success : function(data) {
                alert(data.returnMsg);
            },
            error:function(e){
                alert(e);
            }
        });
    })*/


})