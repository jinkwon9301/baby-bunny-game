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
const FAKE = "fake-image";
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

    makeFakePicture();
    makeBunnyPicture();

    $boardRowCells.forEach(function(target) {
        target.addEventListener("click", showOriginalImage);
    })

    limitTime = setTimeout(countTime, 1000);
    $timer.innerHTML = `제한 시간 : ${time} 초`;
}

function makeFakePicture() {
    for (let i = 0; i < $boardRowCells.length; i++) {
        const image = document.createElement("img");
        image.setAttribute("src", "img/fake.png");
        $boardRowCells[i].appendChild(image);
        image.classList.add(FAKE);
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
    event.currentTarget.childNodes[0].classList.add(INVISIBLE);
    event.currentTarget.childNodes[1].classList.remove(INVISIBLE);
    event.currentTarget.classList.add(SHOWING_IMAGE);
    showingImages.push(event.currentTarget);

    if (showingImages.length === 2) {
        $boardRowCells.forEach(function(target) {
            target.removeEventListener("click", showOriginalImage);
        })
        setTimeout(confirmSamePicture, 500);
    }

    event.currentTarget.removeEventListener("click", showOriginalImage);
}

function confirmSamePicture() {
    if (showingImages[0].childNodes[1].className === showingImages[1].childNodes[1].className) {
        soundPass.play();
        showingImages[0].classList.add(FINDED_IMAGE);
        showingImages[1].classList.add(FINDED_IMAGE);
        showingImages[0].classList.remove(SHOWING_IMAGE);
        showingImages[1].classList.remove(SHOWING_IMAGE);
        findedImages += 2;
        if (findedImages === 16) {
            soundWin.play();
            endGame();
            $endingPage.textContent = '다 찾았다!';
        }
    } else {
        soundFail.play();
        showingImages[0].childNodes[0].classList.remove(INVISIBLE);
        showingImages[0].childNodes[1].classList.add(INVISIBLE);
        showingImages[0].classList.remove(SHOWING_IMAGE);

        showingImages[1].childNodes[0].classList.remove(INVISIBLE);
        showingImages[1].childNodes[1].classList.add(INVISIBLE);
        showingImages[1].classList.remove(SHOWING_IMAGE);
    }
    $boardRowCells.forEach(function(target) {
        if (!target.classList[1]) target.addEventListener("click", showOriginalImage);
    })

    showingImages = [];
}

function restartGame() {
    time = INITIAL_TIME;
    clearInterval(limitTime);
    findedImages = 0;

    $boardRowCells.forEach(function(target) {
        target.removeEventListener("click", showOriginalImage);
    })

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
