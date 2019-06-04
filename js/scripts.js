// front-end logic
var match; // global variable for the match
var turn; // global variable for one turn; reused each time

// initial and setup functions
$(document).ready(function(){
  $("form#form-setup").submit(function(event){
    event.preventDefault();
    var goalInput = parseInt($("#goal").val());
    var player1Input = $("#player1").val().toUpperCase();
    var player2Input = $("#player2").val().toUpperCase();

    if (!(goalInput && goalInput > 0 && player1Input && player2Input)) {
      alert ("Please enter valid player names and goal.")
      return;
    }

    var player1 = new Player(1, player1Input);
    var player2 = new Player(2, player2Input);
    turn = new Turn(player1);    
    match = new Match(goalInput, player1, player2);
    $("div#div-gameplay").show();
    displayGamePlay(match,turn);
  });

  var displayGamePlay = function(){
    $("span#player1-name").text(match.player1.playerName);
    $("span#player1-score").text(match.player1.currentScore);
    
    $("span#player2-name").text(match.player2.playerName);
    $("span#player2-score").text(match.player2.currentScore);
    
    $("span#current-player").text(turn.player.playerName);
    $("span#current-turn-total").text(turn.turnTotal);
  };

  var displayGameOver = function(){
    turn.hold();
    displayGamePlay();
    $("span#winner").text(turn.player.playerName);
    $("div#div-gameover").show();
    $("div#div-turn").hide();
  };

  // game play functions
  $("input#button-roll").click(function(){
    var x = diceroll();
    if (x === 1) {
      alert ("Bummer, you rolled a 1 so you don't get any points and your turn's now over.");
      turn.rolledOne();
      turn.turnOver();
      displayGamePlay();
    } else {
      turn.addRoll(x);
      if (turn.turnTotal + turn.player.currentScore >= match.goal) {
        alert ("Congratulations, you rolled a " + x + " and that puts your score over the goal!")
        displayGameOver();
      } else {
        alert ("Great, you rolled a " + x + ". You get to keep going!");
      }
      $("span#current-turn-total").text(turn.turnTotal);
    }

  });

  $("input#button-hold").click(function(){
    alert (turn.turnTotal + " points will be added to your score. Your turn's now over.");
    turn.hold();
    turn.turnOver();
    displayGamePlay();
  });
  
  $("form#form-gameplay").submit(function(event){
    event.preventDefault();
  });

});



// biz logic
function Match(goal, player1, player2) {
  this.goal = goal;
  this.player1 = player1;
  this.player2 = player2;
};

function Player(playerId, playerName) {
  this.id = playerId;
  this.playerName = playerName;
  this.currentScore = 0;
  this.arrTurns = [];
};

function Turn(player) { 
  this.player = player;
  this.turnTotal = 0;
  this.arrRolls = [];
};

function diceroll(){
  var rand = Math.floor(Math.random() * 6) + 1;
  return rand;
};

Turn.prototype.addRoll = function(num) {
  this.turnTotal += num;
  this.arrRolls.push(num);
};

Turn.prototype.rolledOne = function() {
  this.turnTotal = 0;
  this.arrRolls.push(0);
};

Turn.prototype.hold = function() {
  if (this.player.id === 1) {
    match.player1.currentScore += this.turnTotal
  } else {
    match.player2.currentScore += this.turnTotal
  }
};

Turn.prototype.turnOver = function() {
  if (this.player.id === 1) {
    match.player1.arrTurns.push(this.turnTotal)
    turn.player = match.player2;
  } else {
    match.player2.arrTurns.push(this.turnTotal)
    turn.player = match.player1;
  }  
  turn.turnTotal = 0;
  turn.arrRolls = [];
};
