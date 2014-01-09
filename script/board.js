/*
* The Board class is responsible for handling the graphical (HTML and CSS) representation of the game board.
*/

function Board(rowCount, colCount){
    this.rowCount = rowCount;
    this.colCount = colCount;
}

Board.prototype.$constructBoard = function(){
    var $board = $('<table />', {id: 'board'});

    for(var row = 0; row < this.rowCount; row++){
        var $row = $('<tr />');

        for(var col = 0; col < this.colCount; col++){
            $('<td />').appendTo($row);
        }

        $row.appendTo($board);
    }

    return $board;
}