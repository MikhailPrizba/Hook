// helpers.js

import { animateText, animateImage, animateList, resetAnimations, startAnimations } from './animations.js';


function showMainPage() {
  document.querySelector('.wrap-authorization').style.display = 'none';
  document.querySelector('.page-container').style.display = 'flex';
  startAnimations();
}

// Функция для отображения страницы входа
function showLoginPage() {
  document.querySelector('.wrap-authorization').style.display = 'flex';
  document.querySelector('.page-container').style.display = 'none';
}

// Обработчик события загрузки DOM
function clearLoginFormFields() {
  document.getElementById('login').value = '';
  document.getElementById('password').value = '';
}

function setErrorMessage(message) {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = message;
}



// Форматирует дату в строку дд.мм.гггг
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Преобразует строку даты из формата дд.мм.гггг в формат ISO 8601
function toISOFormat(dateString) {
  const [day, month, year] = dateString.split('.').map(num => parseInt(num, 10));
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString();
}

// Преобразует дату из любого формата в строку в формате ISO 8601
function toISO8601String(dateString) {
  const date = new Date(dateString);
  return date.toISOString();
}

// Экспортируем функции для их использования в других частях приложения
export { formatDate, toISOFormat, toISO8601String,
          showMainPage, showLoginPage, clearLoginFormFields, setErrorMessage
};





// function formatDate(dateString) {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
//   const year = date.getFullYear();

//   return `${day}.${month}.${year}`;
// }

// function toISOFormat(dateString) {
//   // Разбиваем строку "дд.мм.гггг" на части
//   const parts = dateString.split('.');
//   const day = parseInt(parts[0], 10);
//   const month = parseInt(parts[1], 10) - 1; // Месяц в JavaScript начинается с 0
//   const year = parseInt(parts[2], 10);

//   // Создаем объект Date
//   const date = new Date(Date.UTC(year, month, day));

//   // Возвращаем дату в формате ISO 8601
//   return date.toISOString();
// }

// Функция преобразования даты в строку ISO 8601
// function toISO8601String(dateString) {
//   const date = new Date(dateString);
//   return date.toISOString();
// }