

function SpriteFactory() {

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

    Sprite.prototype.setXCoord = function(xCoord, canvasWidth) {
        if (xCoord > 0 && xCoord < canvasWidth ) {
            this.xCoord = xCoord;
        } else {
            //Remove this later
            //alert("X Coordinate is invalid");
        }
    };

    Sprite.prototype.setYCoord = function(yCoord, canvasHeight) {
        if (yCoord > 0 && yCoord < CANVAS_HEIGHT) {
            this.yCoord = yCoord;
        } else {
            //Remove this later
            alert("Y Coordinate is invalid");
        }
    };

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