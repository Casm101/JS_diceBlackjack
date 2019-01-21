/*******************************************
  Game Javascript by Christian Smith Mantas.
  
  Dice Blackjack - main code
  Created: 15-01-2019
  Last Updated: 17-01-2019
  
  Current version: Version 1.2.1
*/

/**************************************************
  Declaration of variables, game rules & game start
**************************************************/
var scores, roundScore, activePlayer, dice, diceMEM, gamePlaying;

gameRestart();
// pointLimit = prompt('What will the game limit be?', 'Enter a value between 6 and ∞');


/******************************************
  All game buttons - ROLL / HOLD / NEW-GAME
******************************************/
document.querySelector('.btn-roll').addEventListener('click', function() {
    
    // Check if game is playing 
    if (gamePlaying) {
        
        // Set dice memory to current dice value
        diceMEM = dice;
        
        // Generate a random number
        dice = Math.floor(Math.random() * 6 + 1);
    
        // Display the result
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';    
    
        // Remove complete score if player rolls 2 consecutive sixes 
        if (dice === 6 && diceMEM === 6) {
            scores[activePlayer] = 0;
            document.querySelector('#score-' + activePlayer).textContent = 0;
            nextPlayer();
        // Update the round score IF dice number is =/= 1
        } if (dice !== 1) {
            
            // Add current score to global score
            roundScore += dice;
            document.querySelector('#current-' + activePlayer).textContent = roundScore; 
        // 
        } else {
            // Next player when dice == 1
            setTimeout(1000);
            nextPlayer();
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function() {
   
    // Check if game is playing
    if (gamePlaying) {
       
        // Add current score to global score
        scores[activePlayer] += roundScore;  
    
        // Update user interface
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        
        // Get & update current pointLimit
        var imput = document.querySelector('.final-score').value
        var pointLimit;
        
        if (imput) {
            pointLimit = imput;
        } else {
            pointLimit = 100;
        }
    
        // Check if game has been won
        if (scores[activePlayer] >= pointLimit) {
            console.log('Player ' + (activePlayer + 1) + ' has won the game!')
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        } else {
           
            // Next player
            nextPlayer();
        } 
    }
})

document.querySelector('.btn-new').addEventListener('click', gameRestart);


/************************************************************************
  Functions to simplify basic repetetive tasks - NEXTPLAYER / GAMERESTART
************************************************************************/
function nextPlayer() {     // Change active player & player styles
    
    // Next player
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
    diceMEM = 0;
    dice = 0;
    
    // Reset current roundScore for both users
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    // Swapp current active user in UI
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    
    // Remove dice holder
    document.querySelector('.dice').style.display = 'none';
}


function gameRestart() {    // Reset game w/ all values = 0                         
    // Reset scores, active player & set game to running
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;
    
    // Remove dice holder
    document.querySelector('.dice').style.display = 'none';

    // Reset score ui
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    // Remove winner ui
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
}

function callWait() {   // Useless funtion to cause a  simulated sleep
    console.log('Waiting 1000ms after encountering a 1');    
}