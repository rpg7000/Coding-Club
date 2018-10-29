// make3D 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// this function takes in arguments and outputs to a canvas a 3D rendering of what was given

/* 
takes 3 arguments:
    camera, which is an object that includes camX, camY, camZ, camAngleXZ, camAngleY, fovXZ, and fovY
    polyArr, which is the array of polygons
    htmlElem, which is the HTML canvas element that will be drawn to
*/
function make3D(camera, polyArr, htmlElem) {
    
    var ctx = htmlElem.getContext("2d");
    
    for (var i = 0; i < polyArr.length; i++) {
        
        // if color is specified, use that color
        if (polyArr[i].hasOwnProperty('color')) {
            
            ctx.strokeStyle = polyArr[i].color;
            
        } else {
            
            ctx.strokeStyle = '#000000';
            
        }
        
        // first we calculate screen coordinates
        polyArr[i].onScreen = false;
        
        for (var j = 0; j < polyArr[i].vertices.length; j++) {
            
            var currentCoords = polyArr[i].vertices[j].coords;
            
            // checking for the sign of the displacement from current position to the vertex accounts for the range of the arctan function
            // this need not be done for camY. if the domain was inappropriate, the object would be behind the player, and therefore offscreen
            if (currentCoords[0] - camera.camX > 0) {
                
                var angleXZ = camera.camAngleXZ - Math.atan((currentCoords[2] - camera.camZ) / (currentCoords[0] - camera.camX));
                
            } else {
                
                var angleXZ = camera.camAngleXZ - Math.atan((currentCoords[2] - camera.camZ) / (currentCoords[0] - camera.camX)) + Math.PI;
                
            }
            if (angleXZ > Math.PI) {
                
                angleXZ -= (Math.PI * 2);
                
            } else if (angleXZ < -1 * Math.PI) {
                
                angleXZ += (Math.PI * 2);
                
            }
            polyArr[i].vertices[j].screenCoords[0] = angleXZ * (htmlElem.width / (camera.fovXZ * 2)) + (htmlElem.width / 2);
            
            var angleY = Math.atan((currentCoords[1] - camera.camY) / Math.sqrt(Math.pow(currentCoords[0] - camera.camX, 2) + Math.pow(currentCoords[2] - camera.camZ, 2))) - camera.camAngleY;
            if (angleY > Math.PI) {
                
                angleY -= (Math.PI * 2);
                
            }
            polyArr[i].vertices[j].screenCoords[1] = htmlElem.height - ((angleY % (Math.PI * 2)) * (htmlElem.height / (camera.fovY * 2)) + (htmlElem.height / 2));
            
            if ((Math.abs(angleXZ) <= (camera.fovXZ)) && (Math.abs(angleY) <= (camera.fovY))) {
                
                polyArr[i].onScreen = true;
                
            }
        
        }
        
        // then display the polygon if the polygon is on screen
        if (polyArr[i].onScreen === true) {
            
            for (var j = 0; j < polyArr[i].vertices.length; j++) {
                
                var currentCoords = polyArr[i].vertices[j].screenCoords;
                
                ctx.beginPath();
                ctx.moveTo(currentCoords[0], currentCoords[1]);
                
                if (j === polyArr[i].vertices.length - 1) {
                    
                    ctx.lineTo(polyArr[i].vertices[0].screenCoords[0], polyArr[i].vertices[0].screenCoords[1]);
                    
                } else {
                    
                    ctx.lineTo(polyArr[i].vertices[j + 1].screenCoords[0], polyArr[i].vertices[j + 1].screenCoords[1]);
                    
                }
                
                ctx.stroke();
                
            }
            
        }
        
    }
    
}

/*
example usage:

nodeArr = [
    {
        onScreen: false,
        center: [400, 400],
        vertices: [
            {
                coords: [500, 0, 400],
                screenCoords: [0, 0],
            },
            {
                coords: [300, 100, 400],
                screenCoords: [0, 0],
            },
            {
                coords: [400, 200, 500],
                screenCoords: [0, 0],
            }
        ]
    },
    {
        onScreen: false,
        center: [50, 50],
        vertices: [
            {
                coords: [0, 0, 0],
                screenCoords: [0, 0]
            },
            {
                coords: [0, 0, 100],
                screenCoords: [0, 0]
            },
            {
                coords: [100, 100, 0],
                screenCoords: [0, 0]
            },
            {
                coords: [100, 100, -100],
                screenCoords: [0, 0]
            }
        ]
    }
];

playerCam = {
    camX: -50,
    camY: 100,
    camZ: -50,
    camAngleXZ: Math.PI / 4,
    camAngleY: 0,
    fovXZ: Math.PI / 3,
    fovY: Math.PI / 3
};

canvas = document.getElementById("testcanvas");

make3D(playerCam, nodeArr, canvas);
*/
