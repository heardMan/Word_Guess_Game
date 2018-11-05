//DECLARE VARIABLES

var startGameElem = document.getElementById("start-game");
var winsElem = document.getElementById("wins");
var wordXElem = document.getElementById("wordX");
var guessesElem = document.getElementById("guesses");
var letterBankElem = document.getElementById("letter-bank");
var easyDifficulty = document.getElementById("exampleRadios1");
var normalDiffculty = document.getElementById("exampleRadios2");
var hardDifficulty = document.getElementById("exampleRadios3");
var wins = 0;
var guesses;
var wordBlanks = [];
var chosenWord = "";
var userInput = [];
var alreadyGuessed =[];
var wordBank = [
    "giraffe",
    "lion",
    "antelope",
    "elephant",
    "finch"
]

//FUNCTION SETUP

//setGuesses
var setGuesses = function () {
    
    if ( easyDifficulty.checked ) {
        guesses = 20;
    } else if ( normalDiffculty.checked ) {
        guesses = 15;
    } else if (hardDifficulty.checked ) {
        guesses = 10;
    }
    
}

//clearWord: clears old word
var clearWord = function () {
    wordBlanks = [];
    chosenWord = "";
    userInput = [];
    letterBankElem.textContent = userInput;
}

// chooseWord: selects word from the wordBank array
var chooseWord = function () {
    var randomNum = Math.floor(Math.random() * wordBank.length);
    var aiSelect = wordBank[randomNum];
    chosenWord += aiSelect;
    console.log(chosenWord);
    console.log(chosenWord.length);
}

// printArrayNoCommas prints the wordBlanks Array without any commas and updates the page element
var printArrayNoCommas = function (arr, elem) {
    var arrToString = arr.toString();
    var spacesNowCommas = arrToString.replace(/,/g," ");
    elem.textContent = spacesNowCommas;
    setTimeout(checkWin, 200);
}

// setBlanks: outputs the correct number of blanks to the wordX element based on the word chosen
var setBlanks = function () {
    
    for (var i = 0; i < chosenWord.length; i++){ 
        wordBlanks.push(" _ ");
    }

    printArrayNoCommas(wordBlanks, wordXElem);
    
}

// newGame: 
var newGame = function () {
    setGuesses();
    clearWord();
    chooseWord();
    setBlanks();
    guessesElem.textContent = guesses;
}

//guessAsses: "sanitizes" user input and outputs appropriate response
var guessAssess = function (keyLimit, keyPressed) {
   

    if (keyPressed !== "shift" && keyPressed !== "meta" && keyPressed !== "backspace" && keyPressed !== " " && keyPressed !== "enter") {      
       
        var wordBlankString = wordBlanks.toString();
        var userInputString = userInput.toString();
        var wordBlankCheck = wordBlankString.match(keyPressed);
        var userInputCheck = userInputString.match(keyPressed);

        if ( wordBlankCheck === null && userInputCheck === null) {
            
            var rightCheck = chosenWord.match(keyPressed);
            console.log(rightCheck);
            
            if ( rightCheck !== null ) {
                guessRight(keyPressed);
            } else {
                guessWrong(keyPressed);
            }
            
        } else {

            alert("Letter already guessed");

        }
        
    }
}

// guessWrong: manages user input if guess is wrong
var guessWrong = function (keyPressed) {
        userInput.push(keyPressed);
        guesses --;
        //letterBankElem.textContent = userInput;
        printArrayNoCommas(userInput, letterBankElem);
        setTimeout(checkLoss, 250);
}

// guessRight: manages user input if guess is correct
var guessRight = function (keyPressed) {
        
        var rightindices = [];
        for ( var i = 0; i < chosenWord.length; i++) {
            if ( keyPressed === chosenWord[i] ) {
                rightindices.push(i);
            }
        }

        for ( var i = 0; i < rightindices.length; i++) {
            var replaceIndex = rightindices[i];
            var letterToReplace =  chosenWord[rightindices[i]];
            //console.log(replaceIndex);
            //console.log(letterToReplace);
            wordBlanks[replaceIndex] = "  " + letterToReplace + "  ";
            //console.log(wordBlanks);
            
        }
        guesses --;
        printArrayNoCommas(wordBlanks, wordXElem);
        
    
}

//checkWin
var checkWin = function () {
    var wordBlankString = wordBlanks.toString();
    var wordBlankCheck = wordBlankString.match(/_/);
    if ( wordBlankCheck === null) {
        newGame();
        alert("WINNER!!!");
        wins ++;
        winsElem.textContent = wins;
    }
}

//checkLoss
var checkLoss = function () {
    if ( guesses === 0 ) {
        alert("LOSER!!!");
        newGame();
    }
}

//Listen for userInput



winsElem.textContent = wins;
newGame();


document.onkeydown = function (e) {
    var rawkeyStroke = e.key;
    var keyStroke = rawkeyStroke.toLowerCase();
    var patt1 = /[a-z]/i;
    var keyRange = keyStroke.match(patt1);

    guessAssess(keyRange, keyStroke);
    
    
    guessesElem.textContent = guesses;
    

    
    
    
}
