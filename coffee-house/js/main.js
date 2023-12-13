'use strict'
window.addEventListener('DOMContentLoaded', () => {
  //************* slider **********************

  const imgsSlider = document.querySelectorAll('.favorite__slider-inner');
  const sliderLine = document.querySelector('.slider-line');
  const btnNext = document.querySelector('.favorite__button-next');
  const btnPrev = document.querySelector('.favorite__button-prev');
  const sliderWindow = document.querySelector('.slider-window');
  
  const indicators = document.querySelectorAll('.indic');

  let count = 0;
  let width;
  let isPaused = false;
let countPercent = 0;

 
  

  function init() {
    width = sliderWindow.offsetWidth;

    sliderLine.style.width = width * imgsSlider.length + 'px';
    imgsSlider.forEach(item => {
      item.style.width = width + 'px';
      item.style.height = 'auto';
    });
    //rollSlider();

  }
  init()


  function nextSlide() {
countPercent = 0
	indicators[count].style.width = countPercent + '%';

    count++;
	
    if (count >= imgsSlider.length) {
      count = 0;
    }
    rollSlider();
  }

  function prevSlide() {
	  countPercent = 0
	  indicators[count].style.width = countPercent + '%';
      countPercent = 0
    count--;
    if (count < 0) {
      count = imgsSlider.length - 1;
    }
    rollSlider();

    //indicators[count].classList.add('indicator-active');
  }

  window.addEventListener('resize', init);

  btnNext.addEventListener('click', nextSlide);
  btnPrev.addEventListener('click', prevSlide);


  function rollSlider() {
    sliderLine.style.transform = 'translate(-' + count * width + 'px)';
  }

  //touch event




  sliderWindow.addEventListener('touchstart', function (e) {
    handelTouchStart(e);
    pauseAutoSlide();
  }, false);

  sliderWindow.addEventListener('touchmove', handelTouchMove, false);

  sliderWindow.addEventListener('touchend', function () {
    slideMove();
    continueAutoSlide();
  }, false);

  let x1;
  let x2;
  let xDiff;



  function handelTouchStart(e) {
    e.preventDefault();
    const firstTouch = e.touches[0];
    x1 = firstTouch.clientX;
  }

  function handelTouchMove(e) {
    if (!x1) {
      return false;
    }
    x2 = e.touches[0].clientX;
    xDiff = x2 - x1;
  }

  function slideMove() {
    if (xDiff < 0) {
      nextSlide();
    }
    if (xDiff > 0) {
      prevSlide();
    }

    x1 = null;
    x2 = null;
    xDiff = null;
  }





  // mouse event



  


  sliderWindow.addEventListener('mousedown', function () {
    handleSliderClick();
    pauseAutoSlide();
  });

  sliderWindow.addEventListener('mouseup', function () {
    slideMove();
    continueAutoSlide();
  });

  sliderWindow.addEventListener('mouseleave', function () {
    slideMove();
    continueAutoSlide();
  });

  function handleSliderClick() {
    x1 = event.clientX;
    sliderWindow.addEventListener('mousemove', handleMouseMove);
  }

  function handleMouseMove() {
    if (event.buttons !== 1) return;
    if (!x1) return false;

    x2 = event.clientX;
    xDiff = x2 - x1;
  }



  // autoslide

  //const intervalDuration = Math.round(8/1000*100);

  
const intervalDuration = 40; 
let intervalId;


function startAutoSlide() {
  intervalId = setInterval(function () {
    if (!isPaused) {
      countPercent++;

      if (countPercent >= 105) {
        countPercent = 0;
        nextSlide();
      }

      indicators[count].style.width = countPercent + '%';
    }
  }, intervalDuration);
}

startAutoSlide();


  sliderWindow.addEventListener('mousemove', pauseAutoSlide);

  function pauseAutoSlide() {
    isPaused = true;
  }


  function continueAutoSlide() {
    isPaused = false;
    
  }


})