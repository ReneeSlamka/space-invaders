function Game() {

    var State = {paused: "paused", playing: "playing", won: "won", lost: "lost"};
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

        //create game components
        characterFactory = ObjectFactory();
        viewController = ViewController();
        gameplayController = GameplayController();
        //setup the game
        gameplayController.setupGame(viewController,characterFactory,playerImg,alienImg,settings);

        //add key listener for player controls
        document.addEventListener("keydown", keyPress, false);

        //add start function to start button
        var startButton = document.getElementById("start-button");
        startButton.addEventListener("click",start);
        //add pause function to pause button
        var pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click",pause);
        //add restart button
        var restartButton = document.getElementById("restart-button");
        restartButton.addEventListener("click",reset);

        gameState = State.paused;
    }

    function keyPress(e) {
        if (gameState === State.playing) {
            gameplayController.controlPlayer(e);
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
            alienMovementTimer = setInterval(gameplayController.moveAliens,1200);
            bulletMovementTimer = setInterval(gameplayController.moveBullets,10);
            alienShootTimer = setInterval(gameplayController.groupAlienShoot, 5000);
            gameState = State.playing;
        }
    }

    function reset() {
        //stop timers
        clearInterval(alienMovementTimer);
        clearInterval(bulletMovementTimer);
        clearInterval(alienShootTimer);
        gameState = State.paused;
        //erase entire canvas
        var canvasWidth = viewController.getCanvasWidth();
        var canvasHeight = viewController.getCanvasHeight();
        viewController.eraseImg(settings.bgColour,0,0,canvasWidth,canvasHeight);

        gameplayController.setupGame(viewController,characterFactory,playerImg,alienImg,settings);
        //init();
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