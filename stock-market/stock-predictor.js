// Stock Predictor
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Let's predict some stocks!

var data, dateArr, stockArr, dayNum, money, stocks, open, high, low, close, playingGame;
var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");

// XMLHttp
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function newStock() {
    
    if (document.getElementById("API-key").value !== 'key') {
        
        document.getElementById("input-api").style.display = 'none';
    
        var stock = stockArr[Math.floor(Math.random() * stockArr.length)];
        
        var request = new XMLHttpRequest();
        
        request.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stock + '&apikey=' + document.getElementById("API-key").value, true);
        
        request.onload = function() {
            
            if (request.status >= 200 && request.status < 400) {
                
                data = JSON.parse(this.response);
                // Object.keys(obj) returns an array (in reverse order) of each property of obj
                dateArr = Object.keys(data['Time Series (Daily)']);
                
                // DOM Work
                document.getElementById("btn-step").disabled = false;
                document.getElementById("UI").style.display = '';
                document.getElementById("btn-start").disabled = true;
                document.getElementById("stock-used").textContent = 'Stock Used: ' + stock;
                
                init();
                
            } else {
                
                console.log('SORRY NOTHING');
                
            }
            
        };
        
        request.send();
        
    } else {
        
        alert('Please input API key.');
        
    }
    
}

function init() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dayNum = 4;
    money = 10000;
    stocks = 0;
    playingGame = true;
    document.getElementById("final").style.display = 'none';
    step();
    
}

// main function
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function step() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    // determining how large the graph must be
    var max = parseFloat(data['Time Series (Daily)'][dateArr[99]]['2. high']);
    var min = parseFloat(data['Time Series (Daily)'][dateArr[99]]['3. low']);
    
    for (var j = 1; j <= dayNum; j++) {
        
        if (parseFloat(data['Time Series (Daily)'][dateArr[99 - j]]['2. high']) > max) {
            
            max = parseFloat(data['Time Series (Daily)'][dateArr[99 - j]]['2. high']);
            
        }
        
        if (parseFloat(data['Time Series (Daily)'][dateArr[99 - j]]['3. low']) < min) {
            
            min = parseFloat(data['Time Series (Daily)'][dateArr[99 - j]]['3. low']);
            
        }
        
    }
    
    // Getting everything displayed
    ctx.strokeStyle = '#888888';
    for (var j = 0; j <= dayNum; j++) {
        
        // getting relevant values for the current day
        open = parseFloat(data['Time Series (Daily)'][dateArr[99 - j]]['1. open']);
        high = parseFloat(data['Time Series (Daily)'][dateArr[99 - j]]['2. high']);
        low = parseFloat(data['Time Series (Daily)'][dateArr[99 - j]]['3. low']);
        close = parseFloat(data['Time Series (Daily)'][dateArr[99 - j]]['4. close']);
        
        // calculating totals for current day
        document.getElementById("funds").textContent = 'Funds: $' + (Math.floor(money * 100) / 100) + ' | Stocks: ' + stocks + ' | Stock Value: ' + (Math.floor(stocks * close * 100) / 100);
        
        // drawing japanese candlestick style stock graph
        if (open < close) {
            
            ctx.fillStyle = "#11EE11";
            ctx.fillRect((j * canvas.width / (dayNum + 1)), canvas.height - ((close - min) * (canvas.height / (max - min))), canvas.width / (dayNum + 1), (close - open) * (canvas.height / (max - min)));
            
        } else if (close < open) {
            
            ctx.fillStyle = "#EE1111";
            ctx.fillRect((j * canvas.width / (dayNum + 1)), canvas.height - ((open - min) * (canvas.height / (max - min))), canvas.width / (dayNum + 1), (open - close) * (canvas.height / (max - min)));
            
        }
        ctx.moveTo((j * canvas.width / (dayNum + 1)) + (canvas.width / (2 * (dayNum + 1))), canvas.height - (high - min) * (canvas.height / (max - min)));
        ctx.lineTo((j * canvas.width / (dayNum + 1)) + (canvas.width / (2 * (dayNum + 1))), canvas.height - (low - min) * (canvas.height / (max - min)));
        ctx.stroke();
        
    }
    
    // drawing in graph axes
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#AAAAAA';
    for (var i = 0; i < 4; i++) {
        
        ctx.moveTo(0, i * canvas.height / 4);
        ctx.lineTo(canvas.width, i * canvas.height / 4);
        ctx.fillText((Math.floor(100 * (max + (i / 4) * (min - max))) / 100).toString(), 0, 10 + i * (canvas.height) / 4);
        
    }
    ctx.stroke();
    ctx.fillText((Math.floor(100 * min) / 100).toString(), 0, canvas.height);
    
    // incrementing day value and checking if the user has finished
    dayNum++
    if (dayNum === 100) {
        
        // turning off game
        document.getElementById("btn-start").disabled = false;
        document.getElementById("btn-step").disabled = true;
        playingGame = false;
        
        // displaying final stats
        var endTot = money + (stocks * close);
        document.getElementById("final").innerHTML = 'Final Stats: <br>Ending Total: $' + (Math.floor(100 * endTot) / 100) + 
            '<br>Percent Change: ' +  '<span style="color: ' + (endTot > 10000 ? 'green' : 'red') + ';">' + (Math.floor(((endTot - 10000) / 10000 * 100 * 1000)) / 1000) + '%</span><br>' + 
            (endTot > 10000 ? 'Great job!' : 'Better luck next time!');
        document.getElementById("final").style.display = '';
        
    }
    
}

function buy(amount) {
    
    if (playingGame && amount > 0) {
        
        if (money >= (close * amount)) {
            
            stocks += amount;
            money -= (close * amount);
            document.getElementById("funds").textContent = 'Funds: $' + (Math.floor(money * 100) / 100) + ' | Stocks: ' + stocks + ' | Stock Value: ' + (Math.floor(stocks * close * 100) / 100);
            
        } else {
            
            alert('Not enough money.');
            
        }
        
    } 
    
}

function sell(amount) {
    
    if (playingGame && amount > 0) {
        
        if (stocks > 0) {
            
            stocks -= amount;
            money += (close * amount);
            document.getElementById("funds").textContent = 'Funds: $' + (Math.floor(money * 100) / 100) + ' | Stocks: ' + stocks + ' | Stock Value: ' + (Math.floor(stocks * close * 100) / 100);
            
        } else {
            
            alert('Not enough stocks.');
            
        }
        
    }
    
}

stockArr = ["VNET", "AKAM", "ANF", "BIDU", "BCOR", "WIFI", "CARB", "JRJC", "CCIH", "CCOI", "CXDO", "ENV", "FB", "GDDY", "IAC", "IIJI", "JCOM", "LLNW", "MOMO", "NTES", "EGOV", "SIFY", "SINA", "TCTZF", "TCEHY", "TCX", "XNET", "YAHOY", "YNDX", "TWTR", "AAPL", "MSFT", "RCA", "GLD", "GOOG", "BAC", "ABT", "XOM", "AMZN", "ALL", "AMD", "AET", "CELG", "MMM", "LUV", "ABBV", "IBM", "INTC", "ADBE", "AVP", "AXP", "AEE", "APD", "ACB", "AZO", "AGN", "AVY", "AAN", "MRO", "ACN", "ARW", "AAC", "WMT", "ADM", "AYI", "TXN", "TGT", "ADSK", "ATU", "AKS", "AEM", "WHR", "SBUX", "AHC", "ABX", "CSCO", "ALTR"];

// for testing new batches of stocks
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
var i = 29;
test();
var testIntervals = setInterval(test, 20000);

function test() {
    
    var stock = stockArr[i];
    
    var request = new XMLHttpRequest();
    
    request.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stock + '&apikey=WMH5EOMQB15Z7COE', true);
    
    request.onload = function() {
        
        console.log(request.status);
        
        if (request.status >= 200 && request.status < 400) {
            
            var data = JSON.parse(this.response);
            
            if (data["Time Series (Daily)"]["2018-11-02"]["4. close"] < 3) {
                
                console.log(stock + ' is too small.');
                console.log(data["Time Series (Daily)"]["2018-11-02"]["4. close"] + ' is its closing value.');
                
            } else {
                
                document.getElementById("stock-used").textContent += (stock + ' ' + i + ' | ');
                
            }
            
        } else {
            
            console.log('SORRY NOTHING');
            
        }
        
    }
    
    request.send();
    
    i++
    if (i >= stockArr.length) {
    
        clearInterval(testIntervals);
    
    }
    
}
*/
