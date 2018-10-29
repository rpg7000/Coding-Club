// spring simulator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var posX, velX, accX, mass, isAttached, coefFrict, springConst, timer, multiplier;
var canvas = document.getElementById("drawing");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = "#BBBBBB";
ctx.fillRect(0, 210, 401, 191);
ctx.fillRect(0, 0, 10, 190);
for (var i = 1; i < 40; i++) {
    
    ctx.clearRect(i * 10, 211, 1, 8);
    
}

document.getElementById("btn-start").addEventListener("click", start);

function move() {
    
    ctx.clearRect(10, 0, 400, 210);
    ctx.clearRect(0, 190, 10, 20);
    
    // checking if it has made contact with a spring, and whether to detach from the spring
    if (posX > 35) {isAttached = true;}
    if (posX < 35 && document.getElementById("attach").checked == false && isAttached == true) {isAttached = false;}
    
    // friction and spring acceleration
    accX = 0
    if (velX > 0) {accX = -9.8 * coefFrict;}
    if (velX < 0) {accX = 9.8 * coefFrict;}
    if (isAttached) {
        
        // we need many conditions to account for how multiplier will affect acceleration
        if ((velX > 0 && posX > 35) || (velX <= 0 && posX < 35)) {accX += (-(springConst * (posX - 35)) / mass) * multiplier;}
        if ((velX <= 0 && posX > 35) || (velX > 0 && posX < 35)) {accX += (-(springConst * (posX - 35)) / mass) / multiplier;}
        
    }
    
    // stop if it hits the wall, and otherwise increment the position and velocity with 60fps in mind
    posX += velX / 60;
    velX += accX / 60;
    
    // if it hits the right wall, stop it from going further, and stop it if its speed is too low and not spring (friction)
    if (posX > 40) {posX = 40; velX = 0;}
    if ((Math.abs(velX) <= 9.8 * coefFrict / 60) && isAttached == false) {velX = 0;}
    
    // drawing the block
    ctx.fillRect(posX * 10, 190, -20, 20);
    
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
    
    /*
        NOTE: Because of the method used to calculate motion (riemann sums) there is some error in movement calculation.
        The multiplier variable accounts for this error in calculation, and is best optimized for Spring constant = mass * 100
        I couldn't find a line of best fit that would accurately describe every ratio of springConst and mass.
        Even if I would have found a line of best fit, it wouldn't work for every case, but this solution fixes most scenarios within reason.
    */
    multiplier = 1.127698522455 + ((springConst / mass) * 0.00170413510245);
    
    timer = setInterval(move, 1000/60);
    
}
