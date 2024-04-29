
const guessbox = document.querySelector(".guessbox");
options = guessbox.querySelector(".options");
searchInp = guessbox.querySelector("input");

//Array we will store the characters in
let characters = [];
setCharacters()
let alreadyChosenCharacters = []
let characterDivs = []
let answer = loadDailyCharacterFetch()
let numOfGuesses = 0

async function chooseRandomCharacter() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const random = characters[Math.floor(Math.random() * characters.length)];
            resolve(random);
        }, 300);
    });
}

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
        addCharacter(arr);
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

// searchInp.addEventListener('blur', function(){
//     options.style.display = 'none';
// });

document.addEventListener('click', function(event) {
    // Check if the clicked element is not the div itself or a child of the div
    if (event.target !== options && !options.contains(event.target)
        && event.target !== searchInp && !searchInp.contains(event.target)) {
        if (!(document.activeElement == searchInp)){
            options.style.display = 'none';
        }
    }
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
    numOfGuesses++;
    console.log(numOfGuesses)
    searchInp.value = '';
    prevInput = "";
    characterDivs = [];
    characters = characters.filter(item => item !== character);
    alreadyChosenCharacters.push(character);
    options.innerHTML = '';

    addGuessToDiv(sendGuess(character), loadCharacter(character))
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
    if (character_name instanceof Promise) {
        character_name = await character_name;
    }

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
    return guess;
}

async function addGuessToDiv(guess_data, character_data){
    let answersDiv = document.querySelector(".user-answer");

    let GD = await guess_data
    let CD = await character_data


    if (GD['Guess'] == 'correct'){
        setTimeout(() => {
            correctGuessTriggered()
        }, 5000);
    }

    const squareContent = [
        "static/img/Character-Portraits/" + CD['Character'] + '.png',
        CD.Gender,
        CD.Race,
        CD.Height,
        CD.Age,
        CD.Afiliation,
        CD["Elemental Affinity"],
        CD["Divine Protection"],
        CD["Authority"]
    ];

    const info = [
        "Gender", "Race", "Height", "Age",
        "Afiliation", "Elemental Affinity",
        "Divine Protection", "Authority"
    ]

    const container = document.createElement('div');
    container.classList.add('square-container');

    let i = 0;

    divs = []
    squareContent.forEach(content => {
        const square = document.createElement('div');
        square.classList.add('square', 'square-answer-tile');
    
        const squareContent = document.createElement('div');
        squareContent.classList.add('square-content');

        if (i==0){
            let img = document.createElement('img');
            img.src = content;
            squareContent.append(img);
        } else {
            divs.push(square);
            square.classList.add('box-animation')
            square.classList.add('active');
            square.classList.add('animation-fix');
            squareContent.innerHTML = content;
            if (GD[info[i-1]] == "incorrect"){
                square.classList.add("guess-incorrect");
            } else if (GD[info[i-1]] == "partial"){
                square.classList.add("guess-partial");
            } else if (GD[info[i-1]] == "correct") {
                square.classList.add("guess-correct");
            }
        }

        i++;
    
        square.appendChild(squareContent);
        container.appendChild(square);
    });

    answersDiv.prepend(container);

    divs.forEach((div, index) => {
        setTimeout(() => {
            div.classList.remove('active');
        }, index * 700 + 100);

        //3 = AGE;  2 = HEIGHT;
        setTimeout(() => {
            div.classList.remove('animation-fix');

            if (index == 3){
                if (GD["AgeArrow"] == 'higher'){
                    div.classList.add('square-up')
                } else if (GD["AgeArrow"] == 'lower'){
                    div.classList.add('square-down')
                } else if (GD['AgeArrow'] == 'undefined'){
                    div.classList.add('square-unknown')
                }
            }

            if (index == 2){
                if (GD["HeightArrow"] == 'higher'){
                    div.classList.add('square-up')
                } else if (GD["HeightArrow"] == 'lower'){
                    div.classList.add('square-down')
                } else if (GD['HeightArrow'] == 'undefined'){
                    div.classList.add('square-unknown')
                }
            }

        }, index * 700 + 100 + 350);
    });
}


function loadDailyCharacterFetch() {
    return fetch('/load_daily_character_stats')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

async function loadWinningDiv(){
    let charAnswer = await answer
    charAnswer = charAnswer['Character']

    let winningDiv = document.querySelector('.win-screen');

    let imgtextdiv = document.createElement('div')
    imgtextdiv.classList.add("win-answer")

    let imgdiv = document.createElement('div');
    let portrait = document.createElement('img');
    portrait.src = "/static/img/Character-Portraits/" + charAnswer + '.png';
    imgdiv.appendChild(portrait)

    let textdiv = document.createElement('div');
    let spanElement = document.createElement('span');
    let brElement = document.createElement('br');
    let spanElement2 = document.createElement('span');
    spanElement.classList.add("win-answer-text");
    spanElement2.classList.add("win-answer-name");
    spanElement.textContent = "You guessed";
    spanElement2.textContent = charAnswer;

    textdiv.appendChild(spanElement)
    textdiv.appendChild(brElement)
    textdiv.appendChild(spanElement2)

    imgtextdiv.appendChild(imgdiv)
    imgtextdiv.appendChild(textdiv)

    let nbdiv = document.createElement('div');
    nbdiv.classList.add("nb-trys")
    nbdiv.textContent = "You took " + numOfGuesses + " number of tries"

    let timerdiv = document.querySelector('.timer-info');

    winningDiv.appendChild(imgtextdiv)
    winningDiv.appendChild(nbdiv)

    console.log(timerdiv)

    winningDiv.appendChild(timerdiv)
}

function correctGuessTriggered(){
    let winningDiv = document.querySelector('.win-screen');
    winningDiv.style.display = 'flex';
    loadWinningDiv()
}