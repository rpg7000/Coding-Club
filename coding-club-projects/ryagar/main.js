        var gameBoard = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        var score = 0;
        var scoreElement = document.getElementById('score-text');

        randomSpawn(gameBoard);
        randomSpawn(gameBoard);
        drawBoard(gameBoard);
        document.onkeyup = (event) => {
            
            if(!(event.keyCode > 36 && event.keyCode < 41))
            return;

            slide(event.keyCode, gameBoard);
            try {randomSpawn(gameBoard);}catch(err){alert('You Have lost'); var gameBoard = [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]]; var score = 0; var scoreElement = document.getElementById('score-text'); randomSpawn(gameBoard); randomSpawn(gameBoard); drawBoard(gameBoard);}
            drawBoard(gameBoard);
        };
        function randomSpawn(board) {

            var emptySpaces = [];

            for(var i = 0; i < 16; i++) {

                var box = board[Math.floor(i / 4)][i % 4];
                if(box == 0)
                    emptySpaces.push(i);

            }

            var randIndex = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
            board[Math.floor(randIndex / 4)][randIndex % 4] = (Math.floor(Math.random() * 100) > 50)? 2 : 4;
            
        }

        function slide(dir, board) {

            for(var j = 0; j < 3; j++) {

                if(dir == 39 || dir == 40) {
                    for(var i = 2; i >= 0; i--) {
                        score += step(i, dir, board);
                    }
                } else {
                    for(var i = 1; i <= 3; i++) {
                        score += step(i, dir, board);
                    }
                }
            }

            
            
            scoreElement.textContent = score;

        }

        function step(ind, dir, board) {

            var newScore = 0;

            switch(dir) {

                case 39:
                    // console.log("right");
                    board.map(row => {
                        
                        if(row[ind] == row[ind + 1] || row[ind + 1] == 0) {
                            if(row[ind] == row[ind + 1])
                                newScore += 2 * row[ind + 1];
                            row[ind + 1] += row[ind];
                            row[ind] = 0;
                            
                        }

                    });
                    
                    break;

                case 38:
                    // console.log("up");

                    board[ind].map((box, col) => {

                        if(board[ind - 1][col] == 0 || board[ind - 1][col] == box) {
                            if(board[ind - 1][col] == box)
                                newScore += 2 * board[ind - 1][col];
                            board[ind - 1][col] += box;
                            board[ind][col] = 0;
                        }

                    });

                    break;

                case 37:
                    // console.log("left");

                    board.map(row => {
                        
                        if(row[ind] == row[ind - 1] || row[ind - 1] == 0) {
                            if(row[ind] == row[ind - 1])
                                newScore += 2 * row[ind - 1];
                            row[ind - 1] += row[ind];
                            row[ind] = 0;
                        }

                    });

                    break;

                case 40:
                    // console.log("down");

                    board[ind].map((box, col) => {

                        if(board[ind + 1][col] == 0 || board[ind + 1][col] == box) {
                            if(board[ind + 1][col] == box)
                                newScore += 2 * board[ind + 1][col];
                            board[ind + 1][col] += box;
                            board[ind][col] = 0;
                        }

                    });

                    break;
            }

            return newScore;
        }

        function drawBoard(board) {

            var boardElement = document.getElementById('game-board');
            boardElement.innerHTML = "";

            board.map(row => {

                var rowElement = document.createElement('tr');

                row.map(box => {
                    var boxElement = document.createElement('td');
                    boxElement.textContent = (box != 0)? box : "";
                    boxElement.className = "box _" + box;
                    rowElement.appendChild(boxElement);
                });

                boardElement.appendChild(rowElement);

            });

        }
