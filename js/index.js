const API_URL = 'http://localhost:3024/';

let dataMusic = [];

let playlist = [];

const favoriteList = localStorage.getItem('favorite')
  ? JSON.parse(localStorage.getItem('favorite')) : []

const audio = new Audio();
const headerLogo = document.querySelector('.header__logo');
const tracksCard = document.getElementsByClassName('track');
const favoriteBtn = document.querySelector('.header__favorite-btn');
const player = document.querySelector('.player');
const catalogContainer = document.querySelector('.catalog__container');
const pauseBtn = document.querySelector('.player__icon_pause');
const stopBtn = document.querySelector('.player__icon_stop');
const prevBtn = document.querySelector('.player__icon_prev');
const nextBtn = document.querySelector('.player__icon_next');
const likeBtn = document.querySelector('.player__icon_like');
const muteBtn = document.querySelector('.player__controller-mute');
const playerProgressInput = document.querySelector('.player__progress-input');

const playerTimePassed = document.querySelector('.player__time-passed');
const playerTimeTotal = document.querySelector('.player__time-total');
const playerVolumeInput = document.querySelector('.player__volume-input');

const search = document.querySelector('.search');

const catalogAddBtn = document.createElement('button');
catalogAddBtn.classList.add('catalog__btn-add');
catalogAddBtn.innerHTML = `
    <span>See all</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
    </svg>  
`;

const pausePlayer = () => {
  const trackActive = document.querySelector('.track_active');

  if (audio.paused) {
    audio.play();
    pauseBtn.classList.remove('player__icon_play');
    trackActive.classList.remove('track_pause');
  } else {
    audio.pause();
    pauseBtn.classList.add('player__icon_play');
    trackActive.classList.add('track_pause');
  }
};

const playMusic = (evt) => {
  evt.preventDefault();
  const trackActive = evt.currentTarget;

  if (trackActive.classList.contains('track_active')) {
    pausePlayer();
    return
  }

  let i = 0;
  const id = trackActive.dataset.idTrack;

  const index = favoriteList.indexOf(id);
  if (index !== -1) {
    likeBtn.classList.add('player__icon_like_active')
  } else {
    likeBtn.classList.remove('player__icon_like_active')
  }

  const track = playlist.find((item, index) => {
    i = index;
    return id === item.id;
  });
  audio.src = `${API_URL}${track.mp3}`;

  audio.play();
  pauseBtn.classList.remove('player__icon_play');
  player.classList.add('player_active');
  player.dataset.idTrack = id;


  const prevTrack = i === 0 ? playlist.length - 1 : i - 1;
  const nextTrack = i + 1 === playlist.length ? 0 : i + 1;
  prevBtn.dataset.idTrack = playlist[prevTrack].id;
  nextBtn.dataset.idTrack = playlist[nextTrack].id;
  likeBtn.dataset.idTrack = id;

  for (let i = 0; i < tracksCard.length; i++) {
    if (id === tracksCard[i].dataset.idTrack) {
      tracksCard[i].classList.add('track_active');
    } else {
      tracksCard[i].classList.remove('track_active');
    }
  }
};

const addHandlerTrack = () => {
  for (let i = 0; i < tracksCard.length; i++) {
    tracksCard[i].addEventListener('click', playMusic)
  }
};

pauseBtn.addEventListener('click', pausePlayer);

stopBtn.addEventListener('click', () => {
  audio.src = '';
  player.classList.remove('player_active');
  document.querySelector('.track_active').classList.remove('track_active');
});

const createCard = (data) => {
  const card = document.createElement('button');
  card.href = '#';
  card.classList.add('catalog__item', 'track');
  if (player.dataset.idTrack === data.id) {
    card.classList.add('track_active');
    if (audio.paused) {
      card.classList.add('track_pause');
    }
  }
  card.dataset.idTrack = data.id;

  card.innerHTML = `
    <div class="track__img-wrap">
    <img class="track__poster" src="${API_URL}${data.poster}" 
        alt="${data.artist} ${data.track}" width="180" height="180">
    </div>
    <div class="track__info">
        <p class="track__title">${data.track}</p>
        <p class="track__artist">${data.artist}</p>
    </div>
    `;

  return card
};

const renderCatalog = (dataList) => {
  catalogContainer.textContent = '';
  playlist = [...dataList];
  const listCards = dataList.map(createCard);
  catalogContainer.append(...listCards)
  addHandlerTrack();
};

const checkCount = (i = 1) => {
  tracksCard[0]
  if (catalogContainer.clientHeight > (tracksCard[0].clientHeight * 3)) {
    tracksCard[tracksCard.length - i].style.display = 'none';
    checkCount(i + 1);
  } else if (i != 1) {
    catalogContainer.append(catalogAddBtn);
  }
};

const updateTimer = () => {
  const duration = audio.duration;
  const currentTime = audio.currentTime;
  const progress = (currentTime / duration) * 100;
  playerProgressInput.value = progress ? progress : 0;

  const minutesPassed = Math.floor(currentTime / 60) || 0;
  const secondsPassed = Math.floor(currentTime % 60) || 0;

  const minutesTotal = Math.floor(duration / 60) || 0;
  const secondsTotal = Math.floor(duration % 60) || 0;

  playerTimePassed.textContent = `${minutesPassed}:${secondsPassed < 10 ? '0' + secondsPassed : secondsPassed}`;
  playerTimeTotal.textContent = `${minutesTotal}:${secondsTotal < 10 ? '0' + secondsTotal : secondsTotal}`;
}
const init = async () => {
  audio.volume = localStorage.getItem('volume') || 1;
  playerVolumeInput.value = audio.volume * 100;

  dataMusic = await fetch(`${API_URL}api/music`).then((data) => data.json())

  renderCatalog(dataMusic);
  checkCount();

  catalogAddBtn.addEventListener('click', () => {
    [...tracksCard].forEach((onetrackCard) => {
      onetrackCard.style.display = '';
      catalogAddBtn.remove();
    });
  });

  prevBtn.addEventListener('click', playMusic);
  nextBtn.addEventListener('click', playMusic);

  audio.addEventListener('ended', () => {
    nextBtn.dispatchEvent(new Event('click', { bubbles: true }));
  })

  audio.addEventListener('timeupdate', updateTimer);

  playerProgressInput.addEventListener('change', () => {
    const progress = playerProgressInput.value;
    audio.currentTime = (progress / 100) * audio.duration;
  });

  favoriteBtn.addEventListener('click', () => {
    const data = dataMusic.filter((item) => favoriteList.includes(item.id))
    renderCatalog(data);
    checkCount();
  });

  headerLogo.addEventListener('click', () => {
    renderCatalog(dataMusic);
    checkCount();
  });

  likeBtn.addEventListener('click', () => {
    const index = favoriteList.indexOf(likeBtn.dataset.idTrack);
    if (index === -1) {
      favoriteList.push(likeBtn.dataset.idTrack);
      likeBtn.classList.add('player__icon_like_active')
    } else {
      favoriteList.splice(index, 1);
      likeBtn.classList.remove('player__icon_like_active')
    }

    localStorage.setItem('favorite', JSON.stringify(favoriteList))
  });

  playerVolumeInput.addEventListener('input', () => {
    const value = playerVolumeInput.value;
    audio.volume = value / 100;
  })

  muteBtn.addEventListener('click', () => {
    if (audio.volume) {
      localStorage.setItem('volume', audio.volume);
      audio.volume = 0;
      muteBtn.classList.add('.player__icon-mute-off');
      console.log('click mute off', muteBtn);
      playerVolumeInput.value = 0;
    } else {
      audio.volume = localStorage.getItem('volume');
      muteBtn.classList.remove('.player__icon-mute-off');
      playerVolumeInput.value = audio.volume * 100;
    }
  });

  search.addEventListener('submit', async (event) => {
    event.preventDefault();

    playlist = await fetch(`${API_URL}api/music?search=${search.search.value}`).then((data) => data.json())

    renderCatalog(playlist);
    checkCount();

  })
};

init();

// this was a mock list of tracks

// {
//   id: '1',
//   artist: 'The weeknd',
//   track: 'Save your tears',
//   poster: 'assets/img/Rectangle 6-1.jpg',
//   mp3: 'audio/The Weeknd - Save Your Tears.mp3',
// },
// {
//   id: '2',
//   artist: 'Imagine Dragons',
//   track: 'Follow You',
//   poster: 'assets/img/Rectangle 6-2.jpg',
//   mp3: 'audio/Imagine Dragons - Follow You.mp3',
// },
// {
//   id: '3',
//   artist: 'Tove Lo',
//   track: 'How Long',
//   poster: 'assets/img/Rectangle 6-3.jpg',
//   mp3: 'audio/Tove Lo - How Long.mp3',
// },
// {
//   id: '4',
//   artist: 'Tom Odell',
//   track: 'Another Love',
//   poster: 'assets/img/Rectangle 6-4.jpg',
//   mp3: 'audio/Tom Odell - Another Love.mp3',
// },
// {
//   id: '5',
//   artist: 'Lana Del Rey',
//   track: 'Born To Die',
//   poster: 'assets/img/Rectangle 6-5.jpg',
//   mp3: 'audio/Lana Del Rey - Born To Die.mp3',
// },
// {
//   id: '6',
//   artist: 'Adele',
//   track: 'Hello',
//   poster: 'assets/img/Rectangle 6-6.jpg',
//   mp3: 'audio/Adele - Hello.mp3',
// },
// {
//   id: '7',
//   artist: 'Tom Odell',
//   track: "Can't Pretend",
//   poster: 'assets/img/Rectangle 6-7.jpg',
//   mp3: "audio/Tom Odell - Can't Pretend.mp3",
// },
// {
//   id: '8',
//   artist: 'Lana Del Rey',
//   track: 'Young And Beautiful',
//   poster: 'assets/img/Rectangle 6-8.jpg',
//   mp3: 'audio/Lana Del Rey - Young And Beautiful.mp3',
// },
// {
//   id: '9',
//   artist: 'Adele',
//   track: 'Someone Like You',
//   poster: 'assets/img/Rectangle 6-9.jpg',
//   mp3: 'audio/Adele - Someone Like You.mp3',
// },
// {
//   id: '10',
//   artist: 'Imagine Dragons',
//   track: 'Natural',
//   poster: 'assets/img/Rectangle 6-10.jpg',
//   mp3: 'audio/Imagine Dragons - Natural.mp3',
// },
// {
//   id: '11',
//   artist: 'Drake',
//   track: 'Laugh Now Cry Later',
//   poster: 'assets/img/Rectangle 6-11.jpg',
//   mp3: 'audio/Drake - Laugh Now Cry Later.mp3',
// },
// {
//   id: '12',
//   artist: 'Madonna',
//   track: 'Frozen',
//   poster: 'assets/img/Rectangle 6-12.jpg',
//   mp3: 'audio/Madonna - Frozen.mp3',
// },