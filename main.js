class Word{
    id = 1;
    word = "";
    translate = "";

    constructor(word, translate) {
        let count_words = JSON.parse(localStorage.getItem("base_words"));
        if(count_words.length) {
            let max = count_words.reduce((a, b) => a.id > b.id ? a : b);
            count_words = max.id;
        }else {count_words = 0;}
        this.id = ++count_words;
        this.word = word;
        this.translate = translate;
    }

    get id(){ return this.id;}
    set id(value){this.id = value;}
    get word(){ return this.word;}
    set word(value){this.word = value;}
    get translate(){ return this.translate;}
    set translate(value){this.translate = value;}
}
class Dictionary{
    base_words = [];
    constructor() {
        if(localStorage.getItem("base_words")){
            this.base_words = JSON.parse(localStorage.getItem("base_words"));
        }else {
            localStorage.setItem("base_words", JSON.stringify(this.base_words));
        }
    }
    get base_words(){return this.base_words;}

    addWordIntoDictionary(word){
        document.querySelector("#search-input"). value = "";
        document.querySelector('#letter-select')[0].selected = true;
        document.querySelector('#sort-select')[0].selected = true;
        dictionary.sortWordsInDictionary(1);
        regenerateTable(dictionary.base_words);
        this.base_words.push(word);
        localStorage.removeItem("base_words");
        localStorage.setItem("base_words", JSON.stringify(this.base_words));
    }
    searchWordsInDictionary(word){
        document.querySelector('#letter-select')[0].selected = true;
        let elements = [];
        this.base_words.forEach((element) => {
            if(element.word.includes(word) || element.translate.includes(word)){
                elements.push(element);
            }
        });
        return elements;
    }
    filterWordsByLetter(language, letter){
        document.querySelector("#search-input"). value = "";
        let elements = [];
        if (letter == "Всі"){return dictionary.base_words;}
        if(language == "EN"){
            this.base_words.forEach((element) => {
                if(element.word[0] == letter){
                    elements.push(element);
                }
            });
        }else{
            this.base_words.forEach((element) => {
                if(element.translate[0] == letter){
                    elements.push(element);
                }
            });
        }
        return elements;
    }
    sortWordsInDictionary(type){
        document.querySelector("#search-input"). value = "";
        document.querySelector('#letter-select')[0].selected = true;
        this.base_words.sort((a, b) => {
            if(type == 1){return a.id < b.id ? 1 : -1;}
            if(type == 2){return a.id > b.id ? 1 : -1;}
            if(type == 3){return a.word > b.word ? 1 : -1;}
            if(type == 4){return a.word < b.word ? 1 : -1;}
        });
        return this.base_words;
    }

    deleteWordFromDictionary(id){
        for (let i=0;i<this.base_words.length;i++){
            if(id == this.base_words[i].id){
                this.base_words.splice(i, 1);
            }
        }

        localStorage.removeItem("base_words");
        localStorage.setItem("base_words", JSON.stringify(this.base_words));
    }

    showDictionary(){
        console.log(this.base_words);
    }
}

let dictionary = new Dictionary();
dictionary.sortWordsInDictionary(1);
regenerateTable(dictionary.base_words);

window.onload = function (){
    // Додавання слова в словник
    document.querySelector("#save-word").addEventListener("click", function (event) {
        let word = document.querySelector("#en-input").value;
        let translate = document.querySelector("#ua-input").value;
        let d_word = new Word(word, translate);
        dictionary.addWordIntoDictionary(d_word);
        document.querySelector("#main-table").insertAdjacentHTML('afterbegin', "<tr id="+d_word.id+"><td>" + d_word.id +"</td><td>"+d_word.word+"</td><td>"+d_word.translate+"<i onclick='deleteWord(this)' class=\"bi bi-x-lg float-end\"></i></td></tr>");
        document.querySelector("#en-input").value = "";
        document.querySelector("#ua-input").value = "";
    });
    //Пошук слів у словнику
    document.querySelector("#search-word").addEventListener('click', function (event){
        let word = document.querySelector("#search-input").value;
        let words = dictionary.searchWordsInDictionary(word);
        regenerateTable(words);
    });
    //Сортування слів у словнику
    document.querySelector("#sort-select").addEventListener("change", function (event){
        dictionary.sortWordsInDictionary(event.target.value);
        regenerateTable(dictionary.base_words);
    });

    document.querySelectorAll("input[name='check-letter']").forEach((input) => {
        input.addEventListener('change', function (event){
            let en_letter = ['Всі','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            let ua_letter = ['Всі','а','б','в','г','ґ','д','е','є','ж','з','и','і','ї','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ь','ю','я'];
            if(input.checked){
                let select = document.querySelector("#letter-select");
                select.innerHTML = '';
                console.log(select);
                if(input.id == "EN"){
                    for (let l of en_letter){
                        select.insertAdjacentHTML('beforeend', "<option value='"+l+"'>"+l+"</option>");
                    }
                }
                else{
                    for (let l of ua_letter) {
                        select.insertAdjacentHTML('beforeend', "<option value='" + l + "'>" + l + "</option>");
                    }
                }
            }
            let letter = document.querySelector("#letter-select").value;

        });
    });
    //Фільтрація слів по букві
    document.querySelector("#letter-select").addEventListener("change", function (event){
        let languages = document.querySelectorAll('input[name="check-letter"]');
        let language;
        for (let l of languages) {
            if (l.checked) {
                language = l.id;
            }
        }
        let words = dictionary.filterWordsByLetter(language, event.target.value);
        regenerateTable(words);
    });
}

//Видалення елемента
function deleteWord(element){
    dictionary.deleteWordFromDictionary(element.parentNode.parentNode.id);
    element.parentNode.parentNode.remove();
}

function regenerateTable(elements){
    let table = document.querySelector("#main-table");
    table.innerHTML = "";
    for(let e of elements){
        table.insertAdjacentHTML('beforeend', "<tr id='"+e.id+"'><td>" + e.id +"</td><td>"+e.word+"</td><td>"+e.translate+"<i onclick='deleteWord(this)' class=\"bi bi-x-lg float-end\"></i></td></tr>");
    }
}
