var modal = document.getElementById('myModal');
var modalAdd = document.querySelector('.modal-add');
var btn = document.getElementById("myBtn");
// var span = document.querySelector(".closeBtn");
var modalAddPrice = document.getElementById("modalAddPrice");
var modalAddShowTime = document.getElementById("modalAddShowTime");
var modalEditShowTime = document.getElementById("modalEditShowTime");
var checkFormChange; //check form change 


$('#btnAddPrice').on('click', function () {
    modalAddPrice.style.display = "block";
});

$('#btnAddShowTime').on('click', function () {
    modalAddShowTime.style.display = "block";
});

$('.close-showTime').on('click', function () {
    modalAddShowTime.style.display = "none";
    modalEditShowTime.style.display = "none";
    modalAddPrice.style.display = "none";
});
// span.onclick = function () {
//     modal.style.display = "none";
// }
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    else if (event.modalAdd == modal) { }
}

$('.closedEdit').change(function () {
    checkFormChange = true;
})
$('.hourEdit').change(function () {
    checkFormChange = true;
})
$('.minuteEdit').change(function () {
    checkFormChange = true;
})
$('.roomEdit').change(function () {
    checkFormChange = true;
})

//click delete date
$('.saveDeleteDate').click(function () {
    var idFilm = $(this).attr('idFilm');
    var date = $(this).attr('date');
    var rowDate = $(this).closest('.dateShowTime');
    var containerDate = $(this).closest('.trClosest');
    var lengthDate = containerDate.find('.dateShowTime');
    Swal.fire({
        icon: 'question',
        title: 'Bạn có chắc chắn muốn xóa ?',
        text: 'Tất cả suất chiếu của phim này vào ngày này sẽ bị xóa',
        showCancelButton: true
    }).then((confirm) => {
        if (confirm.isConfirmed) {
            $.ajax({
                url: "/admin/showtime/delete-showtime-date/",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ idFilm: idFilm, date: date }),
                success: function (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Xóa thành công',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    if (lengthDate.length == 1) {
                        containerDate.remove();
                        var counts = $('.count');
                        var i = 1;
                        counts.each(function () {
                            $(this).text(i++)
                        })
                    } else {
                        rowDate.remove();
                    }
                }
            })
        }
    })
})


//click delete
$('.saveDelete').click(function () {
    var id = $(this).closest('#modalEditShowTime').find('.idHidden').val();
    var buttonShowtime = $(`#${id}`);
    Swal.fire({
        icon: 'question',
        title: 'Bạn có chắc chắn muốn xóa ?',
        text: 'Suất chiếu này sẽ mất và không thể khôi phục',
        showCancelButton: true
    }).then((confirm) => {
        if (confirm.isConfirmed) {
            $.ajax({
                url: "/admin/showtime/delete-showtime/" + id,
                method: "GET",
                contentType: "application/json",
                data: JSON.stringify(),
                success: function (result) {
                    modalEditShowTime.style.display = "none";
                    var containerTime = buttonShowtime.closest('.dateShowTime');
                    var containerDate = buttonShowtime.closest('.trClosest');
                    var lengthTime = containerTime.find('.btnShowTimeDetail');
                    var lengthDate = containerDate.find('.dateShowTime');
                    if (lengthDate.length == 1 && lengthTime.length == 1) {
                        containerDate.remove();
                        var counts = $('.count');
                        var i = 1;
                        counts.each(function () {
                            $(this).text(i++)
                        })
                    }
                    else if (lengthTime.length == 1) {
                        containerTime.remove();
                    } else {
                        buttonShowtime.remove();
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Xóa thành công',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
            })
        }
    })
})


//click save edit
$('.saveEdit').click(function () {
    $(this).html(`<div class="spinner-border text-warning spinner-save spinner-edit" role="status"></div>`);
    $('.alertEdit').html(null);
    var idSt = $(this).closest('.contain-edit').find('.idHidden').val();
    if (checkFormChange) saveEdit(idSt);
    else {
        $('.saveEdit').html('Xác nhận')
        modalEditShowTime.style.display = "none";
        checkFormChange = false;
    }
})

//function save Edit
function saveEdit(idSt) {
    var thisE = $(`#${idSt}`);
    var formm = $('.formEdit')[0];
    var data = new FormData(formm);
    $.ajax({
        url: "/admin/showtime/edit-showtime",
        type: "POST",
        enctype: "multipart/form-data",
        cache: false,
        processData: false,
        contentType: false,
        data: data,
        success: function (result) {
            $('.saveEdit').html('Xác nhận');
            if (typeof result == 'string') {
                $('.alertEdit').html(result);
            } else {
                checkFormChange = false;
                modalEditShowTime.style.display = "none";
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa thành công',
                    showConfirmButton: false,
                    timer: 1000
                })
                result.timeStart = result.timeStart + ((result.timeStart.split(':')[0] < 12) ? ` AM` : ` PM`);
                thisE.html(`${result.timeStart}`);
                if (result.closed == 1) {
                    thisE.css('opacity', '0.5');
                } else {
                    thisE.css('opacity', '1.0');
                }
            }
        }
    });
}

//click button edit
function showtimeDetail(thisE) {
    $('.body-loading').css('display','block');
    modalEditShowTime.style.display = "block";
    var idSt = thisE.getAttribute('id');
    $.ajax({
        url: "/admin/showtime/load-edit",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ idSt: idSt }),
        success: function (result) {
            $('.nameEdit').text(result.nameEN);
            $('.dateEdit').text(new Date(result.date).toLocaleDateString('en-GB'));
            $('.closedEdit').prop('checked', result.closed == 0);
            $('.hourEdit').val(result.hour);
            $('.minuteEdit').val(result.minute);
            $('.idHidden').val(idSt);
            $('.timeHidden').val(result.time);
            $('.dateHidden').val(result.date);
            var roomHtml=result.rooms.map((room)=>{
                return `<option value="${room._id}">
                ${room.name}
            </option>`
            });
            $('.roomEdit').html(roomHtml.join(' '));
            $('.roomEdit').val(result.room);
            $('.body-loading').css('display','none');
        }
    })
}

$('.close-showTime').on('click', function () {
    $('.alertAdd').html(null);
    $('.alertEdit').html(null);
    checkFormChange = false;
    modalAddShowTime.style.display = "none";
    modalEditShowTime.style.display = "none";
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    else if (event.modalAdd == modal) {

    }
}

//ADMIN

//Save Add click
$('.btn-saveAdd').click(function () {
    if ($('.dateAdd').val() == '') {
        $('.alertAdd').html('Vui lòng chọn ngày');
    } else {
        var formm = $('.formAdd')[0];
        var data = new FormData(formm);
        $.ajax({
            url: "/admin/showtime/add-showtime",
            type: "POST",
            enctype: "multipart/form-data",
            cache: false,
            processData: false,
            contentType: false,
            data: data,
            success: function (result) {
                if (result == "success") {
                    modalAddShowTime.style.display = "none";
                    Swal.fire({
                        icon: 'success',
                        title: 'Thêm thành công',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    setTimeout(() => {
                        window.location.reload();
                    }, 1300);
                } else {
                    $('.alertAdd').html(result);
                }
            }
        });
    }
})



//Add element sc
$('#btnAddSC').on('click', () => {
    var htmlObj = $('#form-addSC');
    htmlObj.append(`
    <div class="lc-suatchieu">
        `+ $('.first-row-addSc').html() + `
        <div class="">
            <button type="button" class="btnDelSC"> <i class="fa fa-times close-sc" aria-hidden="true"></i></button>
        </div>
    </div>`);
    $('.btnDelSC').each(function () {
        var $this = $(this);
        var rowAddSt = $this.closest('.lc-suatchieu');
        $this.click(function (e) {
            e.preventDefault();
            rowAddSt.remove();
        })
    })
})

//Add element price
$('#btnAddPR').on('click', () => {
    var htmlObj = $('#form-addPR');
    htmlObj.append(`
    <div class="price-choose-day">
        `+ $('.first-row-addPR').html() + `
        <div class="close-pr">
            <button type="button" class="btnDelPR"> <i class="fa fa-times close-pr" aria-hidden="true"></i></button>
        </div>
    </div>`);
    $('.btnDelPR').each(function () {
        var $this = $(this);
        var rowAddSt = $this.closest('.price-choose-day');
        $this.click(function (e) {
            e.preventDefault();
            rowAddSt.remove();
        })
    })
})


//Choose price seat

$(function () {

    $("input:radio[name*='flexRadioDefault2']").click(function () {

        $(".input-datetime").attr('disabled', false);
        $(".seat-change").attr('disabled', false);
        $(".seat-normal").attr('disabled', true);
        $("input:radio[name*='flexRadioDefault1']").attr('checked', false);
    });

    $("input:radio[name*='flexRadioDefault1']").click(function () {

        $(".seat-normal").attr('disabled', false);
        $(".input-datetime").attr('disabled', true);
        $(".seat-change").attr('disabled', true);
        $("input:radio[name*='flexRadioDefault2']").attr('checked', false);


    });
});


//validate search
$('.btnSearchTime').click(function (e) {
    var name = $('.nameSearch').val();
    var datefrom = $('.datefrom').val();
    var dateto = $('.dateto').val();
    var check = true;
    var title;
    if (name == '' && datefrom == '' && dateto == '') {
        $(location).attr('href','/admin/showtime');
    } else if ((datefrom == '' && dateto != '') || (datefrom != '' && dateto == '')) {
        title = 'Bạn chưa chọn đủ thông tin của ngày';
        check = false;
    } else if (new Date(datefrom) > new Date(dateto)) {
        title = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc';
        check = false;
    }
    if (check == false) {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: title,
            showConfirmButton: false,
            timer: 1000
        })
    }
})