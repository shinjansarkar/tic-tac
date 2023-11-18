document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    const board = document.getElementById("board");

    let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let gameInProgress = false;

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", restartGame);

    function startGame() {
        startBtn.style.display = "none";
        restartBtn.style.display = "inline-block";
        gameInProgress = true;
        renderBoard();
    }

    function restartGame() {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameInProgress = true;
        renderBoard();
        if (currentPlayer === "O") {
            computerMove();
        }
    }

    function renderBoard() {
        board.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            cell.textContent = gameBoard[i];
            cell.addEventListener("click", handleCellClick);
            board.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (gameBoard[index] === "" && currentPlayer === "X" && gameInProgress) {
            gameBoard[index] = currentPlayer;
            renderBoard();
            if (!isGameOver()) {
                currentPlayer = "O";
                setTimeout(computerMove, 1000); // 1-second delay for computer move
            }
        }
    }

    function computerMove() {
        if (!gameInProgress) {
            return;
        }

        const bestMove = findBestMove();
        gameBoard[bestMove] = "O";
        renderBoard();
        currentPlayer = "X";

        if (!isGameOver()) {
            gameInProgress = true;
        }
    }

    function findBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === "") {
                gameBoard[i] = "O";
                let score = minimax(gameBoard, 0, false);
                gameBoard[i] = "";

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        if (checkWinner("X")) {
            return -1;
        } else if (checkWinner("O")) {
            return 1;
        } else if (!board.includes("")) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function isGameOver() {
        if (checkWinner("X")) {
            alert("You win!");
            gameInProgress = false;
            return true;
        } else if (checkWinner("O")) {
            alert("Computer wins!");
            gameInProgress = false;
            return true;
        } else if (!gameBoard.includes("")) {
            alert("It's a tie!");
            gameInProgress = false;
            return true;
        }
        return false;
    }

    function checkWinner(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        return winPatterns.some(pattern => {
            return pattern.every(index => gameBoard[index] === player);
        });
    }
});
