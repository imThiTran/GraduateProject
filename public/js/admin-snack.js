modalAddSnack = document.getElementById("modalAddSnack");
modalEditSnack = document.getElementById("modalEditSnack");
var imgAdd = $('.imgAddPreview');
var imgInputAdd = $('.imgChangeAdd');
var imgEdit = $('.imgEditPreview');
var imgInputEdit = $('.imageChangeEdit');
var photoShow, nameShow, typeShow, priceShow;

function ClearSpanerror() {
  $('.span-error-add').each(function () {
    $(this).text('');
  })
  $('.span-error-edit').each(function () {
    $(this).text('');
  })
}

isRequired($('.nameAdd'), 'add');
isRequired($('.priceAdd'), 'add');
isRequired($('.nameEdit'), 'edit');
isRequired($('.priceEdit'), 'edit');

$('#btnAddSnack').on('click', function () {
  modalAddSnack.style.display = "block";
});

$('.close-snack').on('click', function () {
  ClearSpanerror();
  imgAdd.attr('src', '/img/no_img.webp');
  $('.nameAdd').val('');
  $('.typeAdd').val('Đồ ăn');
  $('.priceAdd').val('');
  imgInputAdd.val(null);
  imgInputEdit.val(null);
  $('.alertEdit').text('');
  $('.alertAdd').text('');
  modalAddSnack.style.display = "none";
  modalEditSnack.style.display = "none";
});



$('.saveAdd').click(function () {
  var check = true;
  checkform([$('.nameAdd'), $('.priceAdd'), $('.imgChangeAdd')], 'add', 'Vui lòng nhập trường này');
  $('.span-error-add').each(function () {
    if ($(this).text() != '') { check = false; return false; }
  })
  if (check == true) {
    $(this).html(`<div class="spinner-border text-warning spinner-save spinner-edit" role="status"></div>`);
    var formm = $('.formAdd')[0];
    var data = new FormData(formm);
    var trContain = $('.trClosest');
    $.ajax({
      url: "/admin/snack/add-snack",
      type: "POST",
      enctype: "multipart/form-data",
      cache: false,
      processData: false,
      contentType: false,
      data: data,
      success: function (result) {
        $('.saveAdd').html('Thêm');
        if (typeof result == 'object') {
          ClearSpanerror();
          imgAdd.attr('src', '/img/no_img.webp');
          $('.nameAdd').val('');
          $('.typeAdd').val('Đồ ăn');
          $('.priceAdd').val('');
          imgInputAdd.val(null);
          modalAddSnack.style.display = "none";
          $('.body-loading').css('display', 'none');
          Swal.fire({
            icon: 'success',
            title: 'Thêm thành công',
            showConfirmButton: false,
            timer: 1000
          })
          $(`<tr class="trClosest">
                                  <th scope="row" style="width: 10%">
                                      <img style="width: 100%" src="${result.photo}" alt="">
                                  </th>
                                  <td style="width: 20%;">
                                      ${result.name}
                                  </td>
                                  <td>${result.type}</td>
                                  <td>${result.price} VNĐ</td>
                                  <td>
                                      <div class="form-check form-switch" style="padding-left: 2.5rem;">
                                          <input onchange="blockBtnHandle(this);" class="swclosed form-check-input" ${(result.block == 0) ? `checked` : ``}  id="${result._id}" type="checkbox" role="switch" />
                                          <label class="form-check-label" for="flexSwitchCheckChecked"></label>
                                      </div>
                                  </td>
                                  <td>
                                      <div class="btn-mode">
                                          <button onclick="loadEdit(this);" id="${result._id}" type="button" class="btnEditSnack"><i class="fa fa-pencil-square-o"
                                              aria-hidden="true"></i></button>
                                          <button id="${result._id}" onclick="handleDelete(this)" type="button"><i class="fa fa-times" aria-hidden="true"></i></button>
                                      </div>
                                  </td>
                              </tr>`).insertBefore(trContain[0]);
        } else {
          $('.alertAdd').html(result);
        }
      }
    })
  }
})

//load when u click button edit
function loadEdit(th) {
  $('.body-loading').css('display', 'block');
  modalEditSnack.style.display = "block";
  var idSnack = th.getAttribute('id')
  nameShow = th.closest('.trClosest').querySelector('.nameShow');
  typeShow = th.closest('.trClosest').querySelector('.typeShow');
  priceShow = th.closest('.trClosest').querySelector('.priceShow');
  photoShow = th.closest('.trClosest').querySelector('.photoShow')
  $.ajax({
    url: "/admin/snack/load-edit/" + idSnack,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(),
    success: function (result) {
      imgAdd.attr('src', '/img/no_img.webp');
      imgEdit.attr('src', result.photo);
      $('.nameEdit').val(result.name);
      $('.typeEdit').val(result.type);
      $('.priceEdit').val(result.price);
      $('.pimage').val(result.photoDrop);
      $('.idHidden').val(result._id);
      $('.photoHidden').val(result.photo);
      $('.body-loading').css('display', 'none');
    }
  })
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

var checkChange = false; //check event change edit
$('.nameEdit').change(function () {
  checkChange = true;
});
$('.typeEdit').change(function () {
  checkChange = true;
});
$('.priceEdit').change(function () {
  checkChange = true;
});
$('.imageChangeEdit').change(function () {
  checkChange = true;
})

//save edit
$('.saveEdit').click(function () {
  imgAdd.attr('src', '/img/no_img.webp');
  var check = true;
  $('.span-error-edit').each(function () {
    if ($(this).text() != '') { check = false; return false; }
  })
  if (check == true) {
    $('.alertEdit').html(null);
    if (checkChange == true) {
      $(this).html(`<div class="spinner-border text-warning spinner-save spinner-edit" role="status"></div>`);
      var formm = $('.formEdit')[0];
      var data = new FormData(formm);
      $.ajax({
        url: "/admin/snack/edit-snack",
        type: "POST",
        enctype: "multipart/form-data",
        cache: false,
        processData: false,
        contentType: false,
        data: data,
        success: function (result) {
          $('.saveEdit').html('Xác nhận');
          imgInputEdit.val(null);
          if (typeof result == 'object') {
            ClearSpanerror();
            checkChange = false;
            nameShow.innerText = result.name;
            typeShow.innerText = result.type;
            priceShow.innerText = formatNumber(result.price) + ' VNĐ';
            photoShow.setAttribute('src', result.photo);
            Swal.fire({
              icon: 'success',
              title: 'Sửa thành công',
              showConfirmButton: false,
              timer: 1000
            })
            modalEditSnack.style.display = "none";
          } else {
            $('.alertEdit').html(result);
          }
        }
      })
    } else {
      modalEditSnack.style.display = "none";
    }
  }
})

function blockBtnHandle(th) {
  var idSnack = th.getAttribute('id');
  var i = 1;
  if (th.checked) {
    i = 0;
  }
  $.ajax({
    url: "/admin/snack/block/",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ idSnack: idSnack, block: i }),
    success: function (result) {

    }
  })
}

function handleDelete(th) {
  var idSnack = th.getAttribute('id');
  var trContain = th.closest('.trClosest');
  Swal.fire({
    icon: 'question',
    title: 'Bạn có chắc chắn muốn xóa ?',
    text: 'Món này sẽ bị xóa và không thể khôi phục',
    showCancelButton: true
  }).then((confirm) => {
    if (confirm.isConfirmed) {
      $.ajax({
        url: "/admin/snack/delete-snack/" + idSnack,
        method: "GET",
        contentType: "application/json",
        data: JSON.stringify(),
        success: function (result) {
          Swal.fire({
            icon: 'success',
            title: 'Xóa thành công',
            showConfirmButton: false,
            timer: 1000
          })
          trContain.remove();
        }
      })
    }
  })
}