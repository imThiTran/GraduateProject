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
  $.ajax({
    url: "/admin/room/add-room",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ name: $('.nameRoom').val(), type: $('.typeRoom').val() }),
    success: function (result) {
      if (result) window.location.reload();
    }
  })
})

$('.btnDeleteRoom').each(function () {
  var $this = $(this);
  var idRoom = $this.attr('id');
  var thisRow= $this.closest('.contain-row')
  $this.click(function () {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn có chắc chắn muốn xóa ?',
      text: 'Tất cả các suất chiếu của phòng này sẽ bị xóa',
      showCancelButton: true
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        $.ajax({
          url: "/admin/room/delete-room/"+ idRoom,
          method: "GET",
          contentType: "application/json",
          data: JSON.stringify(),
          success: function (result) {
            if (result=='success') {
              thisRow.remove();
              var counts=$('.count');
              var i=1;
              counts.each(function(){
                $(this).text(i++)
              })
              Swal.fire(
                'Xóa thành công',
                '',
                result
              )
            }
          }
        })
      }
    })
  })
})