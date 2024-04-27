
const guessbox = document.querySelector(".guessbox");
options = guessbox.querySelector(".options");
searchInp = guessbox.querySelector("input");

//Array we will store the characters in
let characters = [];
setCharacters()
let alreadyChosenCharacters = []
let characterDivs = []
let answer = loadCharacter("Subaru Natsuki");

function addCharacter(characters)
{
    characterDivs = []

    //Adds all the characters to the options list
    //Will need to update in the future the IMG PATH
    //This will be used to reference the img path... of course
    characters.forEach(char => {
        let div = document.createElement('div');
        div.classList.add('character-item');
        div.innerHTML = `<div class="character-select">
                               <div>
                                   <img src="static/img/Character-Portraits/${char}.png">
                               </div>
                            <div>
                                ${char}
                            </div>
                            </div>`;
    
        div.addEventListener('click', function() {
            updateChoice(this, char);
        });
    
        options.appendChild(div);
        characterDivs.push(div);
    });
}

function addCharFromSearch(){
    let arr = [];
    let searchVal = searchInp.value.toLowerCase();

    if (searchVal != "")
    {
        arr = characters.filter(data => {
            return data.toLowerCase().split(' ').some(word => word.startsWith(searchVal.toLowerCase())) ||
                   data.toLowerCase().startsWith(searchVal.toLowerCase());
        });
    }

    //CLEAR THE OPTIONS DIV
    options.innerHTML = '';

    if (arr.length == 0 && searchVal != "")
    {
        options.innerHTML = '<p> No Character Found!! </p>';
    } else {
        addCharacter(arr);
    }
}

prevInput = ""
searchInp.addEventListener("keyup", function(event){
    if (searchInp.value == prevInput){
        return;
    }
    prevInput = searchInp.value;

    addCharFromSearch();
})

searchInp.addEventListener('keydown', function(event){
    if (event.key == 'Enter'){
        if (characterDivs.length == 0){
            return
        }
        
        const selectedDiv = document.querySelector(".character-item.selected")
        
        if (selectedDiv == null){
            characterDivs[0].click();
        } else {
            selectedDiv.click();
        }
    }

    if (event.key == 'ArrowDown'){
        const selectedDiv = document.querySelector(".character-item.selected")

        if (selectedDiv == null){
            characterDivs[0].classList.toggle("selected");
        } else {
            indexOfDiv = characterDivs.indexOf(selectedDiv)
            clearSelections();
            if (indexOfDiv == (characterDivs.length - 1)){
                characterDivs[0].classList.toggle("selected");
            } else {
                characterDivs[indexOfDiv+1].classList.toggle("selected");
            }
        }
    }

    if (event.key == 'ArrowUp'){
        const selectedDiv = document.querySelector(".character-item.selected")

        if (selectedDiv == null){
            characterDivs[characterDivs.length - 1].classList.toggle("selected");
        } else {
            indexOfDiv = characterDivs.indexOf(selectedDiv)
            clearSelections();
            if (indexOfDiv == 0){
                characterDivs[characterDivs.length - 1].classList.toggle("selected");
            } else {
                characterDivs[indexOfDiv-1].classList.toggle("selected");
            }
        }
    }
});

searchInp.addEventListener('keydown', function(event){
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
})

searchInp.addEventListener('blur', function(){
    options.style.display = 'none';
});

searchInp.addEventListener('focus', function(){
    options.style.display = 'block';
});

function clearSelections() {
    let divs = options.querySelectorAll('.character-item');
    
    divs.forEach(div => {
        if (div.classList.contains('selected')) {
            div.classList.remove('selected');
        }
    });
}

function updateChoice(div, character)
{
    console.log("Just selected the character " + character);
    searchInp.value = '';
    characters = characters.filter(item => item !== character);
    alreadyChosenCharacters.push(character);
    options.innerHTML = '';
}

function setCharacters(){
    fetch('/get_characters')
    .then(response => response.json())
    .then(data => {
        characters = data;
    })
    .catch(error => console.log('Error: ', error));
}

function loadCharacterFetch(character_name){
    const data = {
        'Character' : character_name
    };

    return fetch('/load_character_stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            console.log("Loading character " + character_name + " failed")
        }
        return response.text();
    })
    .catch(error => {
        console.log(error);
    });
}

async function loadCharacter(character_name){
    let character = await loadCharacterFetch(character_name);
    return JSON.parse(character);
}

async function makeGuessFetch(character_name){
    let character_answer = await answer

    const data = {
        'Answer' : character_answer.Character,
        'Guess' : character_name
    };

    return fetch('/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            console.log("Guess for " + character_name + " failed")
        }
        return response.text();
    })
    .catch(error => {
        //console.log(error);
    });
}

async function sendGuess(character_name){
    let guess = await makeGuessFetch(character_name);
    guess = JSON.parse(guess)
    console.log(guess)
    return guess;
}

sendGuess('Felix Argyle')