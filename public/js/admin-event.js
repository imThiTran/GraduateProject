modalAddEvent = document.getElementById("modalAddEvent");
modalEditEvent = document.getElementById("modalEditEvent");

$('#btnAddEvent').on('click', function(){
  modalAddEvent.style.display = "block";
});
function getdate(date){  
  var dd= date.getDate()
  if(dd<10){
    dd="0"+dd
  }
  var mm = date.getMonth()+1
  if(mm<10){
    mm="0"+mm
  }
  var yyyy= date.getFullYear()
  return yyyy+'-'+mm+'-'+dd
}
function editEvent(){
  $('.btnEditEvent').each(function () {
    var $this = $(this);    
    $this.on('click', function () {      
      $.ajax({
        url: "/admin/event/" + $this[0].value,
        method: "GET",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function (result) {          
          var editform = $('#modalEditEvent')
          editform.find('.img').attr('src', result.event.photo);  
          editform.find('.imgsrc').val(result.event.photo); 
          editform.find('.pimg').val(result.event.photoDrop);                            
          editform.find('.title').val(result.event.title);
          CKEDITOR.instances['editEventContent'].setData(result.event.content);          
          editform.find('.type').val(result.event.type);
          editform.find('.btnsave').val(result.event._id);          
          if(result.event.type=='Khuyến mãi'){
            editform.find('.idkm').val(result.voucher.code);
            editform.find('.valuekm').val(result.voucher.value);            
            editform.find('.date-from-km').val(getdate(new Date(result.voucher.datefrom)));
            editform.find('.date-to-km').val(getdate(new Date(result.voucher.dateto)));
            editform.find('.inputkhuyenmaiedit').css("display","block")
          }else{
            editform.find('.inputkhuyenmaiedit').css("display","none")
          }
          modalEditEvent.style.display = "block";          
        }
      })
    })
  })
}
editEvent()

$('.close-event').on('click',function(){
    modalAddEvent.style.display = "none";
    modalEditEvent.style.display = "none";
});
//CKEDITOR
CKEDITOR.replace('eventContent');
CKEDITOR.replace('editEventContent');

function deleteEvent(){
  $('.btnDeleteEvent').each(function () {  
    var $this = $(this);
    $this.on('click', function () {    
      swal.fire({
        icon: 'warning',
        title: 'Bạn có chắc chắn muốn xóa?',
        text: 'Một khi đã xóa, bạn không thể khôi phục lại được.',
        showCancelButton: true,
        confirmButtonColor: '#d33'
      })
        .then((willDelete) => {
          if (willDelete.isConfirmed) {
            $.ajax({
              url: "/admin/event/delete/" + $this[0].value,
              method: "GET",
              contentType: "application/json",
              data: JSON.stringify({}),
              success: function (result) {
                if(result.delete){
                  swal.fire(
                    result.msg,
                    "",
                    "success"
                  ).then((value) => {
                    $(`.${result.slug}`).remove()
                  })
                }else{
                  swal.fire(
                    result.msg,
                    "",
                    "warning"
                  )
                }
                
              }
            })
          }
        });
    })
  })
}
deleteEvent()
$("#formEditEvent").submit(function(e){
  e.preventDefault();   
  var id = $('#btnsave').val()
  var formData = new FormData(this); 
  var content = CKEDITOR.instances['editEventContent'].getData();
  formData.append('content',content) 
  $('.body-loading').css('display','block');
  $.ajax({
    type: "POST",
    url: "/admin/event/edit/" + id,    
    data: formData,
    success: function (result) {
      $('.body-loading').css('display','none');  
      if(result.edit){
        $(`.${result.oldslug}`).find('.imgshow').attr('src', result.ev.photo);
        $(`.${result.oldslug}`).find('.titleshow').html(result.ev.title)
        $(`.${result.oldslug}`).find('.contentshow').html(result.ev.content)
        $(`.${result.oldslug}`).find('.btnEditEvent').val(result.ev.slug)
        $(`.${result.oldslug}`).find('.btnDeleteEvent').val(result.ev.slug)
        if(result.ev.slug!=result.oldslug){
          $(`.${result.oldslug}`).addClass(result.ev.slug);
          $(`.${result.oldslug}`).removeClass(result.oldslug);
        }
        editEvent()
        deleteEvent()
        Swal.fire({
          icon: 'success',
          title: "Sửa thành công"               
        }).then((value) => {
          modalEditEvent.style.display = "none";
        })
      }else{
        Swal.fire({
          icon: 'warning',
          title: result.msg
        })
      }
    },
    cache: false,
    processData: false,
    contentType: false
  })
});