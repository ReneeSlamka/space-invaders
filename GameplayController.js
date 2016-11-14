
function GameplayController() {

    var KeyCode = {left: 37, right: 39, shoot: 32};
    var Direction = {left: "left", right: "right", up: "up", down: "down"};
    var vc,objFactory,gameSettings;

    var player;
    var listAliens = [];
    var listBullets = [];


    function setupGame(viewController, objectFactory, playerImg, alienImg, settings) {
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
            listAliens.push(tempAlien);
        }

        //draw sprites
        viewController.drawImg(playerImg,player.getX(),player.getY(),playerW,playerH);
        for (var j = 0; j < settings.numAliens; j++) {
            var tempX = listAliens[j].getX();
            var tempY = listAliens[j].getY();
            viewController.drawImg(alienImg,tempX,tempY,alienW,alienH);
        }
    }

    function controlPlayer(e) {
        var keyCode = e.keyCode;

        if (keyCode == KeyCode.left || keyCode == KeyCode.right) {
            movePlayer(keyCode);
        } else if (keyCode == KeyCode.shoot) {
            shoot();
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
        shiftGroupObjects(listBullets,2,Direction.up);
        //check for collision with aliens
        checkBulletCollision();
        for (var i = 0; i < listBullets.length; i++) {
            var bullet = listBullets[i];
            if (bullet.getY() == 0 - bullet.height) {
                //Bullet has gone off screen, need to delete it
                listBullets.splice(i,1);
            } else {
                var x = bullet.getX();
                var y = bullet.getY();
                var width = bullet.getWidth();
                var height = bullet.getHeight();
                vc.drawBullet(gameSettings.bulletColour,x,y,width,height);
            }
        }
    }

    function checkBulletCollision() {
        for (var i = 0; i < listBullets.length; i++) {
            for (var j = 0; j < listAliens.length; j++) {
                var bulletX = listBullets[i].getX();
                var alienX = listAliens[j].getX();
                var alienW = listAliens[j].getWidth();

                if (alienX <= bulletX && bulletX <= alienX + alienW) {
                    var bulletY = listBullets[i].getY();
                    var alienY = listAliens[j].getY();
                    var alienH = listAliens[j].getHeight();

                    if (alienY <= bulletY && bulletY <= alienY + alienH) {
                        //remove bullet and alien from lists
                        listBullets.splice(i,1);
                        listAliens.splice(j,1);
                        //erase both objects
                        vc.eraseImg(gameSettings.bgColour,alienX,alienY,alienW,alienH);
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


    function shoot() {
        var bulletW = gameSettings.bulletWidth;
        var bulletH = gameSettings.bulletHeight;
        var bulletX = player.getX() + player.getWidth()/2 - bulletW/2; //ensure bullet centered
        var bulletY = player.getY() - bulletH; //ensure no overlap of player image
        var bullet = new objFactory.bullet(bulletX,bulletY,bulletW,bulletH);
        listBullets.push(bullet);
        vc.drawBullet(gameSettings.bulletColour,bulletX,bulletY,bulletW,bulletH);
    }

    function moveAliens() {
        shiftGroupObjects(listAliens,5,Direction.down);
        for(var i = 0; i < listAliens.length; i++) {
            var alien = listAliens[i];
            vc.drawImg(alien.getImg(),alien.getX(),alien.getY(),alien.getWidth(),alien.getHeight());
        }
    }

    return {
        setupGame: setupGame,
        moveBullets: moveBullets,
        moveAliens: moveAliens,
        controlPlayer: controlPlayer
    };
}