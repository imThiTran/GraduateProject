window.onload = disableSelect();

function disableSelect() {
    $('.block-switch').each(function () {
        var $this = $(this);
        var selectTime = $this.closest('.container').find('.selectTime');
        selectTime.prop('disabled', !($this.is(':checked')));
    })
}

//Block the user
$('.block-switch').each(function () {
    var $this = $(this);
    var idUser = $this.attr('idUser');
    var selectTime = $this.closest('.container').find('.selectTime');
    var spanError = $this.closest('.container').find('.span-error');
    $this.change(function () {
        var time = -1;
        if ($this.is(':checked')) { selectTime.prop('disabled', false); }
        else {
            time = 0; selectTime.prop('disabled', true);
        }
        $.ajax({
            url: "/admin/user/block-btn",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ idUser: idUser, time: time }),
            success: function (result) {
                if (result) {
                    if (time == 0) {
                        spanError.html(null);
                        selectTime.val('-1');
                    }
                    else {
                        selectTime.val('-1');
                        spanError.html('Đến khi mở chặn');
                    }
                }
            }
        })
    })
})


//select-block-change
$('.selectTime').each(function () {
    var $this = $(this);
    var idUser = $this.attr('idUser');
    var spanError = $this.closest('.container').find('.span-error');
    $this.change(function () {
        var time = $this.val()
        $.ajax({
            url: "/admin/user/block-btn",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ idUser: idUser, time: time }),
            success: function (result) {
                if (result) {
                    if (time == -1) {
                        spanError.html('Đến khi mở chặn');
                    }
                    else {
                        result.dateto = new Date(result.dateto);
                        var timee = result.dateto.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        var date = result.dateto.toLocaleDateString('en-GB');
                        spanError.html('Bị chặn đến ' + date + ' ' + timee);
                    }
                }
            }
        })
    })
})

//decentralize
$('.decentralize').each(function () {
    var $this = $(this);
    var idUser = $this.attr('idUser');
    $this.data('lastValue', $this.val());
    $(this).change(function () {
        var lastRole = $this.data('lastValue');
        var actor = $this.val();
        Swal.fire({
            icon: 'question',
            title: 'Bạn có chắc chắn điều này ?',
            text: 'Người này sẽ bị thay đổi quyền hạn sử dụng hệ thống',
            showCancelButton: true
        }).then((confirm) => {
            if (confirm.isConfirmed) {
                $(this).data('lastValue', actor);
                $.ajax({
                    url: "/admin/user/decentralize",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ idUser: idUser, actor: actor }),
                    success: function (result) {
                        Swal.fire(
                            'Thực hiện thành công',
                            '',
                            result
                        )
                    }
                })
            }
            else {
                $this.val(lastRole);
            }
        })
    })
})