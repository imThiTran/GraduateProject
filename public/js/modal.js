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
function editFilm(){
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
          editform.find("input[name=ageLimit][value=" + result.film.ageLimit + "]").prop('checked', true);
          editform.find('.detail').val(result.film.detail);
          editform.find('.trailer').val('https://youtu.be/' + result.film.trailer);
          editform.find('.bgeditshow').val(result.film.background);
          editform.find('.avteditshow').val(result.film.photo);
          var htmlObj = $('#form-editCT');
          $('.sleditadd').remove()
          if(result.film.idCat.length==1){
            editform.find('.selectedit').val(result.film.idCat[0]);
          }else{            
            editform.find('.selectedit').val(result.film.idCat[0]);
            for(var i=1;i<result.film.idCat.length;i++){                
                htmlObj.append(`
                  <div class="lc-category sledit sleditadd">
                      `+ $('.sledit').html() + `
                      <div class="">
                          <button type="button" class="btnDelSC"> <i class="fa fa-times close-ct" aria-hidden="true"></i></button>
                      </div>
                  </div>
                  <script>
                    $('.btnDelSC').each(function () {
                      var $this = $(this);
                      var rowAddSt = $this.closest('.lc-category');
                      $this.click(function (e) {
                          e.preventDefault();
                          rowAddSt.remove();
                      })
                    })
                  </script>
                `);
                editform.find('.selectedit').eq(i).val(result.film.idCat[i]);
            }
          }                    
          editform.find('.status').val(result.film.status);
          editform.find('.avtimg').val(result.film.photoDrop);
          editform.find('.bgimg').val(result.film.backgroundDrop);
          editform.find('.idfilm').val(result.film._id);        
          modalEditFilm.style.display = "block";
        }
      })
    })
  })
}
editFilm()
  
function deleteFilm(){
  $('.btnDeleteFilm').each(function () {  
    var $this = $(this);
    $this.on('click', function () {    
      swal.fire({
        icon: 'warning',
        title: 'Bạn có chắc chắn muốn xóa?',
        text: 'Một khi đã xóa, bạn không thể khôi phục lại được.',
        showCancelButton: true,
        confirmButtonColor: '#d33'
      })
        .then((willDelete) => {
          if (willDelete.isConfirmed) {
            $.ajax({
              url: "/admin/film/delete/" + $this[0].value,
              method: "GET",
              contentType: "application/json",
              data: JSON.stringify({}),
              success: function (result) {
                swal.fire(
                  result.msg,
                  "",
                  "success"
                ).then((value) => {
                  $(`.${result.slug}`).remove()
                })
              }
            })
          }
        });
    })
  })
}
deleteFilm()

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

$("#formAddFilm").submit(function(e){
  e.preventDefault();
  var form = $(this);
  var formData = new FormData(this);
  var actionUrl = form.attr('action');  
  $.ajax({
      type: "POST",
      url: actionUrl,
      data: formData,
      success: function(data)
      {
        if(data.add){
          var tr=
          `<tr class="${data.filmAdd.slug}">
              <th scope="row" style="width: 15%">
                  <img style="width: 100%" class="poster-admin-film avt" src="${data.imgAdd}" alt="">
              </th>                                
              <td style="width: 20%;">
                <div class="nameenedit">${data.filmAdd.nameEN}</div>
                <div class="namevnedit">${data.filmAdd.nameVN}</div>
              </td>
              <td class="directorsedit">${data.filmAdd.directors}</td>
              <td class="premiereedit">${data.filmAdd.premiere}</td>
              <td class="categories">${data.filmAdd.cat}</td>                                
              <td>
                <div class="statusedit">${data.filmAdd.status}</div>
              </td>
              <td>
                  <div class="btn-mode">
                      <button type="button" class="btnEditFilm" value="${data.filmAdd.slug}"><i class="fa fa-pencil-square-o"
                          aria-hidden="true"></i></button>
                      <button type="button" class="btnDeleteFilm" value="${data.filmAdd.slug}"><i class="fa fa-times" aria-hidden="true"></i></button>
                  </div>
              </td>
          </tr>`
          Swal.fire(
            data.msg,
            '',        
            'success'
          )
          $('#bodyAdd').append(tr)
          modalAddFilm.style.display = "none"
          editFilm()
          deleteFilm()
          var editform = $('#formAddFilm')
          editform.find('.imgavt').attr('src', '../img/no_img.webp');
          editform.find('.imgbg').attr('src', '../img/no_img.webp');
          editform.find('.imgtest').val('');
          editform.find('#img1').val('');
          editform.find('#img2').val('');
          editform.find('.nameen').val('');
          editform.find('.namevn').val('');
          editform.find('.directors').val('');
          editform.find('.cast').val('');
          editform.find('.premiere').val('');
          editform.find('.time').val('');
          editform.find("input[name=ageLimit][value=" + 18 + "]").prop('checked', true);
          editform.find('.detail').val('');
          editform.find('.trailer').val('');
          editform.find('.selectadd').val('62469bbeb004812168c21722');
          editform.find('.status').val('Đang khởi chiếu');              
        }else{          
          Swal.fire({
            icon: 'warning',
            title: data.msg
          })        
        }        
      },
      cache: false,
      processData: false,
      contentType: false
  });
  
});


//Add element sc
$('#btnAddCT').on('click', () => {
    var htmlObj = $('#form-addCT');
    htmlObj.append(`
<div class="lc-category">
    `+ $('.sladd').html() + `
    <div class="">
        <button type="button" class="btnDelSC"> <i class="fa fa-times close-ct" aria-hidden="true"></i></button>
    </div>
</div>`);
    $('.btnDelSC').each(function () {
        var $this = $(this);
        var rowAddSt = $this.closest('.lc-category');
        $this.click(function (e) {
            e.preventDefault();
            rowAddSt.remove();
        })
    })
})
$('#btnEditCT').on('click', () => {
    var htmlObj = $('#form-editCT');
    htmlObj.append(`
<div class="lc-category sledit sleditadd">
    `+ $('.sledit').html() + `
    <div class="">
        <button type="button" class="btnDelSC"> <i class="fa fa-times close-ct" aria-hidden="true"></i></button>
    </div>
</div>`);
    $('.btnDelSC').each(function () {
        var $this = $(this);
        var rowAddSt = $this.closest('.lc-category');
        $this.click(function (e) {
            e.preventDefault();
            rowAddSt.remove();
        })
    })
})
$("#formEditFilm").submit(function(e){
  var idCat=[]
  for(let i=0;i<$('.selectedit').length;i++){
    idCat.push($('.selectedit').eq(i).val())
  }   
  e.preventDefault();
  var form = $(this);
  var formData = new FormData(this); 
  formData.append('idCat',idCat) 
  var actionUrl = form.attr('action');  
  $.ajax({
      type: "POST",
      url: actionUrl,
      data: formData,
      success: function(data)
      {
        if(data.edit){          
          if(data.imgEdit!=""){
            $(`.${data.oldslug}`).find('.avt').attr('src', data.imgEdit);
          }
          $(`.${data.oldslug}`).find('.nameenedit').html(data.filmEdit.nameEN)          
          $(`.${data.oldslug}`).find('.namevnedit').html(data.filmEdit.nameVN)
          $(`.${data.oldslug}`).find('.directorsedit').html(data.filmEdit.directors)
          $(`.${data.oldslug}`).find('.premiereedit').html(data.filmEdit.premiere)
          $(`.${data.oldslug}`).find('.categories').html(data.filmEdit.cat)
          $(`.${data.oldslug}`).find('.statusedit').html(data.filmEdit.status)
          $(`.${data.oldslug}`).find('.btnEditFilm').val(data.filmEdit.slug)
          $(`.${data.oldslug}`).find('.btnDeleteFilm').val(data.filmEdit.slug)
          if(data.filmEdit.slug!=data.oldslug){
            $(`.${data.oldslug}`).addClass(data.filmEdit.slug);
            $(`.${data.oldslug}`).removeClass(data.oldslug);
          }          
          editFilm()
          deleteFilm()
          Swal.fire({
            icon: 'success',
            title: data.msg               
          })
        }else{
          Swal.fire({
            icon: 'warning',
            title: data.msg
          }).then((value) => {
            modalEditFilm.style.display = "none";
          })
        }
      },
      cache: false,
      processData: false,
      contentType: false
  });
  
});
  