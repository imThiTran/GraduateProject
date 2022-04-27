function isRequired(elements, methodd) {
    var spanerror = elements.parent().find('.span-error-' + methodd);
    elements.blur(function (e) {
        if (elements.val().trim() == "") spanerror.text('Vui lòng nhập trường này');
    })
    elements.on('input', function (e) {
        spanerror.html(null);
    })
}

function isNumberLength(elements, methodd,minlength,maxlength,mess) {
    var spanerror = elements.parent().find('.span-error-' + methodd);
    elements.blur(function (e) {
        if (elements.val() < minlength || elements.val() > maxlength) spanerror.text(mess);
    })
    elements.on('input', function (e) {
        spanerror.html(null);
    })
}

function checkform(array, methodd, mes) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].val().trim() == "") {
            var spanerror = array[i].parent().find('.span-error-' + methodd);
            spanerror.text(mes);
        }
    }
}

function checkRegex(value,regex) {
    if (value.match(regex)) {
        return true;
    } else {
        return false;
    }
}

function isGmail(elements,methodd){
    var spanerror = elements.parent().find('.span-error-' + methodd);
    elements.blur(function (e) {
        var regex=/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;
        if (checkRegex(elements.val(),regex)==false ) spanerror.text('Vui lòng nhập đúng định dạng gmail');
    })
    elements.on('input', function (e) {
        spanerror.html(null);
    })
}

function isName(elements,methodd){
    var spanerror = elements.parent().find('.span-error-' + methodd);
    elements.blur(function (e) {
        var regex=/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;
        if (checkRegex(elements.val(),regex)==false ) spanerror.text('Vui lòng nhập đúng tên');
    })
    elements.on('input', function (e) {
        spanerror.html(null);
    })
}

function isPhone(elements,methodd){
    var spanerror = elements.parent().find('.span-error-' + methodd);
    elements.blur(function (e) {
        var regex=/(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (checkRegex(elements.val(),regex)==false ) spanerror.text('Vui lòng nhập đúng số điện thoại');
    })
    elements.on('input', function (e) {
        spanerror.html(null);
    })
}

function isPassword(elements,methodd){
    var spanerror = elements.parent().find('.span-error-' + methodd);
    elements.blur(function (e) {
        var regex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (checkRegex(elements.val(),regex)==false ) spanerror.text('Mật khẩu từ 8 đến 15 ký tự và có ít nhất một chữ cái thường, một chữ hoa, một chữ số, một ký tự đặc biệt');
        else if (elements.val()!=$('.confirmPass').val()) $('.confirmPass-contain').find('.span-error-add').text('Mật khẩu nhập lại không khớp');
    })
    elements.on('input', function (e) {
        if ($('.confirmPass-contain').find('.span-error-add'))
        $('.confirmPass-contain').find('.span-error-add').html(null);
        spanerror.html(null);
    })
}

function isMatchPass(elements,methodd,elementMatch){
    var spanerror = elements.parent().find('.span-error-' + methodd);
    elements.blur(function (e) {
        if (elements.val()!=elementMatch.val() ) spanerror.text('Mật khẩu nhập lại không khớp');
    })
    elements.on('input', function (e) {
        spanerror.html(null);
    })
}



