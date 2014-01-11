/*
* The GameState class is responsible for maintaining the current layout of the game board, including the location
* of any existing game elements (characters, food, etc.) The class contains public methods that allow elements to
* be added or moved.
*/

function GameState (rowCount, colCount){
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.state = new Array();
    this.snake = [];

    for(var row = 0; row < rowCount; row++){
        var rowArray = new Array();

        for(var col = 0; col < colCount; col++){
            rowArray.push(0);
        }

        this.state.push(rowArray);
    }

    function getNewFoodCoordinates() {
        return {
            row: Math.floor(Math.random() * rowCount),
            col: Math.floor(Math.random() * colCount)
        };
    }

    this.addFood = function () {
        var coordinates = this.getNewFoodCoordinates();
        this.state[coordinates.row][coordinates.col] = 2;
    }

    this.addSnake = function (snake) {
        this.snake = snake;

        for (var i = 0; i < snake.length; i++) {
            if (i == 0) {
                this.state[snake.body[i].row][snake.body[i].col] = 3;
            }
            else {
                this.state[snake.body[i].row][snake.body[i].col] = 1;
            }
        }
    }
}

GameState.prototype.clear = function(){
    for(var row = 0; row < this.rowCount; row++){
        for(var col = 0; col < this.colCount; col++){
            this.state[row][col] = 0;
        }
    }
}

GameState.prototype.removeSnake = function (snake) {
    for (var i = 0; i < snake.length; i++) {
        this.state[snake.body[i].row][snake.body[i].col] = 0;
    }
}

GameState.prototype.removeFood = function (row, col) {
    this.state[row][col] = 0;
}

GameState.prototype.spaceContainsSnakeBody = function (row, col){
    return this.state[row][col] === 1;
}

GameState.prototype.spaceContainsSnakeHead = function (row, col){
    return this.state[row][col] === 3;
}

GameState.prototype.spaceContainsFood = function (row, col){
    return this.state[row][col] === 2;
}
