
function GameController() {

    var NUM_ALIENS = 3;
    var PLAYER_W = 50;
    var PLAYER_H = 50;
    var ALIEN_W = 70;
    var ALIEN_H = 50;
    var BULLET_W = 6;
    var BULLET_H = 10;

    var BG_COLOUR = "#000000";
    var BULLET_COLOUR = "#ffffff";

    var KeyCode = {left: 37, right: 39, shoot: 32};
    var Direction = {left: "left", right: "right", up: "up", down: "down"};
    var State = {paused: "paused", playing: "playing", won: "won", lost: "lost"};
    var gameState;


    var characterFactory, viewController;
    var alienMovementTimer, bulletMovementTimer;
    var playerImg, alienImg;

    var player;
    var listAliens = [];
    var listBullets = [];

    function init() {
        //get sprite
        playerImg = document.getElementById("player-img");
        alienImg = document.getElementById("alien-img");

        //create game components
        characterFactory = SpriteFactory();
        viewController = ViewController();

        //create player
        var playerInitX = viewController.getCanvasWidth()/2 - playerImg.width/2;
        var playerInitY = viewController.getCanvasHeight() - playerImg.height;
        player = new characterFactory.player(3, playerInitX, playerInitY);

        //create aliens
        for (var i = 0; i < NUM_ALIENS; i++) {
            var tempAlien = new characterFactory.alien(1,(200+i*150),100);
            listAliens.push(tempAlien);
        }

        //draw sprites
        viewController.drawImg(playerImg,player.getXCoord(),player.getYCoord(),PLAYER_W,PLAYER_H);
        for (var j = 0; j < NUM_ALIENS; j++) {
            var tempX = listAliens[j].getXCoord();
            var tempY = listAliens[j].getYCoord();
            viewController.drawImg(alienImg,tempX,tempY,ALIEN_W,ALIEN_H);
        }

        //add key listener for player controls
        document.addEventListener("keydown", controlPlayer, false);

        //add start function to start button
        var startButton = document.getElementById("start-button");
        startButton.addEventListener("click",start);
        //add pause function to pause button
        var pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click",pause);
        //add restart button
        var startButton = document.getElementById("restart-button");

        gameState = State.paused;
    }

    function controlPlayer(e) {
        if (gameState === State.paused) {
            return;
        }
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
        var xCoord = player.getXCoord();
        var newXCoord = xCoord;
        var yCoord = player.getYCoord();

        if (keyCode == KeyCode.left) {
            newXCoord-=10;
        } else if (keyCode == KeyCode.right) {
            newXCoord += 10;
        }

        player.setXCoord(newXCoord, viewController.getCanvasWidth(),PLAYER_W);

        if (newXCoord === player.getXCoord()) {
            viewController.eraseImg(BG_COLOUR,xCoord,yCoord,playerImg.width, playerImg.height);
            viewController.drawImg(playerImg,newXCoord,player.getYCoord(),PLAYER_W,PLAYER_H);
        } //else hit a boundary so no movement - don't redraw
    }

    function shoot() {
        var height = BULLET_H;//10;
        var width = BULLET_W;//6;
        var xCoord = player.getXCoord() + PLAYER_W/2 - width/2; //ensure bullet centered
        var yCoord = player.getYCoord()- 10; //ensure no overlap of player image
        var bullet = new characterFactory.bullet(xCoord,yCoord,width,height);
        listBullets.push(bullet);
        viewController.drawBullet(BULLET_COLOUR,xCoord,yCoord,width,height);
    }

    function moveAliens() {
        shiftGroupObjects(listAliens,ALIEN_W,ALIEN_H,5,Direction.down);
        for(var i = 0; i < listAliens.length; i++) {
            var alien = listAliens[i];
            viewController.drawImg(alienImg,alien.getXCoord(),alien.getYCoord(),ALIEN_W,ALIEN_H);
        }
    }

    function moveBullets() {
        shiftGroupObjects(listBullets,BULLET_W,BULLET_H,2,Direction.up);
        //check for collision with aliens
        checkBulletCollision();
        for (var i = 0; i < listBullets.length; i++) {
            var bullet = listBullets[i];
            if (bullet.getYCoord() == 0 - bullet.height) {
                //Bullet has gone off screen, need to delete it
                listBullets.splice(i,1);
            } else {
                viewController.drawBullet(BULLET_COLOUR,bullet.getXCoord(),bullet.getYCoord(),BULLET_W,BULLET_H);
            }
        }
    }

    function checkBulletCollision() {
        for (var i = 0; i < listBullets.length; i++) {
            for (var j = 0; j < listAliens.length; j++) {
                var bulletXCoord = listBullets[i].getXCoord();
                var alienXCoord = listAliens[j].getXCoord();

                if (alienXCoord <= bulletXCoord && bulletXCoord <= alienXCoord + ALIEN_W) {
                    var bulletYCoord = listBullets[i].getYCoord();
                    var alienYCoord = listAliens[j].getYCoord();
                    if (alienYCoord <= bulletYCoord && bulletYCoord <= alienYCoord + ALIEN_H) {
                        //remove bullet and alien from lists
                        listBullets.splice(i,1);
                        listAliens.splice(j,1);
                        //erase both objects
                        viewController.eraseImg(BG_COLOUR,alienXCoord,alienYCoord,ALIEN_W,ALIEN_H);
                        //bullet should already be erased
                        //viewController.eraseImg(BG_COLOUR,bulletXCoord,bulletYCoord,BULLET_W,BULLET_H);
                        break;
                    }
                }
            }
        }
    }

    //Note: only applicable to classes that inherit from GameObject template
    //Updates objects' coordinates AND erases them
    function shiftGroupObjects(listObjects,objectW,objectH,distance,direction) {
        for (var i = 0; i < listObjects.length; i++) {
            var xCoord = listObjects[i].getXCoord();
            var yCoord = listObjects[i].getYCoord();
            viewController.eraseImg("#000000",xCoord,yCoord,objectW,objectH);

            if (direction === Direction.left) {
                xCoord -= distance;
            } else if (direction === Direction.right) {
                xCoord += direction;
            } else if (direction === Direction.up) {
                yCoord -= distance;
            } else if (direction === Direction.down) {
                yCoord += distance;
            }
            listObjects[i].setXCoord(xCoord, viewController.getCanvasWidth());
            listObjects[i].setYCoord(yCoord, viewController.getCanvasHeight());
        }
    }

    function play() {}

    function pause() {
        if (gameState != State.paused) {
            clearInterval(alienMovementTimer);
            clearInterval(bulletMovementTimer);
            gameState = State.paused;
        }
    }

    function start() {
        //start timer for alien movement
        if (gameState != State.playing) {
            alienMovementTimer = setInterval(moveAliens,1200);
            bulletMovementTimer = setInterval(moveBullets,10);
            gameState = State.playing;
        }
    }

    function restart() {}

    return {
        init: init
    };
}

var spaceInvaders;

window.onload = function() {
    spaceInvaders = new GameController();
    spaceInvaders.init();

};