modalAddEvent = document.getElementById("modalAddEvent");
modalEditEvent = document.getElementById("modalEditEvent");

$('#btnAddEvent').on('click', function(){
  modalAddEvent.style.display = "block";
});
$('#btnEditEvent').on('click', function(){
  modalEditEvent.style.display = "block";
});
function editFilm(){
  $('.btnEditEvent').each(function () {
    var $this = $(this);    
    $this.on('click', function () {      
      $.ajax({
        url: "/admin/events/" + $this[0].value,
        method: "GET",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function (result) {
          var editform = $('#modalEditEvent')
          editform.find('.img').attr('src', result.film.photo);          
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

$('.close-event').on('click',function(){
    modalAddEvent.style.display = "none";
    modalEditEvent.style.display = "none";
});
//CKEDITOR
CKEDITOR.replace('eventContent');
CKEDITOR.replace('editEventContent');