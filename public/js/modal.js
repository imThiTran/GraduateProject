var modal = document.getElementById('myModal');
var modalAdd = document.querySelector('.modal-add');
var btn = document.getElementById("myBtn");
var span = document.querySelector(".closeBtn");
var modalAddFilm = document.getElementById("modalAddFilm");
var modalEditFilm = document.getElementById("modalEditFilm");
var modalAddShowTime = document.getElementById("modalAddShowTime");

$('#btnAddFilm').on('click', function () {
  modalAddFilm.style.display = "block";
});
$('.close-footer').on('click', function () {
  modalAddFilm.style.display = "none";
  modalEditFilm.style.display = "none";
});
$('.btnEditFilm').each(function () {
  var $this = $(this);
  $this.on('click', function () {
    $.ajax({
      url: "/admin/film/" + $this[0].value,
      method: "GET",
      contentType: "application/json",
      data: JSON.stringify({}),
      success: function (result) {
        var editform = $('#modalEditFilm')
        editform.find('.imgavt').attr('src', result.film.photo);
        editform.find('.imgbg').attr('src', result.film.background);
        editform.find('.nameen').val(result.film.nameEN);
        editform.find('.namevn').val(result.film.nameVN);
        editform.find('.directors').val(result.film.directors);
        editform.find('.cast').val(result.film.cast);
        editform.find('.premiere').val(result.film.premiere);
        editform.find('.time').val(result.film.time);
        editform.find('.age').val(result.film.ageLimit);
        editform.find('.detail').val(result.film.detail);
        editform.find('.trailer').val('https://www.youtube.com/embed/' + result.film.trailer);
        editform.find('.selectedit').val(result.film.idCat);
        modalEditFilm.style.display = "block";
      }
    })
  })
})

$('.btnDeleteFilm').each(function () {
  var $this = $(this);
  $this.on('click', function () {
    swal({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Một khi đã xóa, bạn không thể khôi phục lại được.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          $.ajax({
            url: "/admin/film/delete/" + $this[0].value,
            method: "GET",
            contentType: "application/json",
            data: JSON.stringify({}),
            success: function (result) {
              swal(result.msg, "", "success").then((value) => {
                $(`.${result.id}`).remove()
              })
            }
          })
        }
      });
  })
})

$('#btnAddShowTime').on('click', function () {
  modalAddShowTime.style.display = "block";
});
$('.close-showTime').on('click', function () {
  modalAddShowTime.style.display = "none";
  modalEditShowTime.style.display = "none";
});
// span.onclick = function () {
//   modal.style.display = "none";
// }
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  else if (event.modalAdd == modal) {

  }
  $('.alertEdit').html(null);
  $('.alertAdd').html(null);
}
var dateAdd = $('.dateAdd');
var nameEN = $('.nameEN');
var date = $('.date');
var time = $('.time');
var room = $('.room');
var formEdit = $('.formEdit')
var tdName;
var tdTime;
var tdRoom;
var tdDate;
$(".filmSelect").change(function (e) {
  var href = $(".filmSelect option:selected").attr('href');
  $(location).attr('href', href);
})
$('.editBtn').each(function () {
  var $this = $(this);
  var id = $this.attr('id');
  $this.on('click', function () {
    tdName = $this.closest('.trClosest').find('.tdName');
    tdTime = $this.closest('.trClosest').find('.tdTime');
    tdRoom = $this.closest('.trClosest').find('.tdRoom');
    tdDate = $this.closest('.trClosest').find('.tdDate');
    $.ajax({
      url: "/admin/showtime/editBtn",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id: id }),
      success: function (result) {
        nameEN.text(result.nameEN);
        date.val(result.date);
        time.html(result.time);
        room.html(result.room);
        formEdit.attr('id', id);
        modal.style.display = "block";
      }
    })
  })

})

$('#btn-save-change-item').on('click', function (e) {
  var check = true;
  $('.span-error-edit').each(function () {
    if ($(this).text() != "") check = false;
  })
  if (check == true) {
    var formm = formEdit[0];
    var id = formEdit.attr('id');
    var data = new FormData(formm);
    $.ajax({
      url: "/admin/showtime/edit-showtime/" + id,
      type: "POST",
      enctype: "multipart/form-data",
      cache: false,
      processData: false,
      contentType: false,
      data: data,
      success: function (result) {
        if (result.noti != "") $('.alertEdit').text(result.noti);
        else {
          tdTime.text(time.val());
          tdRoom.text("CINEMA " + room.val());
          var newDateArr = date.val().split('-')
          var newDate = newDateArr[2] + '/' + newDateArr[1] + '/' + newDateArr[0];
          tdDate.text(newDate);
          modal.style.display = "none";
        }
      }
    });
  }
  e.preventDefault();
})

$('.swclosed').each(function () {
  var $this = $(this);
  var id = $this.attr('id');
  var i;
  $this.change(function () {
    if ($this.is(':checked')) i = 0;
    else i = 1;
    $.ajax({
      url: "/admin/showtime/editBlock",
      method: "POST",
      contentType: "application/json",
      timeout: 10000,
      data: JSON.stringify({ id: id, closed: i }),
      success: function (result) {
        if (result.noti != "") {
          alert(result.noti);
          $this.prop('checked', false);
        }
      }
    })
  })

})
