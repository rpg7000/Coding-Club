// graph3D
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// let's graph stuff in 3D!
// also the graph will fit within: -10 < x, y, z, < 10
// note: uses separate 'make3D' function, make sure to download it with this file for personal use
var axes, points, canvas, ctx, camera, polygons, initX, initY, initAngleXZ, initAngleY, mouseHeld;
canvas = document.getElementById("graph");
ctx = canvas.getContext("2d");
mouseHeld = false;

init();

function init() {
    
    camera = {
        camX: 15,
        camY: 5,
        camZ: 30,
        camAngleXZ: 4.249,
        camAngleY: -0.148,
        fovXZ: 0.5,
        fovY: 0.5
    }
    axes = [
        {
            onScreen: false,
            color: '#444444',
            vertices: [
                {
                    coords: [-10, 0, 0],
                    screenCoords: [0, 0]
                },
                {
                    coords: [10, 0, 0],
                    screenCoords: [0, 0]
                }
            ]
        },
        {
            onScreen: false,
            color: '#444444',
            vertices: [
                {
                    coords: [0, -10, 0],
                    screenCoords: [0, 0]
                },
                {
                    coords: [0, 10, 0],
                    screenCoords: [0, 0]
                }
            ]
        },
        {
            onScreen: false,
            color: '#444444',
            vertices: [
                {
                    coords: [0, 0, -10],
                    screenCoords: [0, 0]
                },
                {
                    coords: [0, 0, 10],
                    screenCoords: [0, 0]
                }
            ]
        }
    ];
    
}

function makePolyArr() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    polygons = [];
    points = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
    
    var a = parseFloat(document.getElementById("a").value);
    var b = parseFloat(document.getElementById("b").value);
    
    for (var i = -10; i <= 10; i++) {
        
        for (var j = -10; j <= 10; j++) {
            
            points[i + 10][j + 10] = (a * Math.pow(i, 2)) + (b * Math.pow(j, 2));
            
        }
        
    }
    
    // finding the absolute max value of the graph to figure out how much to stretch / squish the graph
    var absMax = points[0][0];
    if (Math.abs(points[20][0]) > absMax) {absMax = Math.abs(points[20][0]);}
    if (Math.abs(points[20][20]) > absMax) {absMax = Math.abs(points[20][20]);}
    if (Math.abs(points[0][20]) > absMax) {absMax = Math.abs(points[0][20]);}
    if (Math.abs(points[0][10]) > absMax) {absMax = Math.abs(points[0][10]);}
    if (Math.abs(points[10][0]) > absMax) {absMax = Math.abs(points[10][0]);}
    if (Math.abs(points[10][20]) > absMax) {absMax = Math.abs(points[10][20]);}
    if (Math.abs(points[20][10]) > absMax) {absMax = Math.abs(points[20][10]);}
    
    // this multiplier makes sure that the whole graph will fit on the screen
    var multiplier = 10 / absMax;
    var red, blue;
    
    for (var i = 0; i < 20; i++) {
        
        for (var j = 0; j < 20; j++) {
            
            red = (i * 12).toString(16);
            if (red.length < 2) {red = '0' + red;}
            blue = (j * 12).toString(16);
            if (blue.length < 2) {blue = '0' + blue;}
            
            polygons.push({
                
                onScreen: false,
                color: '#' + red + '00' + blue,
                vertices: [
                    {
                        coords: [i - 10, points[i][j] * multiplier, j - 10],
                        screenCoords: [0, 0]
                    },
                    {
                        coords: [i - 9, points[i + 1][j] * multiplier, j - 10],
                        screenCoords: [0, 0]
                    },
                    {
                        coords: [i - 9, points[i + 1][j + 1] * multiplier, j - 9],
                        screenCoords: [0, 0]
                    },
                    {
                        coords: [i - 10, points[i][j + 1] * multiplier, j - 9],
                        screenCoords: [0, 0]
                    }
                ]
                
            });
            
        }
        
    }
    
    make3D(camera, axes, canvas);
    make3D(camera, polygons, canvas);
}

canvas.onmousedown = function(e) {
    
    if (polygons.length > 0) {
        
        initX = e.screenX;
        initY = e.screenY;
        initAngleXZ = camera.camAngleXZ;
        initAngleY = camera.camAngleY;
        mouseHeld = true;
        
    }
    
}

document.onmousemove = function(e) {
    
    if (mouseHeld) {
        
        // change camera angles
        camera.camAngleXZ = initAngleXZ - (e.screenX - initX) * 0.01;
        if (camera.camAngleXZ >= Math.PI * 2 || camera.camAngleXZ < 0) {camera.camAngleXZ = (camera.camAngleXZ % (Math.PI * 2));}
        camera.camAngleY = initAngleY - (e.screenY - initY) * 0.01;
        if (camera.camAngleY >= Math.PI * 2 || camera.camAngleY < 0) {camera.camAngleY = (camera.camAngleY % (Math.PI * 2));}
        
        // change camera position (camera should always be on sphere radius 33.541, center at (0, 0))
        camera.camX = (-33.541 * Math.cos(camera.camAngleY)) * Math.cos(camera.camAngleXZ);
        camera.camZ = (-33.541 * Math.cos(camera.camAngleY)) * Math.sin(camera.camAngleXZ);
        camera.camY = -33.541 * Math.sin(camera.camAngleY);
        
        // render
        make3D(camera, axes, canvas);
        make3D(camera, polygons, canvas);
        
    }
    
}

document.onmouseup = function() {
    
    mouseHeld = false;
    
}