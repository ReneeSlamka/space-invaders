/*
 * Helper object that implements a type hierarchy, defines the
 * different game objects, and provides constructor functions
 * for the said objects.
 */
function ObjectFactory() {

    //Todo: figure out better way to share this enum
    var Direction = {left: "left", right: "right", up: "up", down: "down"};

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

    GameObject.prototype.setX = function(x,canvasWidth) {
        var outOfXBound = false;
        if (x >= 0 && x <= canvasWidth - this.width) {
            this.x = x;
        } else {
            outOfXBound = true;
        }
        return outOfXBound;
    };

    GameObject.prototype.setY = function(y,canvasHeight) {
        var outOfYBound = false;
        if (y > 0 && y < canvasHeight) {
            this.y = y;
        } else {
            outOfYBound = true;
        }
        return outOfYBound;
    };

    GameObject.prototype.move = function(distance,direction,canvasWidth,canvasHeight) {
        var tempX = this.x;
        var tempY = this.y;
        if (direction === Direction.left) {
            tempX -= distance;
        } else if (direction === Direction.right) {
            tempX += distance;
        } else if (direction === Direction.up) {
            tempY -= distance;
        } else if (direction === Direction.down) {
            tempY += distance;
        }
        var outOfXBound = this.setX(tempX,canvasWidth);
        var outOfYBound = this.setY(tempY,canvasHeight);

        return (outOfXBound || outOfYBound);
    };

    var Bullet = function(x,y,width,height, direction) {
        GameObject.call(this, x, y, width, height);
        this.direction = direction;
    };

    Bullet.prototype = new GameObject();
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.setY = function(y,canvasHeight) {
        //Ensure bullet can be drawn leaving the screen
        var outOfYBound = false;
        if (y >= 0 - this.height && y <= canvasHeight + this.height) {
            this.y = y;
        } else {
            outOfYBound = true;
        }
        return outOfYBound;
    };

    Bullet.prototype.getDirection = function () {
        return this.direction;
    };

    //The basic game character class, parent to Alien and Player
    var Sprite = function(lives,x,y,width,height,img) {
        GameObject.call(this,x,y,width,height);
        this.lives = lives;
        this.img = img;
        this.alive = true;
    };

    Sprite.prototype = new GameObject();
    Sprite.prototype.constructor = Sprite;

    Sprite.prototype.getImg = function() {
        return this.img
    };

    Sprite.prototype.hit = function() {
        if (this.lives > 0) {
            this.lives--;
        }
        if (this.lives === 0) {
            this.alive = false;
        }
    };

    Sprite.prototype.isAlive = function() {
        return this.alive;
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
        var bullet = new Bullet(bulletX,bulletY,bulletWidth,bulletHeight, Direction.up);
        listBullets.push(bullet);
    };

    Player.prototype.getLives = function () {
        return this.lives;
    };

    var Alien = function(lives,x,y,width,height,img) {
        Sprite.call(this,lives,x,y,width,height,img);
        this.points = 10;
        this.isLeftmost = false;
        this.isRightmost = false;
    };

    Alien.prototype = new Sprite();
    Alien.prototype.constructor = Alien;

    Alien.prototype.setIsLeftmost = function() {
        this.isLeftmost = true;
    };

    Alien.prototype.setIsRightmost = function() {
        this.isRightmost = true;
    };

    Alien.prototype.getIsLeftmost = function () {
        return this.isLeftmost;
    };

    Alien.prototype.getIsRightmost = function () {
        return this.isRightmost;
    };

    Alien.prototype.getPoints = function() {
        return this.points;
    };

    Alien.prototype.shoot = function(listBullets,bulletWidth, bulletHeight) {
        var bulletX = this.getX() + this.getWidth()/2 - bulletWidth/2; //ensure bullet centered
        var bulletY = this.getY() + this.height; //ensure no overlap of alien image
        var bullet = new Bullet(bulletX,bulletY,bulletWidth,bulletHeight, Direction.down);
        listBullets.push(bullet);
    };

    var Shield = function(lives,x,y,width,height,img) {
        Sprite.call(this,lives,x,y,width,height,img);
    };

    Shield.prototype = new Sprite();
    Shield.prototype.constructor = Shield;

    return {
        player: Player,
        alien: Alien,
        shield: Shield,
        bullet: Bullet
    };

}