
function GameController() {

    var NUM_ALIENS = 3;
    var LEFT_KEY = 37;
    var RIGHT_KEY = 39;
    var SHOOT_KEY = 32;
    var PLAYER_W = 50;
    var PLAYER_H = 50;
    var ALIEN_W = 70;
    var ALIEN_H = 50;
    var BULLET_W = 6;
    var BULLET_H = 10;

    var BG_COLOUR = "#000000";

    var Direction = {left: "left", right: "right", up: "up", down: "down"};

    var PAUSED = "paused";
    var PLAYING = "playing";
    var gameState = PAUSED;


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
            viewController.drawImg(alienImg,tempX,tempY,70,48);
        }

        //add key listener for player controls
        document.addEventListener("keydown", controlPlayer, false);

        //add pause function to pause button
        var pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click",pause);
        //add start function to start button
        var startButton = document.getElementById("start-button");
        startButton.addEventListener("click",start);

    }

    function controlPlayer(e) {
        if (gameState === PAUSED) {
            return;
        }
        var keyCode = e.keyCode;

        if (keyCode == LEFT_KEY || keyCode == RIGHT_KEY) {
            movePlayer(keyCode);
        } else if (keyCode == SHOOT_KEY) {
            shoot();
        } else {
            //do nothing?
        }
    }

    function movePlayer(keyCode) {
        var xCoord = player.getXCoord();
        var newXCoord = xCoord;
        var yCoord = player.getYCoord();

        if (keyCode == LEFT_KEY) {
            newXCoord-=10;
        } else if (keyCode == RIGHT_KEY) {
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
        viewController.drawBullet("#ffffff",xCoord,yCoord,width,height);
    }

    function moveAliens() {
        shiftGroupObjects(listAliens,ALIEN_W,ALIEN_H,5,Direction.down);
        for(var i = 0; i < listAliens.length; i++) {
            var alien = listAliens[i];
            viewController.drawImg(alienImg,alien.getXCoord(),alien.getYCoord(),ALIEN_W,ALIEN_H);
        }
    }

    function moveBullets() {
        shiftGroupObjects(listBullets,BULLET_W,BULLET_H,5,Direction.up);
        for (var i = 0; i < listBullets.length; i++) {
            var bullet = listBullets[i];
            if (bullet.getYCoord() == 0 - bullet.height) {
                //Bullet has gone off screen, need to delete it
                listBullets.splice(i,1);
            } else {
                viewController.drawBullet("#ffffff",bullet.getXCoord(),bullet.getYCoord(),BULLET_W,BULLET_H);
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
        if (gameState != PAUSED) {
            clearInterval(alienMovementTimer);
            clearInterval(bulletMovementTimer);
            gameState = PAUSED;
        }
    }

    function start() {
        //start timer for alien movement
        if (gameState != PLAYING) {
            alienMovementTimer = setInterval(moveAliens,2000);
            bulletMovementTimer = setInterval(moveBullets,70);
            gameState = PLAYING;
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