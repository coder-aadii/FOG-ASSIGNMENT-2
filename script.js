document.addEventListener('DOMContentLoaded', function() {
    const rows = 15;
    const cols = 20;
    const colors = ['#39ff14', '#00ffff', '#ff073a', '#ffea00'];
    let currentColor = 0;
    let waveSpeed = 100;
    let isWaveActive = true;
    let isAudioInitialized = false;

    const gridElement = document.getElementById('grid');
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(false));

    const clickSound = new Audio('./assets/click.mp3');
    const waveSound = new Audio('./assets/wave.mp3');
    const buttonSound = new Audio('./assets/button.mp3');

    function initializeSounds() {
        if (!isAudioInitialized) {
            clickSound.volume = 0.1;
            waveSound.volume = 0.1;
            buttonSound.volume = 0.1;
            isAudioInitialized = true;
        }
    }

    function createWave() {
        const newGrid = Array.from({ length: rows }, (_, i) =>
            Array.from({ length: cols }, (_, j) =>
                Math.sin(i + j + Date.now() / 500) > 0.5
            )
        );
        updateGrid(newGrid);

        if (isAudioInitialized) {
            waveSound.play();
        }
    }

    function updateGrid(newGrid) {
        gridElement.innerHTML = '';
        newGrid.forEach((row, rowIndex) => {
            row.forEach((isActive, colIndex) => {
                const cell = document.createElement('div');
                cell.classList.add('grid-item');
                cell.style.backgroundColor = isActive ? colors[currentColor] : 'black';
                cell.style.boxShadow = isActive
                    ? `0 0 10px ${colors[currentColor]}, 0 0 20px ${colors[currentColor]}`
                    : 'none';
                cell.addEventListener('click', () => handleGridClick(rowIndex, colIndex));
                gridElement.appendChild(cell);
            });
        });
    }

    function handleGridClick(rowIndex, colIndex) {
        initializeSounds();
        grid[rowIndex][colIndex] = !grid[rowIndex][colIndex];
        updateGrid(grid);

        if (isAudioInitialized) clickSound.play();
    }

    function resetGrid() {
        initializeSounds();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = false;
            }
        }
        updateGrid(grid);

        if (isAudioInitialized) buttonSound.play();
    }

    function toggleWaveEffect() {
        initializeSounds();
        isWaveActive = !isWaveActive;
        document.getElementById('toggleWaveBtn').textContent = isWaveActive ? 'Stop Wave' : 'Start Wave';

        if (isAudioInitialized) buttonSound.play();
    }

    function changeSpeed(newSpeed) {
        initializeSounds();
        waveSpeed = newSpeed;

        if (isAudioInitialized) buttonSound.play();
    }

    // Update color every second
    setInterval(() => {
        currentColor = (currentColor + 1) % colors.length;
    }, 1000);

    // Wave animation loop
    setInterval(() => {
        if (isWaveActive) {
            createWave();
        }
    }, waveSpeed);

    document.getElementById('speedUpBtn').addEventListener('click', () => changeSpeed(50));
    document.getElementById('slowDownBtn').addEventListener('click', () => changeSpeed(200));
    document.getElementById('toggleWaveBtn').addEventListener('click', toggleWaveEffect);
    document.getElementById('resetBtn').addEventListener('click', resetGrid);

    updateGrid(grid); // Initialize grid
});
