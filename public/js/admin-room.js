modalAddRoom = document.getElementById("modalAddRoom");
modalEditRoom = document.getElementById("modalEditRoom");

$('#btnAddRoom').on('click', function () {
  modalAddRoom.style.display = "block";
});
$('#btnEditRoom').on('click', function () {
  modalEditRoom.style.display = "block";
});
$('.close-room').on('click', function () {
  modalAddRoom.style.display = "none";
  modalEditRoom.style.display = "none";
});

$('.saveAdd').click(function () {
  var name = $('.nameRoom').val();
  var type = $('.typeRoom').val();
  var count = $('.count');
  var containRow = $('.contain-row')
  $.ajax({
    url: "/admin/room/add-room",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ name: name, type: type }),
    success: function (result) {
      modalAddRoom.style.display = "none";
      Swal.fire({
        icon: 'success',
        title: 'Thêm thành công',
        showConfirmButton: false,
        timer: 1500
      })
      $(`<tr class="contain-row">
      <th scope="row" class="count" style="width: 1%">
         ${(count.length + 1)} 
      </th>
      <td style="width: 20%;">
      ${(name)}
      </td>
      <td>${(type)}</td>
      <td>
          <div class="form-check form-switch" style="padding-left: 2.5rem;">
              <input class="swclosed form-check-input" id="" type="checkbox" role="switch" />
              <label class="form-check-label" for="flexSwitchCheckChecked"></label>
          </div>
      </td>
      <td>
          <div class="btn-mode">
              <button type="button" id="btnEditRoom"><i class="btnEditRoom fa fa-pencil-square-o"
                      aria-hidden="true"></i></button>
              <button type="button"><i id="${result._id}" onClick="handleDelete(this)" class="btnDeleteRoom fa fa-times" aria-hidden="true"></i></button>
          </div>
      </td>
  </tr>`).insertAfter(containRow[containRow.length - 1]);
    }
  })
})

function handleDelete(element) {
  var idRoom = element.getAttribute('id');
  var thisRow = element.closest('.contain-row')
  Swal.fire({
    icon: 'question',
    title: 'Bạn có chắc chắn muốn xóa ?',
    text: 'Tất cả các suất chiếu của phòng này sẽ bị xóa',
    showCancelButton: true
  }).then((confirm) => {
    if (confirm.isConfirmed) {
      $.ajax({
        url: "/admin/room/delete-room/" + idRoom,
        method: "GET",
        contentType: "application/json",
        data: JSON.stringify(),
        success: function (result) {
          if (result == 'success') {
            thisRow.remove();
            var counts = $('.count');
            var i = 1;
            counts.each(function () {
              $(this).text(i++)
            })
            Swal.fire({
              icon: 'success',
              title: 'Xóa thành công',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }
      })
    }
  })
}
