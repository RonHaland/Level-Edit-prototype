const grid = {x:32,y:32};
var mousePos, gridPos;
var level = {'walls':[],'specials':[],'player':{},'goal':{},'name':'',"req":{"1":4000,"2":3000,"3":2000}};
var selectStart = {x:0,y:0};
var selectEnd = {x:0,y:0};
var context, canvas, placeItem, mouseLeftPressed, mouseRightPressed;

window.onload = function() {
    canvas = document.getElementById('level');
    context = canvas.getContext('2d');
    placeItem = document.getElementById('placeItem');

    drawAll();

    canvas.addEventListener('mousemove', function(e) {
        mousePos = getMousePos(canvas, e);
        gridPos = {
            x: Math.floor((mousePos.x)/grid.x)*grid.x,
            y: Math.floor((mousePos.y)/grid.y)*grid.y
        }
        drawCursorObject();
    });

    canvas.addEventListener('mousedown', function(e) {
        if (e.button == 0){
            mouseLeftPressed = true;
            if (placeItem.value === "wall"){
                createWall(gridPos.x,gridPos.y);
            } else if (placeItem.value === "player"){
                createPlayer(gridPos.x+16,gridPos.y+16);
            } else if (placeItem.value === "goal"){
                createGoal(gridPos.x,gridPos.y);
            } else if (placeItem.value === "tp"){
                createTp(gridPos.x+16,gridPos.y+16);
            } else if (placeItem.value === "select"){
                selectStart = {x: gridPos.x, y:gridPos.y};
            }
        }
        else if (e.button == 2){
            mouseRightPressed = true;
            remove(gridPos.x,gridPos.y);
        }
    });

    window.addEventListener('mouseup', function(e) {
        if (e.button == 0){
            mouseLeftPressed = false;
            if (placeItem.value === "select"){
                if (selectStart.x == gridPos.x && selectStart.y == gridPos.y){
                    selectSingle(gridPos.x, gridPos.y);
                } else {
                    selectMultiple(selectStart.x, selectStart.y, selectEnd.x-1, selectEnd.y-1);
                }
            }
        } else if (e.button == 2) {
            mouseRightPressed = false;
        }
    });

    window.addEventListener("keydown", function (e) {
        if (e.defaultPrevented) {
            return;
        }
        var key = (e.key || e.keyCode)
        switch(key ) {
            case '1':
                placeItem.value = 'wall';
                break;
            case '2':
                placeItem.value = 'player';
                break;
            case '3':
                placeItem.value = 'goal';
                break;
            case '4':
                placeItem.value = 'tp';
                break;
            case '0':
                placeItem.value = 'select';
                break;
        }
        if (key <= '9' && key >= '0'){
            drawCursorObject();
        }
    });

}
