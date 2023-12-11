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
  let currentAnimation = null;


  indicators[count].classList.add('indicator-active');

  function init() {
    width = sliderWindow.offsetWidth;

    sliderLine.style.width = width * imgsSlider.length + 'px';
    imgsSlider.forEach(item => {
      item.style.width = width + 'px';
      item.style.height = 'auto';
    });
    rollSlider();

  }
  init()


  function nextSlide() {
    indicators[count].style.width = '0%';
    indicators[count].classList.remove('indicator-active');

    count++;
    if (count >= imgsSlider.length) {
      count = 0;
    }
    rollSlider();
    indicators[count].classList.add('indicator-active');

    /******/

    // indicators[count].style.animation = 'none';
    // indicators[count].style.width = '0';
    // indicators[count].offsetHeight; 
    // indicators[count].style.animation = 'increaseWidth 5s forwards';
    // currentAnimation = indicators[count].animate([{ width: '0%' }, { width: '100%' }], { duration: 5000, fill: 'forwards' });
  }

  function prevSlide() {
    indicators[count].style.width = '0%';
    indicators[count].classList.remove('indicator-active');

    count--;
    if (count < 0) {
      count = imgsSlider.length - 1;
    }
    rollSlider();
    indicators[count].classList.add('indicator-active');
  }

  window.addEventListener('resize', init);

  btnNext.addEventListener('click', nextSlide);
  btnPrev.addEventListener('click', prevSlide);


  function rollSlider() {
    sliderLine.style.transform = 'translate(-' + count * width + 'px)';
    // sliderLine.style.left = -count * width +'px';
  }

  //touch event


  sliderWindow.addEventListener('touchstart', handelTouchStart, false);
  sliderWindow.addEventListener('touchmove', handelTouchMove, false);
  sliderWindow.addEventListener('touchend', slideMove, false);

  let x1;
  let x2;
  let xDiff;

  let computedStyle;
  let currentWidth;

  function handelTouchStart(e) {
    e.preventDefault();
    const firstTouch = e.touches[0];
    stopAutoSlide()
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
      nextSlide()

    }
    if (xDiff > 0) {
      prevSlide()

    }

    x1 = null;
    x2 = null;
    xDiff = null;
    startAutoSlide()
  }


  // mouse event
  const intervalDuration = 5000;
  let intervalId;

  sliderWindow.addEventListener('mousedown', handleSliderClick);
  sliderWindow.addEventListener('mouseup', slideMove);
  sliderWindow.addEventListener('mouseleave', slideMove);

  function handleSliderClick(e) {
    if (e.button !== 0) return;
    x1 = e.clientX;
    sliderWindow.addEventListener('mousemove', handleMouseMove);
  }

  function handleMouseMove(e) {
    stopAutoSlide()
    if (e.buttons !== 1) return;
    if (!x1) return false;

    x2 = e.clientX;
    xDiff = x2 - x1;
    sliderWindow.removeEventListener('mousemove', handleMouseMove);
  }

  // autoslide


  function startAutoSlide() {
    intervalId = setInterval(nextSlide, intervalDuration);
  }

  sliderWindow.addEventListener('mousemove', stopAutoSlide)
  function stopAutoSlide() {
    clearInterval(intervalId);

    /****/
    /***/
    getCurrentWidth()
    /******/
    /****/

    indicators[count].classList.remove('indicator-active');
  }

  function getCurrentWidth() {
    /***/
    computedStyle = window.getComputedStyle(indicators[count]);
    currentWidth = computedStyle.getPropertyValue('width');
    indicators[count].style.animation = 'none';
    indicators[count].style.width = currentWidth;

    indicators[count].classList.remove('indicator-active');
    /******/
  }

  startAutoSlide()

  // ***************************************

  alert('Уважаемый Проверяющий, пожалуйста, проверьте мою работу в четверг. Спасибо!')
})