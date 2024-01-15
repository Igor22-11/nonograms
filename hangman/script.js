'use strict'
window.addEventListener('DOMContentLoaded', () => {
  const words = [
    ['Rainbow', 'A colorful arc that appears in the sky when sunlight hits water droplets.'],
    ['Marmalade', 'A citrus fruit preserve, typically made from oranges, often eaten on toast.'],
    ['Leopard', 'A large wild cat known for its rosette-shaped spots and powerful build.'],
    ['Protection', 'The act of keeping someone or something safe from harm or danger.'],
    ['Battery', 'A device that stores chemical energy for electrical use.'],
    ['Dolphin', 'A smart, social marine mammal known for its playful nature and intelligence.'],
    ['Police', 'Law enforcement officials responsible for maintaining public order and safety.'],
    ['Bottle', 'A container with a neck, used for storing drinks or other liquids.'],
    ['Flakes', 'Small, flat, thin pieces of something, typically something that has crumbled.'],
    ['Bike', 'A two-wheeled vehicle that is propelled by pedals and steered with handlebars.'],
    ['Turtle', 'A reptile with a bony or cartilaginous shell developed from its ribs that acts as a shield.'],
  ];

  const humanSrc = [
    { head: 'img/head.png' },
    { body: 'img/body.png' },
    { leftHand: 'img/hand-left.png' },
    { rightHand: 'img/hand-right.png' },
    { leftLeg: 'img/leg-left.png' },
    { rightLeg: 'img/leg-right.png' },
  ];

  const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  ]


  let numberOfAttempts = 0;
  const wordForGame = words[Math.floor(Math.random() * (words.length))];


  const gallowsWrapper = document.createElement('div');

  function createGallowsWrapper() {

    gallowsWrapper.classList.add('gallows-wrapper');

    const gallowsImg = document.createElement('img');
    gallowsImg.classList.add('gallows__img');
    gallowsImg.src = 'img/gallows.png';
    gallowsImg.alt = 'Gallows image';
    gallowsWrapper.append(gallowsImg);

    return gallowsWrapper;
  }


  //******************************* */


  function createHumanWrapper() {
    const humanWrapper = document.createElement('div');
    humanWrapper.classList.add('human__wrapper');

    humanSrc.forEach(part => {
      const bodyPartClass = Object.keys(part)[0];
      const imgSrc = part[bodyPartClass];

      const img = document.createElement('img');
      img.classList.add(bodyPartClass, 'human__img');
      img.classList.add(bodyPartClass, 'human__hidden');
      img.classList.add(bodyPartClass, 'part__body');
      img.src = imgSrc;
      img.alt = bodyPartClass;
      humanWrapper.append(img);
    });

    return humanWrapper;
  }


  //******************************* */

  function createSectionWithClass(className) {
    const section = document.createElement('section');
    section.classList.add(className);
    return section;
  }

  function pageStructure() {
    const main = document.createElement('main');
    main.classList.add('main');

    const gallows = document.createElement('section');
    gallows.classList.add('gallows');

    const game = document.createElement('section');
    game.classList.add('game');

    document.body.append(main);
    main.append(gallows, game);

    gallows.append(createGallowsWrapper());
    gallows.querySelector('.gallows-wrapper').append(createHumanWrapper());

    game.append(createSectionWithClass('word'), createSectionWithClass('keyboard'));
  }

  pageStructure();

  //** Keyboard */

  function createKeyboard() {
    const keyboardSection = document.querySelector('.keyboard');

    alphabet.forEach(item => {
      const key = document.createElement('button');
      key.classList.add('keyboard__key');
      key.textContent = item.toUpperCase();
      keyboardSection.append(key);
      key.addEventListener('click', (event) => handleKeyPress(item, key));
    });


    window.addEventListener('keydown', (e) => {
      const key = e.code.slice(3).toLowerCase();
      if (alphabet.includes(key.toLowerCase())) {
        const keyElements = document.querySelectorAll('.keyboard__key');
        keyElements.forEach(keyElement => {
          if (keyElement.textContent === key.toUpperCase()) {
            handleKeyPress(key, keyElement);
          }
        });
      }
    });
  }

  createKeyboard();

  function handleKeyPress(key, keyElement) {
    if (keyElement && !keyElement.classList.contains('keyboard__key-active')) {
      keyElement.classList.add('keyboard__key-active');
      checkWord(key)
    }
  }

  //**********************************/

  function createElementWithClass(tag, className) {
    const section = document.createElement(tag);
    section.classList.add(className);
    return section;
  }


  const wordElement = document.querySelector('.word');


  function createWord() {
    wordElement.innerHTML = '';
    wordElement.append(createElementWithClass('h1', 'title'), createElementWithClass('div', 'selectedWord'), createElementWithClass('div', 'hintElement'), createElementWithClass('div', 'attempts'));
    const hintElement = document.querySelector('.hintElement');

    hintElement.textContent = `Hint: ${wordForGame[1]}`;

    const titleElement = document.querySelector('.title');
    titleElement.textContent = 'HANGMAN GAME'
  }
  createWord();


  function changeAttempts(numberOfAttempts) {
    const attempts = document.querySelector('.attempts');
    attempts.textContent = `Number of attempts: ${numberOfAttempts} / 6`;
  }

  changeAttempts(numberOfAttempts);


  const selectedWordElement = document.querySelector('.selectedWord');
  const hiddenPartOfBody = document.querySelectorAll('.part__body');


  function showWord() {
    for (let i = 0; i < wordForGame[0].length; i++) {
      selectedWordElement.append(createElementWithClass('div', 'letter'));
    }

  }
  showWord()


  let letters = Array.from(wordForGame[0].split(''), () => 0);

  function checkWord(key) {
    if (!wordForGame[0].toLowerCase().includes(key)) {
      hiddenPartOfBody[numberOfAttempts].classList.add('human__show')
      numberOfAttempts++;

      changeAttempts(numberOfAttempts);
    }

    for (let i = 0; i < wordForGame[0].length; i++) {
      if (wordForGame[0][i].toLocaleLowerCase() === key) {
        letters[i] = key;
      }
    }
    showLetters()


    if (numberOfAttempts === 6) {
      setTimeout(function () {
        showModal('Game over. You lose!');
      }, 500);

    }

    if (!letters.includes(0)) {
      showModal('Game over. You win!')
    }
  }


  const hiddenLetters = document.querySelectorAll('.letter');

  function showLetters() {
    letters.forEach((item, i) => {
      if (item) {
        if (i === 0) {
          hiddenLetters[i].textContent = item.toUpperCase();
          hiddenLetters[i].classList.add('letter-no-border');
        } else {
          hiddenLetters[i].textContent = item.toLowerCase();
          hiddenLetters[i].classList.add('letter-no-border');
        }

      }
    })
  }


  // Modal


  function showModal(title) {
    document.body.style.overflow = 'hidden';




    const modal = createSectionWithClass('modal');
    document.body.append(modal);

    const modal__wrapper = createElementWithClass('div', 'modal__wrapper');
    modal.append(modal__wrapper);


    const modalTitle = createElementWithClass('div', 'modalTitle')
    modal__wrapper.append(modalTitle);
    modalTitle.textContent = title;

    const modalMessage = createElementWithClass('div', 'modal__message')
    modal__wrapper.append(modalMessage);
    modalMessage.textContent = `The word was: ${wordForGame[0]}`;

    const buttonNewGame = document.createElement('button');
    buttonNewGame.classList.add('button__new-game');
    modal__wrapper.append(buttonNewGame);
    buttonNewGame.textContent = 'Play again';

    buttonNewGame.addEventListener('click', function () {
      location.reload();
    });
  }
})