/*
* The Game class controls the flow of the game.  This class is in charge coordinating game controls and the timer.
* It is responsible for making sure that commands from the player are sent to the game model and reflected in the view.
*/

var state;
var board;
var gameTimer;
var foodCountDown = -1;
var score = 0;
var deathMessage = "YOU ARE DEAD DUDE.<br/>SCORE: ";
var rowCount = 30;
var colCount = 30;
var gameState = new GameState(rowCount, colCount);
var intervalLength = 100;
var playerName = "Player 1";

// A string that represents the direction that the snake's head is moving.  Valid values are 'up', 'down', 'left', 'right', and 'none'
var snakeDirection;
var snake = new Snake();

$(function () {
    board = new Board(rowCount, colCount);
    board.$constructBoard().appendTo("#board-area");
    setControls();
    getName();
    resetGame();
});

function setControls(){
    $(document.documentElement).on('keydown', function( event ) {
        switch(event.keyCode) {
            case 37 :
                setDirection('left');
                break;
            case 38 :
                setDirection('up');
                break;
            case 39 :
                setDirection('right');
                break;
            case 40 :
                setDirection('down');
                break;
        }
    });
}

function getName(){
    if(ClientSaveUtility.hasSavedNames()){
        selectSavedName();
    }
    else{
        getNameFromUser();
    }
}

function selectSavedName(){
    addSavedNamesToDialog();

    $("#saved-name-dialog").dialog({
        resizable: false,
        modal: true,
        width: 500,
        buttons: {
            "New Game": function () {
                $(this).dialog("close");
                getNameFromUser();
            }
        }
    });
}

function addSavedNamesToDialog(){
    var savedNames = ClientSaveUtility.getSavedNames();

    $nameList = $('<ul />', {'id': 'saved-name-list'});
    for(var i = 0; i < savedNames.length; i++){
        $('<li />', {'text': savedNames[i]}).on('click', function(){
            setUserName($(this).text());
            $("#saved-name-dialog").dialog('close');
        }).appendTo($nameList);
    }

    $nameList.appendTo('#saved-names');
}

function getNameFromUser(){
    $("#name-dialog").dialog({
        resizable: false,
        modal: true,
        buttons: {
            "Start": function () {
                var newName = $('#name-input').val();
                setUserName(newName);
                ClientSaveUtility.addPlayer(newName);
                $(this).dialog("close");
            }
        }
    });
}

function setUserName(name){
    $('#player-name').text(name);
    playerName = name;
}

function playRandomSound(sound, count){
    var result = Math.floor(Math.random() * count)+1;
    var audio = $('#' + sound + result.toString()).get(0);

    audio.load();
    audio.play();
}

function resetGame() {
    gameState.clear();

    addFoodToState();
    addFoodToState();

    score = 0;
    snake.initialize([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 0, col: 5 }]);
    setDirection('none');
    gameState.addSnake(snake);
    console.log("Game State: %O", gameState.state);
    updateBoard(gameState);
    $('#score').text('0');

    clearInterval(gameTimer);
    gameTimer = setInterval(function () {
        if (foodCountDown === 0) {
            addFoodToState();
        }

        foodCountDown--;

        moveSnake(snakeDirection);
    }, intervalLength);
}

function addFoodToState(){
    var foodCoordinates = getNewFoodCoordinates();
    gameState.addFood(foodCoordinates.row, foodCoordinates.col);
}

function setDirection(direction) {
    // Prevent the snake from turning back on itself and immediately dying.
    if (direction != getOppositeDirection(snakeDirection)) {
        snakeDirection = direction;
    }
}

function getOppositeDirection(direction) {
    var oppositeDirection;

    switch (direction) {
        case 'left':
            oppositeDirection = 'right';
            break;
        case 'up':
            oppositeDirection = 'down';
            break;
        case 'right':
            oppositeDirection = 'left';
            break;
        case 'down':
            oppositeDirection = 'up';
            break;
    }

    return oppositeDirection;
}

function setFoodCountDown() {
    foodCountDown = Math.floor(Math.random() * 24)+1;
}

function getNewFoodCoordinates() {
    return {
        row: Math.floor(Math.random() * rowCount),
        col: Math.floor(Math.random() * colCount)
    };
}

function updateBoard(gameState) {
    var $boardSpaces = $("#board td");
    $boardSpaces.removeClass('snake-body');
    $boardSpaces.removeClass('snake-head');
    $boardSpaces.removeClass('food');

    var space = 0;

    for (var row = 0; row < rowCount; row++) {
        for (var col = 0; col < colCount; col++) {
            if (gameState.spaceContainsSnakeBody(row,col)) {
                $($boardSpaces[space]).addClass('snake-body');
            }
            if (gameState.spaceContainsFood(row, col)) {
                $($boardSpaces[space]).addClass('food');
            }
            if (gameState.spaceContainsSnakeHead(row, col)) {
                $($boardSpaces[space]).addClass('snake-head');
            }
            space++;
        }
    }
}

function moveSnake(direction) {
    if (direction === 'none')
        return;

    // Update the head with the new coordinates caused by the movement.
    var newCoordinates = {
        row: getNextRow(snake.getHeadRow(), direction),
        col: getNextCol(snake.getHeadCol(), direction)
    };

    if (gameState.spaceContainsSnakeBody(newCoordinates.row, newCoordinates.col)) {
        clearInterval(gameTimer);
        playRandomSound('scream', 1);
        if(score > ClientSaveUtility.getPersonalBest(playerName)){
            ClientSaveUtility.setPersonalBest(playerName, score);
            displayHighScore();
        }
        else{
            displayDeathMessage();
        }
        return;
    }

    gameState.removeSnake(snake);

    // The snake's head is going to occupy the same space as a piece of food.  That is "eating" for our purposes.
    if (gameState.spaceContainsFood(newCoordinates.row, newCoordinates.col)) {
        // The piece of food becomes the snake's new head.
        score += 30;
        playRandomSound('bite', 2);
        $('#score').text(score);
        snake.addBodySection(newCoordinates.row, newCoordinates.col);
        setFoodCountDown();
    }

    snake.propagateMotion();
    snake.setHeadCoordinates(newCoordinates.row, newCoordinates.col);

    gameState.addSnake(snake);

    updateBoard(gameState);
}

function displayHighScore(){
    $('#high-score').text(score);
    $('#high-score-dialog').dialog({
        modal: true,
        buttons: {
            "Okay!": function () {
                $(this).dialog("close");
                displayDeathMessage();
            }
        }
    });
}

function displayDeathMessage(){
    $('#death-message').html(deathMessage + score);
    $('#death-dialog').dialog({
        modal: true,
        buttons: {
            "Shop": function () {
                $(this).dialog("close");
                $('#shop-dialog').dialog({
                    modal: true,
                    buttons: {
                        "Done Shopping": function () {
                            resetGame();
                            $(this).dialog("close");
                        }
                    }
                });
            },
            "Play Again": function () {
                resetGame();
                $(this).dialog("close");
            }
        }
    });
}

function getNextRow(currentRow, direction) {
    var nextRow = currentRow;

    if (direction === 'up') {
        if (snake.headIsInTopRow()) {
            nextRow = rowCount - 1;
        }
        else {
            nextRow = (currentRow - 1) % rowCount;
        }
    }

    if (direction === 'down') {
        nextRow = (currentRow + 1) % rowCount;
    }

    return nextRow;
}

function getNextCol(currentCol, direction) {
    var nextCol = currentCol;

    if (direction === 'left') {
        if (snake.headIsInLeftColumn()) {
            nextCol = colCount - 1;
        }
        else {
            nextCol = (currentCol - 1) % colCount;
        }
    }

    if (direction === 'right') {
        nextCol = (currentCol + 1) % colCount;
    }

    return nextCol;
}
