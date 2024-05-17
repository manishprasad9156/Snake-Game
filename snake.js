var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var score = 0;
var gameStarted = false;
var gamePaused = false;
var loopInterval;
var obstacleInterval;
var obstacleTimeout;
var speed = 100;
var maxObstacles = 1;

var snake = {
  x: 160,
  y: 160,
  
  dx: grid,
  dy: 0,
  
  cells: [],
  
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320,
  type: 'apple'
};

var obstacles = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createObstacle() {
  if (obstacles.length < maxObstacles) {
    obstacles.push({
      x: getRandomInt(0, 25) * grid,
      y: getRandomInt(0, 25) * grid
    });
    obstacleTimeout = setTimeout(removeObstacle, 3000); // obstacle disappears after 3 seconds
  }
}

function removeObstacle() {
  if (obstacles.length > 0) {
    obstacles.shift();
  }
}

function endGame() {
  clearInterval(loopInterval);
  clearInterval(obstacleInterval);
  clearTimeout(obstacleTimeout);
  alert('Game Over! Your score is: ' + score);
  gameStarted = false;
  document.getElementById('startPauseButton').innerText = 'Start Game';
}

function drawApple(x, y) {
  context.save();
  context.translate(x, y);

  context.beginPath();
  context.arc(grid / 2, grid / 2, grid / 2, 0, 2 * Math.PI, false);
  context.fillStyle = 'red';
  context.fill();

  context.beginPath();
  context.arc(grid / 2, grid / 2 - 4, grid / 6, 0, 2 * Math.PI, false);
  context.fillStyle = 'darkred';
  context.fill();

  context.beginPath();
  context.moveTo(grid / 2, grid / 2 - 8);
  context.lineTo(grid / 2 + 4, grid / 2 - 14);
  context.lineTo(grid / 2 - 4, grid / 2 - 14);
  context.fillStyle = 'green';
  context.fill();

  context.restore();
}

function drawBanana(x, y) {
  context.save();
  context.translate(x, y);

  context.beginPath();
  context.moveTo(4, 12);
  context.quadraticCurveTo(8, 4, 12, 12);
  context.quadraticCurveTo(16, 20, 12, 24);
  context.quadraticCurveTo(8, 28, 4, 24);
  context.quadraticCurveTo(0, 20, 4, 12);
  context.fillStyle = 'yellow';
  context.fill();

  context.beginPath();
  context.moveTo(6, 16);
  context.quadraticCurveTo(8, 12, 10, 16);
  context.quadraticCurveTo(12, 20, 10, 22);
  context.quadraticCurveTo(8, 24, 6, 22);
  context.quadraticCurveTo(4, 20, 6, 16);
  context.fillStyle = 'darkyellow';
  context.fill();

  context.restore();
}

function drawOrange(x, y) {
  context.save();
  context.translate(x, y);

  context.beginPath();
  context.arc(grid / 2, grid / 2, grid / 2, 0, 2 * Math.PI, false);
  context.fillStyle = 'orange';
  context.fill();

  context.beginPath();
  context.arc(grid / 2, grid / 2, grid / 4, 0, 2 * Math.PI, false);
  context.fillStyle = 'darkorange';
  context.fill();

  context.restore();
}

function drawFruit(type, x, y) {
  switch (type) {
    case 'apple':
      drawApple(x, y);
      break;
    case 'banana':
      drawBanana(x, y);
      break;
    case 'orange':
      drawOrange(x, y);
      break;
  }
}

function drawEagle(x, y) {
  context.save();
  context.translate(x, y);

  context.beginPath();
  context.moveTo(4, 4);
  context.lineTo(12, 4);
  context.lineTo(10, 12);
  context.lineTo(14, 8);
  context.lineTo(12, 16);
  context.lineTo(8, 12);
  context.lineTo(4, 16);
  context.lineTo(6, 8);
  context.lineTo(2, 12);
  context.lineTo(4, 4);
  context.fillStyle = 'brown';
  context.fill();

  context.restore();
}

function drawSnakeSegment(x, y, isHead) {
  context.save();
  context.translate(x, y);

  context.beginPath();
  context.arc(grid / 2, grid / 2, grid / 2 - 1, 0, 2 * Math.PI, false);
  context.fillStyle = isHead ? 'darkgreen' : 'green';
  context.fill();

  context.restore();
}

function loop() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  drawFruit(apple.type, apple.x, apple.y);

  snake.cells.forEach(function (cell, index) {
    drawSnakeSegment(cell.x, cell.y, index === 0);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      document.getElementById('score').innerText = 'Score: ' + score;

      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
      apple.type = ['apple', 'banana', 'orange'][getRandomInt(0, 3)];

      if (score % 5 === 0) {
        clearInterval(loopInterval);
        speed -= 10;
        loopInterval = setInterval(loop, speed);
      }

      if (score % 10 === 0 && maxObstacles < 5) {
        maxObstacles++;
      }
    }

    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        endGame();
        return;
      }
    }

    obstacles.forEach(function (obstacle) {
      if (cell.x === obstacle.x && cell.y === obstacle.y) {
        endGame();
        return;
      }
    });
  });

  obstacles.forEach(function (obstacle) {
    drawEagle(obstacle.x, obstacle.y);
  });
}

document.getElementById('startPauseButton').addEventListener('click', function () {
  if (!gameStarted) {
    gameStarted = true;
    document.getElementById('startPauseButton').innerText = 'Pause Game';
    score = 0;
    document.getElementById('score').innerText = 'Score: ' + score;
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    speed = 100;
    maxObstacles = 1;
    obstacles = [];

    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
    apple.type = 'apple';

    loopInterval = setInterval(loop, speed);
    obstacleInterval = setInterval(createObstacle, 5000); // new obstacle every 5 seconds
  } else {
    if (!gamePaused) {
      clearInterval(loopInterval);
      clearInterval(obstacleInterval);
      clearTimeout(obstacleTimeout);
      gamePaused = true;
      document.getElementById('startPauseButton').innerText = 'Resume Game';
    } else {
      loopInterval = setInterval(loop, speed);
      obstacleInterval = setInterval(createObstacle, 5000); // new obstacle every 5 seconds
      gamePaused = false;
      document.getElementById('startPauseButton').innerText = 'Pause Game';
    }
  }
});

document.addEventListener('keydown', function (e) {
  if (!gameStarted || gamePaused) return;

  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
