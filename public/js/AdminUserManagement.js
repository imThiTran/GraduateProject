window.onload = disableSelect();

function disableSelect() {
    $('.block-switch').each(function(){
        var $this=$(this);
        var selectTime=$this.closest('.container').find('.selectTime');
        selectTime.prop('disabled', $this.is(':checked'));
    })
}

//Block the user
$('.block-switch').each(function(){
    var $this=$(this);
    var idUser=$this.attr('idUser');
    var selectTime=$this.closest('.container').find('.selectTime');
    var spanError=$this.closest('.container').find('.span-error');
    $this.change(function(){
        var time=selectTime.val()
        if ($this.is(':checked')) {selectTime.prop('disabled', true);}
        else {
            time=0;selectTime.prop('disabled', false);
        }
        $.ajax({
            url: "/admin/user/blockbtn",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ idUser:idUser , time:time }),
            success: function (result) {
                if (result){
                    if (time==0) spanError.html(null);
                    else if (time==-1) {
                        spanError.html('Đến khi mở chặn');
                    }
                    else{
                        result.dateto=new Date(result.dateto);
                        var timee=result.dateto.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12:false }) ;
                        var date=result.dateto.toLocaleDateString('en-GB');
                        spanError.html('Bị chặn đến '+date+' '+timee);
                    } 
                }
            }      
        })
    })
})

//decentralize
$('.decentralize').each(function(){
    var $this=$(this);
    var idUser=$this.attr('idUser');
    $this.data('lastValue',$this.val());
    $(this).change(function(){
        var lastRole=$this.data('lastValue');
        var actor=$this.val();
        if (confirm('Are you sure?')) {
            $(this).data('lastValue', actor);
            $.ajax({
                url: "/admin/user/decentralize",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ idUser:idUser , actor:actor }),
                success: function (result) {
                    
                }
            })
        }     
        else {
            $this.val(lastRole);
        } 
    })
})