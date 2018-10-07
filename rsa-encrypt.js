// RSA Encryption
////////////////////////////////////////////////////////////////////////////////////////////////////
var p, q, n, e, d, totN;

function keyGen() {
    
    p = primeGen(200);
    q = primeGen(200);
    n = p.multiply(q);
    totN = p.subtract("1").multiply(q.subtract("1"));
    
    e = primeGen(5);
    while (totN.mod(e).value === 0) {
        
        e = primeGen(5);
        
    }
    
    d = MMI(totN, e);
    if (d.sign === true) {
        
        console.log("Private Key generation failed. Retrying...")
        console.log(d);
        keyGen();
        
    }
    
    document.getElementById("output").innerHTML = "Output:<br>" +
        "Private Key:<br>d:<br> " + d.toString() + "<br>n:<br> " + n.toString() + "<br><br>" + 
        "Public Key:<br>e:<br> " + e.toString() + "<br>n:<br> " + n.toString();
    
}

function encrypt(e, n) {
    
    var message = bigInt(document.getElementById("message").value.toString()); 
    var cipherNum = modExp(message, e, n);    
    document.getElementById("output").innerHTML = "Output:<br>Ciphertext: " + cipherNum.toString();
    
}

function decrypt(d, n) {
    
    var cipherText = bigInt(document.getElementById("enc-message").value.toString());
    var messageNum = modExp(cipherText, d, n);
    document.getElementById("output").innerHTML = "Output:<br>Message: " + messageNum.toString();
    
}

// generates a prime with a specified number of digits
function primeGen(digits) {
    
    var numStr = Math.floor(Math.random() * 9 + 1).toString();
    
    for (var i = 0; i < (digits - 1); i++) {
        
        numStr += Math.floor(Math.random() * 10).toString();
        
    }
    
    var temp = bigInt(numStr);
    
    while (temp.isProbablePrime(10) === false) { 
        
        temp = temp.add("1");
           
    }
    
    return temp;
    
}

// multiplicative modular inverse generator (number, followed by modulus)
function MMI(a, b) {
    
    var table = [[bigInt(0), a, bigInt(1), bigInt(0)], [bigInt(0), b, bigInt(0), bigInt(1)]];
    while (table[table.length - 1][1] > 0) {
        
        table.push([]);
        table[table.length - 1][0] = table[table.length - 3][1].divide(table[table.length - 2][1]);
        table[table.length - 1][1] = table[table.length - 3][1].mod(table[table.length - 2][1]);
        table[table.length - 1][2] = table[table.length - 3][2].subtract(table[table.length - 2][2].multiply(table[table.length - 1][0]));
        table[table.length - 1][3] = table[table.length - 3][3].subtract(table[table.length - 2][3].multiply(table[table.length - 1][0]));
        
    }
        
    return table[table.length - 2][3];
    
}

// takes the modulo of a number with a very large exponent recursively ((a ^ b) % c)
function modExp(a, b, c) {
    
    if (a.mod(c).value === 0) {
        
        return bigInt(0);
        
    }
    
    var bBin = toBinary(b);
    var modTable = tableGen(a, b, c);
    var prod = bigInt(1);
    
    for (var i = 0; i < bBin.length; i++) {
        
        if (bBin[i] === "1") {
            
            prod = prod.multiply(modTable[modTable.length - 1 - i]);
            
        }
        
    }
    
    return prod.mod(c);
    
}

// takes bigInt and returns that bigInt in binary
function toBinary(x) {
    
    var temp = "";

    for (var i = x.bitLength().value - 1; i >= 0; i--) {
        
        if (x.greaterOrEquals(bigInt(2).pow(i)) === true) {
            
            temp += "1";
            x = x.subtract(bigInt(2).pow(i));
            
        } else {
            
            temp += "0";
            
        }
        
    }
    
    return temp;
    
}

// for some a, b, and c, generates a table that gives (a ^ (2 ^ i)) mod c with enough elements to cover all of toBinary(b) 
function tableGen(a, b, c) {
    
    var temp = [bigInt(1)];
    temp[1] = a.mod(c);
    
    for (var i = 2; i <= b.bitLength().value; i++) {
        
        temp[i] = temp[i - 1].pow(2).mod(c);
        
    }
    
    return temp;
    
}