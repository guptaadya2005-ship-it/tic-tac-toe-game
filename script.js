
    /* ================= BACKGROUND GRAPHICS (CANVAS) ================= */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 243, 255, 0.3)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 * (1 - dist / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateBackground);
    }
    animateBackground();

    /* ================= GAME LOGIC ================= */
    const boardEl = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('statusDisplay');
    const laserCanvas = document.getElementById('laserCanvas');
    const laserLine = document.getElementById('laserLine');
    
    let boardState = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    let currentPlayer = "X";
    
    // Game Statistics
    let scores = { X: 0, O: 0 };
    let draws = 0;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (boardState[clickedIndex] !== "" || !isGameActive) return;

        makeMove(clickedCell, clickedIndex, currentPlayer);
        evaluateRules();
    }

    function makeMove(cell, index, player) {
        boardState[index] = player;
        cell.textContent = player;
        cell.classList.add(player.toLowerCase(), 'occupied');
    }

    function evaluateRules() {
        let roundWon = false;
        let winCombo = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                roundWon = true;
                winCombo = winningConditions[i];
                break;
            }
        }

        if (roundWon) {
            const loser = currentPlayer === "X" ? "O" : "X";
            statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
            isGameActive = false;
            scores[currentPlayer]++;
            
            // Update Stats Display
            document.getElementById('lastWinner').textContent = currentPlayer;
            document.getElementById('lastLoser').textContent = loser;
            
            updateScoreboard();
            triggerLaserStrike(winCombo);
            return;
        }

        if (!boardState.includes("")) {
            statusDisplay.textContent = "Match Tied!";
            isGameActive = false;
            draws++;
            document.getElementById('drawsCount').textContent = draws;
            document.getElementById('drawsCountRight').textContent = draws;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.textContent = `${currentPlayer}'s Turn`;
    }

    function triggerLaserStrike(combo) {
        const firstCell = cells[combo[0]];
        const lastCell = cells[combo[2]];
        
        const boardRect = boardEl.getBoundingClientRect();
        const firstRect = firstCell.getBoundingClientRect();
        const lastRect = lastCell.getBoundingClientRect();

        const x1 = (firstRect.left + firstRect.width / 2) - boardRect.left;
        const y1 = (firstRect.top + firstRect.height / 2) - boardRect.top;
        const x2 = (lastRect.left + lastRect.width / 2) - boardRect.left;
        const y2 = (lastRect.top + lastRect.height / 2) - boardRect.top;

        laserLine.setAttribute('x1', x1);
        laserLine.setAttribute('y1', y1);
        laserLine.setAttribute('x2', x2);
        laserLine.setAttribute('y2', y2);

        laserCanvas.classList.add('active');
    }

    function updateScoreboard() {
        document.getElementById('scoreX').textContent = scores.X;
        document.getElementById('scoreO').textContent = scores.O;
    }

    function resetBoard() {
        boardState = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        statusDisplay.textContent = "Player X's Turn";
        laserCanvas.classList.remove('active');
        cells.forEach(cell => {
            cell.textContent = "";
            cell.className = "cell";
        });
    }

    function resetMatch() {
        scores = { X: 0, O: 0 };
        draws = 0;
        document.getElementById('lastWinner').textContent = "-";
        document.getElementById('lastLoser').textContent = "-";
        document.getElementById('drawsCount').textContent = "0";
        document.getElementById('drawsCountRight').textContent = "0";
        updateScoreboard();
        resetBoard();
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
