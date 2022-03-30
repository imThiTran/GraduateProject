            var alertOldPass = $('.alertOldPass');
            var alertNewPass = $('.alertNewPass');
            var alertRePass = $('.alertRePass');
            var alertSave = $('.alertSave');
            $('.passwordBlur').blur(function (e) {
                var value = $(this).val();
                var email = $(this).attr('id');
                if (value == "") {
                    alertOldPass.text("Vui lòng nhập trường này");
                } else {
                    $.ajax({
                        url: "/user/check-pass",
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({ email: email, password: value }),
                        success: function (result) {
                            alertOldPass.text(result);
                        }
                    })
                }
            })
            
            $('.newpass').blur(function (e) {
                var value = $(this).val();
                if (value == "")  {alertNewPass.text("Vui lòng nhập trường này"); alertRePass.text("");}
                else if (value.length>15 || value.length<8) alertNewPass.text("Độ dài mật khẩu phải từ 8-15 ký tự");
                if ($('.repass').val()!="" && value !=""){
                    if (value != $('.repass').val()) alertRePass.text("Nhập lại mật khẩu chưa khớp");
                }
            })

            $('.repass').blur(function (e) {
                var value = $(this).val();
                if (value == "")  alertRePass.text("Vui lòng nhập trường này");
                else if ($('.newpass').val()!="" && value != $('.newpass').val()) alertRePass.text("Nhập lại mật khẩu chưa khớp");
            })

            $('.passwordBlur').on('input', function () {
                alertOldPass.text("");
                alertSave.text("");
            })

            $('.newpass').on('input', function () {
                alertNewPass.text("");
                alertSave.text("");
                alertRePass.text("");
            })

            $('.repass').on('input', function () {
                alertRePass.text("");
                alertSave.text("");
            })
            //nut luu mat khau
            $('.btn-save').click(function (e) {
                var check=true;
                if ($('.passwordBlur').val()=="")   {alertOldPass.text("Vui lòng nhập trường này");check=false;}
                if ($('.newpass').val()=="")        {alertNewPass.text("Vui lòng nhập trường này");check=false;}
                if ($('.repass').val()=="")         {alertRePass.text("Vui lòng nhập trường này");check=false;}
                if (alertOldPass.text()!="" || alertNewPass.text()!=""|| alertRePass.text()!=""){check=false} 
                if (check==true){
                    if ($('.passwordBlur').val() == $('.newpass').val()) {
                        $('.alertSave').css('color', 'red');
                        $('.alertSave').text("Mật khẩu bạn đổi giống với mật khẩu hiện tại");
                    }
                    else {
                    var formm = $('.formEdit')[0];
                    var data = new FormData(formm);
                    var email = $('.passwordBlur').attr('id');
                    $.ajax({
                        url: "/user/change-pass/" + email,
                        type: "POST",
                        enctype: "multipart/form-data",
                        cache: false,
                        processData: false,
                        contentType: false,
                        data: data,
                        success: function (result) {
                            if (result == 'Đổi mật khẩu thành công') {
                                $('.alertSave').css('color', 'green');
                                $('.alertSave').text(result);
                            }
                        }
                    });
                    e.preventDefault();
                    }
                }
            })