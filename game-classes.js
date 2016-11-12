

function SpriteFactory() {

    //The basic super class that all other object inherit from
    var GameObject = function (xCoord, yCoord) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    };

    GameObject.prototype.getXCoord = function() {
        return this.xCoord;
    };

    GameObject.prototype.getYCoord = function() {
        return this.yCoord;
    };

    GameObject.prototype.setXCoord = function(xCoord, canvasWidth, imgWidth) {
        if (xCoord >= 0 && xCoord <= canvasWidth - imgWidth) {
            this.xCoord = xCoord;
            return true;
        } else {
            //Remove this later
            //alert("X Coordinate is invalid");
            return false;
        }
    };

    GameObject.prototype.setYCoord = function(yCoord, canvasHeight) {
        if (yCoord > 0 && yCoord < canvasHeight) {
            this.yCoord = yCoord;
        } else {
            //Remove this later
            alert("Y Coordinate is invalid");
        }
    };

    var Bullet = function(xCoord, yCoord, width, length) {
        GameObject.call(this, xCoord, yCoord);
        this.width = width;
        this.height = length;
    };

    Bullet.prototype = new GameObject();
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.setYCoord = function(yCoord,canvasHeight) {
        //Ensure bullet can be drawn leaving the screen
        if (yCoord >= 0 - this.height && yCoord < canvasHeight) {
            this.yCoord = yCoord;
        } else {
            //Remove this later
            alert("Y Coordinate is invalid");
        }
    };

    //The basic game character class, parent to Alien and Player
    var Sprite = function(lives, xCoord, yCoord, dieFunc) {
        GameObject.call(this, xCoord, yCoord);
        this.lives = lives;
        this.spriteHit = function() {
            if (this.lives > 0) {
                lives --;
            } else {
                //call die func for this sprite
            }
        }
    };

    Sprite.prototype = new GameObject();
    Sprite.prototype.constructor = Sprite;

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
        alien: Alien,
        bullet: Bullet
    };

}