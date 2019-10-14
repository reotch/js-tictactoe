// Global variables (don't hate me)
let initializeBoard;
const humanPlayer = "O";
const computerPlayer = "X";
const winningCombinations = [
    // horizontal wins
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // vertical wins
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonal wins
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    initializeBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof initializeBoard[square.target.id] == 'number') {
        turn(square.target.id, humanPlayer);
        if (!checkTie()) turn(bestSpot(), computerPlayer);
    }
}

function turn(squareId, player) {
    initializeBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWinner = checkWin(initializeBoard, player);
    if (gameWinner) gameOver(gameWinner);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWinner = null;
    for (let [index, win] of winningCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWinner = {index: index, player: player};
            break;
        }
    }
    return gameWinner;
}

function gameOver(gameWinner) {
    for (let index of winningCombinations[gameWinner.index]) {
        document.getElementById(index).style.backgroundColor = gameWinner.player == humanPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWinner.player == humanPlayer ? "You win!" : "You lose!")
}

// AI for playing the Xs

function declareWinner(who) {
    document.querySelector('.endgame').style.display = "block";
    document.querySelector('.endgame .text').innerText = who;
}

function emptySquares() {
    return initializeBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return emptySquares()[0]
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}