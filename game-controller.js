
function GameController() {

    var NUM_ALIENS = 3;
    var MOVE_LEFT_KEY_CODE = 37;
    var MOVE_RIGHT_KEY_CODE = 39;
    var P_WIDTH = 50;
    var P_HEIGHT = 50;
    var A_WIDTH = 70;
    var A_HEIGHT = 50;
    var BG_COLOUR = "#000000";

    var PAUSED = "paused";
    var PLAYING = "playing";
    var gameState = PAUSED;


    var characterFactory, viewController, alienMovementTimer;
    var playerImg, alienImg;

    var player;
    var listAliens = [];

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
        viewController.drawImg(playerImg,player.getXCoord(),player.getYCoord(),P_WIDTH,P_HEIGHT);
        for (var j = 0; j < NUM_ALIENS; j++) {
            var tempX = listAliens[j].getXCoord();
            var tempY = listAliens[j].getYCoord();
            viewController.drawImg(alienImg,tempX,tempY,70,48);
        }

        //add key listener for player controls
        document.addEventListener("keydown", movePlayer, false);

        //add pause function to pause button
        var pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click",pause);
        //add start function to start button
        var startButton = document.getElementById("start-button");
        startButton.addEventListener("click",start);

    }

    function movePlayer(e) {

        if (gameState === PAUSED) {
            return;
        }

        var keyCode = e.keyCode;
        var xCoord = player.getXCoord();
        var newXCoord = xCoord;
        var yCoord = player.getYCoord();

        if (keyCode == MOVE_LEFT_KEY_CODE) {
            newXCoord-=10;
        } else if (keyCode == MOVE_RIGHT_KEY_CODE) {
            newXCoord+=10;
        } else {
            //do nothing?
        }

        player.setXCoord(newXCoord, viewController.getCanvasWidth(),P_WIDTH);

        if (newXCoord === player.getXCoord()) {
            viewController.eraseImg(BG_COLOUR,xCoord,yCoord,playerImg.width, playerImg.height);
            viewController.drawImg(playerImg,newXCoord,player.getYCoord(),P_WIDTH,P_HEIGHT);
        } //else hit a boundary so no movement - don't redraw
    }

    function moveAliens() {
        for (var i = 0; i < NUM_ALIENS; i++) {
            var tempX = listAliens[i].getXCoord();
            var tempY = listAliens[i].getYCoord();
            viewController.eraseImg("#000000",tempX,tempY,alienImg.width,alienImg.height);
            tempY+=5;
            listAliens[i].setYCoord(tempY, viewController.getCanvasHeight());
            viewController.drawImg(alienImg,tempX,tempY,A_WIDTH,A_HEIGHT);
        }
    }

    function play() {}

    function pause() {
        if (gameState != PAUSED) {
            clearInterval(alienMovementTimer);
            gameState = PAUSED;
        }
    }

    function start() {
        //start timer for alien movement
        if (gameState != PLAYING) {
            alienMovementTimer = setInterval(moveAliens, 2000);
            gameState = PLAYING;
        }
    }

    function restart() {}

    return {
        init: init,
        play: play,
        restart: restart
    };
}

var spaceInvaders;

window.onload = function() {
    spaceInvaders = new GameController();
    spaceInvaders.init();

};