'use strict';

$(".owl-carousel").owlCarousel({
  stagePadding: 50,
  items: 4,
  margin: 15,
  responsiveClass: true,
  responsive: {
    0: {
      items: 1,
      stagePadding: 20,
    },
    600: {
      items: 2,
    },
    1000: {
      items: 4,
    },
  },
});

ymaps.ready(init);

async function init() {
  var myMap = new ymaps.Map(
    "map",
    {
      center: [55.760824, 37.230857],
      zoom: 16,
      controls: [],
    },

    {
      searchControlProvider: "yandex#search",
    }
  );

  myMap.behaviors.disable(["drag", "rightMouseButtonMagnifier", "scrollZoom"]);

  (MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
    '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
  )),
    (myPlacemark = new ymaps.Placemark(
      myMap.getCenter(),
      {
        hintContent: "Собственный значок метки",
        balloonContent: "Это красивая метка",
      },
      {
        iconLayout: "default#image",
        iconImageHref: "images/icons/map2.svg",
        iconImageSize: [80, 80],
        iconImageOffset: [100, 48],
      }
    )),
    myMap.geoObjects.add(myPlacemark);
}
// ------------------------------------- mine scripts ---------------------------- //

const menuHum = document.querySelector(".menu-header__icon");
const productItem = document.querySelectorAll(".item");
const amoutBasket = document.querySelector('.basket__amount-item')
const totalPriceBasket = document.querySelector('.total__price-pricing')
const payInput = document.querySelectorAll('.pay__input')

let productArr = []
let keyState = []
let pricing = []

// Добавляем рандомный Id к каждому продукту
const randomId = () => {
  return (
    Math.random().toString.toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Генерируем рандомный ID для всех товаров
productItem.forEach((item, index) => {
  item.setAttribute("id", randomId());
  item.setAttribute('item', index)
});

document.querySelectorAll('.products-addition__item').forEach((item, index) => {
  item.setAttribute("id", randomId());
  item.setAttribute('item-b', index)
})

// LISTENER
document.querySelector("body").addEventListener("click", (e) => {
  let target = e.target;
  if (target.closest(".food-item__btn")) {
    // Функция добавления в корзину
    addToCard(target);
  }
  if (target.closest('[data-name="plus-btn"]')) {
    // Увелечение счетчика
    plusCounter(target);
  }
  if (target.closest('[data-name="minus-btn"]')) {
    // Уменьшение счетчика
    minusCounter(target);
  }
  if (target.closest(".cart__items")) {
    // Роутинг на страницу корзины если товаров больше 1
    rout();
  }
  if (target.closest('[data-name="modal-basket-close"]')) {
    // Закрытие модалки
    closeModalBasket(target);
  }
  if (target.closest('.item-basket__remove')) {
    removeItem(target);
  }
  if (target.closest('.item-basket__plus')) {
    increaseItemInBasket(target)
    
  }
  if(target.closest('.item-basket__minus')) {
    decreaseItemInBasket(target)
  }
  if(target.closest('.total__link')) {
    pushTotalLink()
  }
});




// listener
menuHum.addEventListener("click", openMenu);
// --------------------------------------------------

// localstorage for page basket
if(localStorage.getItem('product')) {
  productArr = JSON.parse(localStorage.getItem('product'))
  try {
    productArr.forEach((item) => renderHTMLtoBasket(item) )
  } catch (error) {
    // null
  }
}
if(localStorage.getItem('product')) {
  productArr = JSON.parse(localStorage.getItem('product'))
  try {
    productArr.forEach((item) => renderOrderHTML(item) )
  } catch (error) {
    // null
  }
}
// localstorage item state
if(localStorage.getItem('stateproduct')) {
  keyState = JSON.parse(localStorage.getItem('stateproduct'))
  keyState.forEach((el) => renderState(el),increaseBasketCounter())
}

showCounterBasket()


function addToCard ( target ) {
  let item = target.closest(".item");
  let counterItem = item.querySelector(".food-item__label");
  counterItem.classList.add("_active");

  let itemId = item.id;
  let itemIdpos = item.getAttribute('item')
  let itemAmount = item.querySelector('.food-item__counter').textContent;
  let itemTitle = item.querySelector(".content-food__title").innerText;
  let itemDesc = item.querySelector(".content-food__desc").innerText;
  let itemPrice = item.querySelector(".food-item__price").textContent;

  const productData = {
    id: itemId,
    idPos: itemIdpos,
    amount: itemAmount,
    Title: itemTitle,
    description: itemDesc,
    price: itemPrice,
  }

  const productState = {
    done: false,
    idPos: itemIdpos
  }
  
  addCounterTemplate(item, productData)
  productArr.push(productData)
  keyState.push(productState)
  saveState()
  showCounterBasket()
  increaseBasketCounter()
  saveProduct()
}


function addCounterTemplate(item) {
  let itemPrice = item.querySelector(".food-item__price").innerText;
  let itemWrapper = item.querySelector(".food-item__body");
  const itemBottom = item.querySelector(".food-item__bottom");
  const counterTemplate = ` 

  <div class="food-item__counter counter">
  <button class="counter__btn" data-name="minus-btn"><img src="./images/icons/minus.svg" alt=""></button>
  <div class="counter__num" data-name="counter">${itemPrice}</div>
  <button class="counter__btn" data-name="plus-btn"><img src="./images/icons/plus.svg" alt=""></button>
</div>

 `
 itemBottom.classList.add('hidden-a');
 itemWrapper.insertAdjacentHTML("beforeend", counterTemplate); 
  
 
}


function plusCounter(target) {
  let item = target.closest(".item");
  let itemCounter = item.querySelector(".food-item__label");
  let itemCounterNum = itemCounter.querySelector(".food-item__counter");

  const idItem = item.getAttribute('item');
  const index = productArr.findIndex(function(item) {
    if(item.idPos === idItem) {
      item.amount++;
    }
  })


  itemCounterNum.innerText++;
  saveProduct();
}

function minusCounter(target) {
  let item = target.closest(".item");
  let itemCounter = item.querySelector(".food-item__label");
  let itemCounterNum = itemCounter.querySelector(".food-item__counter");
  let itemAmount = item.querySelector(".counter");
  let itemBottom = item.querySelector(".food-item__bottom");

  const idItem = item.getAttribute('item');
  const index = productArr.findIndex(function(item) {
    if(item.idPos === idItem) {
      item.amount--;
    }
  })

  const indexKey = keyState.findIndex((item) => {})

  if (itemCounterNum.innerText <= 1) {
    itemCounter.classList.remove("_active");
    itemAmount.remove();
    itemBottom.classList.remove("hidden-a");
    productArr.splice(index, 1)
    item.classList.remove('in-basket')
    keyState.splice(indexKey)
  } else {
    itemCounterNum.innerText--;
  }

  if(productArr.length < 1) {
    dropCounterBasket ();
  } 
  saveProduct();

}

function openMenu() {
  const menuHeader = document.querySelector(".menu-header__wrapper");
  const bodyLock = document.querySelector("body");

  menuHeader.classList.toggle("active");
  bodyLock.classList.toggle("lock");
}

function rout() {
  if (productArr.length === 0) {
    openmodalBasket();
  }
  if (productArr.length >= 1) {
    saveProduct ()
    window.location.href = "basket.html";
  }
}

function openmodalBasket() {
  const modalBasket = document.querySelector(".modal-basket");
  const bodyPage = document.querySelector("body");
  modalBasket.classList.add("modal-basket-active");
  bodyPage.classList.add("overlay");
}

function closeModalBasket(event) {
  const modalBasket = event.closest(".modal-basket");
  const bodyPage = document.querySelector("body");
  modalBasket.classList.remove("modal-basket-active");
  bodyPage.classList.remove("overlay");
}

function showCounterBasket() {
  if(productArr.length >= 1) {
  const basketCounter = document.querySelector('.cart__counter');
  const basketIcon = document.querySelector('.cart__icon');
  basketCounter.classList.remove('hidden');
  basketIcon.classList.add('hidden')
  } 
}

function dropCounterBasket() {
  const basketCounter = document.querySelector('.cart__counter');
  const basketIcon = document.querySelector('.cart__icon');
  basketCounter.classList.add('hidden');
  basketIcon.classList.remove('hidden')
}

function saveProduct () {
  localStorage.setItem('product', JSON.stringify(productArr));
}

function saveState() {
  localStorage.setItem('stateproduct', JSON.stringify(keyState))
}

function renderHTMLtoBasket (item) {

  const basketContainer = document.querySelector('.items-basket')

  const template = `

    <div class="items-basket__row" id="${item.id}" item="${item.idPos}">
    <article class="items-basket__item item-basket">
    <div class="item-basket__img"><img src="./images/food/cold/01.jpg" alt=""></div>
    <div class="item-basket__body">
        <div class="item-basket__content">
            <h4 class="item-basket__title">${item.Title}</h4>
            <p class="item-basket__desc">${item.description}
            </p>
        </div>
        <div class="item-basket__actions">
            <div class="item-basket__counter">
            <button class="item-basket__minus"></button>
            <span class="item-basket__amount">${item.amount}</span>
            <button class="item-basket__plus"></button>
        </div>
        <div class="item-basket__price">${item.price}</div>
        <button class="item-basket__remove"></button></div>
    </div>
    </article>
  </div>

  `

  basketContainer.insertAdjacentHTML('beforeend', template)
}

function renderState(elem) {
 productArr.findIndex((index) => {
  if(index = elem) {
    elem.done = true
  }
  if(elem.done = true) {
    gct(elem)
  }
 })
} 

function gct(elem) {
  const item = document.querySelectorAll('.item')
    item.forEach((item) => {
      let id = item.getAttribute('item')
      if(id == elem.idPos) {
        item.classList.add('in-basket')
      }
      if(item.classList.contains('in-basket')) {
        disablebtn(item)
      }
    })
}

function disablebtn(item) {
  let itemBtn = item.querySelector('.food-item__btn');
  itemBtn.disabled = true
}

// увеличиваем счетчик корзины
function increaseBasketCounter () {
  let s = document.querySelector('.cart__counter');
  let lengtharr = productArr.length;

  s.textContent = lengtharr
}

// кол-во товаров в корзине

function itemInBasket () {
  const basketInner = document.querySelector('.items-basket').children.length
  amoutBasket.innerText = basketInner
}


// проверяем есть ли объект на странице
if (amoutBasket) {
  // выводим кол-во товара
  itemInBasket()
}

// удаляем продукт из корзины
function removeItem (target) {
  const itemInBasket = document.querySelector('.basket__amount-item')
  const basketText = document.querySelector('.basket__item')
  const item = target.closest('.items-basket__row');
  const id = item.id;
  const idPos = item.getAttribute('item')



  const index = productArr.findIndex(item => item.id == id) 
  const indexPos = productArr.findIndex(item => item.idPos == idPos)

  productArr.splice(index, 1)
  keyState.splice(indexPos, 1)

  item.remove()
  itemInBasket.innerText--

  if(itemInBasket.innerText == 0) {
    basketText.innerText = 'Корзина пуста'
  }

  checkProductsInBasket()
  changeTotalPrice(item)
  saveState()
  saveProduct()
}

function increaseItemInBasket (target) {
  const item = target.closest('.items-basket__row')
  const itemAmount = item.querySelector('.item-basket__amount')
  const btnMinusItem = item.querySelector('.item-basket__minus')
  let itemPrice = item.querySelector('.item-basket__price')
  let totalPrice = document.querySelector('.total__price-pricing')
  const id = item.id

  
  productArr.findIndex((item) => {
    if(item.id == id) {
      item.amount++;
      let newPriceItem = parseInt(item.price) * +item.amount
      itemPrice.innerText = newPriceItem + ' ₽'

      let newTotal = parseInt(item.price) + parseInt(totalPrice.innerText)
      totalPrice.innerText = newTotal + ' ₽'
    }
  })

  if(btnMinusItem !== 1) {
    btnMinusItem.disabled = false
  }
  
  itemAmount.innerText++
  freeDelivery()
  saveProduct()
}

function decreaseItemInBasket(target) {
  const item = target.closest('.items-basket__row')
  const btnMinusItem = item.querySelector('.item-basket__minus')
  const itemAmount = item.querySelector('.item-basket__amount')
  let itemPrice = item.querySelector('.item-basket__price')
  let totalPrice = document.querySelector('.total__price-pricing')

  const id = item.id
  let index = productArr.findIndex((item) => {
    if(item.id == id) {
      item.amount--;
      let newPrice = parseInt(itemPrice.innerText) - parseInt(item.price)
      itemPrice.innerText = newPrice + ' ₽'

      let newTotal = parseInt(totalPrice.innerText) - parseInt(item.price)
      totalPrice.innerText = newTotal + ' ₽'
    }
  })


  
  itemAmount.innerText--

  if (itemAmount.innerText == 1) {
    btnMinusItem.disabled = true
  }
  
  freeDelivery()
  saveState()
  saveProduct()
}


function checkPriceItem () {
  let itemPrice = document.querySelectorAll('.items-basket__row')
    itemPrice.forEach(el  => {
      let id = el.id
      let priceItem = el.querySelector('.item-basket__price')
      productArr.findIndex(item => {
        if(item.id == id) {
          let price = parseInt(item.price)
          let amount  = parseInt(item.amount)
          let plus = price * amount

          priceItem.innerText = plus + ' ₽'
        }
      })
      
      
    })
  }

try {
checkPriceItem()
  
} catch (error) {
  
}

function priceProducts() {
  let priceProducts = document.querySelectorAll('.item-basket__price')
  priceProducts.forEach((item) => {
    let price = parseInt(item.innerText)
    pricing.push(price)
  })
}

// считаем итоговую сумму заказа
function calcTotalPrice () {
  let total = document.querySelector('.total__price-pricing')

  let newTotal = pricing.reduce((a,b)=> a+b)
  total.innerText = newTotal + ' ₽'
}

// проверяем сумму бесплатной доставки
function freeDelivery () { 
  const deliveryText = document.querySelector('.total__delivery')
  const totalPrice = parseInt(document.querySelector('.total__price-pricing').innerText)

  if (totalPrice >= 1500) {
    deliveryText.innerText = 'Бесплатная доставка'
  } else if(totalPrice < 1500) {
    deliveryText.innerText = 'Бесплатная доставка от суммы 1500 ₽'
  }
}


// запускаем функции если условие совпадает
if(totalPriceBasket) {
  priceProducts ()
  calcTotalPrice ()
  freeDelivery ()
}

function changeTotalPrice (item) {
  const itemPrice = parseInt(item.querySelector('.item-basket__price').innerText)
  const totalPrice = document.querySelector('.total__price-pricing')

  const newTOTAL = parseInt( totalPrice.innerText ) - itemPrice
  totalPrice.innerText = newTOTAL + ' ₽'

}

// блок сдача 
payInput.forEach(item => {
  item.addEventListener('click', () => {
    if(item.classList.contains('cash')) {
      document.querySelector('.pay__change').classList.add('pay__change-active')
    } else {
      document.querySelector('.pay__change').classList.remove('pay__change-active')
    }
  })
})

// full price on order
const totalOrder = []
const orderTOTAL = () => {
  productArr.forEach(item => {
    let itemPrice = parseInt(item.price)
    let itemAmount = parseInt(item.amount)
    let total = itemPrice * itemAmount
    const orderPrice = document.querySelector('.order-products__total-price') 
    totalOrder.push(total)

    let sum = totalOrder.reduce((a,b)=> a+b)
    orderPrice.innerText = sum + ' ₽'
  })
}
orderTOTAL()
// render html for order page
function renderOrderHTML (item) {
  const containerOrderList = document.querySelector('.order-products__list')

  const template = `
    <li class="order-products__item">
                <div class="order-products__container">
                  <div class="order-products__img"><img src="./images/food/cold/01.jpg" alt=""></div>
                  <div class="order-products__content">
                      <div class="order-products__name">${item.Title}</div>
                      <div class="order-products__amount">Кол-во: <span>${item.amount}</span></div>
                      <div class="order-products__price">${item.price}</div>
                  </div>
                </div>
              </li>
  `
  containerOrderList.insertAdjacentHTML('beforeend' , template)
}

// check products on basket 
function checkProductsInBasket () {
  const productsContainer = document.querySelector('.items-basket')
  const modalEmpty = document.querySelector('.modal-empty')
  if(productsContainer.children.length < 1) {
    modalEmpty.classList.add('modal-empty-active')
  }
}

