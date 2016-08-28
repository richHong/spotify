$(document).ready(function(){

  /********* App State ***************/

  //Holds app state variables
  var state = {
    artistId: null,
    artist: null,
    artists: null,
    albums: null,
    relatedArtists: null
  };

  /******** Helper Functions *********/

  // init initializes app with Jquery event listeners
  function init() {
    $('#search-form').on('submit', function(e){
      e.preventDefault();
      searchSpotify();
    });
  }

  // searchSpotify makes an ajax request to Spotify search API
  function searchSpotify () {
    var query = $('#search-text').val();
    if (!query) {
      renderNoQueryError();
    } else {
      var options = {
        q: query,
        type: 'artist'
      };

      $.get('https://api.spotify.com/v1/search', options, function(data, response){
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
    for(var i = 0; i < artists.length; i++ ){
      var artwork;
      artists[i].images.length ? artwork = '-image: url(' + artists[i].images[0].url +')' : artwork = '-color: #282828';
      $('#artists-list').append('<li class="artist" style="background'+artwork+';" data-artist-id="' + artists[i].id + '">' + artists[i].name + '</li>');
    }
    $('#artists-list-container').scrollTop(0);

    // onClick event listener when artist is clicked to select current artist
    $('.artist').on('click', function() {
      state.artistId = $(this).data().artistId;

      $.get('https://api.spotify.com/v1/artists/' + state.artistId, function(data, response){
        state.artist = data;
        renderArtistInfo(state.artist);
      });

      $.get('https://api.spotify.com/v1/artists/' + state.artistId + '/albums', function(data, response){
        state.albums = data.items;
        renderAlbums(state.albums);
      });

      $.get('https://api.spotify.com/v1/artists/' + state.artistId + '/related-artists', function(data, response){
        state.relatedArtists = data.artists;
        renderRelatedArtists(state.relatedArtists);
      });
    });
  }
  // renderRelatedArtists appends selected artists' related artists list
  function renderRelatedArtists(artists) {
    $('#related-artists-list').empty();
    artists = _.uniq(artists, 'name');
    for(var i = 0; i < artists.length; i++ ){
      var artwork;
      artists[i].images.length ? artwork = '-image: url(' + artists[i].images[0].url +')' : artwork = '-color: #282828';
      $('#related-artists-list').append('<li class="artist" style="background'+artwork+';" data-artist-id="' + artists[i].id + '">' + artists[i].name + '</li>');
    }
    $('#related-artists-list-container').scrollTop(0);

    // onClick event listener when artist is clicked to select current artist
    $('.artist').on('click', function() {
      state.artistId = $(this).data().artistId;

      $.get('https://api.spotify.com/v1/artists/' + state.artistId, function(data, response){
        state.artist = data;
        renderArtistInfo(state.artist);
      });

      $.get('https://api.spotify.com/v1/artists/' + state.artistId + '/albums', function(data, response){
        state.albums = data.items;
        renderAlbums(state.albums);
      });

      $.get('https://api.spotify.com/v1/artists/' + state.artistId + '/related-artists', function(data, response){
        state.relatedArtists = data.artists;
        renderRelatedArtists(state.relatedArtists);
      });
    });
  }
  // renderArtistInfo appends selected artist info to div, #artistInfo
  function renderArtistInfo (artist) {
    $('#artist-info').empty();
    var artwork;
    artist.images.length ? artwork = artist.images[0].url : artwork = './assets/cover.png';
    $('#artist-info').append('<span class="artist-name">' + artist.name + '</span><br/><br/><br/><span class="artist-details">Followers: ' + artist.followers.total + '</span><br/><span class="artist-details">Popularity: ' + artist.popularity + '</span>');
    $('#artist-info-container').css('background-image','url(' + artwork + ')');
  }
  // render Albums renders list of albums
  function renderAlbums (albums) {
    $('#artist-album-list').empty();
    albums = _.uniq(albums, 'name');
    for (var j = 0; j < albums.length; j++) {
      $('#artist-album-list').append('<li class=album style="background-image: url(' + albums[j].images[0].url +');" data-uri="' + albums[j].uri +'">' + albums[j].name + '</li>');
    }
    $('#album-info-container').scrollTop(0);
    // Event listener to render player when clicked
    $('.album').on('click', function(){
      var uri = $(this).data().uri;
      renderPlayer(uri);
    });

  }
  // renderPlayer appends player
  function renderPlayer (uri) {
    $('#player-main-container').empty();
    $('#player-main-container').append('<iframe src="https://embed.spotify.com/?uri='+uri+'" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>')
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

  init();

});