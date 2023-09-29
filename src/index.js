import "./styles/normalize.scss";
import "./styles/main.scss";
import "./styles/fonts.scss";

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
        setTimeout(() => card.classList.add("show"), 200);
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
