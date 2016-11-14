function Game() {
    var settings = {
        bgColour: "#000000",
        bulletColour: "#ffffff",
        numLives: 3,
        numAliens: 3,
        playerWidth: 50,
        playerHeight: 50,
        alienWidth: 70,
        alienHeight: 50,
        bulletWidth: 6,
        bulletHeight: 10,
        alienShootMode: "group"
    };
    var gameState;
    var characterFactory, viewController, gameplayController;
    var alienMovementTimer, bulletMovementTimer, alienShootTimer;
    var playerImg, alienImg;


    function init() {
        //get sprite images
        playerImg = document.getElementById("player-img");
        alienImg = document.getElementById("alien-img");

        //create game controller
        gameplayController = GameplayController();
        //setup the game
        gameplayController.setupGame(playerImg,alienImg,settings);

        //add key listener for player controls
        document.addEventListener("keydown", keyPress, false);

        //add start function to start button
        var startButton = document.getElementById("start-button");
        startButton.addEventListener("click",play);
        //add pause function to pause button
        var pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click",pause);
        //add restart button
        var restartButton = document.getElementById("restart-button");
        restartButton.addEventListener("click",reset);

        gameState = gameplayController.State.paused;
    }

    function keyPress(e) {
        if (gameState === gameplayController.State.playing) {
            gameplayController.controlPlayer(e);
        }
    }

    function pause() {
        if (gameState != gameplayController.State.paused) {
            clearInterval(alienMovementTimer);
            clearInterval(bulletMovementTimer);
            clearInterval(alienShootTimer);
            gameState = gameplayController.State.paused;
        }
    }

    function play() {
        //start timer for alien movement
        if (gameState != gameplayController.State.playing) {
            alienMovementTimer = setInterval(gameplayController.moveAliens,1200);
            alienShootTimer = setInterval(gameplayController.groupAlienShoot, 5000);
            bulletMovementTimer = setInterval(function(){
                gameplayController.moveBullets();
                gameState = gameplayController.checkWinLoseStatus();
                if(gameState === gameplayController.State.won) {
                    pause();
                    gameplayController.win();
                } else if (gameState === gameplayController.State.lost) {
                    pause();
                    gameplayController.lose();
                }
            },10);
            gameState = gameplayController.State.playing;
        }
    }

    function reset() {
        //stop timers
        clearInterval(alienMovementTimer);
        clearInterval(bulletMovementTimer);
        clearInterval(alienShootTimer);
        gameState = gameplayController.State.paused;
        gameplayController.setupGame(playerImg,alienImg,settings);
    }

    return {
        init: init
    };
}

var spaceInvaders;

window.onload = function() {
    spaceInvaders = new Game();
    spaceInvaders.init();

};