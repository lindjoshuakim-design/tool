const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
    "The five boxing wizards jump quickly.",
    "Waltz, bad nymph, for quick jigs vex."
];

// Pool of common words for Random Words Mode
const wordBank = [
    "time", "year", "people", "way", "day", "man", "thing", "woman", "life", "child",
    "world", "school", "state", "family", "student", "group", "country", "problem",
    "hand", "part", "place", "case", "week", "company", "system", "program", "question",
    "work", "government", "number", "night", "point", "home", "water", "room", "mother",
    "area", "money", "story", "fact", "month", "lot", "right", "study", "book", "eye",
    "job", "word", "business", "issue", "side", "kind", "head", "house", "service",
    "friend", "father", "power", "hour", "game", "line", "end", "member", "law", "car"
];

let testText = "";
let startTime, endTime;

// Builds a string of N random words joined by spaces
function generateRandomWords(wordCount = 50) {
    let chosenWords = [];
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * wordBank.length);
        chosenWords.push(wordBank[randomIndex]);
    }
    return chosenWords.join(" ");
}

function renderHighlightedText(typedText) {
    const textDisplay = document.getElementById("textDisplay");
    textDisplay.innerHTML = "";

    for (let i = 0; i < testText.length; i++) {
        const charSpan = document.createElement("span");
        charSpan.textContent = testText[i];

        if (i < typedText.length) {
            if (typedText[i] === testText[i]) {
                charSpan.classList.add("correct");
            } else {
                charSpan.classList.add("incorrect");
            }
        } else if (i === typedText.length) {
            charSpan.classList.add("current");
        }

        textDisplay.appendChild(charSpan);
    }
}

function startTest() {
    const isWordMode = document.getElementById("wordModeToggle").checked;

    if (isWordMode) {
        // Generate 15 random words
        testText = generateRandomWords(15);
    } else {
        // Pick a random sentence without repeating the last one
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * sentences.length);
        } while (sentences.length > 1 && sentences[randomIndex] === testText);

        testText = sentences[randomIndex];
    }

    // Reset user input and output
    let userInput = document.getElementById("userInput");
    userInput.value = "";
    userInput.readOnly = false;
    userInput.focus();

    renderHighlightedText("");
    document.getElementById("output").innerHTML = "";

    startTime = new Date().getTime();
}

function endTest() {
    if (!startTime) return;

    endTime = new Date().getTime();
    document.getElementById("userInput").readOnly = true;

    var timeElapsed = (endTime - startTime) / 1000;
    var userTypedText = document.getElementById("userInput").value;
    var isHardMode = document.getElementById("hardModeToggle").checked;

    var typedWords = userTypedText.split(/\s+/).filter(function (word) {
        return word !== "";
    }).length;

    var wpm = 0;
    if (timeElapsed !== 0 && !isNaN(typedWords)) {
        wpm = Math.round((typedWords / timeElapsed) * 60);
    }

    var accuracy = 0;

    if (isHardMode) {
        var correctChars = 0;
        var maxLength = Math.max(testText.length, userTypedText.length);

        for (var i = 0; i < userTypedText.length; i++) {
            if (userTypedText[i] === testText[i]) {
                correctChars++;
            }
        }
        accuracy = maxLength > 0 ? Math.round((correctChars / maxLength) * 100) : 0;
    } else {
        var targetWords = testText.trim().split(/\s+/);
        var cleanUserWords = userTypedText.trim().split(/\s+/).filter(function (word) {
            return word !== "";
        });
        var correctWords = 0;

        for (var i = 0; i < cleanUserWords.length; i++) {
            if (cleanUserWords[i] === targetWords[i]) {
                correctWords++;
            }
        }
        accuracy = targetWords.length > 0 ? Math.round((correctWords / targetWords.length) * 100) : 0;
    }

    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Typing Test Results (" + (isHardMode ? "Hard Mode" : "Easy Mode") + "):</h2>" +
        "<p>Words Typed: " + typedWords + "</p>" +
        "<p>Time Elapsed: " + timeElapsed.toFixed(2) + " seconds</p>" +
        "<p>Words Per Minute (WPM): " + wpm + "</p>" +
        "<p>Accuracy: " + accuracy + "%</p>";
}

document.getElementById("userInput").addEventListener("input", function() {
    if (!this.readOnly && startTime) {
        renderHighlightedText(this.value);
    }
});

document.getElementById("userInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (!this.readOnly && startTime) {
            endTest();
        }
    }
});
