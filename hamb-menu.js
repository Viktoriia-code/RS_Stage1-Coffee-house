//START Hamburger Menu
const hamb = document.getElementById('hamb');
const popup = document.querySelector("#popup");
const body = document.body;

const menu = document.querySelector("#nav-list").cloneNode(1);
const menu_link = document.querySelector("#menu-wrapper");

hamb.addEventListener("click", hambHandler);

function hambHandler() {
  // Переключаем стили элементов при клике
  popup.classList.toggle("open");
  hamb.classList.toggle("active");
  body.classList.toggle("noscroll");
  renderPopup();
};

/*document.addEventListener('click', (e) => {
  const click = e.composedPath().includes(popup);
  const click1 = e.composedPath().includes(hamb);
  if ( !click && !click1 ) {
    closeOnClick();
  }
})*/

// Здесь мы рендерим элементы в наш попап
function renderPopup() {
  popup.appendChild(menu);
  popup.appendChild(menu_link);
}

// Код для закрытия меню при нажатии на ссылку
const links = Array.from(menu.children);

// Для каждого элемента меню при клике вызываем ф-ию
links.forEach((link) => {
  link.addEventListener("click", closeOnClick);
});

// Закрытие попапа при клике на меню
function closeOnClick() {
  console.log('here');
  popup.classList.remove("open");
  hamb.classList.remove("active");
  body.classList.remove("noscroll");
}

// Закрытие попапа при увеличении экрана больше 380
window.addEventListener('resize', checkForWindowResize);
function checkForWindowResize() {
  if (window.innerWidth > 768 && popup.classList.contains('open')) {
    closeOnClick();
  };
};
//END Hamburger Menu