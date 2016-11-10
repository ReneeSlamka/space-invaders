

function spriteFactory() {

    var Sprite = function(lives, xCoord, yCoord, dieFunc) {
        this.lives = lives;
        this.xCoord = xCoord;
        this.yCoord = yCoord;

        this.spriteHit = function() {
            if (this.lives > 0) {
                lives --;
            } else {
                //call die func for this sprite
            }
        }
    };

    Sprite.prototype.getXCoord = function() {
        return this.xCoord;
    };

    Sprite.prototype.getYCoord = function() {
        return this.yCoord;
    };

    Sprite.prototype.setXCoord = function(xCoord) {
        if (xCoord > 0 && xCoord < CANVAS_WIDTH ) {
            this.xCoord = xCoord;
        } else {
            alert("X Coordinate is invalid");
        }
    };

    Sprite.prototype.setYCoord = function(yCoord) {
        if (yCoord > 0 && yCoord < CANVAS_HEIGHT) {
            this.yCoord = yCoord;
        } else {
            alert("Y Coordinate is invalid");
        }
    };

    /*Sprite.prototype.drawSprite = function(img, canvasController, xCoord, yCoord) {
        canvasController.drawImage(img, xCoord, yCoord, 50, 50);
    };*/

    var Player = function (numLives, xCoord, yCoord) {
        Sprite.call(this, numLives, xCoord, yCoord, null);
    };

    Player.prototype = new Sprite();
    Player.prototype.constructor = Player;


    var Alien = function (numLives, xCoord, yCoord) {
        Sprite.call(this, numLives, xCoord, yCoord, null);
    };

    Alien.prototype = new Sprite();
    Alien.prototype.constructor = Alien;

    return {
        player: Player,
        alien: Alien
    };

}