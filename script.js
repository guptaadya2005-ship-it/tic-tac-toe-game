// Get all the cells
const cells = document.querySelectorAll(".cell");

// Get the status text
const statusText = document.getElementById("status");

// Get the restart button
const restartBtn = document.getElementById("restart");

// Current player starts with X
let currentPlayer = "X";

let nextStarter = "X";

// Stores the board state
let board = ["", "", "", "", "", "", "", "", ""];

// Game is running
let gameActive = true;

// All possible winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

// Add click event to each cell
cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
});

restartBtn.addEventListener("click", restartGame);

// Function to handle cell clicks
function handleCellClick(event) {

    // Which cell was clicked?
    const clickedCell = event.target;

    // Get its index (0-8)
    const clickedIndex = clickedCell.dataset.index;

    // If the cell is already filled or the game is over, do nothing
    if (board[clickedIndex] !== "" || !gameActive) {
        return;
    }

    // Save the move in the board array
    board[clickedIndex] = currentPlayer;

    // Display X or O on the screen
    clickedCell.textContent = currentPlayer;

    checkWinner();

    if (!gameActive) {
        return;
    }

    // Change the turn
    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    // Update the status text
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWinner() {

    for (let condition of winningConditions) {

        const a = board[condition[0]];
        const b = board[condition[1]];
        const c = board[condition[2]];

        // Skip if any cell is empty
        if (a === "" || b === "" || c === "") {
            continue;
        }

        // If all three are the same, we have a winner
        if (a === b && b === c) {
            statusText.textContent = `🎉 Player ${a} Wins!`;
            // Remember who should start the next game
            nextStarter = a;
            gameActive = false;
            return;
        }
    }

    // Check for a draw
    if (!board.includes("")) {
        statusText.textContent = "🤝 It's a Draw!";
        gameActive = false;
    }
}

function restartGame() {

    // Reset the board array
    board = ["", "", "", "", "", "", "", "", ""];

    // Start again with Player X
    currentPlayer = nextStarter;

    // Game becomes active again
    gameActive = true;

    // Reset the status text
    statusText.textContent = `Player ${currentPlayer}'s Turn`;

    // Clear all the cells
    cells.forEach((cell) => {
        cell.textContent = "";
    });

}