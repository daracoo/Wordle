const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init(){
    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;

    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordsParts = word.split("");
    let done = false;
    setLoading(false);
    isLoading = false;

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

        //markiranje na dali e tocno, blisku ili netocno

        const guessParts = currentGuess.split("")
        const map = makeMap(wordsParts);

        for(let i = 0; i < ANSWER_LENGTH; i++){
           //mark as correct
           if(guessParts[i] === wordsParts[i]){
               letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
               map[guessParts[i]]--;
           }
        }

        for (let i  =0; i< ANSWER_LENGTH; i++){
            if(guessParts[i] === wordsParts[i]){

            }
            else if (wordsParts.includes(guessParts[i]) && map[guessParts[i]]>0){
                //mark as close
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
                map[guessParts[i]]--;
            }else{
                letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
            }
        }

        currentRow++;
        
        // Dali pobedil ili izgubil
        if(currentGuess === word){
            //win
            alert('You win!');
            done = true;
            return;
        }else if(currentRow === ROUNDS){
            alert('You lose the word was ' + word)
        }
        currentGuess = '';
    }

    function backspace(){ // za brisenje na bukvi
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }

    document.addEventListener('keydown', function handleKeyPress(event){
        if(done || isLoading){
            return;
        }


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

function setLoading(isLoading){ // da ja nema ikonata otkako ce se vcita stranata
    loadingDiv.classList.add('hidden', !isLoading);
}

function makeMap(array){
    const obj = {};
    for(let i = 0; i<array.length; i++){
        const letter = array[i]
        if(obj[letter]){
            obj[letter]++;
        }else {
            obj[letter] = 1;
        }
    }
    return obj;
}

init();