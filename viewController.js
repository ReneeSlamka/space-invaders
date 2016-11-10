
function ViewController() {
    var characterFactory;
    var CANVAS_WIDTH = 800;
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
        //maybe force init call here?
        //other canvasController may be undefined
        canvasController.drawImage(img,x,y,width,height);
    }

    return {
        //initCanvasController: initCanvasController,
        getCanvasHeight: getCanvasHeight,
        getCanvasWidth: getCanvasWidth,
        drawImg: drawImage
    };
}
