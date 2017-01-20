/*
 * "Master" object that contains all properties of the game and
 * manages button functions and timers. The only object that is made created
 * in the global scope.
 */
function Game() {
    //default values for settings
    var settings = {
        bgColour: "#000000",
        bulletColour: "#ffffff",
        numPlayerLives: 3,
        numAlienLives: 1,
        numShieldLives: 3,
        numAlienRows: 3,
        numAlienColumns: 6,
        numShields: 3,
        playerWidth: 50,
        playerHeight: 50,
        alienWidth: 55,
        alienHeight: 40,
        shieldWidth: 70,
        shieldHeight: 30,
        bulletWidth: 6,
        bulletHeight: 10,
        alienShootMode: "group"
    };
    var gameState;
    var gameplayController;
    var alienMovementTimer, bulletMovementTimer, alienShootTimer;
    var playerImg, alienImg, shieldImg;


    function init() {
        //get sprite images
        playerImg = document.getElementById("player-img");
        alienImg = document.getElementById("alien-img");
        shieldImg = document.getElementById("shield-img");


        //create game controller and setup the game
        gameplayController = GameplayController();
        gameplayController.setupGame(playerImg,alienImg,shieldImg,settings);
        gameState = gameplayController.State.paused;

        //add key listener for player controls
        document.addEventListener("keydown", keyPress, false);

        //add start, stop and reset functions to their respective buttons
        var playButton = document.getElementById("play-button");
        playButton.addEventListener("click",play);
        var stopButton = document.getElementById("stop-button");
        stopButton.addEventListener("click",stop);
        var resetButton = document.getElementById("reset-button");
        resetButton.addEventListener("click",reset);

        //init "change image" buttons
        var alienImgButton = document.getElementById("alien-img-button");
        alienImgButton.addEventListener("click", changeImg("alien-img-input", "alien-img"));
        var playerImgButton = document.getElementById("player-img-button");
        playerImgButton.addEventListener("click", changeImg("player-img-input", "player-img"));
        var shieldImgButton = document.getElementById("shield-img-button");
        shieldImgButton.addEventListener("click", changeImg("shield-img-input", "shield-img"));
    }

    function keyPress(e) {
        if (gameState === gameplayController.State.playing) {
            gameplayController.controlPlayer(e);
        }
    }

    function stop() {
        if (gameState != gameplayController.State.paused) {
            clearInterval(alienMovementTimer);
            clearInterval(bulletMovementTimer);
            clearInterval(alienShootTimer);
            gameState = gameplayController.State.paused;
        }
    }

    function play() {
        //start timers for bullet movement, alien movement and alien shooting
        if (gameState != gameplayController.State.playing) {
            alienMovementTimer = setInterval(gameplayController.moveAliens,1200);
            alienShootTimer = setInterval(gameplayController.groupAlienShoot, 5000);
            bulletMovementTimer = setInterval(function(){
                gameplayController.moveBullets();
                gameState = gameplayController.checkWinLoseStatus();
                if(gameState === gameplayController.State.won) {
                    stop();
                    gameplayController.win();
                } else if (gameState === gameplayController.State.lost) {
                    stop();
                    gameplayController.lose();
                }
            },10);
            gameState = gameplayController.State.playing;
        }
    }

    function reset() {
        stop();
        gameplayController.setupGame(playerImg,alienImg,shieldImg,settings);
    }

    function changeImg(inputId, imgId) {
        return function() {
            var newImgUrl = document.getElementById(inputId).value;
            if (newImgUrl && newImgUrl.length > 0) {
                document.getElementById(imgId).src = newImgUrl;
                playerImg = document.getElementById("player-img");
                alienImg = document.getElementById("alien-img");
                shieldImg = document.getElementById("shield-img");
                setTimeout(reset, 100);
            }
        };
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