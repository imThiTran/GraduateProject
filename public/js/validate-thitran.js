function isRequired(elements,methodd){
    var spanerror=elements.parent().find('.span-error-'+methodd);
    elements.blur(function(e){
        if (elements.val().trim()=="") spanerror.text('Vui lòng nhập trường này');
    })
    elements.on('input',function(e){
        spanerror.html(null);
    })
}

function isNumberLength(elements,methodd){
    var spanerror=elements.parent().find('.span-error-'+methodd);
    elements.blur(function(e){
        if (elements.val()<30 || elements.val()>1000) spanerror.text('Thời lượng phim không phù hợp');
    })
    elements.on('input',function(e){
        spanerror.html(null);
    })
}

function checkform(array,methodd,mes){
    for (var i=0;i<array.length;i++)
    {
        if (array[i].val().trim()==""){
            var spanerror=array[i].parent().find('.span-error-'+methodd);
            spanerror.text(mes);
        }
    }
}