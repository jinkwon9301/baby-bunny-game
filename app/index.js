/* js
// 이미지 경로에 따라 아래와 같은 구문 삽입
// `yourImageName` 부분은 사용하는 이미지의 이름을 지어서 넣어주세요.
import yourImageName from "../images/vc.png";

var $something = document.querySelector(".main-logo");

// 이렇게 이미지 요소의 `src` 속성을 추가할 수 있습니다.
$something.src = yourImageName;
*/

const $landingPage = document.querySelector(".landing-page");
const $gamePage = document.querySelector(".game-page");
const $endingPage = document.querySelector(".ending-page");
const $startButton = document.querySelector(".start-button");
const $reStartButton = document.querySelector(".restart-button");
const $statusDisplay = document.querySelector(".status-display");
const $boardRowCells = document.querySelectorAll(".board-row__cell");
const $timer = document.querySelector(".status-display__timer");
const soundFail = new Audio("audio/틀렸을 때.mp3");
const soundLoose = new Audio("audio/게임 종료.mp3");
const soundPass = new Audio("audio/맞추었어.mp3");
const soundWin = new Audio("audio/이김.mp3");

const images = [1,2,3,4,5,6,7,8];

const INVISIBLE = "invisible";
const ORIGINAL = "original-image";
const outsideImage = "outside-image";
const SHOWING_IMAGE = "showing-image";
const FINDED_IMAGE = "finded-image";
const INITIAL_TIME = 30;

let images2 = images.concat(images);
let showingImages = [];
let findedImages = 0;
let time = INITIAL_TIME;
let limitTime = setTimeout(countTime, 1000);
clearInterval(limitTime);

$startButton.addEventListener("click", startGame);
$reStartButton.addEventListener("click", restartGame);

function startGame() {
    $endingPage.classList.add(INVISIBLE);
    $landingPage.classList.add(INVISIBLE);
    $startButton.classList.add(INVISIBLE);
    $gamePage.classList.remove(INVISIBLE);
    $reStartButton.classList.remove(INVISIBLE);
    $statusDisplay.classList.remove(INVISIBLE);

    makeOutsidePicture();
    makeBunnyPicture();

    $boardRowCells.forEach(target => target.addEventListener("click", showOriginalImage));

    limitTime = setTimeout(countTime, 1000);
    $timer.innerHTML = `제한 시간 : ${time} 초`;
}

function makeOutsidePicture() {
    for (let i = 0; i < $boardRowCells.length; i++) {
        const image = document.createElement("img");
        image.setAttribute("src", "img/outside.png");
        $boardRowCells[i].appendChild(image);
        image.classList.add(outsideImage);
    }
}

function makeBunnyPicture() {
    for (let i = 0; i < $boardRowCells.length; i++) {
    const index = Math.floor(Math.random() * images2.length);
    const image = document.createElement("img");
    const pictureNumber = images2[index]
    image.setAttribute("src", `img/${pictureNumber}.jpeg`);
    $boardRowCells[i].appendChild(image);
    image.classList.add(INVISIBLE);
    image.classList.add(ORIGINAL);
    image.classList.add(pictureNumber);
    images2.splice(index, 1);
    }
}

function showOriginalImage(event) {
    const outsideImage = event.currentTarget.childNodes[0];
    const originalImage = event.currentTarget.childNodes[1];
    const currentImage = event.currentTarget;

    outsideImage.classList.add(INVISIBLE);
    originalImage.classList.remove(INVISIBLE);
    currentImage.classList.add(SHOWING_IMAGE);
    showingImages.push(currentImage);

    currentImage.removeEventListener("click", showOriginalImage);

    if (showingImages.length === 2) {
        confirmSamePicture();
    }

}

function confirmSamePicture() {
    const outsideImages = [showingImages[0].childNodes[0], showingImages[1].childNodes[0]];
    const originalImages = [showingImages[0].childNodes[1], showingImages[1].childNodes[1]];

    showingImages.forEach(picture => picture.classList.remove(SHOWING_IMAGE));
    showingImages.forEach(target => target.addEventListener("click", showOriginalImage));

    if (originalImages[0].className === originalImages[1].className) {
        showingImages.forEach(target => target.removeEventListener("click", showOriginalImage));
        soundPass.play();
        showingImages.forEach(picture => picture.classList.add(FINDED_IMAGE));

        findedImages += 2;
        if (findedImages === 16) {
            clearInterval(limitTime);
            soundWin.play();
            endGame();
            $endingPage.textContent = '다 찾았다!';
        }
        showingImages = [];
        return;
    } 

    soundFail.play();
    setTimeout(function() {        
        outsideImages.forEach(picture => picture.classList.remove(INVISIBLE));
        originalImages.forEach(picture => picture.classList.add(INVISIBLE));
    }, 500)
    showingImages = [];
}

function restartGame() {
    time = INITIAL_TIME;
    clearInterval(limitTime);
    findedImages = 0;

    $boardRowCells.forEach(target => target.removeEventListener("click", showOriginalImage));

    $boardRowCells.forEach(function(target) {
        target.classList.remove(FINDED_IMAGE);
        target.classList.remove(SHOWING_IMAGE);
    })
    
    $endingPage.classList.add(INVISIBLE);
    $landingPage.classList.remove(INVISIBLE);
    $startButton.classList.remove(INVISIBLE);
    $gamePage.classList.add(INVISIBLE);
    $reStartButton.classList.add(INVISIBLE);
    $statusDisplay.classList.add(INVISIBLE);

    deleteBunnyPicture();
    images2 = images.concat(images);
}

function deleteBunnyPicture() {
    for (let i = 0; i < $boardRowCells.length; i++) {
        $boardRowCells[i].innerHTML = "";
    }
}

function endGame() {
    $gamePage.classList.add(INVISIBLE);
    $statusDisplay.classList.add(INVISIBLE);
    $endingPage.classList.remove(INVISIBLE);
}

function countTime() {
    time -= 1;
    $timer.innerHTML = `제한 시간 : ${time} 초`;

    clearInterval(limitTime);
    limitTime = setTimeout(countTime, 1000);

    if (time === 0) {
        soundLoose.play();
        endGame();
        $endingPage.textContent = "못찾았다!";
    }
}
