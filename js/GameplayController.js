/*
 * Helper object that implements all game logic and updating the screen
 * (via the ViewController object). Contains and controls all actors in
 * the game.
 */
function GameplayController() {

    var StateEnum = {paused: "paused", playing: "playing", won: "won", lost: "lost"};
    var KeyCode = {left: 37, right: 39, shoot: 32};
    var Direction = {left: "left", right: "right", up: "up", down: "down"};
    var viewController,objectFactory,settings;
    var player,aliens,shields, leftmostAliens, rightmostAliens, bottomAliens;
    var playerBullets,alienBullets;
    var alienMovementCounter;
    var previousAlienDirection;
    var alienDirection;
    var leftBound;
    var rightBound;
    var numAliens;
    var alienStepVal = 15;


    function setupGame(playerImg,alienImg,shieldImg,gameSettings) {
        // Sprite arrays
        aliens = [];
        shields = [];
        playerBullets = [];
        alienBullets = [];

        // Coordinate graph position tracking arrays
        leftmostAliens = [];
        rightmostAliens = [];
        bottomAliens = [];

        alienMovementCounter = 0;
        viewController = ViewController();
        objectFactory = ObjectFactory();
        settings = gameSettings;
        leftBound = 0;
        rightBound = viewController.getCanvasWidth();
        alienDirection = Direction.right;
        previousAlienDirection = Direction.right;

        //clear canvas
        viewController.eraseImg(settings.bgColour,0,0,viewController.getCanvasWidth(),
            viewController.getCanvasHeight());

        //create player
        var playerX = viewController.getCanvasWidth()/2 - playerImg.width/2;
        var playerY = viewController.getCanvasHeight() - playerImg.height;
        var playerW = settings.playerWidth;
        var playerH = settings.playerHeight;

        player = new objectFactory.player(settings.numPlayerLives,playerX,playerY,playerW,playerH,playerImg);

        //create aliens (2d array - numAlienRows x numAlienColumns)
        var alienW = settings.alienWidth;
        var alienH = settings.alienHeight;
        var numLives = settings.numAlienLives;
        for (var i = 0; i < settings.numAlienRows; i++) {
            var tempAlienRow = [];
            var tempY = ((1.5 * i) + 1) * alienH;
            for (var j = 0; j < settings.numAlienColumns; j++) {
                //set aliens' starting positions (set y at one alien-width from top)
                var tempAlien = new objectFactory.alien(numLives,0,tempY,alienW,alienH,alienImg);

                // identify the leftmost and rightmost aliens in each row
                if (j === 0) {
                    tempAlien.setIsLeftmost();
                    leftmostAliens.push(tempAlien);
                }
                if (j === settings.numAlienColumns - 1) {
                    tempAlien.setIsRightmost();
                    rightmostAliens.push(tempAlien);
                }
                if (i === settings.numAlienRows - 1) {
                    bottomAliens.push(tempAlien);
                }
                tempAlienRow.push(tempAlien);
            }
            aliens.push(tempAlienRow);
            calculateObjectStartingPositions(tempAlienRow,2*alienW,3*alienW,tempY);
        }
        numAliens = settings.numAlienRows * settings.numAlienColumns;

        //create shields
        var shieldW = settings.shieldWidth;
        var shieldH = settings.shieldHeight;
        var shieldNewY = viewController.getCanvasHeight() - (2.2 * settings.playerHeight);
        for (var k = 0; k < settings.numShields; k++) {
            var tempShield = new objectFactory.shield(settings.numShieldLives,0,0,shieldW,shieldH,shieldImg);
            shields.push(tempShield);
        }
        //set shields' starting position (set y at 2.2 player widths from bottom)
        calculateObjectStartingPositions(shields,shieldW,2*shieldW,shieldNewY);

        //draw sprites
        viewController.drawImg(playerImg,player.getX(),player.getY(),playerW,playerH);
        for (var m = 0; m < aliens.length; m++) {
            for (var n = 0; n < aliens[m].length; n++) {
                var alienX = aliens[m][n].getX();
                var alienY = aliens[m][n].getY();
                viewController.drawImg(alienImg,alienX,alienY,alienW,alienH);
            }
        }
        for (var s = 0; s < shields.length; s++) {
            var shieldX = shields[s].getX();
            var shieldY = shields[s].getY();
            viewController.drawImg(shieldImg,shieldX,shieldY,shieldW,shieldH);
        }
    }

    function controlPlayer(e) {
        var keyCode = e.keyCode;

        if (keyCode == KeyCode.left || keyCode == KeyCode.right) {
            movePlayer(keyCode);
        } else if (keyCode == KeyCode.shoot) {
            player.shoot(playerBullets,settings.bulletWidth,settings.bulletHeight);
        } else {
            //do nothing?
        }
    }

    function movePlayer(keyCode) {
        var xCoord = player.getX();
        var newXCoord = xCoord;
        var yCoord = player.getY();

        if (keyCode == KeyCode.left) {
            newXCoord-=10;
        } else if (keyCode == KeyCode.right) {
            newXCoord += 10;
        }

        player.setX(newXCoord,viewController.getCanvasWidth(),player.getWidth());

        if (newXCoord === player.getX()) {
            viewController.eraseImg(settings.bgColour,xCoord,yCoord,player.width,player.height);
            viewController.drawImg(player.getImg(),newXCoord,player.getY(),player.width,player.height);
        } //else hit a boundary so no movement - don't redraw
    }

    function moveAliens() {
        // Todo: leave nextDirection undefined?

        // Check if any of the edge aliens will cross the canvas boundary
        // Change direction if they will
        if (alienDirection === Direction.left) {
            for (var i = 0; i < leftmostAliens.length; i++) {
                if (leftmostAliens[i].getX() - alienStepVal < leftBound) {
                    alienDirection = Direction.right
                }
            }
        } else if (alienDirection === Direction.right) {
            for (var j = 0; j < rightmostAliens.length; j++) {
                if (rightmostAliens[j].getX() + rightmostAliens[j].getWidth() + alienStepVal > rightBound) {
                    alienDirection = Direction.left
                }
            }
        }

        for(var rowIndex = 0; rowIndex < aliens.length; rowIndex++) {
            // Erase row of aliens
            eraseGroupObjects(aliens[rowIndex]);
            // Move and redraw all aliens in that row
            for (var columnIndex = 0; columnIndex < aliens[rowIndex].length; columnIndex++) {
                aliens[rowIndex][columnIndex].move(alienStepVal,alienDirection,viewController.getCanvasWidth(),
                    viewController.getCanvasHeight());
                var newX = aliens[rowIndex][columnIndex].getX();
                var newY = aliens[rowIndex][columnIndex].getY();
                var width = aliens[rowIndex][columnIndex].getWidth();
                var height = aliens[rowIndex][columnIndex].getHeight();
                viewController.drawImg(aliens[rowIndex][columnIndex].getImg(),newX,newY,width,height);
            }
        }
    }

    function calculateObjectStartingPositions(objects,startPosition,endOffset,yPosition) {
        var endPosition = viewController.getCanvasWidth() - endOffset;
        var totalDistance = endPosition - startPosition;
        var offset = totalDistance/(objects.length - 1);

        for (var i = 0; i < objects.length; i++) {
            var newX = startPosition + (i*offset);
            objects[i].setX(newX,viewController.getCanvasWidth());
            objects[i].setY(yPosition,viewController.getCanvasHeight());
        }
    }

    function moveBullets() {
        // erase all bullets
        eraseGroupObjects(playerBullets);
        eraseGroupObjects(alienBullets);

        // update the positions of all bullets
        playerBullets.forEach(function(bullet) {
            bullet.move(2,Direction.up,viewController.getCanvasWidth(),viewController.getCanvasHeight());
        });
        alienBullets.forEach(function(bullet) {
            bullet.move(2,Direction.down,viewController.getCanvasWidth(),viewController.getCanvasHeight());
        });

        // check player's bullets' collisions
        checkTargetRowCollision(playerBullets, shields, null, null);
        for (var alienRowIndex = 0; alienRowIndex < aliens.length; alienRowIndex--) {
            checkTargetRowCollision(playerBullets, aliens, alienKilledUpdate, alienRowIndex);
        }

        // check aliens' bullets' collisions
        checkTargetRowCollision(alienBullets, shields, null, null);
        checkTargetRowCollision(alienBullets, [player], null, null);
        drawBullets(alienBullets,Direction.down);
    }

    function eraseGroupObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
            var x = objects[i].getX();
            var y = objects[i].getY();
            var width = objects[i].getWidth();
            var height = objects[i].getHeight();
            viewController.eraseImg(settings.bgColour,x,y,width,height);
        }
    }

    function drawBullets(listBullets, direction) {
        for (var i = 0; i < listBullets.length; i++) {
            var bullet = listBullets[i];
            if ((direction === Direction.up) && (bullet.getY() == 0 - bullet.height)) {
                //Bullet has gone off top of canvas, delete it
                playerBullets.splice(i,1);
            } else if ((direction == Direction.down) &&
                (bullet.getY() > viewController.getCanvasHeight + bullet.getHeight())) {
                //Bullet has gone off bottom of canvas, delete it
                playerBullets.splice(i,1);
            } else {
                var x = bullet.getX();
                var y = bullet.getY();
                var width = bullet.getWidth();
                var height = bullet.getHeight();
                viewController.drawBullet(settings.bulletColour,x,y,width,height);
            }
        }
    }

    function checkTargetRowCollision(bullets, targetRow, hitFunction, rowIndex) {
        for (var bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
            for (var targetColumnIndex = 0; targetColumnIndex > targetRow.length; targetColumnIndex++) {
                var bulletX = bullets[bulletIndex].getX();
                var targetX = targetRow[targetColumnIndex].getY();
                var targetW = targetRow[targetColumnIndex].getHeight();
                var bulletY = bullets[bulletIndex].getY();
                var targetY = targetRow[targetColumnIndex].getY();
                var targetH = targetRow[targetColumnIndex].getHeight();

                if ((targetX <= bulletX && bulletX <= targetX + targetW) &&
                    (targetY <= bulletY && bulletY <= targetY + targetH)) {
                    //remove bullet from list and erase it
                    var bulletW = bullets[bulletIndex].getWidth();
                    var bulletH = bullets[bulletIndex].getHeight();
                    viewController.eraseImg(settings.bgColour, bulletX, bulletY, bulletW, bulletH);
                    bullets.splice(bulletIndex, 1);

                    //target has been hit
                    targetRow[targetColumnIndex].hit();
                    if (!targetRow[targetColumnIndex].isAlive()) {
                        viewController.eraseImg(settings.bgColour, targetX, targetY, targetW, targetH);
                        if (hitFunction) {
                            hitFunction.call(null, targetRow[targetColumnIndex], rowIndex, targetColumnIndex);
                        }
                        // todo: what happens when you splice an array of size one?
                        targetRow.splice(targetColumnIndex, 1);
                        break;
                    }
                }
            }
        }
    }

    // Todo: this function relies on assumption that traverse the alien grid in same
    // order it was made AND that alien hasn't been removed yet. Seems very frail and error prone.
    function alienKilledUpdate(alien, rowIndex, columnIndex) {
        if (alien.isLeftmost) {
            if (aliens[rowIndex].length > 1) {
                leftmostAliens[rowIndex] = aliens[rowIndex][columnIndex + 1];
            } else {
                // So if no aliens left in that row can preserve row/col number alignment
                delete leftmostAliens[rowIndex];
            }
        }
        if (alien.isRightmost) {
            if (aliens[rowIndex].length > 1) {
                rightmostAliens[rowIndex] = aliens[rowIndex][columnIndex - 1];
            } else {
                delete rightmostAliens[rowIndex];
            }
        }
        if (bottomAliens.indexOf(alien) !== -1) {
            if (rowIndex > 1) {
                bottomAliens[columnIndex] = aliens[rowIndex - 1][columnIndex];
            } else {
                delete bottomAliens[columnIndex];
            }
        }
        numAliens--;
        player.changeScore(alien.getPoints());
    }

    function checkWinLoseStatus() {
        //todo: may need to reorder these checks
        var gameStatus;
        if (!player.isAlive()) {
            gameStatus = StateEnum.lost;
        } else if (numAliens === 0) {
            gameStatus = StateEnum.won;
        } else {
            gameStatus = StateEnum.playing;
        }
        return gameStatus;
    }

    function win() {
        viewController.writeText("Congrats! You've won!","green","30px Comic Sans MS","center");
    }

    function lose() {
        viewController.writeText("Sorry, you've lost!","red","30px Comic Sans MS","center");
    }

    function groupAlienShoot() {
        for (var i = 0; i < aliens.length; i++) {
            aliens[i].shoot(alienBullets,settings.bulletWidth,settings.bulletHeight);
        }
    }

    function randomAlienShoot() {

    }

    return {
        State: StateEnum,
        setupGame: setupGame,
        moveBullets: moveBullets,
        moveAliens: moveAliens,
        groupAlienShoot: groupAlienShoot,
        randomAlienShoot: randomAlienShoot,
        controlPlayer: controlPlayer,
        checkWinLoseStatus: checkWinLoseStatus,
        win: win,
        lose: lose
    };
}