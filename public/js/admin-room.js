modalAddRoom = document.getElementById("modalAddRoom");
modalEditRoom = document.getElementById("modalEditRoom");

$('#btnAddRoom').on('click', function(){
  modalAddRoom.style.display = "block";
});
$('#btnEditRoom').on('click', function(){
    modalEditRoom.style.display = "block";
  });
$('.close-room').on('click',function(){
    modalAddRoom.style.display = "none";
    modalEditRoom.style.display = "none";
});

$('.saveAdd').click(function(){
      $.ajax({
        url: "/admin/room/add-room",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ name:$('.nameRoom').val() , type:$('.typeRoom').val() }),
        success: function (result) {
            if (result) window.location.reload();
        }
    })
})

$('.btnDeleteRoom').each(function(){
    var $this=$(this);
    var idRoom=$this.attr('id');
    $this.click(function(){
      console.log(idRoom);
      if (confirm('Bạn có chắc chắn xóa ?')){
        $(location).attr('href','/admin/room/delete-room/'+idRoom)
      }
    })
})