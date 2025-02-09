document.addEventListener("DOMContentLoaded", function () {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("status");
    const resetButton = document.getElementById("reset");

    // Scoreboard elements
    const xWinsText = document.getElementById("x-wins");
    const oWinsText = document.getElementById("o-wins");
    const drawsText = document.getElementById("draws");

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;

    let xWins = 0;
    let oWins = 0;
    let draws = 0;

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    function checkWinner() {
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
                statusText.textContent = "Player " + currentPlayer + " Wins!";
                gameActive = false;

                // Apply winning block effect
                cells[a].classList.add("winning");
                cells[b].classList.add("winning");
                cells[c].classList.add("winning");

                // Update scoreboard
                if (currentPlayer === "X") {
                    xWins++;
                    xWinsText.textContent = xWins;
                } else {
                    oWins++;
                    oWinsText.textContent = oWins;
                }
                return;
            }
        }

        if (!board.includes("")) {
            statusText.textContent = "It's a Draw!";
            gameActive = false;
            draws++;
            drawsText.textContent = draws;
        }
    }

    function handleClick(event) {
        const index = event.target.dataset.index;

        if (board[index] === "" && gameActive) {
            board[index] = currentPlayer;
            event.target.textContent = currentPlayer;

            checkWinner();

            if (gameActive) {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                statusText.textContent = "Player " + currentPlayer + "'s Turn";

                if (currentPlayer === "O") {
                    setTimeout(computerMove, 400);
                }
            }
        }
    }

    function computerMove() {
        let bestMove = findBestMove();

        if (bestMove !== -1) {
            board[bestMove] = "O";
            cells[bestMove].textContent = "O";

            checkWinner();

            if (gameActive) {
                currentPlayer = "X";
                statusText.textContent = "Player X's Turn";
            }
        }
    }

    function findBestMove() {
        // 1. Win if possible
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            if (board[a] === "O" && board[b] === "O" && board[c] === "") return c;
            if (board[a] === "O" && board[c] === "O" && board[b] === "") return b;
            if (board[b] === "O" && board[c] === "O" && board[a] === "") return a;
        }

        // 2. Block the player's win
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
            if (board[a] === "X" && board[c] === "X" && board[b] === "") return b;
            if (board[b] === "X" && board[c] === "X" && board[a] === "") return a;
        }

        // 3. Prioritize center if available
        if (board[4] === "") return 4;

        // 4. Take a corner if available
        let corners = [0, 2, 6, 8].filter(i => board[i] === "");
        if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

        // 5. Take a random available space
        let availableCells = board.map((v, i) => (v === "" ? i : null)).filter(v => v !== null);
        return availableCells.length > 0 ? availableCells[Math.floor(Math.random() * availableCells.length)] : -1;
    }

    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        statusText.textContent = "Player X's Turn";

        // Clear board and remove winning effect
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("winning");
        });
    }

    cells.forEach(cell => cell.addEventListener("click", handleClick));
    resetButton.addEventListener("click", resetGame);
});