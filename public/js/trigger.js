//Add Suat chieu
$('#btnAddSC').on('click', () => {
    var htmlObj = document.getElementById('form-addSC');
    htmlObj.innerHTML = htmlObj.innerHTML + '<div class="row lc-suatchieu"><div class="col-5 showTimeComponent"><label for="">Suất chiếu</label><select id="" name="" class="form-select"><option value="">9:00</option><option value="">12:00</option><option value="">20:00</option></select></div><div class="col-5 showTimeComponent"><label for="">Rạp</label><select id="room" name="room" class="form-select"><option value="1">CINEMA 1</option><option value="2">CINEMA 2</option><option value="3">CINEMA 3</option></select></div><div class="col-2"><button class="btnDelSC"> <i class="fa fa-times" aria-hidden="true"></i></button></div></div>';
})