window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();

const icon = document.querySelector('i.fa.fa-microphone')
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');

const sound = document.querySelector('.sound');

let raiseHand = document.getElementById('raise-hand');
let muteButton = document.getElementById('mute-unmute');
let okButton = document.getElementById('ok');
let endButton = document.getElementById('endbutton');


const func = async () => {
    while (true) {
        console.log("hello")
        await fetch("/feature_feed").then(resp => resp.json()).then(data => {
            console.log(data)
            if (data.Face == 'No face found') {
                muteButton.innerHTML = "Unmute";
            }
            else if (data.Handraise == 'hand') {
                raiseHand.innerHTML = "Lower Hand";
            }
            else if (data.Handraise == 'no hand') {
                raiseHand.innerHTML = "Raise Hand";
            }

        })
    }
}

func()

icon.addEventListener('click', () => {
    sound.play();
    dictate();
});

const dictate = () => {
    recognition.start();
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;

        container.appendChild(paragraph);

        paragraph.textContent = speechToText;

        if (event.results[0].isFinal) {

            if (speechToText == 'mute') {
                muteButton.innerHTML = "Unmute";
            };

            if (speechToText == 'Unmute') {
                muteButton.innerHTML = "Mute";
            };
            if (speechToText == 'raise hand') {
                raiseHand.innerHTML = "Lower Hand";
            };

            if (speechToText === 'lower hand') {
                raiseHand.innerHTML = "Raise Hand";
            };

            if (speechToText === 'I agree') {
                okbutton.innerHTML = "ok";
            };

            if (speechToText === 'ok') {
                okbutton.innerHTML = "I agree";
            };

            if (speechToText === 'leave meeting') {

                setTimeout(() => { alert("Meeting has ended"); }, 2000);
            };

            if (speechToText.includes('what is today\'s date')) {
                alert("Hello");
                speak(getDate);
            };

            if (speechToText.includes('what is the weather in')) {
                getTheWeather(speechToText);
            };
        }
    }
}


const speak = (action) => {
    utterThis = new SpeechSynthesisUtterance(action());
    synth.speak(utterThis);
};

const getTime = () => {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};

const getDate = () => {
    const time = new Date(Date.now())
    return `today is ${time.toLocaleDateString()}`;
};

const getTheWeather = (speech) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`)
        .then(function (response) {
            return response.json();
        })
        .then(function (weather) {
            if (weather.cod === '404') {
                utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
                synth.speak(utterThis);
                return;
            }
            utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
            synth.speak(utterThis);
        });
};