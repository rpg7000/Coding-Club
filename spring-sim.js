var posX, velX, accX, mass, isAttached, coefFrict, springConst, timer, onScreen;
var canvas = document.getElementById("drawing");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = "#BBBBBB";
ctx.fillRect(0, 210, 401, 191);
ctx.fillRect(0, 0, 10, 190);
for (var i = 1; i < 40; i++) {
 
    ctx.clearRect(i * 10, 211, 1, 8);
    
}

/*
    In this model, 10 pixels represent one meter. All measurements are given in meters, meters/second, etc.
    isAttached represents whether the spring and the block are attached. The spring is most stable at posX = 35m.
    mass, posX, velX, and accX are all self-explanatory. posX is the right side of the block
    
    coefFrict represents the coefficient of friction of the floor.
    
    Though the spring returning to its original position could be modeled after launching the block, this will not
    be incorporated.
*/

document.getElementById("btn-start").addEventListener("click", start);

function move() {
    
    ctx.clearRect(10, 0, 400, 210);
    ctx.clearRect(0, 190, 10, 20);
    
    // checking if it has made contact with a spring
    if (posX >= 35) {isAttached = true;}
    if (posX <= 35) {isAttached = false;}
    
    // friction and spring acceleration
    /* for friction, F = μN
    N = m * 9.8, so F = μ * m * 9.8
    acceleration of friction = F / m = (μ * m * 9.8) / m = μ * 9.8 */
    /* for springs, F = -KX
    acceleration of spring = F / m = -KX / m */
    accX = 0
    if (velX > 0) {accX = -9.8 * coefFrict;}
    if (velX < 0) {accX = 9.8 * coefFrict;}
    if (isAttached) {
        
        accX += -(springConst * (posX - 35)) / mass;
        
    }
    
    // stop if it hits the wall, and otherwise increment the position and velocity with 60fps in mind
    posX += velX / 60;
    velX += accX / 60;
    
    // if it hits the right wall, stop it from going further, and stop it if its speed is too low (friction)
    if (posX > 40) {posX = 40; velX = 0;}
    if (Math.abs(velX) <= 9.8 * coefFrict / 60) {velX = 0;}
    if (posX < 0) {onScreen = false;}
    
    // drawing the block
    if (onScreen) {ctx.fillRect(posX * 10, 190, -20, 20);}
    
    // drawing the spring
    if (isAttached) {
        
        var increment = (400 - posX * 10) / 5;
        for (var i = 0; i < 6; i++) {
            
            ctx.beginPath();
            ctx.moveTo(Math.floor(posX * 10 + (i * increment)), 190);
            ctx.lineTo(Math.floor(posX * 10 + (i * increment)), 210);
            ctx.stroke();
            
        }
        
    } else {
        
        var increment = 10;
        for (var i = 0; i < 6; i++) {
            
            ctx.beginPath();
            ctx.moveTo(Math.floor(350 + (i * increment)), 190);
            ctx.lineTo(Math.floor(350 + (i * increment)), 210);
            ctx.stroke();
            
        }
        
    }
    
    // updating screen values
    document.getElementById("output-pos").textContent = Math.round(posX * 1000) / 1000 + ' m';
    document.getElementById("output-vel").textContent = Math.round(velX * 1000) / 1000 + ' m/s';
    document.getElementById("output-acc").textContent = Math.round(accX * 1000) / 1000 + ' m/s²';
    
}

function start() {
    
    clearInterval(timer);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 10, 190);
    ctx.fillStyle = "#1111DD";
    
    posX = 4;
    isAttached = false;
    onScreen = true;
    velX = parseFloat(document.getElementById("input-vel").value);
    mass = parseFloat(document.getElementById("input-mass").value);
    coefFrict = parseFloat(document.getElementById("input-coeff").value);
    springConst = parseFloat(document.getElementById("input-const").value);
    
    timer = setInterval(move, 1000/60);
    
}