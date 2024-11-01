const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_PALETTE = [
  'cyan', 'orange', 'green', 'purple', 'red', 'blue', 'yellow', 'white',
];

const BRICK_LAYOUT = [
  [
    [
      [7, 1, 7],
      [1, 1, 7],
      [1, 7, 7],
    ],
    [
      [1, 1, 7],
      [7, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 7, 1],
      [7, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 7],
      [7, 1, 1],
    ],
  ],
  [
    [
      [7, 1, 7],
      [7, 1, 7],
      [7, 1, 1],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [1, 7, 7],
    ],
    [
      [1, 1, 7],
      [7, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 7, 1],
      [1, 1, 1],
      [7, 7, 7],
    ],
  ],
  [
    [
      [7, 1, 7],
      [1, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 1, 7],
      [7, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 1, 7],
      [1, 1, 7],
      [7, 1, 7],
    ],
  ],
  [
    [
      [1, 7, 7],
      [1, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 1, 1],
      [1, 1, 7],
      [7, 7, 7],
    ],
    [
      [7, 1, 7],
      [7, 1, 1],
      [7, 7, 1],
    ],
    [
      [7, 7, 7],
      [7, 1, 1],
      [1, 1, 7],
    ],
  ],
  [
    [
      [7, 7, 7, 7],
      [1, 1, 1, 1],
      [7, 7, 7, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 1, 7],
      [7, 7, 1, 7],
      [7, 7, 1, 7],
      [7, 7, 1, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 7, 7, 7],
      [1, 1, 1, 1],
      [7, 7, 7, 7],
    ],
    [
      [7, 1, 7, 7],
      [7, 1, 7, 7],
      [7, 1, 7, 7],
      [7, 1, 7, 7],
    ],
  ],
  [
    [
      [1, 7, 7],
      [1, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 1, 1],
      [7, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [7, 7, 1],
    ],
    [
      [7, 1, 7],
      [7, 1, 7],
      [1, 1, 7],
    ],
  ],
  [
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
  ],
];

//Lưu hướng của phím

const KEY_CODES = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

const WHITE_ID = 7;
// Lấy đối tượng canvas và context cho bảng chính và khối gạch sắp tới
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const nextBrickCanvas = document.getElementById('next-brick');
const nextCtx = nextBrickCanvas.getContext('2d');

// Khởi tạo các biến
let nextBrick;
let isPaused = false;
let refresh; // Lưu trạng thái setInterval
let pauseButton = document.getElementById('pause');
let resetButton = document.getElementById('reset');

// Hiển thị điểm cao nhất từ localStorage
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('high-score').innerText = highScore;

// Cập nhật điểm cao nhất
function updateHighScore() {
  if (board.score > highScore) {
    highScore = board.score;
    localStorage.setItem('highScore', highScore);
    document.getElementById('high-score').innerText = highScore;
  }
}

// Thiết lập kích thước cho canvas theo số hàng và cột
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Lớp điều khiển bảng chính
class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.grid = this.generateWhiteBoard();
    this.score = 0;
    this.gameOver = false;
    this.isPlaying = false;
  }

  // Reset lại bảng và điểm số khi trò chơi bắt đầu lại
  reset() {
    this.score = 0;
    document.getElementById('score').innerText = 0; // Reset điểm số về 0
    this.grid = this.generateWhiteBoard();
    this.gameOver = false;
    this.drawBoard();
  }

  // Tạo bảng trắng (chưa có gạch)
  generateWhiteBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_ID));
  }

  // Vẽ một ô trên bảng
  /*drawCell(xAxis, yAxis, colorId) {
    this.ctx.fillStyle = COLOR_PALETTE[colorId] || COLOR_PALETTE[WHITE_ID];
    this.ctx.fillRect(
      xAxis * BLOCK_SIZE,
      yAxis * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
    this.ctx.fillStyle = 'black';
    this.ctx.strokeRect(
      xAxis * BLOCK_SIZE,
      yAxis * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
    
  }*/
 // Hàm vẽ một ô (cell) với hiệu ứng 3D
  drawCell(xAxis, yAxis, colorId) {
    // Chọn màu cơ bản của khối
    const color = COLOR_PALETTE[colorId] || COLOR_PALETTE[WHITE_ID];

    // Đổ nền màu cơ bản
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      xAxis * BLOCK_SIZE,
      yAxis * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
    
    // Đổ bóng ở dưới và bên phải để tạo chiều sâu
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Màu bóng với độ trong suốt
    this.ctx.fillRect(
      xAxis * BLOCK_SIZE + BLOCK_SIZE * 0.9,
      yAxis * BLOCK_SIZE + BLOCK_SIZE * 0.1,
      BLOCK_SIZE * 0.1,
      BLOCK_SIZE * 0.8
    );
    this.ctx.fillRect(
      xAxis * BLOCK_SIZE + BLOCK_SIZE * 0.1,
      yAxis * BLOCK_SIZE + BLOCK_SIZE * 0.9,
      BLOCK_SIZE * 0.8,
      BLOCK_SIZE * 0.1
    );

    // Vẽ đường viền xung quanh ô
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(
      xAxis * BLOCK_SIZE,
      yAxis * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  }

  // Vẽ lại toàn bộ bảng sau mỗi lần thay đổi
  drawBoard() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        this.drawCell(col, row, this.grid[row][col]);
      }
    }
  }

  // Kiểm tra và xử lý khi hoàn thành một hàng
  handleCompleteRows() {
    const latestGrid = board.grid.filter(row => row.some(col => col === WHITE_ID));

    const newScore = ROWS - latestGrid.length; // Số hàng đã hoàn thành
    const newRows = Array.from({ length: newScore }, () => Array(COLS).fill(WHITE_ID));

    if (newScore) {
      board.grid = [...newRows, ...latestGrid];
      this.handleScore(newScore * 10);
    }
  }

  // Cập nhật điểm số
  handleScore(newScore) {
    this.score += newScore;
    document.getElementById('score').innerHTML = this.score;
    updateHighScore();
  }

  // Xử lý khi trò chơi kết thúc
  handleGameOver() {
    this.gameOver = true;
    this.isPlaying = false;
    showGameOverMessage();
  }
}

// Lớp điều khiển các khối gạch
class Brick {
  constructor(id) {
    this.id = id;
    this.layout = BRICK_LAYOUT[id];
    this.activeIndex = 0;//Hướng
    this.colPos = 3;
    this.rowPos = -2;
  }

  // Vẽ khối gạch lên bảng
  draw() {
    for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
      for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
        if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
          board.drawCell(col + this.colPos, row + this.rowPos, this.id);
        }
      }
    }
  }

  // Xóa khối gạch khi nó di chuyển
  clear() {
    for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
      for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
        if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
          board.drawCell(col + this.colPos, row + this.rowPos, WHITE_ID);
        }
      }
    }
  }

  // Di chuyển khối gạch sang trái
  moveLeft() {
    if (!this.checkCollision(this.rowPos, this.colPos - 1, this.layout[this.activeIndex])) {
      this.clear();
      this.colPos--;
      this.draw();
    }
  }

  // Di chuyển khối gạch sang phải
  moveRight() {
    if (!this.checkCollision(this.rowPos, this.colPos + 1, this.layout[this.activeIndex])) {
      this.clear();
      this.colPos++;
      this.draw();
    }
  }

  // Di chuyển khối gạch xuống dưới
  moveDown() {
    if (!this.checkCollision(this.rowPos + 1, this.colPos, this.layout[this.activeIndex])) {
      this.clear();
      this.rowPos++;
      this.draw();
      return;
    }

    this.handleLanded(); // Xử lý khi khối gạch đáp xuống
    generateNewBrick();
  }

  // Xoay khối gạch
  rotate() {
    if (!this.checkCollision(this.rowPos, this.colPos, this.layout[(this.activeIndex + 1) % 4])) {
      this.clear();
      this.activeIndex = (this.activeIndex + 1) % 4;
      this.draw();
    }
  }

  // Kiểm tra va chạm của khối gạch
  checkCollision(nextRow, nextCol, nextLayout) {
    for (let row = 0; row < nextLayout.length; row++) {
      for (let col = 0; col < nextLayout[0].length; col++) {
        if (nextLayout[row][col] !== WHITE_ID && nextRow >= 0) {
          if (
            col + nextCol < 0 ||
            col + nextCol >= COLS ||
            row + nextRow >= ROWS ||
            board.grid[row + nextRow][col + nextCol] !== WHITE_ID
          )
            return true;// Có va chạm
        }
      }
    }
    return false;// Không có va chạm
  }

  // Xử lý khi khối gạch đáp xuống
  handleLanded() {
    if (this.rowPos <= 0) {
      board.handleGameOver();
      return;
    }

    for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
      for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
        if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
          board.grid[row + this.rowPos][col + this.colPos] = this.id;
        }
      }
    }

    board.handleCompleteRows();
    board.drawBoard();
  }
}

// Hàm tạo và hiển thị khối gạch mới
function generateNewBrick() {
  brick = nextBrick || new Brick(Math.floor(Math.random() * BRICK_LAYOUT.length));
  nextBrick = new Brick(Math.floor(Math.random() * BRICK_LAYOUT.length));
  drawNextBrick();
}

// Hàm hiển thị khối gạch tiếp theo
function drawNextBrick() {
  nextCtx.clearRect(0, 0, nextBrickCanvas.width, nextBrickCanvas.height);
  for (let row = 0; row < nextBrick.layout[0].length; row++) {
    for (let col = 0; col < nextBrick.layout[0][0].length; col++) {
      if (nextBrick.layout[0][row][col] !== WHITE_ID) {
        nextCtx.fillStyle = COLOR_PALETTE[nextBrick.id];
        nextCtx.fillRect(
          col * (BLOCK_SIZE / 2),
          row * (BLOCK_SIZE / 2),
          BLOCK_SIZE / 2,
          BLOCK_SIZE / 2
        );
        nextCtx.strokeRect(
          col * (BLOCK_SIZE / 2),
          row * (BLOCK_SIZE / 2),
          BLOCK_SIZE / 2,
          BLOCK_SIZE / 2
        );
      }
    }
  }
}

//Hàm hiển thị thông báo Game Over
function showGameOverMessage() {
  const gameOverOverlay = document.getElementById('game-over');
  gameOverOverlay.style.display = 'flex'; // Hiển thị phần tử thông báo

  // Xử lý sự kiện khi nhấn nút OK
  document.getElementById('game-over-btn').onclick = () => {
    gameOverOverlay.style.display = 'none'; // Ẩn thông báo
    board.reset(); // Reset trò chơi
    document.getElementById('play').innerText = 'Play';
  };
}
// Khởi tạo bảng
let board = new Board(ctx);
board.drawBoard();

// Xử lý sự kiện khi nhấn nút "Play" để bắt đầu hoặc reset trò chơi
document.getElementById('play').addEventListener('click', () => {
  // Reset điểm số mỗi khi nhấn nút Reset
  if (board.isPlaying) {
    clearInterval(refresh); // Dừng setInterval trước đó
    board.reset();    
    board.isPlaying = true;
    isPaused = false;
    pauseButton.innerText = 'Pause';
    document.getElementById('play').innerText = 'Reset';

    generateNewBrick();

    refresh = setInterval(() => {
      if (!board.gameOver && !isPaused) {
        brick.moveDown();
      } else {
        clearInterval(refresh);
      }
    }, 1000);
  } else {
    // Khi trò chơi chưa bắt đầu
    board.reset();
    board.isPlaying = true;
    isPaused = false;
    document.getElementById('play').innerText = 'Reset';

    generateNewBrick();

    refresh = setInterval(() => {
      if (!board.gameOver && !isPaused) {
        brick.moveDown();
      } else {
        clearInterval(refresh);
      }
    }, 1000);
  }
});

// Xử lý sự kiện tạm dừng trò chơi
pauseButton.addEventListener('click', () => {
  if (board.isPlaying && !board.gameOver) {
    if (isPaused) {
      isPaused = false;
      pauseButton.innerText = 'Pause';

      refresh = setInterval(() => {
        if (!board.gameOver && !isPaused) {
          brick.moveDown();
        } else {
          clearInterval(refresh);
        }
      }, 1000);

    } else {
      isPaused = true;
      pauseButton.innerText = 'Resume';
      clearInterval(refresh);
    }
  }
});

// Xử lý sự kiện nhấn phím điều khiển khối gạch
document.addEventListener('keydown', (e) => {
  if (!board.gameOver && board.isPlaying) {
    switch (e.code) {
      case KEY_CODES.LEFT:
        brick.moveLeft();
        break;
      case KEY_CODES.RIGHT:
        brick.moveRight();
        break;
      case KEY_CODES.DOWN:
        brick.moveDown();
        break;
      case KEY_CODES.UP:
        brick.rotate();
        break;
      default:
        break;
    }
  }
});

// Khi trang được tải, reset lại điểm cao nhất
/*window.onload = function() {
  localStorage.setItem('highScore', 0); // Reset điểm cao nhất về 0
}*/

console.table(board.grid);