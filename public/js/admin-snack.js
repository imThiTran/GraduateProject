modalAddSnack = document.getElementById("modalAddSnack");
modalEditSnack = document.getElementById("modalEditSnack");

$('#btnAddSnack').on('click', function(){
  modalAddSnack.style.display = "block";
});
$('.btnEditSnack').on('click', function(){
    modalEditSnack.style.display = "block";
  });
$('.close-snack').on('click',function(){
    modalAddSnack.style.display = "none";
    modalEditSnack.style.display = "none";
});