$(document).ready(function () {
    //modal windows
    var overlay = $('#overlay');
    var open_modal = $('.open-modal');
    var close = $('.modal-close, #overlay');
    modal = $('.modal-div');

    open_modal.click(function (event) {
        event.preventDefault();
        var div = $(this).attr('href');
        overlay.fadeIn(400,
            function () {
                $(div)
                    .css('display', 'block')
                    .animate({opacity: 1, top: '30%'}, 200);
            });
    });
    close.click(function () {
        modal
            .animate({opacity: 0, top: '25%'}, 200,
                function () {
                    $(this).css('display', 'none');
                    overlay.fadeOut(400);
                }
            );
    });

    //tabs visitors and settings
    $('.nav-visitors, .nav-settings').each(function() {
        $(this).find('li').each(function(i) {
            $(this).click(function(){
                $(this).addClass('active').siblings().removeClass('active')
                    .closest('.visitor-tab, .settings-tab').find('.visitor-tab-item, .settings-tab-item').removeClass('active').eq(i).addClass('active');
            });
        });
    });
});


