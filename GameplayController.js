
function GameplayController() {

    var KeyCode = {left: 37, right: 39, shoot: 32};
    var Direction = {left: "left", right: "right", up: "up", down: "down"};
    var vc,objFactory,gameSettings;

    var player;
    var aliens;
    var playerBullets;
    var alienBullets;


    function setupGame(viewController, objectFactory, playerImg, alienImg, settings) {
        aliens = [];
        playerBullets = [];
        alienBullets = [];
        vc = viewController;
        objFactory = objectFactory;
        gameSettings = settings;

        //create player
        var playerX = viewController.getCanvasWidth()/2 - playerImg.width/2;
        var playerY = viewController.getCanvasHeight() - playerImg.height;
        var playerW = settings.playerWidth;
        var playerH = settings.playerHeight;

        player = new objectFactory.player(3,playerX,playerY,playerW,playerH,playerImg);

        //create aliens
        var alienW = settings.alienWidth;
        var alienH = settings.alienHeight;
        for (var i = 0; i < settings.numAliens; i++) {
            var tempAlien = new objectFactory.alien(1,(200+i*150),50,alienW,alienH,alienImg);
            aliens.push(tempAlien);
        }

        //draw sprites
        viewController.drawImg(playerImg,player.getX(),player.getY(),playerW,playerH);
        for (var j = 0; j < settings.numAliens; j++) {
            var tempX = aliens[j].getX();
            var tempY = aliens[j].getY();
            viewController.drawImg(alienImg,tempX,tempY,alienW,alienH);
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

        player.setX(newXCoord,vc.getCanvasWidth(),player.getWidth());

        if (newXCoord === player.getX()) {
            vc.eraseImg(gameSettings.bgColour,xCoord,yCoord,player.width,player.height);
            vc.drawImg(player.getImg(),newXCoord,player.getY(),player.width,player.height);
        } //else hit a boundary so no movement - don't redraw
    }

    function moveBullets() {
        shiftGroupObjects(playerBullets,2,Direction.up);
        shiftGroupObjects(alienBullets,2,Direction.down);
        //check for collision between player bullets and aliens
        checkBulletCollision(playerBullets, aliens);
        //check for collision between alien bullets and player
        //checkBulletCollision(alienBullets,player);
        drawBullets(playerBullets,Direction.up);
        drawBullets(alienBullets,Direction.down);
    }

    function drawBullets(listBullets, direction) {
        for (var i = 0; i < listBullets.length; i++) {
            var bullet = listBullets[i];
            if ((direction === Direction.up) && (bullet.getY() == 0 - bullet.height)) {
                //Bullet has gone off screen, need to delete it
                playerBullets.splice(i,1);
            } else if ((direction == Direction.down) && (bullet.getY() > vc.getCanvasHeight)) {
                //Bullet has gone off screen, need to delete it
                playerBullets.splice(i,1);
            } else {
                var x = bullet.getX();
                var y = bullet.getY();
                var width = bullet.getWidth();
                var height = bullet.getHeight();
                vc.drawBullet(gameSettings.bulletColour,x,y,width,height);
            }
        }
    }

    //Refactor this to only accept array as 2nd parameter?
    function checkBulletCollision(attackerBullets, target) {
        for (var i = 0; i < attackerBullets.length; i++) {
            //if target single object, make it its own array
            if (target.constructor != Array) {
                var tempTarget = target;
                target = [];
                target.push(tempTarget);
            }
            for (var j = 0; j < target.length; j++) {
                var bulletX = attackerBullets[i].getX();
                var targetX = target[j].getX();
                var targetW = target[j].getWidth();

                if (targetX <= bulletX && bulletX <= targetX + targetW) {
                    var bulletY = attackerBullets[i].getY();
                    var targetY = target[j].getY();
                    var targetH = target[j].getHeight();

                    if (targetY <= bulletY && bulletY <= targetY + targetH) {
                        //remove bullet and alien from lists
                        attackerBullets.splice(i,1);
                        target.splice(j,1);
                        //erase both objects
                        vc.eraseImg(gameSettings.bgColour,targetX,targetY,targetW,targetH);
                        //bullet should already be erased
                        //viewController.eraseImg(Settings.bgColour,bulletXCoord,bulletYCoord,BULLET_W,BULLET_H);
                        break;
                    }
                }
            }
        }
    }

    //Note: only applicable to classes that inherit from GameObject template
    //Updates objects' coordinates AND erases them
    function shiftGroupObjects(listObjects,distance,direction) {
        for (var i = 0; i < listObjects.length; i++) {
            var x = listObjects[i].getX();
            var y = listObjects[i].getY();
            var width = listObjects[i].getWidth();
            var height = listObjects[i].getHeight();
            vc.eraseImg("#000000",x,y,width,height);

            if (direction === Direction.left) {
                x -= distance;
            } else if (direction === Direction.right) {
                x += direction;
            } else if (direction === Direction.up) {
                y -= distance;
            } else if (direction === Direction.down) {
                y += distance;
            }
            listObjects[i].setX(x,vc.getCanvasWidth());
            listObjects[i].setY(y,vc.getCanvasHeight());
        }
    }

    function groupAlienShoot() {
        for (var i = 0; i < aliens.length; i++) {
            aliens[i].shoot(alienBullets,gameSettings.bulletWidth,gameSettings.bulletHeight);
        }
    }

    function randomAlienShoot() {

    }

    function moveAliens() {
        shiftGroupObjects(aliens,5,Direction.down);
        for(var i = 0; i < aliens.length; i++) {
            var alien = aliens[i];
            vc.drawImg(alien.getImg(),alien.getX(),alien.getY(),alien.getWidth(),alien.getHeight());
        }
    }

    return {
        setupGame: setupGame,
        moveBullets: moveBullets,
        moveAliens: moveAliens,
        groupAlienShoot: groupAlienShoot,
        randomAlienShoot: randomAlienShoot,
        controlPlayer: controlPlayer
    };
}