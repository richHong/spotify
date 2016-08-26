$(document).ready(function(){

  /********* App State ***************/
  var appState = {
    artistId: null,
    artist: null,
    artists: null
  }

  /******** Event Listeners **********/
  $('#searchForm').on('submit', function(e){
    e.preventDefault();
    searchSpotify();
  });

  /******** Helper Functions *********/

  // Makes ajax request to Spotify search API
  var searchSpotify = function(){
    var query = $('#searchText').val() || 'kamaiyah';
    var options = {
      q: query,
      type: 'artist'
    };
    $.get('https://api.spotify.com/v1/search', options, function(data, response){
        console.log(data);
        appState.artists = data.artists.items;
        appendArtists(appState.artists);
      })
  };

  // Appends search results from Spotify API to unordered list, #artists
  var appendArtists = function(artists){
    $('#artists').empty();
    var artistsArray = artists.slice(0,5);
    for(var i = 0; i < artistsArray.length; i++ ){
      $('#artists').append('<li class="artist" data-artist-id="'+artistsArray[i].id+'"><img class="avatar" src="'+artistsArray[i].images[1].url+'"/>'+artistsArray[i].name+'</li>');
    }
    $('.artist').on('click', function(){
      appState.artistId = $(this).data().artistId;
      $.get('https://api.spotify.com/v1/artists/'+appState.artistId, function(data, response){
        appState.artist = data;
        console.log(appState.artist)
        appendArtistInfo(appState.artist);
      });
    });
  }

  // Appends selected artist info to div, #artistInfo
  var appendArtistInfo = function(artist){
    $('#artistInfo').empty();
    $('#artistInfo').append('<h3>'+artist.name+'</h3><br /><img class="avatar" src="'+artist.images[0].url+'"/><p>Followers: '+artist.followers.total+'</p><p>Popularity: '+artist.popularity+'</p>')
  }

});