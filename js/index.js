const audio = new Audio();
const pauseBtn = document.querySelector('.player__icon_pause');

const playMusic = url => {
    audio.src = url;
    audio.play();
}
pauseBtn.addEventListener('click', () => {
    playMusic('audio/Adele - Hello.mp3')
});