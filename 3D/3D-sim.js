var frame, camX, camY, camZ, camAngle, triangleArr;

var keyArr = [false, 'W', false, 'A', false, 'S', false, 'D', false, 'left', false, 'right'];
var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");
var mapCanv = document.getElementById("map");
var ctxMap = mapCanv.getContext("2d");

init();
setInterval(advanceFrame, 1000/30);

function advanceFrame() {
    
    frame++;
    
    // rotating stuff
    for (var i = 0; i < triangleArr.length; i++) {
        
        if (triangleArr[i][0].rotate === true) {
            
            for (var j = 1; j < 4; j++) {
                
                var currentProps = triangleArr[i][0];
                var currentPoint = triangleArr[i][j];
                
                triangleArr[i][j].angle += currentProps.rotAngle;
                triangleArr[i][j].coords[0] = currentProps.rotateAxis[0] + currentPoint.radius * Math.cos(currentPoint.angle * Math.PI / 180);
                triangleArr[i][j].coords[2] = currentProps.rotateAxis[1] + currentPoint.radius * Math.sin(currentPoint.angle * Math.PI / 180);
                
            }
            
        }
        
    }
    
    // moving character
    if (keyArr[0]) {
        
        camX += 10 * Math.cos(camAngle * Math.PI / 180);
        camZ += 10 * Math.sin(camAngle * Math.PI / 180);
        
    }
    if (keyArr[2]) {
        
        camX -= 10 * Math.sin(camAngle * Math.PI / 180);
        camZ += 10 * Math.cos(camAngle * Math.PI / 180);
        
    }
    if (keyArr[4]) {
        
        camX -= 10 * Math.cos(camAngle * Math.PI / 180);
        camZ -= 10 * Math.sin(camAngle * Math.PI / 180);
        
    }
    if (keyArr[6]) {
        
        camX += 10 * Math.sin(camAngle * Math.PI / 180);
        camZ -= 10 * Math.cos(camAngle * Math.PI / 180);
        
    }
    if (keyArr[8]) {
        
        camAngle += 3;
        if (camAngle >= 360) {
            
            camAngle -= 360;
            
        }
        
    }
    if (keyArr[10]) {
        
        camAngle -= 3;
        if (camAngle < 0) {
            
            camAngle += 360;
            
        }
        
    }
    
    render();
    
}

function render() {
    
    ctx.clearRect(0, 0, 400, 400);
    ctxMap.clearRect(0, 0, 200, 200);
    
    for (var i = 0; i < triangleArr.length; i++) {
        
        // first we calculate screen coordinates
        triangleArr[i][0].onScreen = false;
        
        for (var j = 1; j < 4; j++) {
            
            var currentCoords = triangleArr[i][j].coords;
            
            if (currentCoords[0] - camX > 0) {
                
                var angleXZ = camAngle * (Math.PI / 180) - Math.atan((currentCoords[2] - camZ) / (currentCoords[0] - camX));
                
            } else {
                
                var angleXZ = camAngle * (Math.PI / 180) - Math.atan((currentCoords[2] - camZ) / (currentCoords[0] - camX)) + Math.PI;
                
            }
            if (angleXZ > Math.PI) {
                
                angleXZ -= (Math.PI * 2);
                
            }
            triangleArr[i][j].screenCoords[0] = angleXZ * (180 / Math.PI) * (400 / 120) + 200;
            
            var angleY = Math.atan((currentCoords[1] - camY) / Math.sqrt(Math.pow(currentCoords[0] - camX, 2) + Math.pow(currentCoords[2] - camZ, 2)));
            if (angleY > Math.PI) {
                
                angleY -= (Math.PI * 2);
                
            }
            triangleArr[i][j].screenCoords[1] = 400 - ((angleY % (Math.PI * 2)) * (180 / Math.PI) * (400 / 120) + 200);
            
            if ((Math.abs(angleXZ) <= (Math.PI / 3)) && (Math.abs(angleY) <= (Math.PI / 3))) {
                
                triangleArr[i][0].onScreen = true;
                
            }
        
        }
        
        // then display if the polygon is on screen
        if (triangleArr[i][0].onScreen === true) {
            
            for (var j = 1; j < 4; j++) {
                
                var currentCoords = triangleArr[i][j].screenCoords;
                
                ctx.beginPath();
                ctx.moveTo(currentCoords[0], currentCoords[1]);
                
                if (j < 3) {
                    
                    ctx.lineTo(triangleArr[i][j + 1].screenCoords[0], triangleArr[i][j + 1].screenCoords[1]);
                    
                } else {
                    
                    ctx.lineTo(triangleArr[i][1].screenCoords[0], triangleArr[i][1].screenCoords[1]);
                    
                }
                
                ctx.stroke();
                
            }
            
        }
        
    }
    
    // finally, we draw the map
    ctxMap.beginPath();
    ctxMap.strokeStyle = "#FF0000";
    ctxMap.arc(camX / 16 + 50, 100 - (camZ / 16 + 50), 2, 0, Math.PI * 2);
    ctxMap.moveTo(camX / 16 + 50, 100 - (camZ / 16 + 50));
    ctxMap.lineTo(camX / 16 + 50 + (5 * Math.cos(camAngle * Math.PI / 180)), 100 - (camZ / 16 + 50 + (5 * Math.sin(camAngle * Math.PI / 180))));
    ctxMap.stroke();
    
    ctxMap.strokeStyle = "#000000";
    for (var i = 0; i < triangleArr.length; i++) {
        
        ctxMap.beginPath();
        ctxMap.arc(triangleArr[i][0].rotateAxis[0] / 16 + 50, 100 - (triangleArr[i][0].rotateAxis[1] / 16 + 50), 5, 0, Math.PI * 2);
        ctxMap.stroke();
        
    }
    
}

function init() {
    
    triangleArr = [
        [
            {
                rotate: true,
                rotAngle: 3,
                rotateAxis: [400, 400],
                onScreen: false
            },
            {
                coords: [500, 0, 400],
                screenCoords: [0, 0],
                angle: 0,
                radius: 100
            },
            {
                coords: [300, 100, 400],
                screenCoords: [0, 0],
                angle: 180,
                radius: 100
            },
            {
                coords: [400, 200, 500],
                screenCoords: [0, 0],
                angle: 90,
                radius: 100
            }
        ],
        [
            {
                rotate: true,
                rotAngle: 1,
                rotateAxis: [400, -400],
                onScreen: false
            },
            {
                coords: [500, 100, -400],
                screenCoords: [0, 0],
                angle: 0,
                radius: 100
            },
            {
                coords: [600, 200, -400],
                screenCoords: [0, 0],
                angle: 0,
                radius: 200
            },
            {
                coords: [550, 0, -377],
                screenCoords: [0, 0],
                angle: 8.72,
                radius: 151.75
            }
        ],
        [
            {
                rotate: true,
                rotAngle: 2,
                rotateAxis: [300, 100],
                onScreen: false
            },
            {
                coords: [100, 0, 0],
                screenCoords: [0, 0],
                angle: 243.44,
                radius: 223.61
            },
            {
                coords: [100, 100, 100],
                screenCoords: [0, 0],
                angle: 180,
                radius: 200
            },
            {
                coords: [500, 250, 800],
                screenCoords: [0, 0],
                angle: 74.05,
                radius: 728.01
            }
        ],
        [
            {
                rotate: true,
                rotAngle: 1,
                rotateAxis: [-200, -200],
                onScreen: false
            },
            {
                coords: [-100, 100, -200],
                screenCoords: [0, 0],
                angle: 0,
                radius: 100
            },
            {
                coords: [-250, 100, -286.603],
                screenCoords: [0, 0],
                angle: 240,
                radius: 100
            },
            {
                coords: [-250, 100, -113.397],
                screenCoords: [0, 0],
                angle: 120,
                radius: 100
            }
        ],
        [
            {
                rotate: true,
                rotAngle: 1,
                rotateAxis: [-200, -200],
                onScreen: false
            },
            {
                coords: [-100, 100, -200],
                screenCoords: [0, 0],
                angle: 0,
                radius: 100
            },
            {
                coords: [-250, 100, -286.603],
                screenCoords: [0, 0],
                angle: 240,
                radius: 100
            },
            {
                coords: [-200, 241.421, -200],
                screenCoords: [0, 0],
                angle: 0,
                radius: 0
            }
        ],
        [
            {
                rotate: true,
                rotAngle: 1,
                rotateAxis: [-200, -200],
                onScreen: false
            },
            {
                coords: [-100, 100, -200],
                screenCoords: [0, 0],
                angle: 0,
                radius: 100
            },
            {
                coords: [-250, 100, -113.397],
                screenCoords: [0, 0],
                angle: 120,
                radius: 100
            },
            {
                coords: [-200, 241.421, -200],
                screenCoords: [0, 0],
                angle: 0,
                radius: 0
            }
        ],
        [
            {
                rotate: true,
                rotAngle: 1,
                rotateAxis: [-200, -200],
                onScreen: false
            },
            {
                coords: [-250, 100, -286.603],
                screenCoords: [0, 0],
                angle: 240,
                radius: 100
            },
            {
                coords: [-250, 100, -113.397],
                screenCoords: [0, 0],
                angle: 120,
                radius: 100
            },
            {
                coords: [-200, 241.421, -200],
                screenCoords: [0, 0],
                angle: 0,
                radius: 0
            }
        ],
        [
            {
                rotate: false,
                rotateAxis: [-400, 600],
                onScreen: false
            },
            {
                coords: [-500, 100, 500],
                screenCoords: [0, 0],
            },
            {
                coords: [-500, 700, 400],
                screenCoords: [0, 0],
            },
            {
                coords: [-400, 0, 600],
                screenCoords: [0, 0],
            }
        ]
    ];
    
    frame = 0;
    camX = 0;
    camY = 200;
    camZ = 0;
    camAngle = 0
    ctx.clearRect(0, 0, 400, 400);
    
}

document.onkeydown = function(e) {
    
    switch (e.keyCode) {
            
        case 87:
            keyArr[0] = true;
            break;
        case 65:
            keyArr[2] = true;
            break;
        case 83:
            keyArr[4] = true;
            break;
        case 68:
            keyArr[6] = true;
            break;
        case 37:
            keyArr[8] = true;
            break;
        case 39:
            keyArr[10] = true;
            break;
            
    }
    
};

document.onkeyup = function(e) {
    
    switch (e.keyCode) {
            
        case 87:
            keyArr[0] = false;
            break;
        case 65:
            keyArr[2] = false;
            break;
        case 83:
            keyArr[4] = false;
            break;
        case 68:
            keyArr[6] = false;
            break;
        case 37:
            keyArr[8] = false;
            break;
        case 39:
            keyArr[10] = false;
            break;
            
    }
    
};

