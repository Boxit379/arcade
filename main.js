// Classes

class Choice {
    constructor(id, text, options, required, blocked) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.required = required;
        this.blocked = blocked;
    }
}

class Option {
    constructor(text, effect, event, eventRemoved) {
        this.text = text;
        this.effect = effect;
        this.event = event;
        this.eventRemoved = eventRemoved;
    }
}

// Variables
const choiceDiv = document.getElementById("choice");
const gameOverDiv = document.getElementById("game-over");

let choices = [
    new Choice(0, "There aren't enough homes for everyone. What should we do?", [
        new Option("Build some more", [-20,10,0,10]),
        new Option("Let them live on the streets", [0,-10,0,-10])
        ], null, null),
    new Choice(1, "Some gatherers came across another tribe. Should we form an alliance?", [
        new Option("Yes", [0,10,10,0], "alliance"),
        new Option("No")
        ], null, "alliance"),
    new Choice(2, "The tribe is getting bigger, and we need more food. What should we do?", [
        new Option("Hunt more", [0,10,0,10]),
        new Option("Build more farms", [-20,10,0,20])
        ], null, null),
    new Choice(3, "The alliance we formed went through a famine and needs food. What should we do?", [
        new Option("Send them food", [-10,0,0,0]),
        new Option("Let them starve")
        ], "alliance", null),
    new Choice(4, "The alliance we formed is under attack! What should we do?", [
        new Option("Send them reinforcements", [0,0,-10,0]),
        new Option("They can handle it")
        ], "alliance", null),
    new Choice(5, "The alliance we formed sent us some resources as a gift!", [
        new Option("Accept it", [10,10,10,10]),
        new Option("Decline it", [0,0,0,0])
        ], "alliance", null),
    new Choice(6, "Your people want to build a shrine to worship the gods.", [
        new Option("That's a great idea!", [0,10,0,0], "religion"),
        new Option("I am their god", [0,-10,0,0], "atheism")
        ], null, "religion"),
]
let currentEvents = [];
let stats = {
    economy: 50,
    happiness: 50,
    safety: 50,
    infrastructure: 50
}
let year = 0;

// Functions
function updateUI() {
    document.getElementById("economy").style.height = `${stats.economy}%`;
    document.getElementById("happiness").style.height = `${stats.happiness}%`;
    document.getElementById("safety").style.height = `${stats.safety}%`;
    document.getElementById("infrastructure").style.height = `${stats.infrastructure}%`;

    document.getElementById("economy").style.backgroundColor = `${stats.economy > 20 ? stats.economy >= 80 ? "#70f5bc" : "#31be88" : "#D34040"}`;
    document.getElementById("happiness").style.backgroundColor = `${stats.happiness > 20 ? stats.happiness >= 80 ? "#70f5bc" : "#31be88" : "#D34040"}`;
    document.getElementById("safety").style.backgroundColor = `${stats.safety > 20 ? stats.safety >= 80 ? "#70f5bc" : "#31be88" : "#D34040"}`;
    document.getElementById("infrastructure").style.backgroundColor = `${stats.infrastructure >= 20 ? stats.infrastructure > 80 ? "#70f5bc" : "#31be88" : "#D34040"}`;

    if (stats.economy <= 0 || stats.happiness <= 0 || stats.safety <= 0 || stats.infrastructure <= 0) {
        gameOverDiv.style.display = "block";
        choiceDiv.style.display = "none";
        document.getElementById("score").innerHTML = year;
    }
    if (stats.economy >= 100 || stats.happiness >= 100 || stats.safety >= 100 || stats.infrastructure >= 100) {
        gameOverDiv.style.display = "block";
        choiceDiv.style.display = "none";
        document.getElementById("score").innerHTML = year;
    }
}

function updateChoice(choice) {
    choiceDiv.innerHTML = "";
    choiceDiv.innerHTML += `<h1>${choice.text}</h1>`;
    let option;
    for (let i = 0; i < choice.options.length; i++) {
        option = choice.options[i];
        console.log(option.event);
        choiceDiv.innerHTML += `<button onclick='selectOption(${JSON.stringify(option.effect)}, ${JSON.stringify(option.event)}, ${JSON.stringify(option.eventRemoved)})'>${option.text}</button>`;
    }
}

function selectOption(effect, event, eventRemoved) {
    console.log(event);
    if (effect != undefined) {
        stats.economy += effect[0];
        stats.happiness += effect[1];
        stats.safety += effect[2];
        stats.infrastructure += effect[3];
    }
    if (event != undefined) {
        currentEvents.push(event);
    }
    if (eventRemoved != undefined) {
        currentEvents.splice(currentEvents.indexOf(eventRemoved), 1);
    }
    year++;
    updateUI();
    updateChoice(pickChoice());
}

function pickChoice() {
    let availableChoices = [];
    for (let i = 0; i < choices.length; i++) {
        let choiceAvailable = true;
        // Check if required events are active
        if (choices[i].required != null) {
            if (currentEvents.indexOf(choices[i].required) == -1) {
                choiceAvailable = false;
            }
        }
        // Check if blocked events are not active
        if (choices[i].blocked != null) {
            if (currentEvents.indexOf(choices[i].blocked) != -1) {
                choiceAvailable = false;
            }
        }
        // If choice is available, add it to the available choices
        if (choiceAvailable) {
            availableChoices.push(choices[i]);
        }
    }
    // Pick a random choice from the available choices and return it
    return availableChoices[Math.floor(Math.random() * availableChoices.length)];
}

// Main
updateUI();
updateChoice(pickChoice());

// On key press
document.addEventListener("keydown", function (event) {
    if (gameOverDiv.style.display != "block") {
        // If right arrow key is pressed, select right option
        if (event.keyCode == 39) {
            document.getElementById("choice").getElementsByTagName("button")[1].click();
        }
        // If left arrow key is pressed, select left option
        if (event.keyCode == 37) {
            document.getElementById("choice").getElementsByTagName("button")[0].click();
        }
    }
});