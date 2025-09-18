let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let winCombo = [];

let winCount = 0;
let loseCount = 0;
let drawCount = 0;

const RANDOM_MOVE_CHANCE = 0.20; // 20% Random Moves

function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board.forEach((cell, i) => {
        const cellDiv = document.createElement("div");
        cellDiv.className = "cell";
        cellDiv.textContent = cell;
        cellDiv.onclick = cell !== "" ? undefined : () => playerMove(i);
        cellDiv.style.cursor = gameOver ? "not-allowed" : (cell === "" ? "pointer" : "default");
        if (winCombo.includes(i)) cellDiv.classList.add("winner");
        if (cell === "X") cellDiv.classList.add("x");
        if (cell === "O") cellDiv.classList.add("o");
        boardDiv.appendChild(cellDiv);
    });
}

function checkWinner(bd) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winPatterns) {
        if (bd[combo[0]] !== "" && combo.every(i => bd[i] === bd[combo[0]])) {
            return { winner: bd[combo[0]], combo };
        }
    }
    if (!bd.includes("")) return { winner: "draw", combo: [] };
    return { winner: null, combo: [] };
}

function minimax(bd, depth, isMaximizing) {
    const result = checkWinner(bd);
    if (result.winner === "O") return 10 - depth;
    if (result.winner === "X") return depth - 10;
    if (result.winner === "draw") return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (bd[i] === "") {
                bd[i] = "O";
                let score = minimax(bd, depth + 1, false);
                bd[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (bd[i] === "") {
                bd[i] = "X";
                let score = minimax(bd, depth + 1, true);
                bd[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function bestMove(bd) {
    const emptyCells = Array.from({ length: 9 }, (_, i) => i).filter(i => bd[i] === "");

    if (Math.random() < RANDOM_MOVE_CHANCE) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    let bestScore = -Infinity;
    let move;
    for (let i of emptyCells) {
        bd[i] = "O";
        let score = minimax(bd, 0, false);
        bd[i] = "";
        if (score > bestScore) {
            bestScore = score;
            move = i;
        }
    }
    return move;
}

function playerMove(i) {
    if (board[i] !== "" || gameOver) return;

    board[i] = "X";
    renderBoard();

    const result = checkWinner(board);
    if (result.winner) {
        endGame(result);
        return;
    }

    setStatus("Granite is thinking...");
    setTimeout(() => {
        botMove();
    }, 400);
}

function botMove() {
    const move = bestMove(board);
    if (move !== undefined) board[move] = "O";

    const result = checkWinner(board);
    winCombo = result.combo;
    renderBoard();

    if (result.winner) {
        endGame(result);
    } else {
        setStatus("Your turn");
    }
}

function endGame(result) {
    gameOver = true;
    winCombo = result.combo;
    renderBoard();

    if (result.winner === "draw") {
        setStatus("DRAW");
        drawCount++;
        document.getElementById("drawCount").textContent = drawCount;
    } else if (result.winner === "X") {
        setStatus("YOU WIN!");
        winCount++;
        document.getElementById("winCount").textContent = winCount;
    } else if (result.winner === "O") {
        setStatus("YOU LOSE!");
        loseCount++;
        document.getElementById("loseCount").textContent = loseCount;
    }
}

function setStatus(msg) {
    document.getElementById("status").textContent = msg;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    winCombo = [];
    setStatus("Your turn");
    renderBoard();
}

// --- Initial setup ---
renderBoard();
setStatus("Your turn");