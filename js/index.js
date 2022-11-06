const dataMusic = [
    {
      id: '1',
      artist: 'The weeknd',
      track: 'Save your tears',
      poster: 'assets/img/Rectangle 6-1.jpg',
      mp3: 'audio/The Weeknd - Save Your Tears.mp3',
    },
    {
      id: '2',
      artist: 'Imagine Dragons',
      track: 'Follow You',
      poster: 'assets/img/Rectangle 6-2.jpg',
      mp3: 'audio/Imagine Dragons - Follow You.mp3',
    },
    {
      id: '3',
      artist: 'Tove Lo',
      track: 'How Long',
      poster: 'assets/img/Rectangle 6-3.jpg',
      mp3: 'audio/Tove Lo - How Long.mp3',
    },
    {
      id: '4',
      artist: 'Tom Odell',
      track: 'Another Love',
      poster: 'assets/img/Rectangle 6-4.jpg',
      mp3: 'audio/Tom Odell - Another Love.mp3',
    },
    {
      id: '5',
      artist: 'Lana Del Rey',
      track: 'Born To Die',
      poster: 'assets/img/Rectangle 6-5.jpg',
      mp3: 'audio/Lana Del Rey - Born To Die.mp3',
    },
    {
      id: '6',
      artist: 'Adele',
      track: 'Hello',
      poster: 'assets/img/Rectangle 6-6.jpg',
      mp3: 'audio/Adele - Hello.mp3',
    },
    {
      id: '7',
      artist: 'Tom Odell',
      track: "Can't Pretend",
      poster: 'assets/img/Rectangle 6-7.jpg',
      mp3: "audio/Tom Odell - Can't Pretend.mp3",
    },
    {
      id: '8',
      artist: 'Lana Del Rey',
      track: 'Young And Beautiful',
      poster: 'assets/img/Rectangle 6-8.jpg',
      mp3: 'audio/Lana Del Rey - Young And Beautiful.mp3',
    },
    {
      id: '9',
      artist: 'Adele',
      track: 'Someone Like You',
      poster: 'assets/img/Rectangle 6-9.jpg',
      mp3: 'audio/Adele - Someone Like You.mp3',
    },
    {
      id: '10',
      artist: 'Imagine Dragons',
      track: 'Natural',
      poster: 'assets/img/Rectangle 6-10.jpg',
      mp3: 'audio/Imagine Dragons - Natural.mp3',
    },
    {
      id: '11',
      artist: 'Drake',
      track: 'Laugh Now Cry Later',
      poster: 'assets/img/Rectangle 6-11.jpg',
      mp3: 'audio/Drake - Laugh Now Cry Later.mp3',
    },
    {
      id: '12',
      artist: 'Madonna',
      track: 'Frozen',
      poster: 'assets/img/Rectangle 6-12.jpg',
      mp3: 'audio/Madonna - Frozen.mp3',
    },
  ];

const audio = new Audio();
const tracksCard = document.getElementsByClassName('track');
const player = document.querySelector('.player');
const catalogContainer = document.querySelector('.catalog__container');
const pauseBtn = document.querySelector('.player__icon_pause');
const stopBtn = document.querySelector('.player__icon_stop');
const prevBtn = document.querySelector('.player__icon_prev');
const nextBtn = document.querySelector('.player__icon_next');
const likeBtn = document.querySelector('.player__icon_like');
const muteBtn = document.querySelector('.player__icon_mute');
const playerProgressInput = document.querySelector('.player__progress-input');

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
    const track = dataMusic.find((item, index) => {
        i = index;
        return id === item.id;
    });
    audio.src = track.mp3;

    audio.play();
    pauseBtn.classList.remove('player__icon_play');
    player.classList.add('player_active');

    const prevTrack = i === 0 ? dataMusic.length - 1 : i - 1;
    const nextTrack = i + 1 === dataMusic.length ? 0 : i + 1;
    prevBtn.dataset.idTrack = dataMusic[prevTrack].id;
    nextBtn.dataset.idTrack = dataMusic[nextTrack].id;

    for (let i = 0; i < tracksCard.length; i++) {
        tracksCard[i].classList.remove('track_active');
    }

    trackActive.classList.add('track_active')
};

const addHandlerTrack = () => {
    for (let i = 0; i < tracksCard.length; i++) {
     tracksCard[i].addEventListener('click', playMusic)
    }
};

pauseBtn.addEventListener('click', pausePlayer);

stopBtn.addEventListener('click', () => {
    audio.src = '';
    player.classList.remove('player_active')
    // сначал скрыли, потом удалили трек из src  
});

const createCard = (data) => {
    const card = document.createElement('button');
    card.href = '#';
    card.classList.add('catalog__item', 'track');
    card.dataset.idTrack = data.id;

    card.innerHTML = `
    <div class="track__img-wrap">
    <img class="track__poster" src="${data.poster}" 
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
    const listCards = dataList.map(createCard);
    catalogContainer.append(...listCards)
    addHandlerTrack();
};

const checkCount = (i = 1) => {
    tracksCard[0]
    if (catalogContainer.clientHeight > (tracksCard[0].clientHeight * 3)) {
        tracksCard[tracksCard.length-i].style.display = 'none';
        checkCount(i + 1);
    } else if (i != 1) {
        catalogContainer.append(catalogAddBtn);
    }
};

const updateTimer = () => {
  console.log('updateTimer');
}

const init = () => {
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
    audio.addEventListener('timeupdate', updateTimer);
    playerProgressInput.addEventListener('change', () => {
      const progress = playerProgressInput.value;
      console.log('progress: ', progress);
    })
  };

init();