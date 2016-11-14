
function ViewController() {
    var CANVAS_WIDTH = 600;
    var CANVAS_HEIGHT = 600;
    var canvas;
    var canvasController;

    function getCanvasHeight() {
        return CANVAS_HEIGHT;
    }

    function getCanvasWidth() {
        return CANVAS_WIDTH;
    }

    (function initCanvasController(canvas) {
        canvas = document.getElementById("game-canvas");
        canvas.height = CANVAS_HEIGHT;
        canvas.width = CANVAS_WIDTH;
        canvasController = canvas.getContext("2d");
    })();

    function drawImage(img,x,y,width,height) {
        canvasController.drawImage(img,x,y,width,height);
    }

    function drawBullet(bulletColor,x,y,width,height) {
        canvasController.fillStyle = bulletColor;
        canvasController.fillRect(x,y,width,height);
    }

    function eraseImage(bgColour,x,y,width,height) {
        canvasController.fillStyle = bgColour;
        canvasController.fillRect(x,y,width,height);
    }

    return {
        //initCanvasController: initCanvasController,
        getCanvasHeight: getCanvasHeight,
        getCanvasWidth: getCanvasWidth,
        drawImg: drawImage,
        drawBullet: drawBullet,
        eraseImg: eraseImage
    };
}
