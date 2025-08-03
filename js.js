const gridSize = 10;
const mineCount = 15;
let left = mineCount;
let mines = [];
let numbers = [];
let opened = [];
let gameOver = false;
let mode = 'click'; // 'flag' 或 'click'

const grid = document.querySelector('.grid');
const flagBtn = document.getElementById("flag");
const clickBtn = document.getElementById("click");
const restartBtn = document.getElementById("restart");
const mineleft = document.getElementById("mineleft");

// 模式切换
flagBtn.onclick = function() {
    mode = 'flag';
    flagBtn.style.background = '#ffe066';
    clickBtn.style.background = '';
};
clickBtn.onclick = function() {
    mode = 'click';
    clickBtn.style.background = '#ffe066';
    flagBtn.style.background = '';
};

// 初始化游戏
function initGame() {
    // 清空
    grid.innerHTML = '';
    mines = [];
    numbers = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
    opened = Array.from({length: gridSize}, () => Array(gridSize).fill(false));
    left = mineCount;
    gameOver = false;
    mineleft.textContent = `${left} left`;
    mode = 'click';
    clickBtn.style.background = '#ffe066';
    flagBtn.style.background = '';

    // 随机布雷
    while (mines.length < mineCount) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        const pos = `${x},${y}`;
        if (!mines.includes(pos)) mines.push(pos);
    }

    // 计算数字
    for (const mine of mines) {
        const [mx, my] = mine.split(',').map(Number);
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const nx = mx + dx, ny = my + dy;
                if (
                    nx >= 0 && nx < gridSize &&
                    ny >= 0 && ny < gridSize &&
                    !mines.includes(`${nx},${ny}`)
                ) {
                    numbers[ny][nx]++;
                }
            }
        }
    }

    // 生成格子
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.oncontextmenu = function(e) {
                e.preventDefault();
            };
            cell.onclick = function() {
                if (gameOver || opened[y][x]) return;
                if (mode === 'flag') {
                    if (cell.textContent === '🚩') {
                        cell.textContent = '';
                        left++;
                    } else if (!cell.textContent) {
                        cell.textContent = '🚩';
                        left--;
                    }
                    mineleft.textContent = `${left} left`;
                } else if (mode === 'click') {
                    if (cell.textContent === '🚩') return;
                    openCell(x, y);
                }
            };
            grid.appendChild(cell);
        }
    }
}

// 打开格子
function openCell(x, y) {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    if (opened[y][x]) return;
    const cell = grid.children[y * gridSize + x];
    if (!cell) return;
    if (cell.textContent === '🚩') return; // 插旗不能点开
    opened[y][x] = true;
    cell.classList.add('open');
    cell.style.background = '#eee';

    const pos = `${x},${y}`;
    if (mines.includes(pos)) {
        cell.textContent = '💣';
        cell.style.background = 'black';
        gameOver = true;
        showAllMines();
        setTimeout(() => alert('游戏结束！'), 100);
        return;
    }

    const num = numbers[y][x];
    if (num > 0) {
        cell.textContent = num;
    } else {
        cell.textContent = '';
        // 递归展开周围8格
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx !== 0 || dy !== 0) openCell(x + dx, y + dy);
            }
        }
    }
    checkWin();
}

// 显示所有地雷
function showAllMines() {
    for (const mine of mines) {
        const [x, y] = mine.split(',').map(Number);
        const cell = grid.children[y * gridSize + x];
        cell.textContent = '💣';
        cell.style.background = 'black';
    }
}

// 检查胜利
function checkWin() {
    let openedCount = 0;
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (opened[y][x]) openedCount++;
        }
    }
    if (openedCount === gridSize * gridSize - mineCount && !gameOver) {
        gameOver = true;
        setTimeout(() => alert('恭喜你，胜利！'), 100);
    }
}

// 重新开始
restartBtn.onclick = function() {
    initGame();
};

// 初始化
initGame();

