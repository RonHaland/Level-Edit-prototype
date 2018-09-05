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
    remove(x-16,y-16);
    level.player = {'x':x,'y':y};
    drawAll();
}

function createGoal(x,y) {
    remove(x,y);
    remove(x-16,y-16);
    level.goal = {'x':x,'y':y};
    drawAll();
}

function createTp(x,y) {
    remove(x,y);
    remove(x-16,y-16);
    level.specials.push({'x':x,'y':y,'type':'teleporter',id:Math.floor(level.specials.length/2)});
    selectSingle(x-16,y-16);
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
    if (level.player.x-16 == x && level.player.y-16 == y){
        level.player = {};
    }
    if (ibetween(x,level.goal.x-47,level.goal.x+31) && ibetween(y,level.goal.y-47,level.goal.y+31)){
        level.goal = {};
    }
}

// check if p is between min and max
function between(p, min, max) {
    if (p>min && p<max) {return true}
    else if (p>max && p<min) {return true}
    else return false
}

//check if p is between or equal to min and/or max
function ibetween(p, min, max) {
    if (p>=min && p<=max) {return true}
    else if (p>=max && p<=min) {return true}
    else return false
}

function updateName() {
    level.name = document.getElementById("levelName").value
}

function updateStars(id) {
    level.req[id] = Number(document.getElementById("level"+id+"star").value);
}

function updateId(x,y) {
    var foundSpecials = level.specials.filter(e => e.x == x && e.y == y);
    foundSpecials.forEach(function(e){
        if (e.type === "teleporter") {
            var ind = level.specials.indexOf(e);
            level.specials[ind].id = Number(document.getElementById(''+e.x+','+e.y).value);
            drawAll();
        }
    });
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
        context.fillStyle = "#5fa"
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
    } else if (placeItem.value === "select") {
        var x1,x2,y1,y2,w,h,bx,by;
        if (!mouseLeftPressed) {
            x1=gridPos.x;x2=gridPos.x+grid.x;
            y1=gridPos.y;y2=gridPos.y+grid.y;
            h=grid.y;w=grid.x;
        } else {
            bx = 0; by = 0;
            if (gridPos.x<selectStart.x){bx=grid.x}
            if (gridPos.y<selectStart.y){by=grid.y}
            x1=selectStart.x+bx;x2=gridPos.x+grid.x-bx;
            y1=selectStart.y+by;y2=gridPos.y+grid.y-by;
            h=gridPos.y+grid.y-selectStart.y-2*by*(gridPos.y<selectStart.y);
            w=gridPos.x+grid.x-selectStart.x-2*bx*(gridPos.x<selectStart.x);
            selectEnd = {x:gridPos.x+grid.x-bx, y:gridPos.y+grid.y-by};

        }
        context.strokeStyle = "#00F"
        context.fillStyle = "#55c"
        context.globalAlpha = 0.2;
        context.fillRect(x1, y1, w, h);
        context.globalAlpha = 0.6;
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x1,y2);
        context.lineTo(x2,y2);
        context.lineTo(x2,y1);
        context.lineTo(x1,y1);
        context.stroke();
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
            var r = Math.floor(10+e.id*2.33*Math.PI)%16;
            var g = Math.floor(2+e.id*Math.PI*Math.PI)%16;
            var b = Math.floor(2+e.id*13.88945*Math.PI)%16;
            context.fillStyle = "#"+r.toString(16)+g.toString(16)+b.toString(16)
            context.fill();
        }
    });

}

function selectSingle(x,y) {
    deselect();
    var foundWalls = level.walls.filter(e => e.x == x && e.y == y)
    var foundSpecials = level.specials.filter(e => e.x-16 == x && e.y-16 == y)
    var selectedHtmlDiv = document.getElementById('selected');
    if (foundWalls.length > 0){
        foundWalls.forEach(function(e){
            console.log('wall')
            console.log(e);
        })
    }
    if (foundSpecials.length > 0){
        foundSpecials.forEach(function(e){
            if (e.type === "teleporter") {
                selectedHtmlDiv.innerHTML = '<label>Teleporter ID: <input id="'+e.x+','+e.y+'" onchange="updateId('+e.x+','+e.y+')" type="number" min="0" max="49" value="'+e.id+'" /></label>'
            }
        })
    }
    if (level.player.x-16 == x && level.player.y-16 == y){
        console.log('player')
        console.log(level.player);
    }
    if (ibetween(x,level.goal.x-47,level.goal.x+31) && ibetween(y,level.goal.y-47,level.goal.y+31)){
        console.log('goal')
        console.log(level.goal);
    }
}

function selectMultiple(x1,y1,x2,y2) {
    deselect();
    var foundWalls = level.walls.filter(e => ibetween(e.x, x1,x2) && ibetween(e.y, y1,y2));
    var foundSpecials = level.specials.filter(e => ibetween(e.x-16, x1,x2) && ibetween(e.y-16, y1,y2));
    var selectedObjects = [];
    if (foundWalls.length > 0){
        foundWalls.forEach(function(e){
            console.log('+1');
            selectedObjects.push(e);
        })
    }
    if (foundSpecials.length > 0){
        foundSpecials.forEach(function(e){
            selectedObjects.push(e);
        })
    }
    if (ibetween(level.player.x-16, x1,x2) && ibetween(level.player.y-16, y1,y2)){
        selectedObjects.push(level.player);
    }
    if (ibetween(level.goal.x,x1,x2) && ibetween(level.goal.x,x1,x2)){
        selectedObjects.push(level.goal);
    }
}

function deselect(){
    var selectedHtmlDiv = document.getElementById('selected');
    selectedHtmlDiv.innerHTML = '';
}
