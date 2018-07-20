const app = angular.module('MyApp', []);

app.controller('MainController', ['$http', function($http){
  /* ---------------------
  Global variables
   --------------------- */
  this.h1 = 'Playlist App'
  this.playlist = {}
  this.playlists = []
  this.newPlayListName = ''
  this.createForm = {}

   // API CALL
  this.baseURL = 'http://ws.audioscrobbler.com/2.0/?';
  this.methodSearch = 'method=track.search';
  this.methodInfo = 'method=track.getInfo';
  this.apikey = '&api_key=' + '8e2f6f5f6da4114d76e92c9b03878d02';
  this.format = '&format=json';

  this.tracks = [];
  this.foundMusic = null;

  /* ---------------------
  Playlist functions
   --------------------- */
  // Makes HTTP request to create new playlist
  this.createPlaylist = () => {
    console.log('Angular - Calling createPlayList');
    $http({
      method: 'POST',
      url: '/playlists',
      data: this.createForm
    }).then(response => {
      console.log(response.data);
      this.playlists.unshift(response.data);
      this.createForm = {};
    }, error => {
      console.log(error);
    })
  }

  // Makes HTTP request to get all playlists
  this.getPlaylist = () => {
    $http({
      method: 'GET',
      url: '/playlists',
    }).then(response => {
      console.log(response.data);
      this.playlists = response.data
    }, error => {
      console.log(error);
    })
  }

  // Makes HTTP request to delete playlist
  this.deletePlaylist = (id) => {
    $http({
      method: 'DELETE',
      url: '/playlist/' + id
    }).then(response => {
      console.log(response.data);
      const removeByIndex = this.playlists.findIndex(playlist => playlist._id === id)
      this.playlists.splice(removeByIndex, 1)
    }, error => {
      console.log(error);
    })
  }

  // Makes HTTP request to add track to playlist
  this.addTrackToPlaylist = (track) => {
    this.playlist.tracks.push(track);
    $http({
      method: 'PUT',
      url: '/playlist/' + playlist._id,
      // data: {
      //   tracks: [{
      //     title: this.updatedTitle,
      //     artist: this.updatedArtist,
      //     album: this.updatedAlbum,
      //     genre: this.updatedGenre
      //   }],
      //   description: this.updatedDescription,
      //   likes: {this.updatedLikes},
      //   tags: [{this.updatedTags}],
      //   creator: this.updatedCreator
      //
      // }
    }).then(response => {
      console.log(response.data);
      this.getPlaylist();
    }, error => {
      console.log(error);
    })
  }

  /* ---------------------
  User functions
   --------------------- */
  this.createUser = () => {
    console.log('Angular calling createUser');
    $http({
      method: 'POST',
      url: '/users',
      data: {
        username: this.username,
        password: this.password
      }
    }).then(response => {
      console.log(response);
    })
  }

  this.logIn = () => {
    $http({
      method: 'POST',
      url: '/sessions',
      data: {
        username: this.username,
        password: this.password
      }
    }).then(response => {
      console.log(response);
      this.loggedInUser();
    })
  }

  this.loggedInUser = () => {
    $http({
      method: 'GET',
      url: '/log'
    }).then(response => {
      this.loggedIn = response.data.username
    })
  }

  //API Functions
  this.getMusic = () => {
    $http({
      method: 'GET',
      url: this.baseURL + this.methodSearch + '&track=' + this.MusicTitle + this.apikey + this.format
    }).then(response => {
      console.log(response.data.results.trackmatches.track);
      this.tracks = response.data.results.trackmatches.track;
    }, error => {
      console.error(error);
    }).catch(err => console.error('Catch: ', err));
  }

  this.getTrackInfo = (title, artist) => {
    let titleFormatted = title.split(' ').join('+');
    let artistFormatted = artist.split(' ').join('+');
    $http({
      method: 'GET',
      url: this.baseURL + this.methodInfo + this.apikey + "&artist=" + artistFormatted + '&track=' + titleFormatted + this.format
    }).then(response => {
      console.log(response.data.track);
      this.foundMusic = response.data.track;
    }, error => {
      console.error(error);
    }).catch(err => console.error('Catch: ', err));
  }



  this.getPlaylist();
}]);
