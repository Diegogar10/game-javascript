const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const result = document.querySelector('#result');

let level = 0;
let lives = 3;

let timeStart;
let timPlayer;
let timeInterval;

const playerPosition = {
    x:undefined,
    y:undefined,
}
const giftPosition = {
    x:undefined,
    y:undefined,
}
let enemiesPositions = [];

window.addEventListener('load', startGame);
window.addEventListener('resize', startGame);
const {elementSize, canvasSize} = setCanvasSize();

function startGame() {

    showLives();

    game.font = elementSize + 'px Arial';
    game.textAling = 'center';

    const map = maps[level];

    if(!map){
        gameWin();
        return;
    }
    
    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''))
    
    enemiesPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col,colI) => {
            const emoji = emojis[col];
            const posX = elementSize * (colI);
            const posY = elementSize * (rowI + 1);

            if(col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            }else if(col == 'I'){
                if(!giftPosition.x && !giftPosition.y){
                    giftPosition.x = posX;
                    giftPosition.y = posY;
                }
            }else if(col == 'X'){

                enemiesPositions.push({
                    x: posX,
                    y: posY
                })
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
    
/*     for (let row = 1; row <= 10; row++){
        for(let col = 0; col <= 10; col++){
            game.fillText(emojis[mapRowCols[row-1][col]], elementSize * col, elementSize * row);
        }
    }  */
/*     game.fillRect(0,0,100,100);
    game.clearRect(50,50,50,50);

    game.font='25px Arial';
    game.fillStyle = 'red';
    game.textAlign = 'end'

    game.fillText('Platzi', 70,30) */
}

function setCanvasSize() {
    let canvasSize;

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    }else{
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    const elementSize = canvasSize/10;

    return {
        elementSize,
        canvasSize
    }
}

function movePlayer (){
    const giftCollitionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollitionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollition = giftCollitionX && giftCollitionY;
    
    if(giftCollition){
        levelWin();
    }
    
    const enemyCollitions = enemiesPositions.find(enemy =>{
        const enemyCollitionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollitionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollitionX && enemyCollitionY;
    });
    
    if(enemyCollitions){
        levelFail();
    }


    game.fillText(emojis['PLAYER'], playerPosition.x , playerPosition.y);
}

function levelWin() {
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    giftPosition.x = undefined;
    giftPosition.y = undefined;
    level++;
    startGame();
}

function gameWin() {
    console.log('terminaste juego');
    clearInterval(timeInterval);
    
    const record = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    
    if(record) {
        if(record >= playerTime){
            localStorage.setItem('record_time', playerTime);
            result.innerHTML = 'Felicitaciones, superaste el record!'
        }else {
            result.innerHTML = 'Lo siento, no superaste el record!'
        }
    }else {
        localStorage.setItem('record_time', playerTime);
    }
}

function levelFail() {
    lives--;

    /* spanLives.innerHTML = emojis['HEART']; */

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    giftPosition.x = undefined;
    giftPosition.y = undefined;

    startGame();  
}

function showLives(){

    spanLives.innerHTML = '';
    const p = document.createElement('p');

    for(i = 0; i < lives ; i++){
        const txt = document.createTextNode(emojis['HEART']);
        p.appendChild(txt);
    }
    spanLives.appendChild(p);

}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnRight.addEventListener('click', moveRight);
btnLeft.addEventListener('click', moveLeft);
window.addEventListener('keydown', moveByKeys);

function moveUp() {
    if ((playerPosition.y - elementSize) < elementSize){
    }else {
        playerPosition.y -= elementSize; 
        startGame();
    }
}
function moveDown() {
    if ((playerPosition.y + elementSize )> (canvasSize)){
    }else {
        playerPosition.y += elementSize; 
        startGame();
    }
}
function moveRight() {
    if ((playerPosition.x + elementSize )> (canvasSize-elementSize)){
    }else {
        playerPosition.x += elementSize; 
        startGame();
    }
}
function moveLeft() {
    if ((playerPosition.x - elementSize )< 0){
    }else {
        playerPosition.x -= elementSize; 
        startGame();
    }
}
function moveByKeys(e) {
    switch (e.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        default :
            console.log('Tecla no valida!')
            break;
    }
}