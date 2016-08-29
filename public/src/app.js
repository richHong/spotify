$(document).ready(() => {

  /********* App State ***************/

  //Holds app state variables
  let state = {
    artistId: null,
    artist: null,
    artists: null,
    albums: null,
    relatedArtists: null
  };

  /******** Helper Functions *********/

  // init initializes app with Jquery event listeners
  $('#search-form').on('submit', e => {
    e.preventDefault();
    searchSpotify();
  });
  
  // searchSpotify makes an ajax request to Spotify search API
  function searchSpotify () {

    let query = $('#search-text').val();

    if (!query) {

      renderNoQueryError();

    } else {

      let options = {
        q: query,
        type: 'artist'
      };

      $.get('https://api.spotify.com/v1/search', options, (data, response) => {
        if (data.artists.items.length === 0){

          renderNoResultsError();

        } else {

          state.artists = data.artists.items;
          renderArtists(state.artists);
        }
      });

      $('#search-text').val('');
    }
  };

  // renderArtists appends search results from Spotify API to unordered list, #artists
  function renderArtists (artists) {

    $('#artists-list').empty();

    artists = _.uniq(artists, 'name');

    for(let i = 0; i < artists.length; i++ ){

      let artwork;
      artists[i].images.length ? artwork = `-image: url(${artists[i].images[0].url})` : artwork = '-color: #282828';
      
      $('#artists-list').append(`<li 
                                    class="artist" 
                                    style="background${artwork};" 
                                    data-artist-id=${artists[i].id}>
                                    ${artists[i].name}
                                 </li>`);
    }
    $('#artists-list-container').hide().show('blind', {direction:'up'});
    $('#artists-list-container').scrollTop(0);

    // onClick event listener when artist is clicked to select current artist
    $('.artist').on('click', function() {
      state.artistId = $(this).data().artistId;

      $.get(`https://api.spotify.com/v1/artists/${state.artistId}`, (data, response) => {
        state.artist = data;
        renderArtistInfo(state.artist);
      });

      $.get(`https://api.spotify.com/v1/artists/${state.artistId}/albums`, (data, response) => {
        state.albums = data.items;
        renderAlbums(state.albums);
        renderPlayer(state.albums[0].uri);
      });

      $.get(`https://api.spotify.com/v1/artists/${state.artistId}/related-artists`, (data, response) => {
        state.relatedArtists = data.artists;
        renderRelatedArtists(state.relatedArtists);
      });
    });
  }
  // renderRelatedArtists appends selected artists' related artists list
  function renderRelatedArtists(artists) {

    $('#related-artists-list').empty();

    artists = _.uniq(artists, 'name');

    for(let k = 0; k < artists.length; k++) {

      let artwork;
      artists[k].images.length ? artwork = `-image: url(${artists[k].images[0].url})` : artwork = '-color: #282828';
      
      $('#related-artists-list').append(`<li 
                                            class="related-artist" 
                                            style="background${artwork};" 
                                            data-artist-id=${artists[k].id}>
                                            ${artists[k].name}
                                          </li>`);
    }
    $('#related-artists-list-container').hide().show('blind', {direction:'up'});
    $('#related-artists-list-container').scrollTop(0);

    // onClick event listener when artist is clicked to select current artist
    $('.related-artist').on('click', function() {
      state.artistId = $(this).data().artistId;

      $.get(`https://api.spotify.com/v1/artists/${state.artistId}`, (data, response) => {
        state.artist = data;
        renderArtistInfo(state.artist);
      });

      $.get(`https://api.spotify.com/v1/artists/${state.artistId}/albums`, (data, response) => {
        state.albums = data.items;
        renderAlbums(state.albums);
        renderPlayer(state.albums[0].uri);
      });

      $.get(`https://api.spotify.com/v1/artists/${state.artistId}/related-artists`, (data, response) => {
        state.relatedArtists = data.artists;
        renderRelatedArtists(state.relatedArtists);
      });
    });
  }
  // renderArtistInfo appends selected artist info to div, #artistInfo
  function renderArtistInfo (artist) {

    $('#artist-info').empty();

    let artwork;
    artist.images.length ? artwork = artist.images[0].url : artwork = './assets/cover.png';
    
    $('#artist-info').append(`<span class="artist-name">
                                ${artist.name}
                              </span>
                              <br/>
                              <br/>
                              <br/>
                              <span class="artist-details">
                                Followers: ${artist.followers.total}
                              </span>
                              <br/>
                              <span class="artist-details">
                                Popularity: ${artist.popularity}
                              </span>`);

    $('#artist-info-container').css('background-image',`url(${artwork})`);
    $('#artist-info-container').hide().show('puff');
  }
  // render Albums renders list of albums
  function renderAlbums (albums) {

    $('#artist-album-list').empty();

    albums = _.uniq(albums, 'name');

    for (let j = 0; j < albums.length; j++) {
      $('#artist-album-list').append(`<li 
                                        class="album" 
                                        style="background-image: url(${albums[j].images[0].url});" 
                                        data-uri=${albums[j].uri}>
                                        ${albums[j].name}
                                      </li>`);
    }
    $('#album-info-container').hide().show('blind', {direction:'up'});
    $('#album-info-container').scrollTop(0);

    // Event listener to render player when clicked
    $('.album').on('click', function() {
      renderPlayer($(this).data().uri);
    });
  }
  // renderPlayer appends player
  function renderPlayer (uri) {
    $('#player-main-container').empty();
    $('#player-main-container').append(`<iframe 
                                          src="https://embed.spotify.com/?uri=${uri}" 
                                          width="100%" 
                                          height="380" 
                                          frameborder="0" 
                                          allowtransparency="true">
                                        </iframe>`);
    $('#player-main-container').hide().show('blind', {direction:'down'});
  }
  // renderNoResultsError appends error to list when no results are found
  function renderNoResultsError() {
    $('#artists-list').empty();
    $('#artists-list').append('<li class="error">No search results.</li>');
  }
  // renderNoQueryError appends error to list when no query data is entered
  function renderNoQueryError() {
    $('#artists-list').empty();
    $('#artists-list').append('<li class="error">Search cannot be empty.</li>');
  }

});