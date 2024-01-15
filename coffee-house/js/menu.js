'use strict'


window.addEventListener('DOMContentLoaded', () => {

  const productWrapper = document.querySelector('.product__wrapper');
  const btnType = document.querySelectorAll('.tab-item');
  const btnRefresh = document.querySelector('.button__refresh');


  btnType.forEach(item => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('tab-item-active')) {


        btnType.forEach(btn => {
          if (btn !== item) {
            btn.classList.remove('tab-item-active');
          }
        });
        item.classList.toggle('tab-item-active');
      }

      let type = 'coffee';
      if (item.classList.contains('coffee-btn')) {
        type = 'coffee';
      } else if (item.classList.contains('tea-btn')) {
        type = 'tea';
      } else if (item.classList.contains('dessert-btn')) {
        type = 'dessert';
      }

      if (type) {
        fetchData(type);
      }
    });
  });

  function fetchData(type = 'coffee') {
    fetch('./products.json')
      .then(response => response.json())
      .then(data => {
        createCards(data, type);
      });
  }
  fetchData();

  let countCards;

  function createCards(resp, type) {



    countCards = 0;
    let filteredData = resp.filter(item => item.category === type);

    // console.log(filteredData)

    productWrapper.innerHTML = '';

    filteredData.forEach((item, idx) => {
      countCards++;
      let card = document.createElement('div');
      card.innerHTML = '';

      card.classList.add('product__card');

      card.setAttribute('data', `${item.name}`)

      card.addEventListener('click', showModal)

      if (idx > 3) {
        card.classList.add('product__card-hidden');
      }

      card.innerHTML = `
    <div class="product__view">
      <img src=${item.image} alt="${item.name}">
    </div>
    <div class="product__description-wrapper">
      <h2 class="product__title">${item.name}</h2>
      <h4 class="product__description">${item.description}</h4>
    <h3 class="product__price">$${item.price}</h3>
    </div>
    `
      productWrapper.append(card);
    })

    hiddenBtnRefresh();


    window.addEventListener('resize', hiddenBtnRefresh)
    function hiddenBtnRefresh() {
      if (countCards <= 4 || window.innerWidth > 769) {
        btnRefresh.style.display = 'none';
      } else {
        btnRefresh.style.display = 'flex';
      }
    }

    btnRefresh.addEventListener('click', showCards)

    function showCards() {
      document.querySelectorAll('.product__card-hidden').forEach(item => {
        item.classList.remove('product__card-hidden')
      })
      btnRefresh.style.display = 'none';
    }






    //modal



    function showModal(e) {
      let modal = document.querySelector('.modal');
      let modalWtapper = modal.querySelector('.modal__wrapper');

      let target = e.currentTarget.getAttribute('data');

      let price = 0;
      let priceAdd = 0
        ;

      modalWtapper.innerHTML = '';

      filteredData.forEach(item => {
        if (target === item.name) {
          price = +item.price

          console.log(price)
          // console.log(e.currentTarget)


          modalWtapper.innerHTML = `
          <div class="modal__img">
          <img src=${item.image} alt=${item.name} />
        </div>
        <div class="modal__content">
          <div class="modal__text">
            <div class="modal__text-title">${item.name}</div>
            <div class="modal__text-description">
            ${item.description}
            </div>
          </div>
          <div class="modal__choice choise__value">
            <div class="size__title">Size</div>
            <div class="size__buttons">
              <div class="size__btn size__btn-active">
                <div class="size__btn-text">S</div>
                <div class="size__btn-value">${item.sizes.s.size}</div>
              </div>
              <div class="size__btn">
                <div class="size__btn-text">M</div>
                <div class="size__btn-value">${item.sizes.m.size}</div>
              </div>
              <div class="size__btn">
                <div class="size__btn-text">L</div>
                <div class="size__btn-value">${item.sizes.l.size}</div>
              </div>
            </div>
          </div>

          <div class="modal__choice choise__add">
            <div class="size__title">Additives</div>
            <div class="size__buttons">
              <div class="size__btn">
                <div class="size__btn-text">1</div>
                <div class="size__btn-value">${item.additives[0].name}</div>
              </div>
              <div class="size__btn">
                <div class="size__btn-text">2</div>
                <div class="size__btn-value">${item.additives[1].name}</div>
              </div>
              <div class="size__btn">
                <div class="size__btn-text">3</div>
                <div class="size__btn-value">${item.additives[2].name}</div>
              </div>
            </div>
          </div>

          <div class="modal__sum">
            <div class="modal__sum-title">Total:</div>
            <div class="modal__sum-tota">$${price.toFixed(2)}</div>
          </div>

          <div class="modal__info">
            <div class="modal__info-sign">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none">
                <g clip-path="url(#clip0_268_12877)">
                  <path
                    d="M8 7.66663V11"
                    stroke="#403F3D"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path
                    d="M8 5.00667L8.00667 4.99926"
                    stroke="#403F3D"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path
                    d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z"
                    stroke="#403F3D"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_268_12877">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div class="modal__info-text">
              The cost is not final. Download our mobile app to see the final
              price and place your order. Earn loyalty points and enjoy your
              favorite coffee with up to 20% discount.
            </div>
          </div>
          <div class="modal__info-btn">Close</div>
        </div>
    `


          let modalBtnClose = document.querySelector('.modal__info-btn');

          modalBtnClose.addEventListener('click', closeModal);
          modal.addEventListener('click', closeModal);
          modal.classList.add('modal-show');

          document.body.style.overflow = 'hidden';

          function closeModal(e) {
            if (e.target === modal || e.currentTarget === modalBtnClose) {
              modal.classList.remove('modal-show')
              document.body.style.overflow = '';
            }
          }

          const sizeBtn = document.querySelectorAll('.choise__value .size__buttons .size__btn')
          const addBtn = document.querySelectorAll('.choise__add .size__buttons .size__btn')




          let prevActiveIndex = -1;

          sizeBtn.forEach((item, idx) => {
            item.addEventListener('click', () => {
              if (!item.classList.contains('size__btn-active')) {
                sizeBtn.forEach((btn, i) => {
                  btn.classList.remove('size__btn-active');
                });
                item.classList.add('size__btn-active');
                if (prevActiveIndex !== -1) {
                  price -= 0.5 * prevActiveIndex;
                }
                price += 0.5 * idx;
                prevActiveIndex = idx;
              }
              document.querySelector('.modal__sum-tota').innerHTML = `$${(price.toFixed(2))}`;
            });
          });


          addBtn.forEach(item => {
            item.addEventListener('click', () => {
              item.classList.toggle('size__btn-active');
              if (item.classList.contains('size__btn-active')) {
                price = +price + 0.5
              } else {
                price = +price - 0.5
              }
              document.querySelector('.modal__sum-tota').innerHTML = `$${(price.toFixed(2))}`;
            });
          });


        }
      })
    }



  }
});


