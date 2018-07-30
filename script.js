// this is the script of the website

var posX, velX, accX, grav;
grav = 0.25
newGame();

// initial canvas stuff
var canvas = document.getElementById('graph');
var ctx = canvas.getContext('2d');
for (var i = -50; i <= 50; i++) {
	ctx.fillRect(i + 50, 75 - (Math.pow(i / 50, 2) * 25), 1, 1);
}

setInterval('move', 1000/30);

function move() {
    // every 30th of a second movement will be calculated
    
    // first we undisplay the previous block
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(posX + 48, 65 - (Math.pow(posX / 50, 2) / 2 * 25), 5, 5);
    
    // calculate new position
    slopeAngle = Math.atan(posX / 50);
    accX = grav * Math.sin(slopeAngle);
    velX += accX;
    posX += velX;
    if (posX > 50) {posX -= 100;}
    if (posX < -50) {posX += 100;}
    
    // draw new box
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(posX + 49, 66 - (Math.pow(posX / 50, 2) / 2 * 25), 3, 3);
}

function newGame() {
	posX = -40;
	velX = 0;
	accX = 0;
}
