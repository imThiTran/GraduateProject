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