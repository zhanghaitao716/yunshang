$(function(){
    /**
     * ����������
     * @type {string}
     */
    suffix = "jpg";//�ϴ��ļ��ĺ�׺��
    imagebase64str = "";//base64��Ƭ
    filename = "";//�ϴ��ļ�����
    info = '�������,������ת������Ϣ�˶�ҳ��!';

    /*  //��ʼ����Ϣ
      $(function () {
          //����������
          start_preview();
          var ifr = document.getElementById('ifr');
          $(ifr).load(function () {
              filename = $(window.frames["ifr"].document).find("input[name='temp-data']").val();
              //����������ʾ�ؼ�
              if (filename != "" && filename != "ok" && filename != undefined) {
                  $('#area_photo').hide();
                  $('#pzan').hide();
                  $("#area_show").show();
                  //�������յ���Ƭ
                  $('#img_show').attr("src", "http://192.168.120.115:9008/zpfw/readimage?filename=" + filename);
                  $('#scCp').show();
              }
          });
      });*/
    //    }
    //��ʼ��������
    $(function () {
        /* function start_preview() {*/
        var num = LaCtrl.btnGetCameraCount_Click('01');
        if (num != 3) {
            mjnotie.alert( "�������Ӹ�����!");
            return;
        }
        LaCtrl.btnEnableDelBack_Click(false);
        LaCtrl.btnSetDefaultResolution_Click(2);//����Ĭ�Ϸֱ��� 2 1200*1600
        LaCtrl.btnOpenSub_Click('01');
        /*  }*/
    });

    //����--��ȡbase64
    function capturebase64() {
        LaCtrl.btnEnableDelBack_Click(false);
        imagebase64str = LaCtrl.btnCaptureSubBase64_Click("gpypz.JPG");
        //�ϴ���Ƭ������  ��ʱ�ļ� ���һ�����Ƭ
        if (imagebase64str == "") {
            alert("��ȡ��Ƭ��Ϣʧ��,���Ժ�����!");
            return;
        }
        $("input[name='base64str']").val(imagebase64str);

        // $('#form1').submit();
        //�ύform��
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
                    //�������յ���Ƭ
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
    //�ر�ҳ���ͷŸ�������Դ
    window.onbeforeunload = function () {
        stop_preview();
    }

    //�ر���Դ
    function stop_preview() {
        LaCtrl.btnCloseSub_Click();
    }

    //���⻷������
    function dodark() {
        LaCtrl.btnLowLight_Click();
    }

    //ǿ�⻷������
    function dobright() {
        LaCtrl.btnHightLight_Click();
    }

    //�Զ���������
    function setauto() {
        LaCtrl.btnAuto_Click();
    }

    //����
    function chongpai() {
        $('#area_show').hide();//���ػ�����Ƭ��
        $('#img_show').src = "";//������Ƭ
        $('#scCp').hide();//����ȷ�ϰ�ť
        $('#area_photo').show();//��ʾ������
        $('#pzan').show();//��ʾ���հ�ť
        filename = "";//�����ļ���,
        $('#sc_btn').hide();
        $('#xszp').hide();
    }

    //ȷ��
    function queren() {
        $("#gpyzp").prop("src", "http://192.168.120.115:9008/zpfw/readimage?filename=" + filename);
        $('#scCp').hide();
        $('#area_show').hide();
        $('#sc_btn').show();
        $('#zpmc').val(filename);
        $("#pzbase64").val(imagebase64str);

    }


    /**
     * ��ȡ֤����Ϣ
     */
    function ksdk(){
        if(!residence_permit.OpenDevice(0x10C482CD, 0, "01")) {
            alert('�豸��ʧ�ܣ�');
            return;
        }
        yzPsamMm();
        if(!residence_permit.CloseDevice()) {
            alert('�豸�ر�ʧ��!');
            return;
        }
    }

    function  yzPsamMm(){
        if (!residence_permit.ActiveDevice()) {
            alert( '���ڸ������Ϸ���֤��!');
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
                        alert('��PSAM����Ч��');
                        return;
                    }
                },
                error : function() {
                    alert('�������������!');
                }
            });
            if (!residence_permit.InternalAuth(kpassword)) {
                alert('�ڲ���֤ʧ��!');
                return;
            }
            //�õ�֤������ 00 ��ס֤��01�Ǽ�ƾ֤
            var rdType = residence_permit.RdType;

            if (rdType == null) {
                alert('��ȡ������ʧ��!');
                return;
            }
            var ryxx = residence_permit.ReadData("wef24", rdType);
            var yxks_jzrq = residence_permit.ReadData("wef25", rdType);
            var dzxx = residence_permit.ReadData("wef26", rdType);
            ryxx = $.parseJSON(ryxx);
            var xb = ryxx.A3;
            if (xb == "1") {
                xb = "��";
            } else {
                xb = "Ů";
            }
            //��ȡ����
            document.getElementById("xm").value = ryxx.A2.replace(/^\s+|\s+$/g, "");
            //��ȡ���֤����
            document.getElementById("sfz").value = ryxx.A1.replace(/^\s+|\s+$/g, "");

            var kdf = residence_permit.Factor;
            document.getElementById("kdf").value = kdf;
            //��ȡ��Ƭ��Ⱦ����ǩ��
            var zpxx = ryxx.A12;
            document.getElementById('zkzp').src = 'data:image/jpg;base64,' + zpxx;//עie6��7ʱ�޷���ʾ
            $('#zkzp').attr('width', '137px');
            $('#zkzp').attr('height', '178px');
            document.getElementById("kpbase64").value =zpxx;
        }
    }

    /**
     * ���ύ����Ȩ
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