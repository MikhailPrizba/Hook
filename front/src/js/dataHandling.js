
import {  getAuthToken, makeFetchRequest  } from './apiService.js';
import { formatDate, toISOFormat, toISO8601String } from './helpers.js';


function fetchAndUpdateTobaccoStock() {
  const authToken = getAuthToken();
  if (!authToken) return;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    }
  };

  makeFetchRequest('/storage/tobacco/', options)
    .then(data => {
      refreshStockTableWithData(data);
      data.forEach(item => {
        if (item.organization) {
          console.log('Organization:', item.organization);
        }
      });
    })
    .catch(error => console.error('Error fetching tobacco stock data: ', error));
}

function fetchAndUpdateWorkers() {
  const authToken = getAuthToken();
  if (!authToken) return;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    }
  };

  makeFetchRequest('/worker/', options)
    .then(data => {
      console.log(data);
      refreshStaffTableWithWorkers(data);
    })
    .catch(error => console.error('Error fetching worker data: ', error));
}

function refreshStockTableWithData(data) {
  const tableBody = document.querySelector('.table__stock tbody');
  tableBody.innerHTML = ''; // Очистить текущее содержимое
  data.forEach((item, index) => {
    const formattedPurchaseDate = formatDate(item.purchase_date);
    const formattedBestBeforeDate = formatDate(item.best_before_date);
    
    const row = document.createElement('tr'); // Создать новый элемент TR
    row.setAttribute('data-id', item.id); // Установить атрибут data-id
    
    // Заполнить row содержимым
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.brand}</td>
      <td>${item.supplier}</td>
      <td>${item.taste}</td>
      <td>${item.taste_group}</td>
      <td>${formattedPurchaseDate}</td>
      <td>${formattedBestBeforeDate}</td>
      <td>${item.weight}</td>
      <td>${item.price}</td>
      <td class="actions">
        <div class="action-buttons">
          <button class="options-button stock-table-options-button" data-action="toggle" data-id="${item.id}">...</button>
          <div class="table-edit-delete-buttons" id="edit-delete-${item.id}" style="display: none;">
            <button class="table-edit-button stock-table-edit-button" data-action="edit" data-id="${item.id}"><i class="ri-edit-2-line"></i><span>Редактировать</span></button>
            <button class="table-delete-button stock-table-delete-button" data-action="delete" data-id="${item.id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
          </div>
        </div>
      </td>
    `;

    // Добавить row в tableBody
    tableBody.appendChild(row);
  });
  
  document.querySelector('.stock__box').style.display = data.length === 0 ? 'flex' : 'none';
}


function refreshStaffTableWithWorkers(data) {
  const tableBody = document.querySelector('.table__staff tbody');
  // Очистить текущее содержимое tbody
  tableBody.innerHTML = '';

  // Добавить строки в таблицу
  data.forEach(worker => {
    const row = document.createElement('tr');
    // Установить атрибут data-id для строки, если у worker есть уникальный идентификатор
    row.setAttribute('data-id', worker.id);

    // Создание и добавление данных пользователя в строку таблицы, включая кнопки действий
    row.innerHTML = `
      <td>${worker.user.first_name}</td>
      <td>${worker.user.last_name}</td>
      <td>${worker.user.email}</td>
      <td>${worker.user.username}</td>
      <td>${worker.user.user_role}</td>
      <td class="actions">
      <div class="action-buttons">
        <button class="options-button staff-table-options-button" data-action="toggle" data-id="${worker.id}">...</button>
        <div class="table-edit-delete-buttons" id="edit-delete-${worker.id}" style="display: none;">
          <button class="table-edit-button staff-table-edit-button" data-action="edit" data-id="${worker.id}">
          <i class="ri-edit-2-line"></i>
          <span>Редактировать</span></button>
          <button class="table-delete-button staff-table-delete-button" data-action="delete" data-id="${worker.id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
        </div>
      </div>
    </td>
    `;

    // Добавление строки в tbody
    tableBody.appendChild(row);
  });
}



function updateStockItemRow(id, updatedData) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    const cells = row.querySelectorAll('td');

      // Преобразуем даты обратно в читаемый формат перед обновлением ячеек
      const formattedPurchaseDate = formatDate(updatedData.purchase_date);
      const formattedBestBeforeDate = formatDate(updatedData.best_before_date);

    // Обновляем текст в каждой ячейке, кроме первой и последней
    cells[1].innerText = updatedData.brand; // Индекс 0, потому что мы пропустили первую ячейку
    cells[2].innerText = updatedData.supplier;
    cells[3].innerText = updatedData.taste;
    cells[4].innerText = updatedData.taste_group;
    cells[5].innerText = formattedPurchaseDate; // Используем отформатированную дату
    cells[6].innerText = formattedBestBeforeDate; // Используем отформатированную дату
    cells[7].innerText = updatedData.weight;
    cells[8].innerText = updatedData.price;
    // ... обновить остальные ячейки

    // Возвращаем кнопки "Редактировать" и "Удалить"
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
    <div class="action-buttons">
    <button class="options-button stock-table-options-button" data-action="toggle" data-id="${id}">...</button>
    <div class="table-edit-delete-buttons" id="edit-delete-${id}" style="display: none;">
      <button class="table-edit-button stock-table-edit-button" data-action="edit" data-id="${id}"><i class="ri-edit-2-line"></i> <span>Редактировать</span></button>
      <button class="table-delete-button stock-table-delete-button" data-action="delete" data-id="${id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
    </div>
  </div>
    `;
  }
}


// Экспорт функций для использования в других файлах
export { fetchAndUpdateTobaccoStock, 
         fetchAndUpdateWorkers, 
         updateStockItemRow 
                                    };






// // Получение токена аутентификации из localStorage
// function getAuthToken() {
//     return localStorage.getItem('authToken');
// }

// // Обновление данных о складе табака
// export async function fetchAndUpdateTobaccoStock() {
//     const url = `${API_BASE_URL}/storage/tobacco/`;
//     try {
//         const authToken = getAuthToken();
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Token ${authToken}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//         if (!response.ok) throw new Error('Ошибка при получении данных о табаке');
//         const data = await response.json();
//         // Здесь можно добавить логику для обновления UI с использованием полученных данных
//     } catch (error) {
//         console.error('Ошибка:', error);
//     }
// }

// // Получение данных о работниках
// export async function fetchWorkers() {
//     const url = `${API_BASE_URL}/worker/`;
//     // Реализация аналогична fetchAndUpdateTobaccoStock
// }

// // Выход пользователя
// export async function logout() {
//     localStorage.removeItem('authToken');
//     // Логика для перенаправления пользователя на страницу входа
// }

// // Отправка данных формы
// export async function sendFormData(formData) {
//     const url = `${API_BASE_URL}/path/to/endpoint`; // Укажите конкретный путь к API
//     // Реализация отправки formData на сервер
// }

// // Обновление данных работника
// export async function updateWorkerData(workerId, updatedData) {
//     const url = `${API_BASE_URL}/worker/${workerId}/`;
//     // Реализация обновления данных работника
// }

// // Удаление элемента (например, товара со склада)
// export async function deleteItem(itemId) {
//     const url = `${API_BASE_URL}/storage/tobacco/${itemId}/`;
//     // Реализация удаления элемента
// }

// // Удаление работника
// export async function deleteStaff(staffId) {
//     const url = `${API_BASE_URL}/worker/${staffId}/`;
//     // Реализация удаления работника
// }
