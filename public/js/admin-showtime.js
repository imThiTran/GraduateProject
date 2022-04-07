var modal = document.getElementById('myModal');
var modalAdd= document.querySelector('.modal-add');
var btn = document.getElementById("myBtn");
var span = document.querySelector(".closeBtn");
var modalAddShowTime = document.getElementById("modalAddShowTime");




$('#btnAddShowTime').on('click', function(){
  modalAddShowTime.style.display = "block";
});
$('.close-showTime').on('click',function(){
  modalAddShowTime.style.display = "none";
  modalEditShowTime.style.display = "none";
});
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        else if (event.modalAdd == modal){

        }
    }

//ADMIN
//Add Suat chieu
$('#btnAddSC').on('click', () => {
    var htmlObj = document.getElementById('form-addSC');
    htmlObj.innerHTML = htmlObj.innerHTML + `<div class="row lc-suatchieu">
    <div class="col-5 showTimeComponent">
    <label for="">Suất chiếu</label>
    <select id="" name="" class="form-select">
    <option value="">9:00</option>
    <option value="">12:00</option>
    <option value="">20:00</option>
    </select>
    </div>
    <div class="col-5 showTimeComponent">
    <label for="">Rạp</label>
    <select id="room" name="room" class="form-select">
    <option value="1">CINEMA 1</option>
    <option value="2">CINEMA 2</option>
    <option value="3">CINEMA 3</option>
    </select>
    </div>
    <div class="col-2">
    <button class="btnDelSC"> <i class="fa fa-times" aria-hidden="true"></i></button>
    </div>
    </div>`;
})
//Block the user
window.onload = disableSelect();

function disableSelect() {
    const selectPcs = document.querySelectorAll('.sl-active');
    selectPcs.forEach(element => {
        element && (element.disabled = true);
    });
}

function toggleSelect(e) {
    const selectPc = e.parentElement.parentElement.querySelector('.sl-active');
    selectPc && (selectPc.disabled = e.checked);
}

