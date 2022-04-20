function cleanText(text) {
    return text.replaceAll(/\s+/g, ' ').trim();
}
var rating=-1;

function handleRate(e){
    rating=e.value;
}
$(document).ready(function () {
    var idFilm = $('.idFilmHidden').val();


    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('nav').addClass('sticky');
        } else {
            $('nav').removeClass('sticky');
        }
    });

    //click rating
    $('.userComment').click(function () {
        var value = $('.contentComment').val();
        if (value == '') {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng nhập nội dung',
                showConfirmButton: false,
                timer: 1500
            });
        } else if (rating==-1) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đánh giá sao',
                showConfirmButton: false,
                timer: 1000
            });
        }  else {
            $.ajax({
                url: "/user/comment",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ content: value, idFilm: idFilm,rating:rating }),
                success: function (result) {
                    if (result == 'success') window.location.reload();
                    else {
                        window.location.href = '/auth/login';
                    }
                }
            })
        }
    })

    $('.dateChange').change(function () {
        var $this = $(this);
        var date = $this.val();
        $.ajax({
            url: "/movie/load-time",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ date: date, idFilm: idFilm }),
            success: function (result) {
                $('#showtime').html(result);
            }
        })

    })

    $('.editCmt').each(function () {
        var $this = $(this);
        var textEdit = $this.closest('.star-text').find('#text-sua');
        var currentCmt = $this.closest('.star-text').find('#commentp');
        var btnSave = $this.closest('.star-text').find('#btn-save');
        var btnCancel = $this.closest('.star-text').find('#btn-huy');
        var deleteCmtBtn = $(this).parent().find('#btn-xoacomt');
        var editCmtBtn = $this;
        var timeCommand = $this.closest('.star-text').find('.time-comt');
        function revert() {
            textEdit.css('display', 'none');
            currentCmt.css('display', 'block');
            btnSave.css('display', 'none');
            btnCancel.css('display', 'none');
            editCmtBtn.css('display', 'block');
            deleteCmtBtn.css('display', 'block');
        }

        $this.click(function () {
            textEdit.css('display', 'block');
            currentCmt.css('display', 'none');
            btnSave.html(`Lưu`)
            btnSave.css('display', 'block');
            btnCancel.css('display', 'block');
            $this.css('display', 'none');
            deleteCmtBtn.css('display', 'none');
            textEdit.val(currentCmt.text().trim());
        })

        btnCancel.click(function () {
            revert();
        })


        //save edit rating
        btnSave.click(function () {
            var $this = $(this);
            var idRate = $this.attr('idRate');
            var content = textEdit.val().trim();
            if (content == '') {
                // deleteCmt(deleteCmtBtn);
                Swal.fire({
                    icon: 'warning',
                    title: 'Không được bỏ trống nội dung',
                    showConfirmButton: false,
                    timer: 1000
                });
            }
            else if (content == currentCmt.text().trim()) {
                revert();
            } else {
                $.ajax({
                    url: "/user/edit-comment",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ idRate: idRate, idFilm: idFilm, content: content }),
                    success: function (result) {
                        $this.html(`<div class="spinner-border text-warning spinner-save" role="status"></div>`);
                        setTimeout(() => {
                            revert();
                            var now = new Date();
                            var time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                            var date = now.toLocaleDateString('en-GB');
                            timeCommand.html("Đã chỉnh sửa lúc " + time + ' ' + date);
                            currentCmt.text(content);
                        }, 400);
                    }
                })
            }
        })
    })

    // $('.deleteCmt').each(function () {
    //     var $this = $(this);
    //     $this.click(function () {
    //         deleteCmt($this);
    //     })

    // })

    // function deleteCmt(element) {
    //     var commentRow = element.closest('.commented');
    //     var idCmt = element.attr('idCmt');
    //     var editCmtBtn = element.parent().find('.editCmt')
    //     Swal.fire({
    //         icon: 'question',
    //         title: 'Bạn có chắc chắn muốn xóa ?',
    //         text: 'Bình luận này sẽ bị mất',
    //         showCancelButton: true
    //     }).then((confirm) => {
    //         if (confirm.isConfirmed) {
    //             editCmtBtn.css('display', 'none');
    //             $.ajax({
    //                 url: "/user/delete-comment",
    //                 method: "POST",
    //                 contentType: "application/json",
    //                 data: JSON.stringify({ idCmt: idCmt, idFilm: idFilm }),
    //                 success: function (result) {
    //                     commentRow.remove();
    //                 }
    //             })
    //         }
    //     })
    // }
});

function handleRadio(e) {
    var idSt = $(e).attr('idSt');
    $('.container-input-hidden').html(` <input type="hidden" value=` + idSt + ` name="idShowtime">`);
}