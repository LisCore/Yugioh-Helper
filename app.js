//elements
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");

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
    if (transcript.includes("effect of")) {
        let cardName = transcript.split(" ");
        transcript.replace(/['"]+/g, '').trim();
        cardName.splice(0, 2);
        console.log(cardName);
        cardName = cardName.join(" ");
        fetchCardInfo(cardName);
    }
    // const regex = /what does (.+) do\?/;
    // const match = transcript.match(regex);
    // if (match && match[1]) {
    //     const cardName = match[1];
    //     fetchCardInfo(cardName);
    // }
    // else {
    //     const regex = /what does (.+) do\?/;
    //     const match = transcript.match(regex);
    //     if (match && match[1]) {
    //         const cardName = match[1];
    //         console.log("Detected 'what does [card name] do?'", cardName);
    //         fetchCardInfo(cardName);
    //     }
    // }
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
    readOut("Hello Duelist!");
});

window.onload = function () {
    readOut(" ");
}

// function fetchCardInfo(cardName) {
//     const apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cardName)}`;
//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             if (data.data && data.data.length > 0) {
//                 const card = data.data[0];
//                 const cardDescription = `${card.name} is a ${card.type} with ${card.atk} attack and ${card.def} defense. ${card.desc}`;
//                 readOut(cardDescription);
//             } else {
//                 readOut(`Sorry, I couldn't find any information about ${cardName}.`);
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching card data:', error);
//             readOut('There was an error fetching the card information.');
//         });
// }
//This function fetches the local db, and if there is a match, read out the effect of card. 
function fetchCardInfo(cardName) {
    // Path to your JSON file; this could also be a URL
    const filePath = './db/YGO.json';
    console.log(filePath);
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            const cards = data.data;
            const card = cards.find(c => c.name.toLowerCase().replace(/["]+/g, '').trim() === cardName.toLowerCase());
            if (card) {
                const cardDescription = `${card.name} is a ${card.type} with ${card.atk} attack and ${card.def} defense. ${card.desc}`;
                readOut(cardDescription);
            } else {
                readOut(`Sorry, I couldn't find any information about ${cardName}.`);
                console.log(cardName);
            }
        })
        .catch(error => {
            console.error('Error fetching file:', error);
            readOut('There was an error fetching the card information.');
        });
}
