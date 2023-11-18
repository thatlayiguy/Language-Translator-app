const fromText = document.querySelector(".from-text"), 
toText = document.querySelector(".to-text"), 
selectTag = document.querySelectorAll("select"),
exchangeIcon = document.querySelector(".exchange"),
translateBtn = document.querySelector("button");
icons = document.querySelectorAll(".row i")


selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        let selected;
        if(id == 0 && country_code == "en-GB"){
            selected = "selected";
        }else if(id == 1 && country_code == "hi-IN"){
            selected = "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); // adds options tag into select tag
    }

});

exchangeIcon.addEventListener("click", () =>{
    // to exahnge the fromText and selectTag values
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () =>{
    let text = fromText.value,
    translateFrom = selectTag[0].value,     //gets fromSelect tag value
    translateTo = selectTag[1].value;       //gets toSelect tag value
    if(!text) return;
    toText.setAttribute("placeholder","translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    /*fetchs api response and returns it with parsing into js obj and receives it in another then method*/
    fetch(apiUrl).then(res => res.json()).then(data =>{
        console.log(data);
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) =>{
        if(target.classList.contains("fa-copy")){
            //if the clicked icon has a from id, copy the fromtext value else copy the totext value
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            //if the clicked icon has a from id, speak the fromtext value else speak the totext value
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;  //set the utterance language to fromselect tag value
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;  //set the utterance language to toselect tag value
            }
            speechSynthesis.speak(utterance); // to speak the text
        }
    })
});
