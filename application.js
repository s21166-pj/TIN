document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const secondsLabel = document.getElementById("seconds");
   
    let width;
    let bombAmount;
    let flags;
    let squares;
    let isGameOver;
    let isGameStarted;
    let timeInterval;
    let totalSeconds;
    
    function startGame() {
        width = 10;
        bombAmount = 20;
        flags = 0;
        squares = [];
        isGameOver= false;
        isGameStarted= true;
        totalSeconds = 0;
        secondsLabel.innerHTML = timeViewer(totalSeconds);
        grid.innerHTML = '';
        clearInterval(timeInterval);
        createBoard();
    }

    function setTime() {
        if(!isGameOver) {
            ++totalSeconds;
            secondsLabel.innerHTML = timeViewer(totalSeconds);
        }
    }
    
    function timeViewer(val) {
        let valString = val + "";
        
        if (valString.length < 2) {
          return "00" + valString;
        } else if (valString.length < 3) {
            return "0" + valString;
        } else {
            return valString;
        }
      }
    
    //Creating board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount;

        //Array with number of bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        //Array with number of 'nonBomb' fields called 'valid'
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        //Joint array with bombs and valid fields in order
        const gameArray = emptyArray.concat(bombsArray);
        //Shuffling for randomize effect
        const shuffledArray = gameArray.sort(() => Math.random() -0.5);
    

        //Creating little squares of divs on the map
        //and adding them class name of 'bomb' or 'valid' 
        //on top of the id number
        for(let i=0; i<width*width; i++) {
            const square = document.createElement('div'); 
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            //Normal Click event listener
            square.addEventListener('click', function(e) {
                click(square);
            }) 

            //cntrl and left click
            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }
        
        //Adding numbers to squares
        for (let i = 0; i<squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width-1);

            if (squares[i].classList.contains('valid')) {
                if(i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++;
                if(i > 9 && !isRightEdge && squares[i+1-width].classList.contains('bomb')) total++;
                if(i > 10 && squares[i-width].classList.contains('bomb')) total++;
                if(i > 11 && !isLeftEdge && squares[i-1-width].classList.contains('bomb')) total++;
                if(i < 98 && !isRightEdge && squares[i+1].classList.contains('bomb')) total++;
                if(i < 90 && !isLeftEdge && squares[i-1 +width].classList.contains('bomb')) total++;
                if(i < 88 && !isRightEdge && squares[i+1+width].classList.contains('bomb')) total++;
                if(i < 89 && squares[i+width].classList.contains('bomb')) total++;

                squares[i].setAttribute('data', total);
            }
        }
    }

    //add Flag with right click
    function addFlag(square) {
        if(isGameOver) return;
        if(!square.classList.contains('checked') && (flags < bombAmount)) {
            if(!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombAmount-flags;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = bombAmount-flags;
            }
        }
    }

    //click on square actions
    function click(square) {
        if(isGameStarted) {
            timeInterval = setInterval(setTime, 1000);
            isGameStarted = false;
        }
        let currentId = square.id;
        if(isGameOver) return;
        if(square.classList.contains('checked') || square.classList.contains('flag')) return;
        if(square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if( total !=0) {
                square.classList.add('checked');
                if (total == 1) square.classList.add('one');
                if (total == 2) square.classList.add('two');
                if (total == 3) square.classList.add('three');
                if (total == 4) square.classList.add('four');
                if (total == 5) square.classList.add('five');
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add('checked');
    }


//check neighboring squares once clicked
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width-1);
    
    setTimeout( () => {
        if(currentId >0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) -1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(currentId) +1-width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId >10) {
            const newId = squares[parseInt(currentId) -width].id;
            const newSquare = document.getElementById(newId); 
            click(newSquare);
        }
        if(currentId >11 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) -1-width].id;
            const newSquare = document.getElementById(newId); 
            click(newSquare);
        }
        if(currentId < 98 && !isRightEdge) {
            const newId = squares[parseInt(currentId) +1].id;
            const newSquare = document.getElementById(newId); 
            click(newSquare);
        }
        if(currentId <90 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) -1+width].id;
            const newSquare = document.getElementById(newId); 
            click(newSquare);
        }
        if(currentId <88 && !isRightEdge) {
            const newId = squares[parseInt(currentId) +1+width].id;
            const newSquare = document.getElementById(newId); 
            click(newSquare);
        }
        if(currentId <89) {
            const newId = squares[parseInt(currentId) +width].id;
            const newSquare = document.getElementById(newId); 
            click(newSquare);
        }

    }, 10)
}

//GameOver function
function gameOver(square) {
    console.log('Boom! Game Over!');
    isGameOver = true;
    clearInterval(timeInterval);

    //Show all the bombs
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '💣'
        }
    })
}

//Check for win
function checkForWin() {
    let matches = 0;
    for(let i = 0; i<squares.length; i++) {
        if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++;
        }
        //victory when number of flags ON bombs fields 
        //is equal to general bombs amount
        if(matches === bombAmount) {
            console.log('You Won!');
            isGameOver = true;
        }
    }
}

let startGameButton = document.getElementById('newGame');
startGameButton.addEventListener('click', function(e) {
    startGame();
}) 

startGame();
})