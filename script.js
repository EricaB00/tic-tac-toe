const displayController = (() => {
    const renderMessage = (message) => {
      document.querySelector(".display-message").innerHTML = message;
    };
    return {
      renderMessage,
    };
  })();
  
  const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];
  
    // function display the gameboard
    const render = () => {
      let board = "";
      gameboard.forEach((box, index) => {
        board += `<div class="box" id="box-${index}">${box}</div>`;
      });
      document.querySelector(".gameboard").innerHTML = board;
      // grab all boxes
      const boxes = document.querySelectorAll(".box");
  
      // attach click event to each box
      boxes.forEach((box) => {
        box.addEventListener("click", Game.handleClick);
      });
    };
  
    // update the gameboard
    const update = (index, value) => {
      gameboard[index] = value;
      render();
    };
  
    const getGameboard = () => gameboard;
  
    return {
      render,
      update,
      getGameboard,
    };
  })();
  
  // factory function to create players
  const createPlayer = (name, mark) => {
    if (name == "") {
      name = mark;
    }
    return { name, mark };
  };
  

//   Control the game
  const Game = (() => {
    // keep track of players
    let players = [];
    let currentPlayerIndex;
    // when game is over
    let gameOver;
  
    const start = () => {
      // create players
      players = [
        createPlayer(document.querySelector("#player1").value, "X"),
        createPlayer(document.querySelector("#player2").value, "O"),
      ];
  
      // current player when start
      currentPlayerIndex = 0;
      gameOver = false;
      Gameboard.render();
    };
  
    const handleClick = (event) => {
      if (gameOver) {
        return;
      }
      //console.log(event.target.id);
      let index = parseInt(event.target.id.split("-")[1]);
      console.log(index);
      // if board marked, then do nothing
      if (Gameboard.getGameboard()[index] !== "") return;
      // where we clicked, current player, and X or O
      Gameboard.update(index, players[currentPlayerIndex].mark);
      // logic for wins and ties
      if (
        winningBoard(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
      ) {
        gameOver = true;
        displayController.renderMessage(
          `${players[currentPlayerIndex].name} wins!`
        );
      } else if (tieGame(Gameboard.getGameboard())) {
        gameOver = true;
        displayController.renderMessage("It is a tie!");
      }
      // switch players
      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };
  
    function winningBoard(board) {
      const winningMoves = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
  
      for (let i = 0; i < winningMoves.length; i++) {
        const [a, b, c] = winningMoves[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return true;
        }
      }
      return false;
    }
  
    const restart = () => {
      for (let i = 0; i < 9; i++) {
        Gameboard.update(i, "");
      }
      Gameboard.render();
      gameOver = false;
      document.querySelector(".display-message").innerHTML = "";
    };
  
    function tieGame(board) {
      return board.every((cell) => cell !== "");
    }
  
    return {
      start,
      handleClick,
      restart,
    };
  })();
  
  
  
  // global
  
  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", () => {
    Game.start();
  });
  
  const restartButton = document.querySelector(".restart-button");
  restartButton.addEventListener("click", () => {
    Game.restart();
  });
  