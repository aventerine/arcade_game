/* global variables */
var rowHeight = 83; //height of rows
var colWidth = 101; //width of columns
var yOffsetForChar = -23; // Used to center the player/enemies in their row
var enemyRows = [
    yOffsetForChar + rowHeight,
    yOffsetForChar + rowHeight * 2,
    yOffsetForChar + rowHeight * 3
];
var enemySpeeds = [
    getRandomInt(getRandomInt(1, 3), getRandomInt(4, 6)),
    getRandomInt(getRandomInt(4, 6), getRandomInt(8, 10)),
    getRandomInt(getRandomInt(8, 10), getRandomInt(15, 20))
];

function getRandomInt(min, max) {
    /* Thanks to MDN documentation for getRandomInt(),
    returns a random integer between min & max,
    inclusive/non-inclusive respectively. */
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = getRandomInt(-101, 505);
    this.y = enemyRows[getRandomInt(0, 3)];
};

Enemy.prototype.update = function(dt) {
    if (this.x >= -colWidth && this.x < ctx.canvas.width + colWidth) {
        this.x += this.speed(player.level) * (dt * 100 - 1);
    } else {
        this.x = -colWidth;
        this.y = enemyRows[getRandomInt(0, 3)];
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.speed = function(playerLvl) {
    if (playerLvl < 5) {
        return enemySpeeds[0];
    } else if (playerLvl < 9) {
        return enemySpeeds[1];
    } else {
        return enemySpeeds[2];
    }
};

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.resetHome(); 
    this.level = 1; 
    this.lives = 10; 
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
    // No update function needed at this time, all movements handled in
    // handleInput function.
};

Player.prototype.updateLives = function() {
    this.lives -= 1;
};

Player.prototype.levelUp = function() {
    this.level++;
    if (this.level % 2 === 0) {
        allEnemies.push(new Enemy()); 
    }
    this.resetHome(); 
};

Player.prototype.resetHome = function() {
    this.x = colWidth * 2;
    this.y = yOffsetForChar + rowHeight * 5;
};

Player.prototype.handleInput = function(key) {
    if (key === 'up') {
        if (this.y === yOffsetForChar + rowHeight) {
            this.levelUp();
        } else {
            this.y -= rowHeight;
        }
    } else if (key === 'down') {
        if ((this.y + rowHeight) <= (yOffsetForChar + rowHeight * 5)) {
            this.y += rowHeight;
        }
    } else if (key === 'left') {
        if (this.x - colWidth >= 0) {
            this.x -= colWidth;
        }
    } else if (key === 'right') {
        if ((this.x + colWidth) <= (colWidth * 4)) {
            this.x += colWidth;
        }
    } else {
        // blank just to cover any unwanted implications
        // i.e. if other keys are pressed
    }
};

/* Check Collisions Function */
function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        if (enemy.y >= player.y - 50 &&
            enemy.y <= player.y + 50 &&
            enemy.x >= player.x - 65 &&
            enemy.x <= player.x + 65) {
                player.updateLives();
                player.resetHome();
        }
    });
}

/* Initialize Objects */
var allEnemies = [
    new Enemy(),
    new Enemy()
];
var player = new Player();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
