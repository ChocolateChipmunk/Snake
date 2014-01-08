/*
* The Snake class represents the base functionality of a snake game element.  It is responsible for keeping track
* of the location of its body parts and updating their coordinates as the snake moves around the game board.
*/

function Snake (){
    this.body = new Array();
    this.length = 0;

    // A string that represents the direction that the snake's head is moving.  Valid values are 'up', 'down', 'left', 'right', and 'none'
    this.currentDirection = 'none';

    // Private methods
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

    // Privileged methods (publicly accessible, but able to access private methods/values [see Crockford])
    this.setDirection = function(direction) {
        // Prevent the snake from turning back on itself and immediately dying.
        if (direction != getOppositeDirection(this.currentDirection)) {
            this.currentDirection = direction;
        }
    }
}

Snake.prototype.headIsInLeftColumn = function () {
    return this.body[0].col === 0;
}

Snake.prototype.headIsInTopRow = function() {
    return this.body[0].row === 0;
}

Snake.prototype.initialize = function(coordinateArray){
    this.body = coordinateArray;
    this.length = coordinateArray.length;
}

Snake.prototype.getHeadRow = function (){
    return this.body[0].row;
}

Snake.prototype.getHeadCol = function(){
    return this.body[0].col;
}

Snake.prototype.addBodySection = function(row, col){
    this.body.reverse();
    this.body.push({row: row, col: col});
    this.body.reverse();
    this.length = this.body.length;
}

Snake.prototype.propagateMotion = function (){
    // Iterate from the tail toward the head, moving each body section toward the head.
    var tailIndex = this.body.length-1;
    for (var i = tailIndex; i > 0; i--) {
        this.body[i].row = this.body[i - 1].row;
        this.body[i].col = this.body[i - 1].col;
    }
}

Snake.prototype.setHeadCoordinates = function(row, col){
    this.body[0].row = row;
    this.body[0].col = col;
}
