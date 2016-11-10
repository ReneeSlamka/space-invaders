var canvas;
var canvasController;
var playerImg;
var alienImg;
var player;
var characterFactory;


function createCharacters() {
    var playerInitX = CANVAS_WIDTH/2 - playerImg.width/2;
    var playerInitY = CANVAS_HEIGHT - playerImg.height;
    characterFactory = spriteFactory();
    //player = new Player(3, playerInitX, playerInitY);
    player = new characterFactory.player(3, playerInitX, playerInitY);

}


function init() {
    canvas = document.getElementById("game-canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvasController = canvas.getContext("2d");
    playerImg = document.getElementById("player-img");
    alienImg = document.getElementById("alien-img");
    alienImg.width = 40;
    alienImg.height = 40;



    createCharacters();
    //drawCharacters();

    //start motion
}

/*function drawCharacters() {
    player.drawSprite(playerImg, canvasController, player.x, player.y);
}*/


window.onload = function() {
    init();
    player.drawSprite(playerImg, canvasController, player.getXCoord(), player.getYCoord());
    //canvasController.drawImage(alienImg, 200, 200);
    //canvasController.drawImage(playerImg, 100,100,50,50);
};





