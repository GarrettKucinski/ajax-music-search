"use strict";

$(document).on('ready', function() {
    let spotifyAPI = 'https://api.spotify.com/v1/search';
    let searchTerm;

    const getAlbums = (response, statusText, jqXHR) => {
        spotifyAPI = response.albums.next;
        let returnedItems = jqXHR.responseJSON.albums.items;
        let albumList = '<ul class="album-list">';

        if (jqXHR.status === 200 && returnedItems.length) {
            let albums = response.albums.items;
            for (let i = 0; i < albums.length; i++) {
                albumList += `
                            <li>
                                <div class="album-wrap">
                                    <a href="${albums[i].external_urls.spotify}"><img class="album-art" src="${albums[i].images[1].url}" alt=""></a>
                                </div>
                                <span class="album-title">${albums[i].name}</span>
                                <span className="album-artist">${albums[i].artists[0].name}</span>
                            </li>`;
            }
        } else {
            albumList += `<li class='no-albums desc'>
                            <i class='material-icons icon-help'>help_outline</i>no albums found that match: ${searchTerm}.
                          </li>`;
        }

        albumList += '</ul>';

        $('#albums').html(albumList);
    };

    $('form').submit(function(e) {
        searchTerm = $('#search').val();

        $.ajax(spotifyAPI, {
            method: 'GET',
            data: {
                q: `${searchTerm}`,
                type: "album",
                limit: '50'
            },
            dataType: 'json',
            success: getAlbums
        });

        e.preventDefault();
    });

    // $(window).on('scroll', () => {
    //     let scrollTop = $(document).scrollTop();
    //     let windowHeight = $(window).height();
    //     let bodyHeight = $(document).height() - windowHeight;
    //     let scrollPercentage = (scrollTop / bodyHeight);
    //     if (scrollPercentage > 0.9) {
    //         console.log('load content: ', scrollTop);
    //     }
    // });
});