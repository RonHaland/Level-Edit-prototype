const grid = {x:32,y:32};
var mousePos, gridPos;
var level = {'walls':[],'specials':[],'player':{},'goal':{},'name':'',"req":{"1":4000,"2":3000,"3":2000}};
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
            console.log(123)
            drawCursorObject();
        }
    });
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function createWall(x,y) {
    if (level.walls.filter(e => e.x == x && e.y == y).length > 0){
        return
    } else {
        remove(x,y);
        level.walls.push({'x':x,'y':y});
        drawAll();
    }
}

function createPlayer(x,y) {
    remove(x,y);
    level.player = {'x':x,'y':y};
    drawAll();
}

function createGoal(x,y) {
    remove(x,y);
    level.goal = {'x':x,'y':y};
    drawAll();
}

function createTp(x,y) {
    remove(x,y);
    level.specials.push({'x':x,'y':y,'type':'teleporter'});
    drawAll();
}

function remove(x,y) {
    var foundWalls = level.walls.filter(e => e.x == x && e.y == y)
    var foundSpecials = level.specials.filter(e => e.x-16 == x && e.y-16 == y)
    if (foundWalls.length > 0){
        foundWalls.forEach(function(e){
            var ind = level.walls.indexOf(e);
            level.walls.splice(ind,1);
            drawAll();
        })
    }
    if (foundSpecials.length > 0){
        foundSpecials.forEach(function(e){
            var ind = level.specials.indexOf(e);
            level.specials.splice(ind,1);
            drawAll();
        })
    }
    if (level.player.x == x && level.player.y == y){
        level.player = {};
    }
    if (ibetween(x,level.goal.x-47,level.goal.x+31) && ibetween(y,level.goal.y-47,level.goal.y+31)){
        level.goal = {};
    }
}
// check if p is between min and max
function between(p, min, max) {
    if (p>min && p<max) {return true}
    else return false
}

//check if p is between or equal to min and/or max
function ibetween(p, min, max) {
    if (p>=min && p<=max) {return true}
    else return false
}

function updateName() {
    level.name = document.getElementById("levelName").value
}

function updateStars(id) {
    level.req[id] = Number(document.getElementById("level"+id+"star").value);
}

function drawCursorObject() {
    drawAll();
    context.fillStyle = '#aaa';
    context.globalAlpha = 0.5;

    if (mouseRightPressed) {
        remove(gridPos.x,gridPos.y);
        context.fillStyle = '#F66'
        context.fillRect(gridPos.x, gridPos.y,grid.x,grid.y);
    } else if (placeItem.value === "wall"){
        context.fillRect(gridPos.x, gridPos.y,grid.x,grid.y);
        if (mouseLeftPressed){
            createWall(gridPos.x,gridPos.y);
        }
    } else if (placeItem.value === "player") {
        context.beginPath();
        context.arc(gridPos.x+16,gridPos.y+16,8,0,2*Math.PI);
        context.fillStyle = "#5aF"
        context.fill();
    } else if (placeItem.value === "goal") {
        context.beginPath();
        context.arc(Math.max(gridPos.x,32),Math.max(gridPos.y,32),32,0,2*Math.PI);
        context.fillStyle = "#5aF"
        context.fill();
    } else if (placeItem.value === "tp") {
        context.beginPath();
        context.arc(gridPos.x+16,gridPos.y+16,16,0,2*Math.PI);
        context.fillStyle = "#F55"
        context.fill();
    }
    context.globalAlpha = 1;

}

function drawGrid() {
    context.globalAlpha = .35;
    for (var i = 0; i<canvas.height; i+=grid.y){
        x1=0;x2=canvas.width;
        y1=i;y2=i;
        context.strokeStyle = "#000";
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.stroke();
    }
    for (var i = 0; i<canvas.width; i+=grid.x){
        y1=0;y2=canvas.height;
        x1=i;x2=i;
        context.strokeStyle = "#000";
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.stroke();
    }
    context.globalAlpha = 1;
}

function drawAll() {
    context.globalAlpha = 1;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    context.fillStyle='#aaa';
    level.walls.forEach(function(e) {
        context.fillRect(e.x,e.y,grid.x,grid.y);
    });
    if ('x' in level.player && 'y' in level.player) {
        context.beginPath();
        context.arc(level.player.x,level.player.y,8,0,2*Math.PI);
        context.fillStyle = "#5A5"
        context.fill();
    }
    if ('x' in level.goal && 'y' in level.goal) {
        context.beginPath();
        context.arc(level.goal.x,level.goal.y,32,0,2*Math.PI);
        context.fillStyle = "#5AF"
        context.fill();
    }
    level.specials.forEach(function(e){
        if (e.type == 'teleporter'){
            context.beginPath();
            context.arc(e.x,e.y,16,0,2*Math.PI);
            context.fillStyle = "#A55"
            context.fill();
        }
    });

}
