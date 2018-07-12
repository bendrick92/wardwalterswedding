$(document).ready(function () {
    var prevScroll;

    $(window).on('scroll', function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 0) {
            $('.navbar').toggleClass('hidden', scrollTop > prevScroll);
        }
        else {
            $('.navbar').removeClass('hidden');
        }
        prevScroll = scrollTop;
    });

    $('.navbar a').on('click', function (e) {
        if (this.hash !== "") {
            e.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });

    $('.navbar-burger').on('click', function () {
        $(this).toggleClass('is-active');

        var menu = $('.navbar-menu');
        menu.toggleClass('is-active');
    });

    $('#stories-tabs li').on('click', function () {
        var tab = $(this).data('tab');

        $('#stories-tabs li').removeClass('is-active');
        $(this).addClass('is-active');

        $('#stories-content div').removeClass('is-active');
        $('div[data-content="' + tab + '"]').addClass('is-active');
    });

    $('#party-tabs li').on('click', function () {
        var tab = $(this).data('tab');

        $('#party-tabs li').removeClass('is-active');
        $(this).addClass('is-active');
        $('#party-content div').removeClass('is-active');
        $('div[data-content="' + tab + '"]').addClass('is-active');
    });

    $('#countdown').countdown("05/10/2020", function(event) {
        $(this).text(
            event.strftime('%D days %H:%M:%S')
        );
    });
});