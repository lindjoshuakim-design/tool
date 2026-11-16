let testText = "The quick brown fox jumps over the lazy dog.";
let startTime, endTime;

function startTest() {
    // Set the test text
    document.getElementById("inputText").value = testText;

    // Reset user input and output
    let userInput = document.getElementById("userInput");
    userInput.value = "";
    userInput.readOnly = false;
    userInput.focus();

    document.getElementById("output").innerHTML = "";

    // Start timer
    startTime = new Date().getTime();
}

function endTest() {
    // Prevent running endTest if the test hasn't started
    if (!startTime) return;

    endTime = new Date().getTime();

    // Disable user input
    document.getElementById("userInput").readOnly = true;

    // Calculate time elapsed and words per minute (WPM)
    var timeElapsed = (endTime - startTime) / 1000; // in seconds
    var userTypedText = document.getElementById("userInput").value;
    var isHardMode = document.getElementById("hardModeToggle").checked;

    // Split the text using regex to count words correctly
    var typedWords = userTypedText.split(/\s+/).filter(function (word) {
        return word !== "";
    }).length;

    var wpm = 0;
    if (timeElapsed !== 0 && !isNaN(typedWords)) {
        wpm = Math.round((typedWords / timeElapsed) * 60);
    }

    // Calculate accuracy based on Easy vs. Hard mode
    var accuracy = 0;

    if (isHardMode) {
        // HARD MODE: Strict character-by-character alignment
        var correctChars = 0;
        var maxLength = Math.max(testText.length, userTypedText.length);

        for (var i = 0; i < userTypedText.length; i++) {
            if (userTypedText[i] === testText[i]) {
                correctChars++;
            }
        }
        accuracy = maxLength > 0 ? Math.round((correctChars / maxLength) * 100) : 0;
    } else {
        // EASY/NORMAL MODE: Forgives extra spaces and compares word-by-word
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

    // Display the results
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Typing Test Results (" + (isHardMode ? "Hard Mode" : "Easy Mode") + "):</h2>" +
        "<p>Words Typed: " + typedWords + "</p>" +
        "<p>Time Elapsed: " + timeElapsed.toFixed(2) + " seconds</p>" +
        "<p>Words Per Minute (WPM): " + wpm + "</p>" +
        "<p>Accuracy: " + accuracy + "%</p>";
}

// End test immediately when Enter is pressed inside the typing box
document.getElementById("userInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (!this.readOnly && startTime) {
            endTest();
        }
    }
});
