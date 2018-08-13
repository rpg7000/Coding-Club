// slope simulator
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var posX, velX, accX, grav;

// initial canvas defining
var bg = document.getElementById('bg');
var bgCtx = bg.getContext('2d');
var graph = document.getElementById('graph');
var graphCtx = graph.getContext('2d');

// drawing background (graph of 0.5x^2, from -1 to 1)
for (var i = -100; i <= 100; i++) {
    bgCtx.fillRect(i + 100, 150 - Math.pow(i / 100, 2) / 2 * 100, 1, 1);   
}
newGame();

setInterval(move, 1000/30);

function move() {
	// every 30th of a second movement will be calculated
	
    // we first undisplay the previous block
	graphCtx.clearRect(posX * 100 + 95, 145 - (Math.pow(posX, 2) / 2 * 100), 11, 11);
	
	// calculate new position
    /*
        Small innaccuracy: Normally gravity is split into a perpendicular and tangential component, but the tangential component is used as
        movement along the x-axis, and y is calculated from our position along the x-axis, in this program.
    */
	slopeAngle = Math.atan(posX);
	accX = -grav * Math.sin(slopeAngle);
	velX += accX / 30;
	posX += velX / 30;
	if (posX > 1) {posX -= 2;}
	if (posX < -1) {posX += 2;}
	
	// draw new box
	graphCtx.fillRect(posX * 100 + 96, 146 - (Math.pow(posX, 2) / 2 * 100), 9, 9);
}

function newGame() {
    posX = -0.8;
    velX = 0;
    accX = 0;
    grav = 8;
    graphCtx.fillStyle = '#FF0000';
}
