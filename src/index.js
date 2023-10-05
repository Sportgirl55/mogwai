import "./styles/normalize.scss";
import "./styles/main.scss";
import "./styles/fonts.scss";
import "./styles/media.scss";
import "./styles/variables.scss";

// Создаём массив с картинками

const images = Array.from({ length: 10 }, (_, index) =>
  require(`./images/pic${index + 1}.png`)
);

// Загрузка данных для карточек
function loadCards() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => {
      const cardsContainer = document.querySelector(".cards");
      cardsContainer.innerHTML = "";
      const maxCards = 30;
      let currentCards = 10;

      // Создание карточки
      const createCard = ({ title, body }, index) => {
        const card = document.createElement("li");
        card.classList.add("cards__item");
        card.innerHTML = `
        <div class="cards__img" style="background-image: url(${images[index]})"></div>
             <div class="cards__content">
               <h3><a class="cards__title" href="#">Bridge</a></h3>
               <span class="cards__subtitle">${title}</span>
               <p class="cards__text">${body}</p>
               <p class="cards__date">Posted by <a href="#" class="cards__author">Eugenia</a>, on July 24, 2019</p>
             </div>
             <button class="cards__btn" type="button"><a href="#">Continue reading</a></button>`;
        setTimeout(() => card.classList.add("show"), 10);
        return card;
      };

      data.slice(0, currentCards).forEach((cardData, index) => {
        const card = createCard(cardData, index);
        cardsContainer.appendChild(card);
      });

      // Подгрузка карточек при нажатии на кнопку 'Загрузить ещё'
      const cardsLoadBtn = document.querySelector(".cards").nextElementSibling;
      cardsLoadBtn.addEventListener("click", () => {
        if (currentCards < maxCards) {
          currentCards += 5;
          data.slice(currentCards - 5, currentCards).forEach((cardData) => {
            const card = createCard(cardData, randomDigit());
            cardsContainer.appendChild(card);
          });
        }
        currentCards >= maxCards && (cardsLoadBtn.style.display = "none");
      });
    })
    .catch((error) => console.log(error));
}
window.addEventListener("load", loadCards);

// Генератор случайного числа для выбора картинок для подгруженных карточек
const randomDigit = () => Math.floor(Math.random() * 10);
//Проверка значения введённого в инпут на пустоту
const isNotEmpty = (elem) => elem.value.length > 0;

// ФОРМА //

// Открытие формы и отправка заполненных данных

const buttons = document.querySelectorAll(".request__button");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".modal__close");
const form = document.querySelector(".modal__form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const errors = document.querySelectorAll(".modal__error");
const emailError = document.querySelector(".modal__error_email");
const nameError = document.querySelector(".modal__error_name");
const phoneError = document.querySelector(".modal__error_phone");

//Открытие модального окна по нажатию на кнопки "Оставить заявку"

buttons.forEach(
  (btn) =>
    btn.classList.contains("form") && btn.addEventListener("click", openModal)
);

[btnCloseModal, overlay].forEach((item) =>
  item.addEventListener("click", closeModal)
);

//Закрытие модального окна при нажатии на кнопку Esc
document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

form.addEventListener("submit", (e) => {
  if (checkValidity()) {
    closeModal();
    form.reset();
  } else {
    e.preventDefault();
  }
});

// Валидация полей
function validateField(field, error, regex) {
  if (!regex.test(field.value.trim())) {
    showError(
      error,
      isNotEmpty(field) ? error.dataset.errorText : "Поле не может быть пустым"
    );
    return false;
  } else {
    hideError(error);
    return true;
  }
}

// Проверка валидности каждого поля
function checkValidity() {
  const isNameValid = validateField(name, nameError, /^[a-zA-Zа-яА-Я\s]+$/);
  const isEmailValid =
    isNotEmpty(email) &&
    validateField(
      email,
      emailError,
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  const isPhoneValid = validateField(
    phone,
    phoneError,
    /^((\+7|7|8)+([0-9]){10})$/
  );

  if (isNotEmpty(phone) && isPhoneValid && !isNotEmpty(email)) {
    hideError(emailError);
  }

  return (
    isNameValid &&
    isPhoneValid &&
    (!isNotEmpty(email) || (isNotEmpty(email) && isEmailValid))
  );
}

// Открытие/скрытие модального окна
function closeModal() {
  modal.classList.remove("show");
  overlay.classList.remove("show");
  errors.forEach((error) => hideError(error));
  form.reset();
}

function openModal() {
  form.reset();
  modal.classList.add("show");
  overlay.classList.add("show");
}

//Скрытие ошибки
const hideError = (error) => (error.style.display = "none");

// Отображение ошибки
const showError = (error, message) => {
  error.style.display = "block";
  error.textContent = message;
};

name.addEventListener("input", () => hideError(nameError));
email.addEventListener("input", () => hideError(emailError));
phone.addEventListener("input", () => hideError(phoneError));


// Dropdown

const dropdownBtn = document.querySelector(".header__dropdown");
const dropdownMenu = document.querySelector(".header__menu");
const heroSection = document.querySelector(".hero");
const heroContent = document.querySelector(".hero__content");

const toggleDropdown = () => {
  heroSection.classList.toggle("blackout");
  heroContent.classList.toggle("show");
  dropdownMenu.classList.toggle("show-dropdown");
};

dropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown();
});

document.documentElement.addEventListener(
  "click",
  () => dropdownMenu.classList.contains("show-dropdown") && toggleDropdown()
);
