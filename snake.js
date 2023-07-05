//board
const blockSize = 25;
const rows = 20;
const cols = 20;
let board;
let context;

//snake head (starting at 5,5)
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

//snake direction
let velocityX = 0;
let velocityY = 0;

//snake body
let snakeBody = [];

//food head (starting at 10,10) - replaced by placeFood to randomise where food appears
// const foodX = blockSize * 10;
// const foodY = blockSize * 10;
let foodX;
let foodY;

let gameOver = false;

const update = () => {
    if (gameOver) {
        return;
    }

    //board
    context.fillStyle="black";
    context.fillRect(0,0, board.width, board.height);

    //food (needs to be rendered first so that the snakes goes over the food)
    context.fillStyle="red";
    context.fillRect(foodX,foodY,blockSize, blockSize);

    if ((snakeX === foodX) && (snakeY === foodY)) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    //move each segment by one starting with the tail so that the head is the last to move and all the other segements have moved into the places where the previous segment was
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    //if snake has a body move the first body segment (the one before the head) to where the head was
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY]
    } 

    //snake
    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX,snakeY,blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize)
    }

    //game over conditions
    // if go out of bounds
    if (snakeX < 0 || snakeX > cols* blockSize || snakeY < 0 || snakeY > rows*blockSize) {
        gameOver = true;
        alert("Game Over");
    }

    //or if bump into your own body parts
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }

}

const placeFood = () => {
    //(randomly chooses number between 0-1) * cols -> (0-19.99999...) -> (0-19 when floor) * blocksize
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}


const changeDirection = (e) => {
    //pressed up and is not going in a down direction
    if (e.code === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    //pressed down and is not going in an up direction
    else if (e.code === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

window.onload = () => {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    placeFood();
    document.addEventListener("keyup", changeDirection);
    // update();
    // instead of calling update just once make the page refresh 5 times a second so that it re-renders and picks up the snake moving
    setInterval(update, 1000/5);
}