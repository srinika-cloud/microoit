console.log("Welcome to Tic Tac Toe");

let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");

let turn = "X";
let isGameOver = false;
let difficulty = "easy";

const boxes = document.querySelectorAll('.box');
const info = document.querySelector('.info');
const resetBtn = document.getElementById('reset');
const difficultySelect = document.getElementById('difficulty');
const img = document.querySelector('.imgbox img');

const changeTurn = () => turn === "X" ? "O" : "X";

const checkWin = () => {
  const boxtext = Array.from(boxes).map(box => box.innerText);
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a,b,c] of wins) {
    if (boxtext[a] && boxtext[a] === boxtext[b] && boxtext[b] === boxtext[c]) {
      info.innerText = `${boxtext[a]} Won!`;
      isGameOver = true;
      img.style.width = "200px";
      gameover.play();
      return true;
    }
  }

  if (!boxtext.includes("") && !isGameOver) {
    info.innerText = "It's a Draw!";
    isGameOver = true;
    return false;
  }

  return false;
};

const getEmptyBoxes = () => Array.from(boxes).filter(box => box.innerText === "");

const makeAIMove = () => {
  if (isGameOver) return;
  let move;

  if (difficulty === "easy") {
    const empties = getEmptyBoxes();
    move = empties[Math.floor(Math.random() * empties.length)];
  }

  else if (difficulty === "medium") {
    move = findBestMove(false) || getEmptyBoxes()[0];
  }

  else {
    move = findBestMove(true);
  }

  if (move) {
    move.innerText = "O";
    audioTurn.play();
    turn = changeTurn();
    checkWin();
    if (!isGameOver) info.innerText = "Turn for X";
  }
};

const checkWinner = (board) => {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return board.includes("") ? null : "Draw";
};

const minimax = (board, isMaximizing) => {
  const winner = checkWinner(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (winner === "Draw") return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = isMaximizing ? "O" : "X";
      let score = minimax(board, !isMaximizing);
      board[i] = "";
      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }
  return bestScore;
};

const findBestMove = (useMinimax) => {
  const board = Array.from(boxes).map(box => box.innerText);
  let bestScore = -Infinity;
  let move = null;

  boxes.forEach((box, i) => {
    if (board[i] === "") {
      board[i] = "O";
      let score = useMinimax ? minimax(board, false) : 0;
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = box;
      }
    }
  });

  return move;
};

// Event Listeners
boxes.forEach((box, i) => {
  box.setAttribute("data-index", i);
  box.addEventListener("click", () => {
    if (box.innerText === "" && !isGameOver && turn === "X") {
      box.innerText = turn;
      audioTurn.play();
      if (!checkWin()) {
        turn = changeTurn();
        info.innerText = "Turn for " + turn;
        setTimeout(makeAIMove, 500);
      }
    }
  });
});

resetBtn.addEventListener("click", () => {
  boxes.forEach(box => box.innerText = "");
  turn = "X";
  isGameOver = false;
  info.innerText = "Turn for X";
  img.style.width = "0px";
});

difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value;
});
