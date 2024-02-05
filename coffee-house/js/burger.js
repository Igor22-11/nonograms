'use strict'
window.addEventListener('DOMContentLoaded', () => {
  //burger
  const burgerBtn = document.querySelector('.burger');
  const burgerMenu = document.querySelector('.burger-menu');
  const burgerLinks = burgerMenu.querySelectorAll('.menu__item')

  burgerBtn.addEventListener('click', () => {
    burgerBtn.children[0].classList.toggle('burger-line-top-active');
    burgerBtn.children[1].classList.toggle('burger-line-bottom-active');

    document.body.style.overflowY = document.body.style.overflowY === 'hidden' ? 'visible' : 'hidden';

    burgerMenu.classList.toggle('burger-menu-active');
  });

  function closeBurger() {
    burgerBtn.children[0].classList.remove('burger-line-top-active');
    burgerBtn.children[1].classList.remove('burger-line-bottom-active');
    burgerMenu.classList.remove('burger-menu-active');
    document.body.style.overflowY = 'visible'
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeBurger();
    }
  });

  burgerLinks.forEach(item => {
    item.addEventListener('click', () => {
      closeBurger();
    })
  })
})