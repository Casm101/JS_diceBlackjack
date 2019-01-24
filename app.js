/*******************************************
  Game Javascript by Christian Smith Mantas.
  With ♥ from: Nellogy
  
  Dice Blackjack - main code
  Created: 15-01-2019
  Last Updated: 24-01-2019
  
  Current version: Version 1.4 (live Beta)
*/

/**************************************************
  Declaration of variables, game rules & game start
**************************************************/
var scores, roundScore, activePlayer, inactivePlayer, dice, diceMEM, gamePlaying, highScore, constantHS, uiStyle, modeCounter, gameMode, probability, tempScore;

document.querySelector('.settings-panel').style.display = 'none';
document.querySelector('.scores-panel').style.display = 'none';

// Get local High-Score
constantHS = localStorage.getItem('constantHS', constantHS);

// Set high score if previous game found on system
if ( constantHS !==  null) { 
    document.querySelector('.btn-hiscore').textContent = 'HI-SCORE: ' + constantHS;
    } else {
        document.querySelector('.btn-hiscore').textContent = 'HI-SCORE'
};

// Set UI style to light and gamemode to normal
uiStyle = 0;
gameMode = 0;

gameRestart();


/************************************************************************************************************
  All game buttons - ROLL / HOLD / NEW-GAME / SETTINGS / DARK / RESET-HIGH-SCORE / GAMEMODE / BACK-0 / BACK-1
************************************************************************************************************/

document.querySelector('.btn-roll').addEventListener('click', btnRoll);

document.querySelector('.btn-hold').addEventListener('click', btnHold);

document.querySelector('.btn-new').addEventListener('click', gameRestart);

document.querySelector('.btn-settings').addEventListener('click', function() {
    document.querySelector('.game-panel').style.display = 'none';
    document.querySelector('.settings-panel').style.display = 'block';
    document.getElementById('tabTitle').innerHTML = "Dice Blackjack: Settings";
});

document.querySelector('.btn-dark').addEventListener('click', btnDark);

document.querySelector('.btn-resetHighScore').addEventListener('click', function () {
    highScore = 0;
    constantHS = 0;
    localStorage.removeItem('constantHS');
    document.querySelector('.btn-hiscore').textContent = 'HI-SCORE';
})

document.querySelector('.btn-gameMode').addEventListener('click', function() {
    if (gameMode < 2) {
        gameMode += 1;
    } else if (gameMode === 2) {
        gameMode = 0;
    };
    console.log("Current game mode is: " + gameMode);
});

document.querySelector('.btn-back').addEventListener('click', function() { 
    //window.location = "index.html";
    document.querySelector('.settings-panel').style.display = 'none';
    document.querySelector('.scores-panel').style.display = 'none';
    document.querySelector('.game-panel').style.display = 'block';
    document.getElementById('tabTitle').innerHTML = "Dice Blackjack";
});

document.querySelector('.btn-hiscore').addEventListener('click', function() {
    document.querySelector('.game-panel').style.display = 'none';
    document.querySelector('.scores-panel').style.display = 'block';
    document.getElementById('tabTitle').innerHTML= "Dice Blackjack: HI-Scores";
});

document.querySelector('.btn-back-1').addEventListener('click', function() { 
    //window.location = "index.html";
    document.querySelector('.settings-panel').style.display = 'none';
    document.querySelector('.scores-panel').style.display = 'none';
    document.querySelector('.game-panel').style.display = 'block';
    document.getElementById('tabTitle').innerHTML = "Dice Blackjack";
});


/*****************************************************************************************************************************************************
  Functions to simplify basic repetetive tasks - NEXTPLAYER / GAMERESTART / BTNROLL / BTNHOLD / HIGHSCORECALC / BTNDARK / ACTIVEPLAYERUI / DICEUPDATER
*****************************************************************************************************************************************************/
function nextPlayer() {     // Change active player & player styles
    
    // Next player
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    activePlayer === 0 ? inactivePlayer = 1 : inactivePlayer = 0;
    roundScore = 0;
    diceMEM = 0;
    dice = 0;
    
    // Reset current roundScore for both users
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    // Swapp current active user in UI
    activePlayerUI()
    
    // Remove dice holder
    document.querySelector('.dice').style.display = 'none';
};


function gameRestart() {    // Reset game w/ all values = 0                         
    
    // Reset scores, active player & set game to running
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    activePlayer === 0 ? inactivePlayer = 1 : inactivePlayer = 0;
    
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
    
    // Reset active player ui
    if (uiStyle === 0) {
        document.querySelector('.player-0-panel').classList.remove('active');
        document.querySelector('.player-0-panel').classList.add('active');
        document.querySelector('.player-1-panel').classList.remove('active');
    } else if (uiStyle === 1 ) {
        document.querySelector('.player-0-panel').classList.remove('active-dark');
        document.querySelector('.player-0-panel').classList.add('active-dark');
        document.querySelector('.player-1-panel').classList.remove('active-dark');
    }    
};

function btnRoll() {    // Roll the game dice and obtain randomized number between 1 & 6
    
    // Check if game is playing 
    if (gamePlaying && gameMode === 0) {    // Normal gamemode
        
        // Set dice memory to current dice value
        diceMEM = dice;
        
        // Generate a random number (1-6)
        dice = Math.floor(Math.random() * 6 + 1);
    
        // Display the result
        diceUpdater();
    } else if (gamePlaying && gameMode === 1) {     // Extreme gamemode
        
        // Generate a random number (1-100)
        probability = Math.floor(Math.random() * 100 + 1);
        
        // Create extreme dice value
        if (probability !== 100) {
            dice = Math.floor(Math.random() * 3 + 1);  
            
            // Diplay dice value
            diceUpdater();
        } else {
            dice = 6;
            
            // Diplay dice value
            diceUpdater();
        }; 
    };
};

function btnHold() {    // Update global score of active player & check if game has been won
    
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
        
        // Update the "HI-Score"
        highScoreCalc();
    
        // Check if game has been won
        uiStyle === 1 ? iconColour = "#D79921" : iconColour = "#EB4D4D";
        
        if (scores[activePlayer] >= pointLimit && uiStyle === 0) {
            console.log('Player ' + (activePlayer + 1) + ' has won the game!')
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        } else if (scores[activePlayer] >= pointLimit && uiStyle === 1) {
            console.log('Player ' + (activePlayer + 1) + ' has won the game!')
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner-dark');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active-dark');
            gamePlaying = false;
        } else {
            // Next player
            nextPlayer();
        }
    }
};

function btnDark() {    // Toggle active UI to darkMode <easier on the eyes>
    
    var iconColour, textColour; 
        
    uiStyle === 0 ? uiStyle = 1 : uiStyle = 0;
        
    uiStyle === 1 ? iconColour = "#D79921" : iconColour = "#EB4D4D";
    uiStyle === 1 ? textColour = "white" : textColour = "#555";
        
    // Change background image
    uiStyle === 1 ? document.body.style.backgroundImage = "url('back3.jpg')" : document.body.style.backgroundImage = "url('back.jpg')";
        
    // Change panel colour
    document.querySelector('.settings-panel').classList.toggle('dark');
    document.querySelector('.scores-panel').classList.toggle('dark');
    document.querySelector('.player-0-panel').classList.toggle('dark');
    document.querySelector('.player-1-panel').classList.toggle('dark'); 
    activePlayer === 0 ? inactivePlayer = 1 : inactivePlayer = 0;
    activePlayerUI();
        
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('active-dark');
    
    // Change UI style icons
    document.getElementById('icnUI').classList.toggle('ion-ios-moon');
    document.getElementById('icnUI').classList.toggle('ion-ios-sunny');
    
    // Change UI icon colour
    document.getElementById('icnUI').style.color = iconColour;
    document.getElementById('icnReturn-0').style.color = iconColour;
    document.getElementById('icnReturn-1').style.color = iconColour;
    document.getElementById('icnNewGame').style.color = iconColour;
    document.getElementById('icnSettings').style.color = iconColour;
    document.getElementById('icnRoll').style.color = iconColour;
    document.getElementById('icnHold').style.color = iconColour;
    document.getElementById('icnReset').style.color = iconColour;
    document.getElementById('icnMode').style.color = iconColour;
        
    // Change other UI colour elements
    document.getElementById('currentBox-0').style.backgroundColor = iconColour;
    document.getElementById('currentBox-1').style.backgroundColor = iconColour;
    
    //Change text colour & button text colour
    document.getElementById('title-1').style.color = textColour;
    document.getElementById('title-2').style.color = textColour;
    document.getElementById('name-0').style.color = textColour;
    document.getElementById('name-1').style.color = textColour;
    document.getElementById('score-0').style.color = iconColour;
    document.getElementById('score-1').style.color = iconColour;
        
    document.getElementById('buttonDL').style.color = textColour;
    document.getElementById('buttonBack-0').style.color = textColour;
    document.getElementById('buttonBack-1').style.color = textColour;
    document.getElementById('buttonNew').style.color = textColour;
    document.getElementById('buttonSettings').style.color = textColour;
    document.getElementById('buttonRoll').style.color = textColour;
    document.getElementById('buttonHold').style.color = textColour;
    document.getElementById('itemHi').style.color = textColour;
    document.getElementById('buttonReset').style.color = textColour;
    document.getElementById('buttonMode').style.color = textColour;
    
    // Reload active player UI
    activePlayerUI()
};

function highScoreCalc() {     // Calculate and update the current highscore
    
    // Check who has the highest score in the current game
    if (scores[0] > scores[1] && scores[0] !== 0) {
        highScore = scores[0];
        if (constantHS < scores[0]) {
            // Make change in the UI
            constantHS = highScore;
            localStorage.setItem('constantHS', constantHS);
            document.querySelector('.btn-hiscore').textContent = 'HI-SCORE: ' + constantHS;
        };
    } else if (scores[1] > scores[0] && scores[1] !== 0) {
        highScore = scores[1];
        if (constantHS < scores[1]) {
            // Make change in the UI
            constantHS = highScore;
            localStorage.setItem('constantHS', constantHS);
            document.querySelector('.btn-hiscore').textContent = 'HI-SCORE: ' + constantHS;
        };
    } else if (scores[0] === scores[1]) {
        // Maintain current value
        document.querySelector('.btn-hiscore').textContent = 'HI-SCORE: ' + constantHS;
    } else {
        // Make change in the UI
        document.querySelector('.btn-hiscore').textContent = 'HI-SCORE';
    }
};

function activePlayerUI() {     // Change active player UI (either dark mode or light mode)
    if (uiStyle === 0) {
        document.querySelector('.player-' + inactivePlayer + '-panel').classList.remove('active-dark');
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
        document.querySelector('.player-' + inactivePlayer + '-panel').classList.remove('active-dark');
        document.querySelector('.player-' + inactivePlayer + '-panel').classList.remove('active');
    } else if (uiStyle === 1) {
        document.querySelector('.player-' + inactivePlayer + '-panel').classList.remove('active');
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('active-dark');
        document.querySelector('.player-' + inactivePlayer + '-panel').classList.remove('active');
        document.querySelector('.player-' + inactivePlayer + '-panel').classList.remove('active-dark');
    };
};

function diceUpdater() {    // Update the dice UI
     // Display the result
    var diceDOM = document.querySelector('.dice');
    diceDOM.style.display = 'block';
    diceDOM.src = 'dice-' + dice + '.png';    
    
    // Remove complete score if player rolls 2 consecutive sixes 
    if (dice === 6 && diceMEM === 6) {
        scores[activePlayer] = 0;
        document.querySelector('#score-' + activePlayer).textContent = 0;
        nextPlayer();
    // Update the round score IF dice number is !== 1
    } if (dice !== 1) {            
        // Add current score to global score
        roundScore += dice;
        document.querySelector('#current-' + activePlayer).textContent = roundScore; 
    // Erase roundscore and change active player if dice === 1
    } else {
        // Next player when dice == 1
        nextPlayer();
    };
};