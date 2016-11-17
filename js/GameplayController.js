/*
 * Helper object that implements all game logic and updating the screen
 * (via the ViewController object). Contains and controls all actors in
 * the game.
 */
function GameplayController() {

    var StateEnum = {paused: "paused", playing: "playing", won: "won", lost: "lost"};
    var KeyCode = {left: 37, right: 39, shoot: 32};
    var Direction = {left: "left", right: "right", up: "up", down: "down"};
    var viewController,objectFactory,gameSettings;

    var player;
    var aliens;
    var shields;
    var playerBullets;
    var alienBullets;


    function setupGame(playerImg,alienImg,shieldImg,settings) {
        aliens = [];
        shields = [];
        playerBullets = [];
        alienBullets = [];
        viewController = ViewController();
        objectFactory = ObjectFactory();
        gameSettings = settings;

        //clear canvas
        viewController.eraseImg(settings.bgColour,0,0,viewController.getCanvasWidth(),
            viewController.getCanvasHeight());

        //create player
        var playerX = viewController.getCanvasWidth()/2 - playerImg.width/2;
        var playerY = viewController.getCanvasHeight() - playerImg.height;
        var playerW = gameSettings.playerWidth;
        var playerH = gameSettings.playerHeight;

        player = new objectFactory.player(gameSettings.numPlayerLives,playerX,playerY,playerW,playerH,playerImg);

        //create aliens
        var alienW = gameSettings.alienWidth;
        var alienH = gameSettings.alienHeight;
        for (var i = 0; i < gameSettings.numAliens; i++) {
            var tempAlien = new objectFactory.alien(gameSettings.numAlienLives,0,0,alienW,alienH,alienImg);
            aliens.push(tempAlien);
        }
        //set aliens' starting positions (set y at one alien-width from top)
        calculateObjectStartingPositions(aliens,gameSettings.numAliens,alienW,2*alienW,3*alienW,alienH);

        //create shields
        var shieldW = gameSettings.shieldWidth;
        var shieldH = gameSettings.shieldHeight;
        var shieldNewY = viewController.getCanvasHeight() - (2.2 * gameSettings.playerHeight);
        for (var k = 0; k < gameSettings.numShields; k++) {
            var tempShield = new objectFactory.shield(gameSettings.numShieldLives,0,0,shieldW,shieldH,shieldImg);
            shields.push(tempShield);
        }
        //set shields' starting position (set y at 2.2 player widths from bottom)
        calculateObjectStartingPositions(shields,gameSettings.numShields,shieldW,shieldW,2*shieldW,shieldNewY);

        //draw sprites
        viewController.drawImg(playerImg,player.getX(),player.getY(),playerW,playerH);
        for (var j = 0; j < gameSettings.numAliens; j++) {
            var alienX = aliens[j].getX();
            var alienY = aliens[j].getY();
            viewController.drawImg(alienImg,alienX,alienY,alienW,alienH);
        }
        for (var m = 0; m < shields.length; m++) {
            var shieldX = shields[m].getX();
            var shieldY = shields[m].getY();
            viewController.drawImg(shieldImg,shieldX,shieldY,shieldW,shieldH);
        }
    }

    function controlPlayer(e) {
        var keyCode = e.keyCode;

        if (keyCode == KeyCode.left || keyCode == KeyCode.right) {
            movePlayer(keyCode);
        } else if (keyCode == KeyCode.shoot) {
            player.shoot(playerBullets,gameSettings.bulletWidth,gameSettings.bulletHeight);
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
            viewController.eraseImg(gameSettings.bgColour,xCoord,yCoord,player.width,player.height);
            viewController.drawImg(player.getImg(),newXCoord,player.getY(),player.width,player.height);
        } //else hit a boundary so no movement - don't redraw
    }

    function moveBullets() {
        //erase all bullets
        eraseGroupObjects(playerBullets);
        eraseGroupObjects(alienBullets);

        //update the positions of all bullets
        playerBullets.forEach(function(bullet) {
            bullet.move(2,Direction.up,viewController.getCanvasWidth(),viewController.getCanvasHeight());
        });
        alienBullets.forEach(function(bullet) {
            bullet.move(2,Direction.down,viewController.getCanvasWidth(),viewController.getCanvasHeight());
        });

        //check for collision between player bullets and aliens/shields
        checkBulletCollision(playerBullets, aliens);
        checkBulletCollision(playerBullets, shields);
        //check for collision between alien bullets and player/shields
        checkBulletCollision(alienBullets,player);
        checkBulletCollision(alienBullets,shields);

        drawBullets(playerBullets,Direction.up);
        drawBullets(alienBullets,Direction.down);
    }

    function eraseGroupObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
            var x = objects[i].getX();
            var y = objects[i].getY();
            var width = objects[i].getWidth();
            var height = objects[i].getHeight();
            viewController.eraseImg(gameSettings.bgColour,x,y,width,height);
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
                viewController.drawBullet(gameSettings.bulletColour,x,y,width,height);
            }
        }
    }

    //Refactor this to only accept array as 2nd parameter?
    //Bad style to use temp variables like this?
    function checkBulletCollision(attackerBullets, target) {
        //if target single object, make it its own array
        if (target.constructor != Array) {
            var tempTarget = target;
            target = [];
            target.push(tempTarget);
        }
        for (var bulletCounter = 0; bulletCounter < attackerBullets.length; bulletCounter++) {
            for (var targetCounter = 0; targetCounter < target.length; targetCounter++) {
                var bulletX = attackerBullets[bulletCounter].getX();
                var targetX = target[targetCounter].getX();
                var targetW = target[targetCounter].getWidth();

                if (targetX <= bulletX && bulletX <= targetX + targetW) {
                    var bulletY = attackerBullets[bulletCounter].getY();
                    var targetY = target[targetCounter].getY();
                    var targetH = target[targetCounter].getHeight();

                    if (targetY <= bulletY && bulletY <= targetY + targetH) {
                        //target has been hit
                        target[targetCounter].hit();
                        //remove bullet from list and erase it
                        var bulletW = attackerBullets[bulletCounter].getWidth();
                        var bulletH = attackerBullets[bulletCounter].getHeight();
                        viewController.eraseImg(gameSettings.bgColour,bulletX,bulletY,bulletW,bulletH);
                        attackerBullets.splice(bulletCounter,1);

                        //if target was fatally hit remove it from screen
                        //todo: this may not work for both player and aliens
                        if (!target[targetCounter].isAlive()) {
                            viewController.eraseImg(gameSettings.bgColour, targetX, targetY, targetW, targetH);
                            target.splice(targetCounter, 1);
                            break; //bullet can't kill more than one alien
                        } //else do nothing for now (may alter picture later to show damage)
                    }
                }
            }
        }
    }

    function checkWinLoseStatus() {
        //todo: may need to reorder these checks
        var gameStatus;
        if (!player.isAlive()) {
            gameStatus = StateEnum.lost;
        } else if (aliens.length === 0) {
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
            aliens[i].shoot(alienBullets,gameSettings.bulletWidth,gameSettings.bulletHeight);
        }
    }

    function randomAlienShoot() {

    }

    function moveAliens() {
        eraseGroupObjects(aliens);
        for(var i = 0; i < aliens.length; i++) {
            var alien = aliens[i];
            alien.move(5,Direction.down,viewController.getCanvasWidth(),viewController.getCanvasHeight());
            viewController.drawImg(alien.getImg(),alien.getX(),alien.getY(),alien.getWidth(),alien.getHeight());
        }
    }

    function calculateObjectStartingPositions(objects,numObjects,objectWidth,startPosition,endOffset,yPosition) {
        var endPosition = viewController.getCanvasWidth() - endOffset;
        var totalDistance = endPosition - startPosition;
        var offset = totalDistance/(numObjects-1);

        for (var i = 0; i < numObjects; i++) {
            var newX = startPosition + (i*offset);
            objects[i].setX(newX,viewController.getCanvasWidth());
            objects[i].setY(yPosition,viewController.getCanvasHeight());
        }
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