const textContainer = document.getElementById("textContainer");
const textGenerator = document.getElementById("textGenerator");
const caret = document.getElementById("caret");
const speed = document.getElementById("speed");
const accuracy = document.getElementById("accuracy");

const word = document.createElement("div");
word.classList.add("word");

const letter = document.createElement("span");
letter.classList.add("letter");

let currentLetter;
let startTime;
let timeStarted = false;
let allTries;
let currectTries;
let t;

//Получение ссылки на текст
let getRowText =  async () => {
    let url = "https://fish-text.ru/get";
    let req = await fetch(url, {
        type: "sentence",
        number: 4,
        format: "JSON"
    })
    let res = await req.json();
    prepareText(res);
    console.log(res.text);
}

//Подготовка текста
let prepareText = (res) => {
    allTries = 0;
    currectTries = 0;
    textContainer.textContent = ""    

    let text = res.text.split(" ").map(w => {
        let wt = word.cloneNode();
        w.split("").forEach(l => {
            let lt = letter.cloneNode();
            switch(l){
                case '\u8212':
                    lt.textContent = '-'
                    break;
                case 'ё':
                    lt.textContent = 'е';
                    break;
                default:
                    lt.textContent = l;
                    break;
                }
            wt.append(lt);
        });
        textContainer.append(wt)
    });
    LetterEvents.currentWord = 0;
    LetterEvents.currentLetter = 0;
    currentLetter = textContainer.children[0].children[0];
    caret.style.display = "block";
    caret.style.left = currentLetter.getBoundingClientRect().left + "px";
    caret.style.top = currentLetter.getBoundingClientRect().top + 3 + "px";
    timeStarted = false;
}

class LetterEvents {
    static currentWord = 0;
    static currentLetter = 0;
    static conteiner = textContainer;

    //Проверка клавиши
    static colorNextLetter(key){
        let e = this.conteiner.children[this.currentWord].children;
        if("qwertyuiopasdfghjklzxcvbnm,.=.?/!:;'\"йцукенгёшщзхъфывапролджэячсмитьбю".includes(key.toLowerCase())){
            if(key === e[this.currentLetter].textContent){
                e[this.currentLetter].classList.add("correct");
                currentLetter = e[this.currentLetter];
                caret.style.left = currentLetter.getBoundingClientRect().left + currentLetter.offsetWidth + "px";
                caret.style.top = currentLetter.getBoundingClientRect().top + 3 + "px";
                this.currentLetter += 1;
                currectTries++;
                allTries++;
            } else {
                e[this.currentLetter].classList.add("wrong");
                allTries++;
            }
        } else if((key === " ") && (this.currentLetter === e.length)){
            this.currentLetter = 0;
            this.currentWord += 1;
            currectTries++;
            allTries++;
            caret.style.left = currentLetter.getBoundingClientRect().left + currentLetter.offsetWidth + 6 + "px";
        }
    }
    
    //Рассчет скорости и точности 
    static accuracySpeed(){
        speed.textContent = Math.floor((currectTries * 1000 * 60) / (Date.now() - startTime))
        accuracy.textContent = Math.floor((currectTries/allTries) * 100);
    }
}

//Генерация текста и начало скрипта
getRowText();

//Генерация текста по нажатию крнопки
textGenerator.addEventListener("click", () => {
    getRowText(); 
});

// Нажатие клавиши
window.addEventListener("keydown", (e) => {
    e.preventDefault(); 
    LetterEvents.colorNextLetter(e.key)
    if(!timeStarted){
        startTime = Date.now();
        timeStarted = true;
        setInterval(() => LetterEvents.accuracySpeed(), 1000)
    }
});
