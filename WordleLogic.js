var randomWordApi = "https://random-word-api.herokuapp.com/word?length=5";
// var wordleWord = "";

var width = 5;
var height = 6;

var row = 0;
var col = 0;

async function randomWordleWord(randomWordApi) {
  try {
    let result = await fetch(randomWordApi);
    let word = await result.text();
    return word.substring(2, 7).toUpperCase();
     
  } catch (err) {
    console.log("Error: " + err);
  }
}

async function initializeGame(randomWordApi) {

  const wordleWord = await randomWordleWord(randomWordApi);

  console.log(wordleWord);

  async function isWordValid(r, c) {
    let api = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    let enteredWord = "";
    for (var i = 0; i < width; i++) {
      enteredWord =
        enteredWord +
        document.getElementById("r" + r.toString() + "c" + i.toString())
          .innerText;
    }
    api = api + enteredWord;
    try {
      const response = await fetch(api);
      if (response.ok) return true;
      else return false;
    } catch (err) {
      console.log("Error: " + err);
      return false;
    }
  }

  function initializeMap() {
    let letterFrequency = new Map();
    for (let i = 0; i < 5; i++) {
      if (letterFrequency.has(wordleWord[i])) {
        letterFrequency[wordleWord[i]]++;
      } else letterFrequency[wordleWord[i]] = 1;
    }
    return letterFrequency;
  }

  function isLetter(keyInput) {
    if (keyInput >= "a" && keyInput <= "z") return true;
    else if (keyInput.length === 1 && keyInput >= "A" && keyInput <= "Z")
      return true;
    return false;
  }

  function gameOver(win) {
    col = width + 1;
    row = height + 1;
    if (win) {
      alert("Badhaai Ho!! Jeet gaye tum, the word was " + wordleWord);
    } else alert("Tum Rehne do bhai!!, the word was " + wordleWord);
  }

  function checkWord(r, c) {
    let letterFrequency = initializeMap(); //stores the key value of wordle word
    var howManyLettersCorrect = 0;

    for (let j = 0; j < width; j++) {
      var currElement = document.getElementById(
        "r" + r.toString() + "c" + j.toString()
      );
      if (currElement.innerText == wordleWord[j]) {
        currElement.classList.add("correct");
        howManyLettersCorrect++;
        letterFrequency[currElement.innerText]--;
      }
    }

    for (var i = 0; i < width; i++) {
      var currElement = document.getElementById(
        "r" + r.toString() + "c" + i.toString()
      );
      if (letterFrequency[currElement.innerText] > 0) {
        currElement.classList.add("present");
        letterFrequency[currElement.innerText]--;
      } else if (!currElement.classList.contains("correct"))
        currElement.classList.add("absent");
    }

    if (howManyLettersCorrect == 5) gameOver(true);
    else if (r == height - 1) gameOver(false);
  }

  document.addEventListener("keyup", async function (event) {
    var letter = event.key;
    console.log(letter);

    if (letter === "Backspace") {
      if (col <= width && col > 0) {
        col--;
        document.getElementById(
          "r" + row.toString() + "c" + col.toString()
        ).innerText = "";
      }
    } else if (letter === "Enter") {
      if (await isWordValid(row, col)) {
        if (row == height - 1 && col == width) {
          checkWord(row, col);
        } else if (col == width) {
          checkWord(row, col);
          row++;
          col = 0;
        }
      } else {
        alert("This is not a valid word");
      }
    } else if (isLetter(letter)) {
      if (col < width) {
        var currentBlock = this.getElementById(
          "r" + row.toString() + "c" + col.toString()
        );
        currentBlock.innerText = letter.toUpperCase();
        col++;
      }
    }
  });
}
initializeGame(randomWordApi);
