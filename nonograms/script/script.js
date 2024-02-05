window.addEventListener('DOMContentLoaded', () => {


const audioClickLeft = new Audio("sounds/clic.mp3");
const audioClickRight = new Audio("sounds/clic2.mp3");
const audioWin = new Audio("sounds/win.mp3");
let theme = false;
let currentNonogramName = "smile";

function createElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let isModal = false;
let eventHandlers = [];

function addEventHandler(element, eventType, handler) {
  element.addEventListener(eventType, handler);

  eventHandlers.push({ element, eventType, handler });
}
function clearEventHandlers() {
  eventHandlers.forEach(({ element, eventType, handler }) => {
    element.removeEventListener(eventType, handler);
  });

  eventHandlers = [];
}

let array = nonograms[0]["easy"]["smile"];

let arrayGame = array.map((row) => row.map(() => 0));

const gameWrapper = createElement("div", "game__wrapper");
document.body.append(gameWrapper);

const gameTitle = createElement("h1", "game__title");
gameTitle.textContent = "Nonograms game".toUpperCase();
gameWrapper.append(gameTitle);

const gameTimer = createElement("div", "game__timer");
gameTimer.textContent = "Timer: 00:00";
gameWrapper.append(gameTimer);

const gameChangeTheme = createElement("div", "change__theme");
gameChangeTheme.textContent = "click to change theme";
gameWrapper.append(gameChangeTheme);

const nonogramBox = createElement("div", "nonogram__box");
gameWrapper.append(nonogramBox);

const gameBtsn = createElement("div", "btns__wrapper");
gameWrapper.append(gameBtsn);

const listNonograms = createElement("div", "list-nonograms-wrapper");
gameWrapper.append(listNonograms);

// *********************************************
// *********************************************

//BTNS
const btnSolution = createElement("div", "btn__game");
btnSolution.classList.add("btn__solution");
btnSolution.textContent = "Solution";
gameBtsn.append(btnSolution);

const btnResetGame = createElement("div", "btn__game");
btnResetGame.classList.add("btn__reset");
btnResetGame.textContent = "Reset game";
gameBtsn.append(btnResetGame);
btnResetGame.addEventListener("click", resetGame);

const btnSaveGame = createElement("div", "btn__game");
btnSaveGame.classList.add("btn__save");
btnSaveGame.textContent = "Save game";
gameBtsn.append(btnSaveGame);

const btnContinueGame = createElement("div", "btn__game");
btnContinueGame.classList.add("btn__continue");
btnContinueGame.textContent = "Continue saved game";
gameBtsn.append(btnContinueGame);

const btnRandomeGame = createElement("div", "btn__game");
btnRandomeGame.classList.add("btn__randome");
btnRandomeGame.textContent = "Randome game";
gameBtsn.append(btnRandomeGame);

// *********************************************

//Result Table

const resultTable = createElement("div", "result__table");
gameWrapper.append(resultTable);

// *********************************************

gameChangeTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-theme") ? "dark-theme" : ""
  );
});
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
  }
}

loadTheme();

const nonograms__rowTop = createElement("div", "nonograms__row-top");
nonogramBox.append(nonograms__rowTop);
// const
const topNumber = createElement("div", "top__lumber");
nonograms__rowTop.append(topNumber);

const nonograms__rowBottom = createElement("div", "nonograms__row-bottom");
nonogramBox.append(nonograms__rowBottom);
const leftNumber = createElement("div", "lef__lumber");
nonograms__rowBottom.append(leftNumber);

//********************************************/

// Timer

let timerInterval;
let totalTime = 0;
let timerStarted = false;

function startTimer() {
  timerInterval = setInterval(() => {
    totalTime++;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    gameTimer.textContent = `Timer: ${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

//********************************************/
function handleClickBox(i, j) {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }
  const box = document.querySelector(
    `.nonograms__row:nth-child(${i + 1}) .nonograms__box:nth-child(${j + 1})`
  );
  if (!box.classList.contains("cross")) {
    audioClickLeft.play();
    box.classList.toggle("nonograms__box-selected");
    arrayGame[i][j] = box.classList.contains("nonograms__box-selected") ? 1 : 0;
  }
  compareArrays(array, arrayGame);
}

const nonograms__wrapper = createElement("div", "nonograms__wrapper");
nonograms__rowBottom.append(nonograms__wrapper);

function showNonogram(array, element) {
  element.innerHTML = "";
  displayHints(array, topNumber, leftNumber);
  for (let i = 0; i < array.length; i++) {
    const rowElement = createElement("div", "nonograms__row");
    element.append(rowElement);

    for (let j = 0; j < array[i].length; j++) {
      const nonograms__box = createElement("div", "nonograms__box");
      rowElement.append(nonograms__box);

      const handleClickBox = function () {
        if (!timerStarted) {
          startTimer();
          timerStarted = true;
        }
        if (!this.classList.contains("cross")) {
          audioClickLeft.play();
          this.classList.toggle("nonograms__box-selected");
        }

        if (this.classList.contains("nonograms__box-selected")) {
          arrayGame[i][j] = 1;
        } else {
          arrayGame[i][j] = 0;
        }
        compareArrays(array, arrayGame);
      };

      addEventHandler(nonograms__box, "click", handleClickBox);

      function handleRightClickBox(e, i, j) {
        e.preventDefault();
        if (!timerStarted) {
          startTimer();
          timerStarted = true;
        }

        if (!this.classList.contains("nonograms__box-selected")) {
          this.classList.toggle("cross");
          audioClickRight.play();
        }
      }

      addEventHandler(nonograms__box, "contextmenu", handleRightClickBox);
    }
  }
}

showNonogram(array, nonograms__wrapper);

function compareArrays(arr1, arr2, isSolutionView = false) {
  let arraysMatch = true;

  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) return false;

    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        arraysMatch = false;
        break;
      }
    }

    if (!arraysMatch) break;
  }

  if (arraysMatch && !isSolutionView) {
    audioWin.play();
    stopTimer();
    showModal(totalTime);
    resetTimer();
  } else if (!arraysMatch) {
  }

  return arraysMatch;
}

function removeEventListenersFromBoxes() {
  document.querySelectorAll(".nonograms__box").forEach((box) => {
    box.removeEventListener("click", handleClickBox);
    clearEventHandlers();
  });
}

// ***********************************************

function generateRowHints(array) {
  return array.map((row) => {
    const hints = [];
    let count = 0;

    row.forEach((cell) => {
      if (cell === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    });

    if (count > 0) {
      hints.push(count);
    }

    return hints.length > 0 ? hints : [0];
  });
}

function generateColumnHints(array) {
  const columnHints = [];

  for (let j = 0; j < array[0].length; j++) {
    const hints = [];
    let count = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i][j] === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }

    if (count > 0) {
      hints.push(count);
    }

    columnHints.push(hints.length > 0 ? hints : [0]);
  }

  return columnHints;
}

function displayHints(array, nonogramsRowTop, nonogramsRowBottom) {
  const rowHints = generateRowHints(array);
  const columnHints = generateColumnHints(array);

  nonogramsRowTop.innerHTML = "";
  nonogramsRowBottom.innerHTML = "";

  columnHints.forEach((hints) => {
    const columnHintsContainer = createElement("div", "column-hints-container");
    hints.forEach((hint) => {
      const hintElement = createElement("div", "hint-number");
      hintElement.textContent = hint;
      columnHintsContainer.appendChild(hintElement);
    });
    nonogramsRowTop.appendChild(columnHintsContainer);
  });

  rowHints.forEach((hints) => {
    const rowHintsContainer = createElement("div", "row-hints-container");
    hints.forEach((hint) => {
      const hintElement = createElement("div", "hint-number");
      hintElement.textContent = hint;
      rowHintsContainer.appendChild(hintElement);
    });
    nonogramsRowBottom.appendChild(rowHintsContainer);
  });
}
// *********************************
let activeListItem = null;

function showNonogramList(nonograms, level, container) {
  // renderSavedGame();
 
  currentNonogramSelect();
  const levelWrapper = createElement("div", "level-wrapper");

  const title = createElement("h3", "level-title");
  title.textContent = `${level}:`;
  levelWrapper.appendChild(title);

  const list = createElement("ul", "nonogram-list");

  Object.keys(nonograms[level]).forEach((name) => {
    const listItem = createElement("li", "nonogram-list-item");

    listItem.textContent = name;
    listItem.addEventListener("click", function () {
      console.dir(array)
      currentNonogramName = name;
      if (activeListItem) {
        activeListItem.classList.remove("nonogram-list-item-active");
      }

      array = nonograms[level][name];
      arrayGame = array.map((row) => row.map(() => 0));
      totalTime = 0;
      resetTimer();
      showNonogram(array, nonograms__wrapper);

      currentNonogramSelect();

      listItem.classList.add("nonogram-list-item-active");
      activeListItem = listItem;
    });
    list.appendChild(listItem);
  });
  levelWrapper.appendChild(list);

  container.appendChild(levelWrapper);
}

function resetTimer() {
  clearInterval(timerInterval);
  totalTime = 0;
  gameTimer.textContent = "Timer: 00:00";
  timerStarted = false;
}

showNonogramList(nonograms[0], "easy", listNonograms);
showNonogramList(nonograms[1], "medium", listNonograms);
showNonogramList(nonograms[2], "hard", listNonograms);

// *****************************

//Modal

function showModal(time) {
  document.body.style.overflow = "hidden";

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const modal = createElement("div", "modal");
  document.body.append(modal);

  const modalText = createElement("div", "modal__text");
  modalText.textContent = `You solved the nonogram "${currentNonogramName}" in ${minutes} minutes ${seconds} seconds`;
  modal.append(modalText);

  const closeModal = createElement("div", "close__modal");
  closeModal.textContent = "Close";
  modalText.append(closeModal);

  closeModal.addEventListener("click", () => {
    modal.remove();
  });
  isModal = true;
  clearEventHandlers();
}

document
  .querySelector(".nonograms__wrapper")
  .addEventListener("contextmenu", (e) => e.preventDefault());

// ************************************

document.addEventListener("DOMContentLoaded", function () {
  const solutionButton = document.querySelector(".btn__solution");
  if (solutionButton) {
    solutionButton.addEventListener("click", fillSolution);
  }
});

let isSolutionView = false;

function fillSolution() {
  isSolutionView = true;
  removeEventListenersFromBoxes();
  stopTimer();

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const box = document.querySelector(
        `.nonograms__row:nth-child(${i + 1}) .nonograms__box:nth-child(${
          j + 1
        })`
      );
      if (
        array[i][j] === 1 &&
        !box.classList.contains("nonograms__box-selected")
      ) {
        box.classList.add("nonograms__box-selected");
        arrayGame[i][j] = 1;
      } else if (
        array[i][j] === 0 &&
        box.classList.contains("nonograms__box-selected")
      ) {
        box.classList.remove("nonograms__box-selected");
        arrayGame[i][j] = 0;
      }
    }
  }

  compareArrays(array, arrayGame, isSolutionView);
}

function resetGame() {
  arrayGame = array.map((row) => row.map(() => 0));
  showNonogram(array, nonograms__wrapper);
  const modal = document.querySelector(".modal");

  resetTimer();
  if (modal) modal.remove();
}

function currentNonogramSelect() {
  
  document.querySelectorAll(".nonogram-list-item").forEach((item) => {
    item.classList.remove("nonogram-list-item-active");
    if (item.textContent === currentNonogramName) {
      item.classList.add("nonogram-list-item-active");
    }
  });
}

btnSaveGame.addEventListener("click", function () {
  const gameState = {
    arrayGame,
    totalTime,
    currentNonogram: array,
    currentNonogramName,
  };
  localStorage.setItem("nonogramGameState", JSON.stringify(gameState));
  alert("Game saved!");
});

btnContinueGame.addEventListener("click", function () {
  
  const savedGameState = JSON.parse(localStorage.getItem("nonogramGameState"));
  if (savedGameState) {
    arrayGame = savedGameState.arrayGame;
    totalTime = savedGameState.totalTime;
    array = savedGameState.currentNonogram;
    currentNonogramName = savedGameState.currentNonogramName;
    currentNonogramSelect();
    showNonogram(array, nonograms__wrapper);

    if (!timerStarted) {
      startTimer();
      timerStarted = true;
    }
  } else {
    alert("No saved game found!");
  }
  renderSavedGame();
  console.dir(array)
});

function renderSavedGame() {
  nonograms__wrapper.innerHTML = "";

  for (let i = 0; i < arrayGame.length; i++) {
    const rowElement = createElement("div", "nonograms__row");
    nonograms__wrapper.appendChild(rowElement);

    for (let j = 0; j < arrayGame[i].length; j++) {
      const nonogramsBox = createElement("div", "nonograms__box");
      if (arrayGame[i][j] === 1) {
        nonogramsBox.classList.add("nonograms__box-selected");
      }

      nonogramsBox.addEventListener("click", () => handleClickBox(i, j));

      nonogramsBox.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        handleRightClickBox(e, i, j);
      });

      rowElement.appendChild(nonogramsBox);
    }
  }
}


function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


function chooseRandomNonogram() {
  resetTimer();

  const levels = Object.entries(nonograms).map(([level, puzzles]) => ({
    level,
    puzzles,
  }));


  const randomLevel = getRandomElement(levels);
  const puzzles = Object.entries(randomLevel.puzzles).map(
    ([difficulty, puzzles]) => ({
      difficulty,
      puzzles,
    })
  );

  const randomPuzzleType = getRandomElement(puzzles);
  const randomPuzzle = getRandomElement(
    Object.entries(randomPuzzleType.puzzles)
  );

  const [name, arrayN] = randomPuzzle;

  currentNonogramName = name;
  arrayGame = arrayN.map((row) => row.map(() => 0));
  array = arrayN;
  showNonogram(arrayN, nonograms__wrapper);
  currentNonogramSelect();
}

const btnRandomGame = document.querySelector(".btn__randome");
btnRandomGame.addEventListener("click", chooseRandomNonogram);


console.dir(array);




// alert('Уважаемый проверяющий, прошу проверить работу в среду, большое спасибо!')
})