// this is the script of the website

var canvas = document.getElementById('graph');
var ctx = canvas.getContext('2d');

for (var i = -50; i <= 50; i++) {
	ctx.fillRect(i + 50, 75 - (Math.pow(i / 50, 2) * 25), 1, 1);
}

console.log('Task complete.');
