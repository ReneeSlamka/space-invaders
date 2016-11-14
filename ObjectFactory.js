
function ObjectFactory() {

    //The basic super class that all other object inherit from
    var GameObject = function (x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

    GameObject.prototype.getX = function() {
        return this.x;
    };

    GameObject.prototype.getY = function() {
        return this.y;
    };

    GameObject.prototype.getWidth = function() {
        return this.width;
    };

    GameObject.prototype.getHeight = function() {
        return this.height;
    };

    GameObject.prototype.setX = function(x,canvasWidth,imgWidth) {
        if (x >= 0 && x <= canvasWidth - imgWidth) {
            this.x = x;
        } else {
            console.log(this.toString() + " X coordinate is invalid");
        }
    };

    GameObject.prototype.setY = function(y,canvasHeight) {
        if (y > 0 && y < canvasHeight) {
            this.y = y;
        } else {
            console.log(this.toString() + " Y coordinate is invalid");
        }
    };

    var Bullet = function(x,y,width,height) {
        GameObject.call(this, x, y, width, height);
    };

    Bullet.prototype = new GameObject();
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.setY = function(y,canvasHeight) {
        //Ensure bullet can be drawn leaving the screen
        if (y >= 0 - this.height && y < canvasHeight) {
            this.y = y;
        } else {
            console.log(this.toString() + " Y coordinate is invalid");
        }
    };

    //The basic game character class, parent to Alien and Player
    var Sprite = function(lives,x,y,width,height,img) {
        GameObject.call(this,x,y,width,height);
        this.lives = lives;
        this.img = img;
    };

    Sprite.prototype = new GameObject();
    Sprite.prototype.constructor = Sprite;

    Sprite.prototype.getImg = function() {
        return this.img
    };

    var Player = function (lives,x,y,width,height,img) {
        Sprite.call(this,lives,x,y,width,height,img);
        this.score = 0;
    };

    Player.prototype = new Sprite();
    Player.prototype.constructor = Player;

    Player.prototype.getScore = function() {
        return this.score;
    };

    Player.prototype.changeScore = function(value) {
        this.score += value;
    };

    Player.prototype.shoot = function(listBullets,bulletWidth,bulletHeight) {
        var bulletX = this.getX() + this.getWidth()/2 - bulletWidth/2; //ensure bullet centered
        var bulletY = this.getY() - bulletHeight; //ensure no overlap of player image
        var bullet = new Bullet(bulletX,bulletY,bulletWidth,bulletHeight);
        listBullets.push(bullet);
    };


    var Alien = function(numLives,x,y,width,height,img) {
        Sprite.call(this,numLives,x,y,width,height,img);
        this.points = 10;
    };

    Alien.prototype = new Sprite();
    Alien.prototype.constructor = Alien;

    Alien.prototype.getPoints = function() {
        return this.points;
    };

    Alien.prototype.shoot = function(listBullets,bulletWidth, bulletHeight) {
        var bulletX = this.getX() + this.getWidth()/2 - bulletWidth/2; //ensure bullet centered
        var bulletY = this.getY() + this.height; //ensure no overlap of alien image
        var bullet = new Bullet(bulletX,bulletY,bulletWidth,bulletHeight);
        listBullets.push(bullet);
    };

    return {
        player: Player,
        alien: Alien,
        bullet: Bullet
    };

}