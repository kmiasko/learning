function Board() {
  var board = Array.apply(null, Array(9)).map(Number.prototype.valueOf, -1);
  var winningLines = [
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
  ];

  this.isPositionFree = function(pos) {
    return board[pos] === -1;
  }

  this.getFreePositions = function() {
    var pos = [];
    for (var i = 0; i < board.length; i++) {
      if (this.isPositionFree(i)) pos.push(i);
    }
    return pos;
  }

  this.getPositionValue = function(pos) {
    return board[pos];
  }

  this.markPosition = function (player, pos) {
    if (this.isPositionFree(pos)) {
      board[pos] = player;
      return true;
    }
    return false;
  }

  this.getWinningLines = function() {
    return winningLines;
  }

}

function AI() {
  this.getComputerMove = function(board) {
    var moves = board.getFreePositions();
    var pos =  this.generateMove(moves.length);
    return moves[pos];
  }

  this.generateMove = function(max) {
    return Math.floor((Math.random() * max) + 1) - 1;
  }
}

function Game(startingPlayer, jquery) {
  this.startingPlayer = startingPlayer;
  this.currentPlayer = startingPlayer;
  var numberOfMoves = 0;
  var board = new Board();
  var ai = new AI();
  var playerWon = -1;
  var $ = jquery;

  this.changePlayer = function() {
    if (this.currentPlayer === 0) this.currentPlayer = 1;
    else this.currentPlayer = 0;
  }

  this.getCurrentPlayer = function() {
    return this.currentPlayer;
  }

  this.move = function(player, pos) {
    if (this.end()) return false;
    if (board.markPosition(player, pos)) {
      numberOfMoves += 1;
      if (this.hasWon(player)) this.playerWon = player;
      if (this.end()) this.showResult();
      return true;
    }
    return false;
  }

  this.possibleMove = function(pos) {
    return board.isPositionFree(pos);
  }

  this.computerMove = function() {
    if (this.end()) return false;
    var move = ai.getComputerMove(board);
    $('.field[data-move=' + move + ']').addClass('fa fa-circle-o');
    if (this.move(this.getCurrentPlayer(), move)) this.changePlayer();
  }

  this.hasWon = function(player) {
    var that = this;
    return board.getWinningLines().some(function(line) {
      for (var i = 0; i < line.length; i++) {
        var pos = line[i];
        if (board.getPositionValue(pos) !== player) return false;
      }
      playerWon = player;
      return true;
    });
  }

  this.end = function() {
    if (playerWon !== -1 || numberOfMoves === 9) return true;
    return false;
  }

  this.showResult = function() {
    $('.result').css({'visibility': 'visible'});
    if (numberOfMoves === 9 && playerWon === -1) {
      $('.result p:first-child').text('TIE! Good game!');
      $('.result').fadeTo(1000, 1.0);
    } else {
      if (playerWon === 0) {
        $('.result p:first-child').text('Computer Won!');
        $('.result i').addClass('fa fa-laptop');
      } else {
        $('.result p:first-child').text('Human Won!')
        $('.result i').addClass('fa fa-user');
      }
      $('.result').fadeTo(1000, 1.0);
    }
  }

  this.reset = function() {
    $('.field').removeClass('fa fa-circle-o fa-times');
    $('.result p:first-child').text('');
    $('.result i').removeClass('fa fa-laptop fa-user');
    this.currentPlayer = this.startingPlayer = playerWon = -1;
    numberOfMoves = 0;
    board = new Board();
    ai = new AI();
  }
}

$('document').ready(function() {
  var G;
  $('.playerChoose p').click(function(e) {
    if (G) return;
    if ($(this).hasClass('computer')) {
      G = new Game(0, jQuery);
      G.computerMove();
    } else G = new Game(1, jQuery);
    e.preventDefault();
  });

  $('.field').click(function(e) {
    var pos = $(this).data('move');
    if (G && G.possibleMove(pos)) {
      if (G.getCurrentPlayer() === 1) {
        $(this).addClass('fa fa-times');
        G.move(G.getCurrentPlayer(), pos)
        G.changePlayer();
        G.computerMove();
      }
    } else {
      return false;
    }
    e.preventDefault();
  });

  $('.result').click(function(e) {
    G.reset();
    G = undefined;
    $(this).fadeOut(1000);
  });
});