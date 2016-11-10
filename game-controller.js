
function gameController() {
    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 600;
    var NUM_ALIENS = 3;

    var canvas;
    var canvasController;
    var playerImg;
    var alienImg;
    var characterFactory;
    var player;
    var listAliens = [];

    function initSprites()  {
        playerImg = document.getElementById("player-img");
        alienImg = document.getElementById("alien-img");
        var playerInitX = CANVAS_WIDTH/2 - playerImg.width/2;
        var playerInitY = CANVAS_HEIGHT - playerImg.height;
        characterFactory = spriteFactory();
        player = new characterFactory.player(3, playerInitX, playerInitY);

        for (var i = 0; i < NUM_ALIENS; i++) {
            var tempAlien = new characterFactory.alien(1,(200+i*150),100);
            listAliens.push(tempAlien);
        }
    }

    function initDisplay() {
        canvas = document.getElementById("game-canvas");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvasController = canvas.getContext("2d");
        //player.drawSprite(playerImg, canvasController, player.getXCoord(), player.getYCoord());
        canvasController.drawImage(playerImg,player.getXCoord(),player.getYCoord(),50,50);

        for (var i = 0; i < NUM_ALIENS; i++) {
            var tempX = listAliens[i].getXCoord();
            var tempY = listAliens[i].getYCoord();
            canvasController.drawImage(alienImg,tempX,tempY,30,30);
        }
    }

    function init() {
        initSprites();
        initDisplay();
    }

    function play() {}

    function pause() {}

    function restart() {}

    return {
        init: init,
        play: play,
        pause: pause,
        restart: restart
    };
}

var spaceInvaders;

window.onload = function() {
    spaceInvaders = new gameController();
    spaceInvaders.init();
    //player.drawSprite(playerImg, canvasController, player.getXCoord(), player.getYCoord());
    //canvasController.drawImage(alienImg, 200, 200);
    //canvasController.drawImage(playerImg, 100,100,50,50);
};





