
function GameController() {

    var NUM_ALIENS = 3;
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
        viewController.drawImg(playerImg,player.getXCoord(),player.getYCoord(),50,50);
        //viewController.drawImg(playerImg,400,400,50,50);
        for (var i = 0; i < NUM_ALIENS; i++) {
            var tempX = listAliens[i].getXCoord();
            var tempY = listAliens[i].getYCoord();
            viewController.drawImg(alienImg,tempX,tempY,30,30);
        }

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





