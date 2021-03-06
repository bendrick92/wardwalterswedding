$(document).ready(function () {
    var subscribeForm = $('#subscribe-form');
    var subscribeError = $('#subscribe-error');
    var subscribeSuccess = $('#subscribe-success');
    var subscribeEmail = $('#subscribe-email');

    var apiEndpoint = 'https://jukebox-api-free.azurewebsites.net/api/Suggestion';
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
        $('#stories-content div[data-content="' + tab + '"]').addClass('is-active');
    });

    $('#party-tabs li').on('click', function () {
        var tab = $(this).data('tab');

        $('#party-tabs li').removeClass('is-active');
        $(this).addClass('is-active');
        $('#party-content div').removeClass('is-active');
        $('#party-content div[data-content="' + tab + '"]').addClass('is-active');
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

    $('#subscribe-email').on('keypress', function (e) {
        subscribeEmail.css('border', 'none');
        subscribeError.hide();
        subscribeSuccess.hide();
    });

    $('#subscribe-form').on('submit', function (e) {   
        var form = document.getElementById('subscribe-form');

        e.preventDefault();
        
        var valid = trySubscribe();

        if (valid) {
            var data = new FormData(form);

            $.ajax(form.method, form.action, data, subscribeSuccess, subscribeError);
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

    function trySubscribe() {
        if (validateEmail(subscribeEmail.val())) {
            return true;
        }
        else {
            subscribeEmail.css('border', '1px solid #F00');
            subscribeError.text('Please enter a valid email');
            subscribeError.show();
            return false;
        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email.toLowerCase());
        }
    }

    function subscribeSuccess() {
        subscribeForm.reset();
        subscribeSuccess.text('Submitted!');
        subscribeSuccess.show();
    }

    function subscribeError() {
        subscribeError.text('There was an error - please try again!');
        subscribeError.show();
    }
});