$(document).ready(function () {
    var apiEndpoint = 'https:///jukebox-api.azurewebsites.net/api/Suggestion';
    //var apiEndpoint = 'http://localhost';

    loadJukebox();

    var prevScroll;

    $(window).on('scroll', function () {
        var scrollTop = $(window).scrollTop();
        var navbarHeight = $('.navbar').height();
        var windowWidth = $(window).width();

        if (windowWidth > 1087 && scrollTop > navbarHeight && scrollTop > prevScroll) {
            hideNav();
        }
        else {
            showNav();
        }

        prevScroll = scrollTop;
    });

    $(window).on('resize', function () {
        var windowWidth = $(window).width();

        if (windowWidth <= 1087) {
            showNav();
        }
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

    $('#jukebox-form').on('submit', function (e) {
        e.preventDefault();

        $(this).validate();

        if ($(this).valid()) {
            var json = JSON.stringify({
                'SubmitterName': $('#submitterName').val(),
                'SongName': $('#songName').val(),
                'ArtistName': $('#artistName').val(),
                'Recaptcha': $('#g-recaptcha-response').val()
            });

            console.log(json);

            $.ajax({
                url: apiEndpoint,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: json,
                success: function (result) {
                    addToJukebox(result);
                    
                    showJukeboxSuccess();
                },
                error: function (xhr, response, text) {
                    console.log(xhr, response, text);

                    showJukeboxError();
                }
            });
        }
    });

    function showNav() {
        $('.navbar').removeClass('hidden');
    }

    function hideNav() {
        $('.navbar').addClass('hidden');
    }

    function showJukeboxSuccess() {
        var jukeboxStatus = $('#jukebox-status');
        jukeboxStatus.attr('class', '');
        jukeboxStatus.attr('class', 'notification is-success');
        jukeboxStatus.text('Song added successfully!');
        jukeboxStatus.slideDown();

        setTimeout(function () {
            jukeboxStatus.slideUp();
        }, 3000);
    }

    function showJukeboxError() {
        var jukeboxStatus = $('#jukebox-status');
        jukeboxStatus.attr('class', '');
        jukeboxStatus.attr('class', 'notification is-danger');
        jukeboxStatus.text('An error occurred - please try again!');
        jukeboxStatus.slideDown();

        setTimeout(function () {
            jukeboxStatus.slideUp();
        }, 3000);
    }

    function loadJukebox() {
        var jukeboxTable = $('#jukebox-table');

        $.ajax({
            url: apiEndpoint,
            type: 'GET',
            success: function (result) {
                $.each(result, function (i, v) {
                    addToJukebox(v);
                });
            },
            error: function (xhr, response, text) {
                console.log(xhr, response, text);
            }
        });
    }

    function addToJukebox(suggestion) {
        var jukeboxTable = $('#jukebox-table');

        var submitter = suggestion.submitterName;
        var song = suggestion.songName;
        var artist = suggestion.artistName;

        var jukeboxItem = $('<tr></tr>');
        jukeboxItem.append('<td>' + song + '</td>');
        jukeboxItem.append('<td>' + artist + '</td>');
        jukeboxItem.append('<td>' + submitter + '</td>');
        
        jukeboxTable.find('tbody').append(jukeboxItem);
    }
});