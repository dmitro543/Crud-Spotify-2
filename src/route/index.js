// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

 // ================================================================

 class Track {
  static #list = []
  
  constructor(name, author, image) {
     this.id = Math.floor(1000 + Math.random() * 9000)
     this.name = name
     this.author = author
     this.image = image
   }

   static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
     return newTrack
   }

   static getlist() {
    return this.#list.reverse()
   }
 }
Track.create(
   'Інь Ян',
   'MONATIK і ROXOLANA',
   'https://picsum.photos/100/100',
)

Track.create(
   'Baila Conmigo (Remix)',
   'Selena Gomez і Rauw Alejandro',
   'https://picsum.photos/100/100',
)

Track.create(
   'Shameless',
   'Camila Cabello',
   'https://picsum.photos/100/100',
)

Track.create(
   'DÁKITI',
   'BAD BUNNY і JHAY',
   'https://picsum.photos/100/100',
)

Track.create(
   '11 PM',
   'Maluma',
   'https://picsum.photos/100/100',
)

Track.create(
   'Інша любов',
   'Enleo',
   'https://picsum.photos/100/100',
)

console.log(Track.getlist())

class Playlist {

  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }
  
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getlist() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getlist()

    let randomTracks = allTracks
     .sort(() => 0.5 - Math.random())
     .slice(0, 3)

     playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find (
        (playlist) => playlist.Id = id,
      ) || null
    )
  }

  deleteTrackById (trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) => {
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase())
    })
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

// ================================================================

router.get('/', function (req, res) {
  allTracks = Track.getlist()
  console.log(allTracks)

  const allPlaylists = Playlist.getlist()
  console.log(allPlaylists)

  res.render('index', {
    style: 'index',

    data: {
      list: allPlaylists.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      image: 'https://picsum.photos/100/100',
    },
  })
})

// ================================================================

router.get('/spotify-choose', function (req, res) {

  res.render('spotify-choose', {

    style: 'spotify-choose',
  })
})

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;

  console.log(isMix);

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    }
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if(!name) {
    return res.render('alert', {
      style: 'alert',
  
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
        ? `spotify-create?isMix=true`
        : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if(isMix) {
     Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
     
  const playlist = Playlist.getById(id)

  if(!playlist) { 
    return res.render('alert', {
     style: 'alert',
     data: {
       message: 'Помилка',
       info: 'Такого плейліста не знайдено',
       link: '/'
     }
   })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if(!playlist) {
    return res.render('alert', {
      style: 'alert',
  
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      }
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
     style: 'spotify-playlist',
    
      data: {
        playlistId: playlist.id,
        tracks: playlist.tracks,
        name: playlist.name,
      }
  })
})

router.get('/spotify-add-playlist', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getlist()

  console.log(playlistId, playlist, allTracks)
   
  res.render('spotify-add-playlist', {
    style: 'spotify-add-playlist',
   
     data: {
      playlistId: playlist.id,
      tracks: allTracks,
      link: `/spotify-add-playlist?playlistId={{../playlistId}}&trackId={{id}}`
     }
 })
})

router.post('/spotify-add-playlist', function (req, res) {
  const playlistId = Number(req.body.playlistId)
  const trackId = Number(req.body.trackId)
  const playlist = Playlist.getById(playlistId) 
   
  if(!playlist) {
    return res.render('alert', {
      style: 'alert',
     
       data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${{playlistId}}`
       }
    })
  }

  const trackToAdd = Track.getlist().find((track) => track.id === trackId)

  if(!trackToAdd) {
    return res.render('alert', {
      style: 'alert',
     
       data: {
        message: 'Помилка',
        info: 'Такого треку не знайдено',
        link: `/spotify-add-playlist?id=${{playlistId}}`
       }
    })
  }

  playlist.tracks.push(trackToAdd)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
   
     data: {
       playlistId: playlist.id,
       tracks: playlist.tracks,
       name: playlist.name,
     }
  })
})

router.get('/spotify-search', function (req, res) {
  const value = ''
  
  const list = Playlist.findListByValue(value)

    res.render('spotify-search', {
      style: 'spotify-search', 
  
      data: {
         list: list.map(({ tracks, ...rest }) => ({
          ...rest,
          amount: tracks.length
        })),
        value,
      },
    })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log(value)

    res.render('spotify-search', {
      style: 'spotify-search', 
  
      data: {
         list: list.map(({ tracks, ...rest}) => ({
          ...rest,
          amount: tracks.length
        })),
        value,
      },
    })
})

router.get('/spotify-list', function (req, res) {
  allTracks = Track.getList()
  console.log(allTracks)

  const allPlaylists = Playlist.getList()
  console.log(allPlaylists)

  res.render('spotify-list', {
    style: 'spotify-list',
   
     data: {
      list: allPlaylists.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
     }
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
