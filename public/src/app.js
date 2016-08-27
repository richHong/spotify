$(document).ready(function(){

  /********* App State ***************/

  //Holds app state variables
  var state = {
    artistId: null,
    artist: null,
    artists: null,
    albums: null
  }

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

    var query = $('#search-text').val() || 'kamaiyah';

    var options = {
      q: query,
      type: 'artist'
    };

    $.get('https://api.spotify.com/v1/search', options, function(data, response){
        state.artists = data.artists.items;
        renderArtists(state.artists);
      })
  };

  // renderArtists appends search results from Spotify API to unordered list, #artists
  function renderArtists (artists) {
    $('#artists-list').empty();

    for(var i = 0; i < artists.length; i++ ){
      $('#artists-list').append('<li class="artist" data-artist-id="' + artists[i].id + '">' + artists[i].name + '</li>');
    }

    // onClick event listener when artist is clicked to select current artist
    $('.artist').on('click', function() {

      state.artistId = $(this).data().artistId;

      $.get('https://api.spotify.com/v1/artists/' + state.artistId, function(data, response){
        state.artist = data;
        renderArtistInfo(state.artist);

        $.get('https://api.spotify.com/v1/artists/' + state.artistId + '/albums', function(data, response){
          console.log(data)
          state.albums = data.items;
          renderAlbums(state.albums);
        })
      });
    });
  }

  // renderArtistInfo appends selected artist info to div, #artistInfo
  function renderArtistInfo (artist) {

    $('#artist-info').empty();

    $('#artist-info').append('<span>' + artist.name + '</span><br /><img class="avatar" src="' + artist.images[0].url + '"/><span>Followers: ' + artist.followers.total + '</span><br/><span>Popularity: ' + artist.popularity + '</span><br/>')
  }
  function renderAlbums (albums) {

    $('#artist-album-list').empty();

    for (var j = 0; j < albums.length; j++) {
      $('#artist-album-list').append('<li class=album data-uri="' + albums[j].uri +'">' + albums[j].name + '</li>')
    }

    $('.album').on('click', function(){
      var albumUri = $(this).data().uri
      renderPlayer(albumUri)
    })

  }
  function renderPlayer (uri) {
    $('#player-main-container').empty();
    $('#player-main-container').append('<iframe src="https://embed.spotify.com/?uri='+uri+'" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>')
  }

  init();

});