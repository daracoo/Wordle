const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;

async function init(){
    let currentGuess = '';
    let currentRow = 0;
    function addLetter (letter){
        if(currentGuess.length < ANSWER_LENGTH){
            currentGuess += letter;//dodava bukva
        }else{
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter //da ja zameni poslednata bukva dokolku napisi nova
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter; //da gi vpisi vo kvadratcinata bukvite
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) { // ako imame stegnato enter pred krajo na zboro da prekini so izvrsuvanje
            return;
        }

        //TODO: validacija na zbor

        //TODO: markiranje na dali e tocno, blisku ili netocno

        //TODO: dali korisnikot pobedil ili ne?

        currentRow++;
        currentGuess = '';
    }

    function backspace(){ // za brisenje na bukvi
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }

    document.addEventListener('keydown', function handleKeyPress(event){
         const action = event.key; // go zema kopceto so go stegame na tastatura

        if(action === 'Enter'){
            commit(); //se povikuva koga korisniko se obiduva da pogodi
        }else if (action === 'Backspace'){
            backspace(); // ako saka da izbrisi nekoja bukva
        }else if (isLetter(action)){
            addLetter(action.toUpperCase()); //ako stegnal bukva da ja vnesi
        }else {
            //ostanatite kopcina od kb da se ignorira
        }
    })
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

init();