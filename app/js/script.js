var Layout = function () {
    //popovers
    var popovers = function(){
        $('.percent').popover({
            trigger: 'hover',
            placement: 'top'
        });
    };

    //choose foto
    var chooseFoto = function(){
        var item = $('.gallery-files li');
        item.click(function(){
            var checkbox = $(this).find('input[type="checkbox"]');
                if(checkbox.is(":checked")){
                    checkbox.attr('checked',false)
                }
                else{
                    checkbox.attr('checked',true)
                }
        })
    };

    //show smiles
    var showSmiles = function(){
      $('.insert-smiles').click(function(event){
          event.preventDefault();
          $('#smiles').toggle()
          if($('#smile').is(":visible")){
              $('#smile').css('border-bottom','1px solid black');
          }
          else{
              $('#smile').css('border-bottom','0px solid black');
          }
      });
    };

    //modal windows
    var modalWindows = function () {
        var overlay = $('#overlay');
        var open_modal = $('.open-modal');
        var close = $('.modal-close, #overlay,.modal-button-close');
        var modal = $('.modal-div');
        var alert = $('.alert');
        var closeAlert = $('.alert .close');

        function showAlert() {
            alert.animate({
                'top': '0px'
            }).fadeIn(500)
        };

        function hideAlert() {
            alert.animate({
                'top': '-50px'
            }).fadeOut(500);
        };

        function runAlert(){
            setTimeout(showAlert, 1000);
            closeAlert.click(hideAlert);
            setTimeout(hideAlert, 7000);
        };

        function closeModal() {
            modal
                .animate({opacity: 0, top: '20%'}, 200,
                    function () {
                        $(this).css('display', 'none');
                        overlay.fadeOut(400);
                    }
                );
        };

        open_modal.click(function (event) {
            event.preventDefault();
            var div = $(this).attr('href');
            overlay.fadeIn(400,
                function () {
                    $(div)
                        .css('display', 'block')
                        .animate({opacity: 1, top: '15%'}, 200);
                });

            var form = $(div).children('form');
            var done = $(form).children('.done');
            var value = $(form).children('.value');
            var deletePhoto = $(form).children('.delete-photo');
            var deleteAlbum = $(form).children('.delete-album');
            var addAvator = $(div).children('.add-avator');
            var addImage = $(div).children('.add-image');


            done.click(function(event){
                event.preventDefault();
                if($(value).val() !== undefined && $(value).val() !== '' ){
                    closeModal();
                    if(div == '#modal-status' ){
                        $('.alert .alert-text p').text('Status saved.');
                    }
                    else if( div == '#modal-support' ){
                        $('.alert .alert-text p').text('Your letter has been successfully sent. The Site Adiminstration will contact you soon.');
                    }
                    else if( div == '#modal-photo-edit'){
                        $('.alert .alert-text p').text('Image updated.');
                    }
                    runAlert();
                }
                else{
                    console.log('dont have value');
                }
            });

            var deletePhoto = $(form).children('.delete-photo');
            deletePhoto.click(function(event){
                event.preventDefault();
                    closeModal();
                    $('.alert .alert-text p').text('Image removed.');
                    runAlert();
            });

            deleteAlbum.click(function(event){
                event.preventDefault();
                closeModal();
                $('.alert .alert-text p').text('Album removed.');
                runAlert();
            });

            addAvator.click(function(event){
                event.preventDefault();
                closeModal();
                $('.alert .alert-text p').text('Avator seved.');
                runAlert();
            });

            addImage.click(function(event){
                event.preventDefault();
                closeModal();
                $('.alert .alert-text p').text('Image uploaded.');
                runAlert();
            });

            var addPhotoInMessage = $('#modal-gallery-files input[type="submit"]');
            addPhotoInMessage.click(function(event){
                event.preventDefault();
                if($('.gallery-files input[type="checkbox"]').is(":checked")){
                    closeModal();
                    $('.photo-box').css('display','block');
                }
            });
        });

        var editAlbum = $('#edit-album .done');
        var albumName = $('#edit-album #album-title');
        editAlbum.click(function(event){
            event.preventDefault();
            if($(albumName).val() !== '' && $(albumName) !== undefined){
                $('.alert .alert-text p').text('Album saved.');
                $('#edit-album').css('display','none');
                runAlert();
            }
        });

        close.click(function () {
            closeModal();
        });
    };

    //tabs visitors and settings
    var tabWindows = function () {
        $('.nav-visitors, .nav-settings').each(function () {
            $(this).find('li').each(function (i) {
                $(this).click(function () {
                    $(this).addClass('active').siblings().removeClass('active')
                        .closest('.visitor-tab, .settings-tab').find('.visitor-tab-item, .settings-tab-item')
                        .removeClass('active').eq(i).addClass('active');
                });
            });
        });
    };

    //album-add, photo-add
    var addPhotoAlbum = function () {
        var div = $('#album-add-block form, #edit-album');
        var link = $('#album-add-block a.album-add, a.edit-album-link');
        var close = $('#album-add-block button[title="album-add-cancel"],.add-photo-cancel');
        $(div).css('display', 'none');
        $(link).click(function (event) {
            event.preventDefault();
            $(div).show();
        });
        $(close).click(function (event) {
            event.preventDefault();
            $(div).hide();
        });
    };

    //colorbox
    var colorBox = function () {
        $('a.photo-link').colorbox({rel: 'gal'});
    };

    //rotate avator
    var transformImg = function () {
        $.fn.addTransform = function (val) {
            return this.each(function () {
                var tr = $(this).css('transform');
                if (tr === 'none') tr = '';
                $(this).css('transform', tr + ' ' + val);
            });
        };
        $('#modal-edit-img .rotate').click(function (event) {
            event.preventDefault();
            $('#modal-edit-img .img').addTransform('rotate(90deg)');
        });
    };

    return {
        initPopovers : function(){
            popovers();
        },
        initChooseFoto : function(){
            chooseFoto();
        },
        initShowSmiles : function(){
            showSmiles();
        },
        initModalWindows: function () {
            modalWindows();
        },
        initTabWindows: function () {
            tabWindows();
        },
        initAddPhotoAlbum: function () {
            addPhotoAlbum();
        },
        initColorBox: function () {
            colorBox();
        },
        initTransformImg: function () {
            transformImg();
        },
        init: function () {
            this.initPopovers();
            this.initChooseFoto();
            this.initShowSmiles();
            this.initModalWindows();
            this.initTabWindows();
            this.initAddPhotoAlbum();
            this.initColorBox();
            this.initTransformImg();
        }
    };
}();



