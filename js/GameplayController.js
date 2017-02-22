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
        document.getElementById("score").innerHTML = "0";
        document.getElementById("num-lives").innerHTML = settings.numPlayerLives.toString();

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
                    tempAlien.setIsBottom();
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
                if (leftmostAliens[i] != undefined) {
                    if (leftmostAliens[i].getX() - alienStepVal < leftBound) {
                        alienDirection = Direction.right
                    }
                }
            }
        } else if (alienDirection === Direction.right) {
            for (var j = 0; j < rightmostAliens.length; j++) {
                if (rightmostAliens[j] != undefined) {
                    if (rightmostAliens[j].getX() + rightmostAliens[j].getWidth() + alienStepVal > rightBound) {
                        alienDirection = Direction.left
                    }
                }
            }
        }

        for(var rowIndex = 0; rowIndex < aliens.length; rowIndex++) {
            // Erase row of aliens
            eraseGroupObjects(aliens[rowIndex]);
            // Move and redraw all aliens in that row
            for (var columnIndex = 0; columnIndex < aliens[rowIndex].length; columnIndex++) {
                if (aliens[rowIndex][columnIndex] != undefined) {
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

        // update the positions of all bullets - remove out of bounds bullets
        for (var i = 0; i < playerBullets.length; i++) {
            var playerFireOutOfBounds = playerBullets[i].move(2,Direction.up,viewController.getCanvasWidth(),
                    viewController.getCanvasHeight());
            if (playerFireOutOfBounds) {
                playerBullets.splice(i,1);
                i--;
            }
        }
        for (var j = 0; j < alienBullets.length; j++) {
            var alienFireOutOfBounds = alienBullets[j].move(2,Direction.down,viewController.getCanvasWidth(),
                viewController.getCanvasHeight());
            if (alienFireOutOfBounds) {
                alienBullets.splice(j,1);
                j--;
            }
        }

        // check player's bullets' collisions
        checkTargetRowCollision(playerBullets, shields, null, null);
        for (var alienRowIndex = (aliens.length - 1); alienRowIndex >= 0; alienRowIndex--) {
            checkTargetRowCollision(playerBullets, aliens[alienRowIndex], alienKilledUpdate, alienRowIndex);
        }

        // check aliens' bullets' collisions and update game feedback
        checkTargetRowCollision(alienBullets, shields, null, null);
        checkTargetRowCollision(alienBullets, [player], null, null);
        document.getElementById('num-lives').innerHTML = player.getLives();
        drawBullets(alienBullets);
        drawBullets(playerBullets);
    }

    function eraseGroupObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
            if (objects[i] != undefined) {
                var x = objects[i].getX();
                var y = objects[i].getY();
                var width = objects[i].getWidth();
                var height = objects[i].getHeight();
                viewController.eraseImg(settings.bgColour,x,y,width,height);
            }
        }
    }

    function drawBullets(listBullets) {
        for (var i = 0; i < listBullets.length; i++) {
            var bullet = listBullets[i];
            var x = bullet.getX() + 2; // otherwise leaves white line after erasing
            var y = bullet.getY();
            var width = bullet.getWidth() - 4;// see above comment
            var height = bullet.getHeight();
            viewController.drawBullet(settings.bulletColour,x,y,width,height);
        }
    }

    function checkTargetRowCollision(bullets, targetRow, hitFunction, rowIndex) {
        for (var bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
            for (var targetColumnIndex = 0; targetColumnIndex < targetRow.length; targetColumnIndex++) {
                if (targetRow[targetColumnIndex] == undefined) {
                    continue;
                }
                var bulletX = bullets[bulletIndex].getX();
                var targetX = targetRow[targetColumnIndex].getX();
                var targetW = targetRow[targetColumnIndex].getWidth();
                var bulletY = bullets[bulletIndex].getY();
                var targetY = targetRow[targetColumnIndex].getY();
                var targetH = targetRow[targetColumnIndex].getHeight();
                var bulletDirection = bullets[bulletIndex].getDirection();
                var targetHit = false;

                if (targetX <= bulletX && bulletX <= targetX + targetW) {
                    // Separate Y conditions so alien fire doesn't cut into targets when bullets erased
                    if (bulletDirection === Direction.down && targetY <= (bulletY + bullets[bulletIndex].getHeight())
                        && (bulletY + bullets[bulletIndex].getHeight()) <= targetY + targetH) {
                        targetHit = true;
                    } else if (bulletDirection === Direction.up && targetY <= bulletY &&
                        bulletY <= targetY + targetH) {
                        targetHit = true;
                    }
                    if(!targetHit) {
                        return;
                    }

                    // Remove bullet from list and erase it
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
                        delete aliens[rowIndex][targetColumnIndex];
                        // delete row if all aliens have been killed
                        if (isRowEmpty(aliens[rowIndex])) {
                            aliens.splice(rowIndex,1);
                        }
                        break;
                    }
                }
            }
        }
    }

    function isRowEmpty(rowSprites) {
        for (var i = 0; i < rowSprites.length; i++) {
            if (rowSprites[i] != undefined) {
                return false;
            }
        }
        return true;
    }

    // Todo: this function relies on assumption that traverse the alien grid in same
    // order it was made AND that alien hasn't been removed yet. Seems very frail and error prone.
    function alienKilledUpdate(alien, rowIndex, columnIndex) {
        // Note: if only one element will remain after the splicing, it will be leftmost AND rightmost
        if (alien.getIsLeftmost()) {
            if (aliens[rowIndex].length > 1) {
                // search for next leftmost alien
                for (var i = columnIndex + 1; i < aliens[rowIndex].length; i++) {
                    if (aliens[rowIndex][i] != undefined) {
                        aliens[rowIndex][i].setIsLeftmost();
                        leftmostAliens[rowIndex] = aliens[rowIndex][i];
                        break;
                    }
                }
            } else {
                // So if no aliens left in that row can preserve row/col number alignment
                leftmostAliens.splice(rowIndex,1); //not column, is row
            }
        }
        if (alien.getIsRightmost()) {
            if (aliens[rowIndex].length > 1) {
                // search for next rightmost alien
                for (var j = columnIndex - 1; j >= 0; j--) {
                    if (aliens[rowIndex][j] != undefined) {
                        aliens[rowIndex][j].setIsRightmost();
                        rightmostAliens[rowIndex] = aliens[rowIndex][j];
                        break;
                    }
                }
            } else {
                rightmostAliens.splice(rowIndex,1);
            }
        }
        if (alien.getIsBottom()) {
            if (rowIndex > 0) {
                // search for next bottommost alien
                for (var k = rowIndex - 1; k >= 0; k--) {
                    if (aliens[k][columnIndex] != undefined) {
                        aliens[k][columnIndex].setIsBottom();
                        bottomAliens[columnIndex] = aliens[k][columnIndex];
                        break;
                    }
                }
            } else {
                // don't splice because need to preserve row-col relationship
                delete bottomAliens[columnIndex];
            }
        }
        numAliens--;
        player.changeScore(alien.getPoints());
        // Update displayed user score
        document.getElementById("score").innerHTML = player.getScore();
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
        for (var i = 0; i < bottomAliens.length; i++) {
            if (bottomAliens[i] != undefined) {
                bottomAliens[i].shoot(alienBullets,settings.bulletWidth,settings.bulletHeight);
            }
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