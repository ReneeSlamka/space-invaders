
function GameController() {

    var NUM_ALIENS = 3;
    var MOVE_LEFT_KEY_CODE = 37;
    var MOVE_RIGHT_KEY_CODE = 39;
    var P_WIDTH = 50;
    var P_HEIGHT = 50;
    var BG_COLOUR = "#000000";


    var characterFactory;
    var viewController;
    var playerImg;
    var alienImg;

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
        //viewController.drawImg(playerImg,400,400,50,50);
        for (var i = 0; i < NUM_ALIENS; i++) {
            var tempX = listAliens[i].getXCoord();
            var tempY = listAliens[i].getYCoord();
            viewController.drawImg(alienImg,tempX,tempY,70,48);
        }

        //add key listeners for player controls
        document.addEventListener("keydown", movePlayer, false);
    }

    function movePlayer(e) {
        var keyCode = e.keyCode;
        var xCoord = player.getXCoord();
        var yCoord = player.getYCoord();

        viewController.eraseImg(BG_COLOUR,xCoord,yCoord,playerImg.width, playerImg.height);

        if (keyCode == MOVE_LEFT_KEY_CODE) {
            xCoord-=10;
        } else if (keyCode == MOVE_RIGHT_KEY_CODE) {
            xCoord+=10;
        } else {
            //do nothing?
        }

        player.setXCoord(xCoord, viewController.getCanvasWidth());
        viewController.drawImg(playerImg,xCoord,player.getYCoord(),P_WIDTH,P_HEIGHT);
    }

    function moveAliens() {

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
    spaceInvaders = new GameController();
    spaceInvaders.init();
    //player.drawSprite(playerImg, canvasController, player.getXCoord(), player.getYCoord());
    //canvasController.drawImage(alienImg, 200, 200);
    //canvasController.drawImage(playerImg, 100,100,50,50);
};





