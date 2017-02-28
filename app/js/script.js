var Layout = function () {
    //office-modal
    var officeBlock = function () {
        var select = $('#office-changer');
        select.change(function () {
            var option = $('#office-changer option:selected').val();
            if (option === '1') {
                $('.office-container').css('display', 'none');
                $('#office-1').css('display', 'block');
            }
            else if (option === '2') {
                $('.office-container').css('display', 'none');
                $('#office-2').css('display', 'block');
            }
            else if (option === '3') {
                $('.office-container').css('display', 'none');
                $('#office-3').css('display', 'block');
            }
            else {
                $('.office-container').css('display', 'none');
                $('#office-4').css('display', 'block');
            }
        })
    };

    //add and remove from favorite
    var favorite = function () {
        var link = $('#favorite');
        $(link).find('a').click(function (event) {
            event.preventDefault();
            if ($(this).hasClass('add')) {
                $(this).text('Remove from favorites')
                    .removeClass('add')
                    .addClass('remove');
                $(link).children('span')
                    .removeClass('add-s')
                    .addClass('remove-s');
            }
            else {
                $(this).text('Add to favorites')
                    .removeClass('remove')
                    .addClass('add');
                $(link).children('span')
                    .removeClass('remove-s')
                    .addClass('add-s');
            }
        });
    };

    //popovers
    var popovers = function () {
        $('.percent').popover({
            trigger: 'hover',
            placement: 'top'
        });
    };

    //choose foto
    var chooseFoto = function () {
        var item = $('.gallery-files li');
        item.click(function () {
            var checkbox = $(this).find('input[type="checkbox"]');
            if (checkbox.is(":checked")) {
                checkbox.attr('checked', false)
            }
            else {
                checkbox.attr('checked', true)
            }
        })
    };

    //show smiles
    var showSmiles = function () {
        $('.insert-smiles').click(function (event) {
            event.preventDefault();
            $('#smiles').toggle(function () {
                if ($('#smile').is(":visible")) {
                    $('#smile').css('height', 'auto').fadeOut(1000)
                }
                else {
                    $('#smile').css('height', 0).fadeIn(1000)
                }
            });
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

        function runAlert() {
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
            var deleteMessage = $(form).children('.delete-message');


            done.click(function (event) {
                event.preventDefault();
                if ($(value).val() !== undefined && $(value).val() !== '') {
                    closeModal();
                    if (div == '#modal-status') {
                        $('.alert .alert-text p').text('Status saved.');
                    }
                    else if (div == '#modal-support') {
                        $('.alert .alert-text p').text('Your letter has been successfully sent. The Site Adiminstration will contact you soon.');
                    }
                    else if (div == '#modal-photo-edit') {
                        $('.alert .alert-text p').text('Image updated.');
                    }
                    runAlert();
                }
                else {
                    console.log('dont have value');
                }
            });

            var deletePhoto = $(form).children('.delete-photo');
            deletePhoto.click(function (event) {
                event.preventDefault();
                closeModal();
                $('.alert .alert-text p').text('Image removed.');
                runAlert();
            });

            deleteAlbum.click(function (event) {
                event.preventDefault();
                closeModal();
                $('.alert .alert-text p').text('Album removed.');
                runAlert();
            });

            deleteMessage.click(function (event) {
                event.preventDefault();
                closeModal();
                $('.alert .alert-text p').text('Message have been deleted.');
                runAlert();
            });

            addAvator.click(function (event) {
                event.preventDefault();
                closeModal();
                $('.alert .alert-text p').text('Avator seved.');
                runAlert();
            });

            addImage.click(function (event) {
                event.preventDefault();
                closeModal();
                $('.alert .alert-text p').text('Image uploaded.');
                runAlert();
            });

            var addPhotoInMessage = $('#modal-gallery-files input[type="submit"]');
            addPhotoInMessage.click(function (event) {
                event.preventDefault();
                if ($('.gallery-files input[type="checkbox"]').is(":checked")) {
                    closeModal();
                    $('.photo-box').css('display', 'block');
                }
            });
        });

        var editAlbum = $('#edit-album .done');
        var albumName = $('#edit-album #album-title');
        editAlbum.click(function (event) {
            event.preventDefault();
            if ($(albumName).val() !== '' && $(albumName) !== undefined) {
                $('.alert .alert-text p').text('Album saved.');
                $('#edit-album').css('display', 'none');
                runAlert();
            }
        });

        close.click(function (event) {
            event.preventDefault();
            closeModal();
        });
    };

    //tabs visitors and settings
    var tabWindows = function () {
        $('.nav-visitors, .nav-settings, .nav-contacts').each(function () {
            $(this).find('li').each(function (i) {
                $(this).click(function () {
                    $(this).addClass('active').siblings().removeClass('active')
                        .closest('.visitor-tab, .settings-tab, .office-container').find('.visitor-tab-item, .settings-tab-item, .contact-tab')
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
        $('a.photo-link').colorbox({
            rel: 'gal'
        });
        $("a.cbox").colorbox({
            current: "{current}/{total}",
            maxWidth: 600,
            maxHeight: 600,
            escKey: true
        });
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
        initOfficeBlock: function () {
            officeBlock();
        },
        initFavorite: function () {
            favorite();
        },
        initPopovers: function () {
            popovers();
        },
        initChooseFoto: function () {
            chooseFoto();
        },
        initShowSmiles: function () {
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
            this.initOfficeBlock();
            this.initFavorite();
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

var Smilies = function () {
    var smiles = function () {
        $.emojiarea.path = 'img/smilies';
        $.emojiarea.icons = {
            ':m_birthday:': 'm_birthday.gif',
            ':m_training:': 'm_training.gif',
            ':m_rain:': 'm_rain.gif',
            ':m_rake:': 'm_rake.gif',
            ':m_facepalm:': 'm_facepalm.gif',
            ':m_swim:': 'm_swim.gif',
            ':m_newspaper:': 'm_newspaper.gif',
            ':m_cook:': 'm_cook.gif',
            ':m_desire:': 'm_desire.gif',
            ':m_heat:': 'm_heat.gif',
            ':m_shower:': 'm_shower.gif',
            ':m_happy:': 'm_happy.gif',
            ':m_sos:': 'm_sos.gif',
            ':m_cleaning:': 'm_cleaning.gif',
            ':m_gamer:': 'm_gamer.gif',
            ':m_boat:': 'm_boat.gif',
            ':m_fishing:': 'm_fishing.gif',
            ':violinist:': 'violinist.gif',
            ':victory:': 'victory.gif',
            ':superman:': 'superman.gif',
            ':searching:': 'searching.gif',
            ':runner:': 'runner.gif',
            ':reading:': 'reading.gif',
            ':pleasantry:': 'pleasantry.gif',
            ':playboy:': 'playboy.gif',
            ':music:': 'music.gif',
            ':morning:': 'morning.gif',
            ':martini:': 'martini.gif',
            ':man_in_love:': 'man_in_love.gif',
            ':malesnore:': 'malesnore.gif',
            ':m_yes:': 'm_yes.gif',
            ':m_wink:': 'm_wink.gif',
            ':m_smile:': 'm_smile.gif',
            ':m_kiss:': 'm_kiss.gif',
            ':m_happymail:': 'm_happymail.gif',
            ':m_empathy:': 'm_empathy.gif',
            ':m_dance:': 'm_dance.gif',
            ':m_cray:': 'm_cray.gif',
            ':m_blush:': 'm_blush.gif',
            ':lazy:': 'lazy.gif',
            ':l_turn:': 'l_turn.gif',
            ':l_lovers:': 'l_lovers.gif',
            ':l_kiss_hand:': 'l_kiss_hand.gif',
            ':l_hug:': 'l_hug.gif',
            ':hi:': 'hi.gif',
            ':her_victory:': 'her_victory.gif',
            ':heart:': 'heart.gif',
            ':give_rose:': 'give_rose.gif',
            ':give_heart:': 'give_heart.gif',
            ':gentelman:': 'gentelman.gif',
            ':friends:': 'friends.gif',
            ':first_move:': 'first_move.gif',
            ':family:': 'family.gif',
            ':daisy:': 'daisy.gif',
            ':cyclist:': 'cyclist.gif',
            ':come_here:': 'come_here.gif',
            ':bye:': 'bye.gif',
            ':big_boss:': 'big_boss.gif',
            ':angel:': 'angel.gif',
            ':air_kiss:': 'air_kiss.gif',
            ':acute:': 'acute.gif'
        };

        $('.reply_textarea textarea').emojiarea({button: '.smile-add', buttonPosition: 'before'});
    };

    return {
        initSmiles: function () {
            smiles();
        },
        init: function () {
            this.initSmiles();

        }
    };
}();



var Maps = function () {

    var addMaps = function () {

        var MapOption = function(x,y){
           this.center =  new google.maps.LatLng(x,y);
           this.zoom = 17;
           this.scrollwheel = false;
        };

        var mapOption1 = new MapOption(55.656233,37.540905);
        var mapOption2 = new MapOption(15.656233,37.540905);
        var mapOption3 = new MapOption(35.656233,37.540905);
        var mapOption4 = new MapOption(55.656233,37.540905);

        var map1 = new google.maps.Map(document.getElementById('google-map1'), mapOption1);
        var map2 = new google.maps.Map(document.getElementById('google-map2'), mapOption2);
        var map3 = new google.maps.Map(document.getElementById('google-map3'), mapOption3);
        var map4 = new google.maps.Map(document.getElementById('google-map4'), mapOption4);

        var Marker = function(x,y,Id){
            this.marker = new google.maps.Marker({
                position :  new google.maps.LatLng(x,y),
                map : Id,
                visible : true,
                icon : 'img/icon/marker.png',
                sayHi : (function(){
                    console.log(Id);
                })()
            });
        }

        var marker1 = new Marker(55.656233,37.540905, map1);
        var marker2 = new Marker(15.656233,37.540905, map2);
        var marker3 = new Marker(35.656233,37.540905, map3);
        var marker4 = new Marker(55.656233,37.540905, map4);


        $('.open-modal').click(function(){
            setTimeout(function(){
                //reload map
                google.maps.event.trigger(map1,'resize');
                console.log('riseze');
            },500);
        });

        var select = $('#office-changer');
        select.change(function () {
            setTimeout(function(){
                google.maps.event.trigger(map1,'resize');
                google.maps.event.trigger(map2,'resize');
                google.maps.event.trigger(map3,'resize');
                google.maps.event.trigger(map4,'resize');
            },500);
        });

    };
    return {
        initAddMaps: function () {
            addMaps();
        },
        init: function () {
            this.initAddMaps();
        }
    };
}();




