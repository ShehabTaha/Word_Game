async function fetchWord() {
  try {
    const response = await fetch("words.json");
    const data = await response.json();
    getRandomWord(data);
    return data;
  } catch (error) {
    console.error("Error fetching word:", error);
  }
}
function getRandomWord(wordList) {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return (word = wordList[randomIndex]);
}

let startGame = () => {
  fetchWord().then((data) => {
    getRandomWord(data);
    function updateDisplay() {
      for (let i = 0; i < 7; i++) {
        let div = document.createElement("div");
        div.classList.add("word");
        for (let j = 0; j < word.length; j++) {
          let input = document.createElement("input");
          input.type = "text";
          input.maxLength = 1;
          input.size = 1;
          input.disabled = true;
          input.classList.add(`l${i}${j}`);
          div.appendChild(input);
        }
        document.body.appendChild(div);
      }
      let divs = document.querySelectorAll(".word");
      let rows = Array.from(divs, (div) =>
        Array.from(div.querySelectorAll("input"))
      );
      return rows;
    }
    let rows = updateDisplay();
    function enableRow(rowIndex) {
      let inputs = rows[rowIndex];
      inputs[0].focus();

      for (let i = 0; i < word.length; i++) {
        inputs[i].oninput = function () {
          this.value = this.value.toLowerCase();
          if (i < word.length - 1) {
            inputs[i + 1].disabled = false;
            inputs[i + 1].focus();
          }
        };
      }
    }
    enableRow(0);
    function checkRow(row) {
      rows[row].forEach((input, index) => {
        if (input.value === word[index] && input.value !== "") {
          input.classList.add("right");
          input.disabled = true;
        } else if (word.includes(input.value) && input.value !== "") {
          input.classList.add("almost");
          input.disabled = true;
        } else {
          input.classList.add("wrong");
          input.disabled = true;
        }
      });
      if (rows[row].every((input, index) => input.value === word[index])) {
        document.querySelector(".won-popup").style.display = "block";
        document.querySelectorAll(".word input").forEach((input) => {
          input.disabled = true;
        });
      }
    }
    let button = document.createElement("button");
    button.innerHTML = "guess";
    button.onclick = function () {
      for (let i = 0; i < rows.length; i++) {
        if (!rows[i][word.length - 1].disabled) {
          checkRow(i);
          if (i < rows.length - 1) {
            enableRow(i + 1);
          } else {
            document.querySelector(".lose-popup").style.display = "block";
            document.getElementById("correct-word").textContent = word;
          }
        }
      }
    };
    document.body.appendChild(button);
  });
};

window.onload = startGame();
