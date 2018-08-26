// car
//////////////////////////////////////////////////////////////////////////////////////////////////////////

var posX, posY, velX, velY, accX, accY, angle, mapData, mapObj, countDownInterval, timeLeftUntilStart, moveInterval, startTime, endTime, gameState, currentMap, timeArr, totalTime;

var canvas = document.getElementById("track");
var ctxCanvas = canvas.getContext("2d");
var bg = document.getElementById("bg");
var ctxBg = bg.getContext("2d");

var keyArr = ['left', false, 'right', false, 'up', false, 'down', false];

restart();
    
function startCountDown() {
    // this starts a countdown timer before the game starts
    
    gameState = 1;
    
    document.getElementById("btn-start").style.display = "none";
    countDownInterval = setInterval(countDown, 100);
    timeLeftUntilStart = 30;
    
    // resetting font stuff for countdown timer, clearing screen
    ctxBg.font = "20px Arial";
    ctxBg.fillStyle = "#FFFFFF";
    ctxBg.textAlign = "center";
    ctxBg.clearRect(0, 0, 400, 400);
    ctxCanvas.clearRect(0, 0, 400, 400);
    
}

function countDown() {
    // countdown timer increments and displays every 1/10 of a second
        
    ctxBg.clearRect(0, 0, 400, 400);
    ctxBg.fillText((timeLeftUntilStart / 10).toString(), 200, 200);
    if (timeLeftUntilStart === 0) {
        
        start();
        
    } else {
        
        timeLeftUntilStart -= 1;
        
    }
        
}

function start() {
    // begins the race, by resetting variables, setting up the setInterval for move, and loading the correct map
    
    gameState = 2;
    
    clearInterval(countDownInterval);
    loadMap(currentMap);
    moveInterval = setInterval(move, 1000/60);
    isGamePlaying = true;
    startTime = new Date().getTime();
    
}

function move() {
    
    // calculating movement
    if (keyArr[1]) {angle += 0.1;}
    if (keyArr[3]) {angle -= 0.1;}
    
    // deceleration
    if (Math.abs(velX) < 0.1) {velX = 0;}
    if (Math.abs(velY) < 0.1) {velY = 0;}
    accX = -velX / 4;
    accY = -velY / 4;
    
    // acceleration
    if (keyArr[5]) {
        
        accX += 90 * Math.cos(angle);
        accY += 90 * Math.sin(angle);
        
    } else if (keyArr[7]) {
        
        accX += -90 * Math.cos(angle);
        accY += -90 * Math.sin(angle);
        
    }
    
    // changing velocity, accounting for speed cap
    velX += accX / 30;
    velY += accY / 30;
    if (velX > 90) {velX = 90;} else if (velX < -90) {velX = -90;}
    if (velY > 90) {velY = 90;} else if (velY < -90) {velY = -90;}
    
    // updating position
    posX += velX / 30;
    posY += velY / 30;
    
    // collision detection
    for (var i = 0; i < mapData.length; i++) {
        
        wallCollision(mapData[i].x1, mapData[i].y1, mapData[i].x2, mapData[i].y2, mapData[i].xAxis, mapData[i].pushPos)
        
    }
    
    // drawing on canvas
    ctxCanvas.clearRect(0, 0, 400, 400);
    render();
    
    // win condition
    if ((posX >= mapObj[1].x1 && posX <= mapObj[1].x2) && (posY <= mapObj[1].y1 && posY >= mapObj[1].y2)) {
        
        gameState = 3;
        
        // stops movement, and calculates final time elapsed
        clearInterval(moveInterval);
        isGamePlaying = false;
        endTime = new Date().getTime();
        
        // draws final time on the screen
        ctxBg.fillStyle = "#FFFFFF";
        ctxCanvas.strokeStyle = "#FFFFFF";
        ctxBg.font = "20px Arial";
        ctxBg.textAlign = "center";
        
        ctxCanvas.clearRect(120, 180, 160, 30);
        ctxBg.clearRect(120, 180, 160, 30);
        ctxCanvas.rect(120, 180, 160, 30);
        ctxCanvas.stroke();
        ctxBg.fillText('Time: ' + ((endTime - startTime) / 1000).toString(), 200, 200);
        timeArr.push(endTime - startTime);
        
        // loading next map
        if (currentMap < 10) {
            
            currentMap++;
            setTimeout(startCountDown, 3000);
        
        } else {
            
            setTimeout(finish, 3000);
            
        }
        
    }
    
}

function render() {
    
    // box
    ctxCanvas.beginPath();
    ctxCanvas.strokeStyle = "#FFFFFF";
    ctxCanvas.rect(posX - 5, 400 - posY - 5, 10, 10);
    ctxCanvas.stroke();
    
    // red line
    ctxCanvas.beginPath();
    ctxCanvas.strokeStyle = "#11DDFF";
    ctxCanvas.moveTo(posX, 400 - posY);
    ctxCanvas.lineTo(posX + (10 * Math.cos(angle)), 400 - (posY + (10 * Math.sin(angle))));
    ctxCanvas.stroke();
    
}

function loadMap(mapNum) {
    
    // loading in map data from mapdata.json
    switch(mapNum) {
        case 0:
            mapData = JSON.parse(map0);
            mapObj = JSON.parse(map0Obj);
            break;
        case 1:
            mapData = JSON.parse(map1);
            mapObj = JSON.parse(map1Obj);
            break;
        case 2:
            mapData = JSON.parse(map2);
            mapObj = JSON.parse(map2Obj);
            break;
        case 3:
            mapData = JSON.parse(map3);
            mapObj = JSON.parse(map3Obj);
            break;
        case 4:
            mapData = JSON.parse(map4);
            mapObj = JSON.parse(map4Obj);
            break;
        case 5:
            mapData = JSON.parse(map5);
            mapObj = JSON.parse(map5Obj);
            break;
        case 6:
            mapData = JSON.parse(map6);
            mapObj = JSON.parse(map6Obj);
            break;
        case 7:
            mapData = JSON.parse(map7);
            mapObj = JSON.parse(map7Obj);
            break;
        case 8:
            mapData = JSON.parse(map8);
            mapObj = JSON.parse(map8Obj);
            break;
        case 9:
            mapData = JSON.parse(map9);
            mapObj = JSON.parse(map9Obj);
            break;
        case 10:
            mapData = JSON.parse(map10);
            mapObj = JSON.parse(map10Obj);
            break;
        default:
            break;
    }
    
    // drawing the map
    if (mapData.length) {
        
        ctxBg.clearRect(0, 0, 400, 400);
        ctxBg.strokeStyle = "#FFFFFF";
        
        for (var i = 0; i < mapData.length; i++) {
            
            ctxBg.beginPath();
            ctxBg.moveTo(mapData[i].x1, 400 - mapData[i].y1);
            ctxBg.lineTo(mapData[i].x2, 400 - mapData[i].y2);
            ctxBg.stroke();
            
        }
        
        posX = mapObj[0].x;
        posY = mapObj[0].y;
        angle = mapObj[0].angle * Math.PI / 180;
        velX = 0;
        velY = 0;
        accX = 0;
        accY = 0;
        
        ctxBg.fillStyle = "#FF0000";
        ctxBg.fillRect(mapObj[1].x1, 400 - mapObj[1].y1, mapObj[1].width, mapObj[1].height);
        
    }
    
} 

function wallCollision(a, b, c, d, xAxisPush, pushPositive) {
    
    if (xAxisPush) {
        
        if (Math.abs(posX - ((c - a) / (d - b)) * (posY - b) - a) < 5 && ((posY >= b && posY <= d) || (posY <= b && posY >= d))) {
            
            if (pushPositive) {
                
                posX = ((c - a) / (d - b)) * (posY - b) + a + 5;
                velX = 0;
                
            } else {
                
                posX = ((c - a) / (d - b)) * (posY - b) + a - 5;
                velX = 0;
                
            }
            
        }
        
    } else {
        
        if (Math.abs(posY - ((d - b) / (c - a)) * (posX - a) - b) < 5 && ((posX >= a && posX <= c) || (posX <= a && posX >= c))) {
            
            if (pushPositive) {
                
                posY = ((d - b) / (c - a)) * (posX - a) + b + 5;
                velY = 0;
                
            } else {
                
                posY = ((d - b) / (c - a)) * (posX - a) + b - 5;
                velY = 0;
                
            }
            
        }
        
    }
    
}

document.onkeydown = function(e) {
    
    switch (e.keyCode) {
            
        case 37:
            keyArr[1] = true;
            break;
        case 39:
            keyArr[3] = true;
            break;
        case 38:
            keyArr[5] = true;
            break;
        case 40:
            keyArr[7] = true;
            break;
            
    }
    
};

document.onkeyup = function(e) {
    
    switch (e.keyCode) {
            
        case 37:
            keyArr[1] = false;
            break;
        case 39:
            keyArr[3] = false;
            break;
        case 38:
            keyArr[5] = false;
            break;
        case 40:
            keyArr[7] = false;
            break;
            
    }
    
};

function finish() {
    // for when you've done every track
            
    ctxCanvas.clearRect(0, 0, 400, 400);
    ctxBg.clearRect(0, 0, 400, 400);
    
    // displaying final times
    ctxCanvas.fillStyle = "#FFFFFF";
    ctxCanvas.font = "30px Arial";
    ctxCanvas.fillText('Final Times:', 10, 30);
    ctxCanvas.fillText('Total Time:', 200, 350);
    
    totalTime = 0;
    for (var i = 0; i < timeArr.length; i++) {
        
        totalTime += timeArr[i];
        
    }
    ctxCanvas.fillText((totalTime / 1000).toString(), 200, 380);
    
    ctxCanvas.font = "15px Arial";
    for (var i = 0; i < timeArr.length; i++) {
        
        ctxCanvas.fillText('Course ' + (i + 1) + ': ' + (timeArr[i] / 1000), 10, 60 + 20 * i);
        
    }
    
    // displaying replay button
    document.getElementById("btn-restart").style.display = "";
    
}

function restart() {
    
    // gameState = 0=> before anything happens, 1=> in countdown, 2=> during play, 3=> after finishing
    gameState = 0;
    currentMap = 1;
    timeArr = [];
    document.getElementById("btn-start").style.display = "";
    document.getElementById("btn-restart").style.display = "none";
    
    ctxCanvas.clearRect(0, 0, 400, 400);
    
}