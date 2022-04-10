modalAddEvent = document.getElementById("modalAddEvent");
modalEditEvent = document.getElementById("modalEditEvent");

$('#btnAddEvent').on('click', function(){
  modalAddEvent.style.display = "block";
});
$('#btnEditEvent').on('click', function(){
    modalEditEvent.style.display = "block";
  });
$('.close-event').on('click',function(){
    modalAddEvent.style.display = "none";
    modalEditEvent.style.display = "none";
});
//CKEDITOR
CKEDITOR.replace('eventContent');
CKEDITOR.replace('editEventContent');