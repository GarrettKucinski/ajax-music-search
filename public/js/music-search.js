"use strict";

$(document).on('ready', function() {

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */

    const getHashParams = () => {
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    };

    const params = getHashParams();

    let access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    let spotifyAPI = 'https://api.spotify.com/v1';
    let searchTerm;

    $('#login').hide();
    $('#loggedin').show();

    const getAlbums = (response, statusText, jqXHR) => {
        let returnedItems = jqXHR.responseJSON.albums.items;
        let albumList = '<ul class="album-list inner">';

        if (jqXHR.status === 200 && returnedItems.length) {

            let albums = response.albums.items;
            for (let i = 0; i < albums.length; i++) {
                albumList += `
                            <li>
                                <a class="album-detail" href="${albums[i].id}">
                                    <div class="album-wrap">
                                        <img class="album-art" src="${albums[i].images[0].url}" alt="">
                                    </div>
                                    <span class="album-title">${albums[i].name}</span>
                                    <span class="album-artist">${albums[i].artists[0].name}</span>
                                    <a class="spotify-link" href="${albums[i].external_urls.spotify}">View on Spotify</a>
                                </a>
                            </li>`;
            }
        } else {
            albumList += `<li class='no-albums desc'>
                            <i class='material-icons icon-help'>help_outline</i>no albums found that match: ${searchTerm}.
                          </li>`;
        }

        albumList += '</ul>';
        $('#albums').html(albumList);
        $('.album-detail').on('click', function(e) {
            // e.preventDefault();
            let albumId = $(this).attr('href');

            $.ajax({
                url: `${spotifyAPI}/albums/${albumId}`,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function(response, statusText, jqXHR) {
                    const album = response;
                    const albumTracks = album.tracks.items;

                    let albumDetailView = `<div class="album-detail-view">
                                    <header class="detail-header">
                                        <div class="album-details inner">
                                            <a href="#" class="search-results">&lt; Search Results</a>
                                            <span class="image-wrapper">
                                                <img class"album-cover" src="${album.images[1].url}" alt="${album.name}"/>
                                            </span>
                                            <h1 class="album-title">${album.name} (${album.release_date.split('-', 1)}) <span class="artist-name">${album.artists[0].name}</span></h1>
                                        </div>
                                    </header>
                                    <ul class="track-list">`;

                    for (let i = 0; i < albumTracks.length; i++) {
                        albumDetailView += `<li class='album-track'>${i + 1}. ${albumTracks[i].name}</li>`;
                    }

                    albumDetailView += '</ul>';

                    $('#albums').html(albumDetailView);
                    $('.search-results').on('click', (e) => {
                        e.preventDefault();
                        $.ajax({
                            url: `${spotifyAPI}/search`,
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            data: {
                                q: `${searchTerm}`,
                                type: "album",
                                limit: "50"
                            },
                            success: getAlbums
                        });

                    });
                }
            });
        });
    };

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            $('form').submit(function(e) {
                searchTerm = $('#search').val();

                $.ajax({
                    url: `${spotifyAPI}/search`,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    data: {
                        q: `${searchTerm}`,
                        type: "album",
                        limit: "50"
                    },
                    success: getAlbums
                });
                e.preventDefault();
            });
        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
        }
    }
});