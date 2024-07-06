// import Fuse from 'fuse.js';

//elements
const startBtn = document.querySelector("#speech");
const stopBtn = document.querySelector("#no-speech");
const speakBtn = document.querySelector("#motivation");

//Speech recognition setup
//this is for browser speech recognition
const speechRecognition =
    window.speechRecognition || window.webkitSpeechRecognition;

const recognition = new speechRecognition();

//SR start
recognition.onstart = function (event) {
    console.log("vr active");
};

//SR result
recognition.onresult = function (event) {
    let current = event.resultIndex;
    let transcript = event.results[current][0].transcript;
    transcript = transcript.toLowerCase();
    console.log("This is the transcript: " + transcript);
    // readOut(transcript);
    if (transcript.includes("hey yugi")) {
        readOut("Hello Duelist");
    }
    if (transcript.includes("open youtube")) {
        readOut("opening youtube!");
        window.open("https://www.youtube.com/");
    }
    if (transcript.includes("open tcgplayer")) {
        readOut("opening card database!");
        window.open("https://www.tcgplayer.com/")
    }
    //google search
    if (transcript.includes("search for")) {
        readOut("here's the result:");
        let input = transcript.split("");
        input.splice(0, 11);
        //seems like google does not include punctuations
        // input.pop();
        input = input.join("").split(" ").join("+");
        console.log(input);
        window.open(`https://www.google.com/search?q=${input}`);
    }
    // youtube
    if (transcript.includes("open youtube")) {
        readOut("opening youtube");
        window.open("https://www.youtube.com/");
        // windowsB.push(a)
    }
    if (transcript.includes("play")) {
        let playStr = transcript.split("");
        playStr.splice(0, 5);
        let videoName = playStr.join("");
        playStr = playStr.join("").split(" ").join("+");
        readOut(`searching youtube for ${videoName}`);
        window.open(`https://www.youtube.com/search?q=${playStr}`);
        // windowsB.push(a);
    }
    if (transcript.includes("card")) {
        let cardName = transcript.split(" ");
        transcript.replace(/['"]+/g, '').trim();
        cardName.splice(0, 1);
        console.log(cardName);
        cardName = cardName.join(" ");
        fetchCardInfo(cardName);
    }
};

//SR stop
recognition.onend = function (event) {
    console.log("vr deactive");
};

//SR continuous
// recognition.continuous = true;

startBtn.addEventListener("click", () => {
    recognition.start();
});

stopBtn.addEventListener("click", () => {
    recognition.stop();
});

//Yugi Speech
function readOut(message) {
    const speech = new SpeechSynthesisUtterance();
    //different voices
    // const allVoices = speechSynthesis.getVoices();
    speech.text = message;
    // speech.voice = allVoices[10];
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
    console.log("speaking out");
}

//example
speakBtn.addEventListener("click", () => {
    // readOut("hello, my name is Yugi, it's time to DUEL!");
    readOut("Maxx C");
});

window.onload = function () {
    readOut(" ");
}


//This is for fetching the info from API
//Chose to create local db because limitations of API noted in documentation
//Will be needed if no updates made as new sets come out
function fetchCardInfo(cardName) {
    const filePath = './db/YGO.json';
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            const cards = data.data;
            const searchString = cardName.toLowerCase()
                .replace(/[",:\-*★]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            const card = cards.find(c => {
                const processedName = c.name.toLowerCase()
                    .replace(/[",:\-*★]+/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                return processedName === searchString;
            });

            if (card) {
                const cardDescription = `${card.name} is a ${card.type} with ${card.atk} attack and ${card.def} defense. ${card.desc}`;
                readOut(cardDescription);

                displayCard(card);
            } else {
                readOut(`Sorry, I couldn't find any information about ${cardName}.`);
                const firstWord = getFirstWord(searchString);
                console.log(`query: ${firstWord}`);
                // Handle search for partial matches using searchString
                const partialMatches = cards.filter(c => c.name.toLowerCase().replace(/[",:\-*★]+/g, '').includes(firstWord));
                if (partialMatches.length > 0) {
                    readOut(`Here is a list of matching cards:`);
                    partialMatches.forEach(element => {
                        console.log(`${element.name} - ${element.type}`);
                    });
                } else {
                    readOut("No matching cards found.");
                    console.log(cardName);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching file:', error);
            readOut('There was an error fetching the card information.');
        });
}

function getFirstWord(fullString) {
    const words = fullString.split(" "); // Splits the string into an array of words
    return words[0];
}

//this function sends back an image link for display
function displayCard(card) {
    const cardHolder = document.querySelector(".card-holder");
    const cardContainer = document.createElement("div");
    cardContainer.className = "ygo-card";
    let cardPhoto = document.createElement("img");
    // cardPhoto.className = "ygo-card";
    let cardId = card.card_images[0].id;
    cardPhoto.src = `https://images.ygoprodeck.com/images/cards/${cardId}.jpg`
    cardPhoto.alt = card.name;
    cardContainer.appendChild(cardPhoto);

    //create the desc of the card
    let cardDesc = document.createElement("span");
    cardDesc.className = "ygo-desc";
    cardDesc.textContent = `${card.name}\nType: ${card.type}\n${card.type.includes("Monster") ? `ATK: ${card.atk}\nDEF: ${card.def}\n` : "N/A"}.\n${card.desc}`;
    cardContainer.appendChild(cardDesc);
    cardHolder.appendChild(cardContainer);
}
// function displayCard(card) {
//     const cardHolder = document.querySelector(".card-holder");
//     let cardPhoto = document.createElement("img");
//     cardPhoto.src = "./images/card-back.png";

// }