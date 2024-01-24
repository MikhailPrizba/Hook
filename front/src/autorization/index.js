// document.querySelector('.login-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Предотвращаем стандартное поведение отправки формы
  
//     // Функция для получения значения куки по имени
//     function getCookie(name) {
//       let cookieValue = null;
//       if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//           const cookie = cookies[i].trim();
//           if (cookie.substring(0, name.length + 1) === (name + '=')) {
//             cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//             break;
//           }
//         }
//       }
//       return cookieValue;
//     }
  
//     // Получаем CSRF-токен из куки
//     let csrfToken = getCookie('csrftoken');
  
//     // Собираем данные формы
//     let formData = new FormData(this);
  
//     // Отправляем данные на сервер с помощью fetch
//     fetch('/your-login-endpoint', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           // Добавляем CSRF-токен в заголовки запроса
//           'X-CSRFToken': csrfToken
//         },
//         credentials: 'include' // Необходимо для включения кук в запрос
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Сетевой ответ был не ok.');
//       }
//       return response.json();
//     })
//     .then(data => {
//         if (data.success) {
//             document.querySelector('.center-container').style.display = 'none'; // Скрываем форму
//             document.getElementById('main-page').style.display = 'block'; // Показываем main-page
//         } else {
//             // Обработка ошибки авторизации
//             console.error('Ошибка авторизации: ', data.message);
//         }
//     })
//     .catch((error) => {
//         console.error('Ошибка запроса: ', error);
//     });
//   });
  