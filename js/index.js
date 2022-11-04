const audio = new Audio();
const tracksCard = document.getElementsByClassName('track');
const player = document.querySelector('.player');
const pauseBtn = document.querySelector('.player__icon_pause');
const stopBtn = document.querySelector('.player__icon_stop');

const playMusic = (evt) => {
    // console.dir(evt.currentTarget);
    const trackActive = evt.currentTarget;

    audio.src = trackActive.dataset.track;
    audio.play();
    pauseBtn.classList.remove('player__icon_play');
    player.classList.add('player_active');
    for (let i = 0; i < tracksCard.length; i++) {
        tracksCard[i].classList.remove('track_active');
    }

    trackActive.classList.add('track_active')
};

for (let i = 0; i < tracksCard.length; i++) {
    tracksCard[i].addEventListener('click', playMusic)
};


pauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        pauseBtn.classList.remove('player__icon_play')
    } else {
        audio.pause();
        pauseBtn.classList.add('player__icon_play')
    }
});

stopBtn.addEventListener('click', () => {
    // скрыть и удалить из src трек 
})