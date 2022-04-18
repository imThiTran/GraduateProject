var modal = document.getElementById('myModal');
var modalAdd = document.querySelector('.modal-add');
var btn = document.getElementById("myBtn");
// var span = document.querySelector(".closeBtn");
var modalAddShowTime = document.getElementById("modalAddShowTime");
var modalEditShowTime = document.getElementById("modalEditShowTime");
var checkFormChange; //check form change 

$('#btnAddShowTime').on('click', function () {
    modalAddShowTime.style.display = "block";
});
// $('.btnEditShowTime').on('click', function(){
//     var $this=$(this);
//     var idFilm=$this.attr('idFilm');
//     var date=$this.attr('date');
//     $.ajax({
//         url: "/admin/showtime/load-edit",
//         method: "POST",
//         contentType: "application/json",
//         data: JSON.stringify({idFilm:idFilm,date:date}),
//         success: function (result) {
//             result.date=(new Date(result.date)).toLocaleDateString('en-GB');
//             $('.nameEdit').html(result.nameEN);
//             $('.dateEdit').html(result.date);
//             $('.first-row-editSc').html(result.htmlSend);
//             modalEditShowTime.style.display = "block";
//         }
//     })
// });


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




//click save edit
$('.saveEdit').click(function () {
    $('.alertEdit').html(null);
    var idSt = $(this).closest('.contain-edit').find('.idHidden').val();
    if (checkFormChange) saveEdit(idSt);
    else {
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
            checkFormChange = false;
            if (result == 'fail') {
                $('.alertEdit').html(`Tồn tại suất chiếu trùng thời gian`);
            } else {
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
    var idSt = thisE.getAttribute('id');
    $.ajax({
        url: "/admin/showtime/load-edit",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ idSt: idSt }),
        success: function (result) {
            $('.nameEdit').val(result.nameEN);
            $('.dateEdit').text(new Date(result.date).toLocaleDateString('en-GB'));
            $('.closedEdit').prop('checked', result.closed == 0);
            $('.hourEdit').val(result.hour);
            $('.minuteEdit').val(result.minute);
            $('.roomEdit').val(result.room);
            $('.idHidden').val(idSt);
            $('.timeHidden').val(result.time);
            $('.dateHidden').val(result.date);
            modalEditShowTime.style.display = "block";
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
                window.location.reload();
            } else {
                $('.alertAdd').html(result);
            }
        }
    });
})



//Add element sc
$('#btnAddSC').on('click', () => {
    var htmlObj = $('#form-addSC');
    htmlObj.append(`
    <div class="lc-suatchieu">
        `+ $('.first-row-addSc').html() + `
        <div class="">
            <button type="button" class="btnDelSC"> <i class="fa fa-times" aria-hidden="true"></i></button>
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




