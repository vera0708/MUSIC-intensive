const audio = new Audio();
const tracksCard = document.getElementsByClassName('track');
console.log('tracksCard: ', tracksCard);
const pauseBtn = document.querySelector('.player__icon_pause');

const playMusic = (evt) => {
    // console.dir(evt.currentTarget);
    audio.src = event.currentTarget.dataset.track;
    audio.play();
}

for (let i = 0; i < tracksCard.length; i++) {
    tracksCard[i].addEventListener('click', playMusic)
};


// pauseBtn.addEventListener('click', () => {
//     playMusic('audio/Adele - Hello.mp3')
// });