
const guessbox = document.querySelector(".guessbox");
options = guessbox.querySelector(".options");
searchInp = guessbox.querySelector("input");

//Array we will store the characters in
let characters = ["Subaru", "Miku", "Tyler", "Emilia", "Test", "More", "C++", "openGL", "ASDFHECK", "test boobs", "Joe Biden"];
let alreadyChosenCharacters = []

function addCharacter(characters)
{
    //Adds all the characters to the options list
    //Will need to update in the future the IMG PATH
    //This will be used to reference the img path... of course
    characters.forEach(char => {
        let div = `<div onclick="updateChoice(this, '${char}')" class="character-item">
                       <div class="character-select">
                           <div>
                               <img src="img/miku.jpg">
                           </div>
                        <div>
                            ${char}
                        </div>
                        </div>
                    </div>`;

        options.insertAdjacentHTML("beforeend", div);
    });
}

searchInp.addEventListener("keyup", () =>{
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
})

function updateChoice(div, character)
{
    console.log("Just selected the character " + character);
    characters = characters.filter(item => item !== character);
    alreadyChosenCharacters.push(character);
    options.innerHTML = '';
}