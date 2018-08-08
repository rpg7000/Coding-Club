var posX, velX, accX, grav;
grav = -0.25
newGame();

// initial canvas stuff
var canvas = document.getElementById('graph');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000';

setInterval(move, 1000/30);

function move() {
	// every 30th of a second movement will be calculated
	
    // we first undisplay the previous block
	ctx.clearRect(posX + 47, 72 - (Math.pow(posX / 50, 2) / 2 * 50), 7, 7);
	
	// calculate new position
    	/* when looking at acceleration on a slope, gravity is split into a perpendicular and tangential component, 
	the latter of which dictates the acceleration along the slope. */
	slopeAngle = Math.atan(posX / 50);
	accX = grav * Math.sin(slopeAngle);
	velX += accX;
	posX += velX;
	if (posX > 50) {posX -= 100;}
	if (posX < -50) {posX += 100;}
	
	// draw new box
	ctx.fillRect(posX + 48, 73 - (Math.pow(posX / 50, 2) / 2 * 50), 5, 5);
}

function newGame() {
	posX = -40;
	velX = 0;
	accX = 0;
}
