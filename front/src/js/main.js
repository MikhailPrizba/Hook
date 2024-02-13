

import { toggleMenu } from './header.js';
import { showSection } from './navigation.js';
import { formatDate, toISOFormat, toISO8601String } from './helpers.js';




// --------------Header_____________________

document.querySelector('.burger-menu').addEventListener('click', toggleMenu);

// --------------Выводим секцию__________________

document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('.menu__item-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const sectionId = link.getAttribute('href');
      if (sectionId === '#stock') {
        event.preventDefault(); // Предотвратить стандартное поведение ссылки
        fetchAndUpdateTobaccoStock();
      } else {
        showSection(event, sectionId);
      }
      showSection(event, sectionId);
    });  
  });

  const logoLink = document.querySelector('.logo-menu'); // Предполагая, что класс .logo уникален для логотипа
  logoLink.addEventListener('click', (event) => {
    event.preventDefault(); // Предотвратить стандартное поведение ссылки
    const sectionId = logoLink.getAttribute('href');
    showSection(event, sectionId); // Используем sectionId напрямую без изменений
  });
});


// --------------Выводим секцию__________________

// --------------Header_____________________

// Функция для отображения главной страницы
function showMainPage() {
  document.querySelector('.wrap-authorization').style.display = 'none';
  document.querySelector('.page-container').style.display = 'flex';
}

// Функция для отображения страницы входа
function showLoginPage() {
  document.querySelector('.wrap-authorization').style.display = 'flex';
  document.querySelector('.page-container').style.display = 'none';
}

// Обработчик события загрузки DOM
document.addEventListener('DOMContentLoaded', async (event) => {
  // Проверка аутентификации пользователя
  if (localStorage.getItem('authToken')) {
    showMainPage();
  } else {
    showLoginPage();
  }

  const loginForm = document.querySelector('.login-form');
  const logoutButton = document.querySelector('.output-btn');
  const loginInput = document.getElementById('login');
  const passwordInput = document.getElementById('password');
  const errorMessageElement = document.getElementById('error-message');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const postData = {
        username: loginInput.value,
        password: passwordInput.value,
      };

      try {
        const response = await fetch('http://188.68.221.107/api/v1/auth/token/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json', 
            'User-Agent': 'Thunder Client (https://www.thunderclient.io)', 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
        const data = await response.json();

        if (data.auth_token) {
          console.log('Токен:', data.auth_token);
          localStorage.setItem('authToken', data.auth_token);
          showMainPage();
          clearLoginFormFields();
        } else {
          console.error('Ошибка аутентификации', data);
          errorMessageElement.textContent = 'Ошибка аутентификации';
        }
      } catch (error) {
        console.error('Ошибка сети', error);
        errorMessageElement.textContent = 'Неверный логин или пароль';
      }
    });
  } else {
    console.error('Форма входа не найдена');
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  } else {
    console.error('Кнопка выхода не найдена');
  }
});

async function logout() {
  localStorage.removeItem('authToken');
  showLoginPage();
  clearLoginFormFields();
}

function clearLoginFormFields() {
  document.getElementById('login').value = '';
  document.getElementById('password').value = '';
}


// -----------------Выход_____________________

// -----------------Склад_____________________

let organization;

// Функция для получения токена аутентификации
function getAuthToken() {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('Токен аутентификации не найден.');
    return null;
  }
  return authToken;
}

// Универсальная функция для выполнения запросов к API
async function fetchDataFromAPI(url, processResponse) {
  const authToken = getAuthToken();
  if (!authToken) return;

  console.log('Начало отправки данных, токен аутентификации найден.');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    processResponse(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Функции для обработки полученных данных
function processTobaccoData(data) {
  updateTable(data); // Обновление таблицы табака
  data.forEach(item => {
    if(item.organization) {
      console.log('Organization:', item.organization);
    }
  });
}

function processWorkerData(data) {
  console.log(data); // Вывод данных о работниках
  insertDataIntoTable(data); // Вставка данных в таблицу работников
}

// Использование универсальной функции для запросов к API
function fetchAndUpdateTobaccoStock() {
  const url = 'http://188.68.221.107/api/v1/storage/tobacco/';
  fetchDataFromAPI(url, processTobaccoData);
}

function fetchWorkers() {
  const url = 'http://188.68.221.107/api/v1/worker/';
  fetchDataFromAPI(url, processWorkerData);
}


// function toggleEditDeleteButtons(id) {
//   const editDeleteButtons = document.getElementById(`edit-delete-${id}`);
//   editDeleteButtons.style.display = editDeleteButtons.style.display === 'none' ? 'flex' : 'none';
//   toggleRowStyle(id); 
// }

// * Обрабатывает клики по документу для выполнения действий с элементами, основываясь на их data-action атрибутах.


document.addEventListener('click', function(event) {
  if (event.target.matches('[data-action="toggle"]')) {
    const id = event.target.getAttribute('data-id');
    // Определяем, к какой таблице принадлежит кнопка, по ее классу
    const isStockTable = event.target.classList.contains('stock-table-options-button');
    const isStaffTable = event.target.classList.contains('staff-table-options-button');
    toggleEditDeleteButtons(id, isStockTable, isStaffTable);
  } else if (event.target.matches('[data-action="edit"]')) {
    const id = event.target.getAttribute('data-id');
    startEditing(id);
  } else if (event.target.matches('[data-action="delete"]')) {
    const id = event.target.getAttribute('data-id');
    deleteItem(id);
  }
});

function toggleEditDeleteButtons(id, isStockTable, isStaffTable) {
  let editDeleteDiv;
  if (isStockTable) {
    editDeleteDiv = document.querySelector(`.stock__table #edit-delete-${id}`);
  } else if (isStaffTable) {
    editDeleteDiv = document.querySelector(`.staffAdministration__table #edit-delete-${id}`);
  }
  
  if (editDeleteDiv) {
    editDeleteDiv.style.display = editDeleteDiv.style.display === 'none' ? '' : 'none';
  }
}



// // ------------Меняем цвет строки_______________________
// function toggleRowStyle(id) {
//   const row = document.querySelector(`tr data-id="${item.id}"`);
//   if (row.classList.contains('highlighted')) {
//     row.classList.remove('highlighted');
//   } else {
//     row.classList.add('highlighted');
//   }
// }


function updateTable(data) {
  const tableBody = document.querySelector('.stock__table tbody');
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
            <button class="table-edit-button stock-table-edit-button" data-action="edit" data-id="${item.id}"><i class="ri-edit-line"></i> <span>Редактировать</span></button>
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




// Новая функция для начала редактирования
function startEditing(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) {
    console.error('Строка с id не найдена:', id);
    return;
  }
  const cells = row.querySelectorAll('td');
  row.style.height = '100px';
  row.style.background = 'rgb(254, 243, 234)'

  // Превращаем каждую ячейку в редактируемое поле, кроме первой и последней (индекс и кнопки действий)
  for (let i = 1; i < cells.length - 1; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = cells[i].innerText;
    input.classList.add('reset-default-styles');
    cells[i].innerText = '';
    cells[i].appendChild(input);
  }

  const productFormSaveBtn = document.createElement('button');
  productFormSaveBtn.textContent = 'Сохранить';
  productFormSaveBtn.classList.add('stock-save-button');
  productFormSaveBtn.onclick = () => saveEdit(id);

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Отменить';
  cancelButton.classList.add('stock-cancel-button');
  cancelButton.onclick = () => cancelEdit(id);

  const buttonsContainer = document.getElementById(`edit-delete-${id}`);
  if (buttonsContainer) {
    buttonsContainer.innerHTML = '';
    buttonsContainer.classList.add('edit-save-cancel-buttons');
    buttonsContainer.appendChild(productFormSaveBtn);
    buttonsContainer.appendChild(cancelButton);
  } else {
    console.error('Элемент для редактирования не найден:', `edit-delete-${id}`);
  }
}


// Функция для сохранения изменений
function saveEdit(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const inputs = row.querySelectorAll('input');
  const updatedItem = {
    brand: inputs[0].value, 
    supplier: inputs[1].value, 
    taste: inputs[2].value,
    taste_group: inputs[3].value,
    purchase_date: toISOFormat(inputs[4].value), // Преобразуем дату в ISO
    best_before_date: toISOFormat(inputs[5].value), // Преобразуем дату в ISO
    weight: inputs[6].value,
    price: inputs[7].value,
    
    // ... получить остальные значения
    
  };
  if (row) {
    // Восстановление исходной высоты строки
    row.style.height = ''; // Удаление индивидуального стиля высоты для возврата к стандартному CSS
  }
  updateItemOnServer(id, updatedItem);
}



// Обновленная функция для отправки изменений на сервер
function updateItemOnServer(id, updatedItem) {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('Токен аутентификации не найден');
    return;
  }

  const url = `http://188.68.221.107/api/v1/storage/tobacco/${id}/`;
  fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json', // Добавляем заголовок Accept
      'User-Agent': 'Thunder Client (https://www.thunderclient.io)', // Добавляем заголовок User-Agent
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}` 
    },
    body: JSON.stringify(updatedItem)
  })
  .then(response => {
    if (response.ok) {
      console.log(`Обновлен элемент с id: ${id}`);
      return response.json();
    } else {
      return response.json().then(error => {
        throw new Error(`Ошибка при обновлении: ${error.message}`);
      });
    }
  })
  .then(updatedData => {
    // Обновление данных в таблице
    updateTableRow(id, updatedData);
  })
  .catch(error => {
    console.error('Ошибка при обновлении элемента:', error);
  });
}

// Обновленная функция для обновления строки таблицы
function updateTableRow(id, updatedData) {
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
      <button class="table-edit-button stock-table-edit-button" data-action="edit" data-id="${id}"><i class="ri-edit-line"></i> <span>Редактировать</span></button>
      <button class="table-delete-button stock-table-delete-button" data-action="delete" data-id="${id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
    </div>
  </div>
    `;
  }
}



function cancelEdit(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const cells = row.querySelectorAll('td');
  // Восстановление исходных значений ячеек, если они были изменены
  // Ваш код для восстановления исходных значений ячеек...
  if (row) {
    // Восстановление исходной высоты строки
    row.style.height = ''; // Удаление индивидуального стиля высоты для возврата к стандартному CSS
  }
  // Восстановление исходного состояния кнопок
  const actionCell = cells[cells.length - 1];
  actionCell.innerHTML = `
  <div class="action-buttons">
  <button class="options-button stock-table-options-button" data-action="toggle" data-id="${id}">...</button>
  <div class="table-edit-delete-buttons" id="edit-delete-${id}" style="display: none;">
    <button class="table-edit-button stock-table-edit-button" data-action="edit" data-id="${id}"><i class="ri-edit-line"></i> <span>Редактировать</span></button>
    <button class="table-delete-button stock-table-delete-button" data-action="delete" data-id="${id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
  </div>
</div>
  `;
}


// ___!!!!


document.addEventListener('DOMContentLoaded', () => {
  // Загрузка данных о товарах
  fetchAndUpdateTobaccoStock();
  
  // Загрузка данных о сотрудниках
  fetchWorkers();

  // Обработчик событий для таблицы товаров
  document.querySelector('.stock__table').addEventListener('click', function(e) {
    if (e.target.closest('.stock-table-edit-button')) {
      const id = e.target.closest('.stock-table-edit-button').getAttribute('data-id');
      startEditing(id);
    } else if (e.target.closest('.stock-table-delete-button')) {
      const id = e.target.closest('.stock-table-delete-button').getAttribute('data-id');
      deleteItem(id);
    }
  });

  // Обработчик событий для таблицы сотрудников
  document.querySelector('.staffAdministration__table').addEventListener('click', function(e) {
    if (e.target.closest('.staff-table-edit-button')) {
      const id = e.target.closest('.staff-table-edit-button').getAttribute('data-id');
      startEditingStaff(id); // Предполагается, что у вас есть функция startEditingStaff для редактирования данных сотрудников
    } else if (e.target.closest('.staff-table-delete-button')) {
      const id = e.target.closest('.staff-table-delete-button').getAttribute('data-id');
      deleteStaff(id); // Предполагается, что у вас есть функция deleteStaff для удаления данных сотрудников
    }
  });
});



function editItem(id) {
  console.log('Редактировать элемент с id:', id);
}




// \---Удаление_____

function deleteItem(id) {
  const authToken = localStorage.getItem('authToken'); // Или sessionStorage, в зависимости от того, где он хранится
  if (!authToken) {
    console.error('Токен аутентификации не найден');
    return;
  }

  const url = `http://188.68.221.107/api/v1/storage/tobacco/${id}/`;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${authToken}`

    }
  })
  .then(response => {
    if (response.ok) {
      console.log(`Удален элемент с id: ${id}`);
      removeTableRow(id);
    } else {
      return response.json().then(error => {
        throw new Error(`Ошибка при удалении: ${error.message}`);
      });
    }
  })
  .catch(error => {
    console.error('Ошибка при удалении элемента:', error);
  });
}
function removeTableRow(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    row.remove();
    // Также вызываем обновление номеров после удаления строки
    updateRowNumbers();
  }
}

function updateRowNumbers() {
  const rows = document.querySelectorAll('.stock__table tbody tr');
  rows.forEach((row, index) => {
    row.cells[0].textContent = index + 1; // Обновляем номер строки, предполагая что номер находится в первой ячейке
  });
}
// \---Удаление_____





// -----------------Табы_____________________

document.addEventListener('click', function(event) {
  const target = event.target;

  // Общая функция для открытия форм
  if (target.closest('.stock__btn-add, .staffAdministration__btn-add')) {
    const formId = target.closest('.stock__btn-add') ? '#productForm' : '#userForm';
    toggleForm(formId, true); // Показать форму
  }

  // Общая функция для закрытия форм
  if (target.closest('.user-form__close, .product-form__close') || target.closest('.product-form__cancel-btn')) {
    const formId = target.closest('.user-form, .product-form').id;
    toggleForm(`#${formId}`, false); // Скрыть форму
    clearFormContent(formId); // Очистить содержимое формы
  }
});

function toggleForm(formId, show) {
  document.querySelector(formId).style.display = show ? 'block' : 'none';
  if (show) {
    document.body.insertAdjacentHTML('beforeend', '<div class="modal-backdrop"></div>');
  } else {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
}

function clearFormContent(formId) {
  const formBody = document.getElementById(formId + 'Body');
  if (!formBody) return; // Выход, если тело формы не найдено

  const formContents = formBody.querySelectorAll('.form-content, .product-form__content');
  formContents.forEach(formContent => {
    const inputs = formContent.querySelectorAll('input');
    const selects = formContent.querySelectorAll('select');

    inputs.forEach(input => {
      input.value = ''; // Сброс значения текстовых полей
    });

    selects.forEach(select => {
      select.selectedIndex = 0; // Сброс выбранного значения в выпадающих списках
    });
  });
}

// function resetTabs() {
//   const tabsContainer = document.getElementById('tabs');
//   const productFormBody = document.getElementById('productFormBody');
  
//   // Удаление всех табов, кроме кнопки добавления нового таба
//   tabsContainer.querySelectorAll('.tab').forEach(tab => tab.remove());
  
//   // Удаление всех форм табов
//   productFormBody.querySelectorAll('.product-form__content').forEach(formContent => formContent.remove());
  
//   // Добавление одного нового таба, чтобы форма была не пустой
//   addTab(); // Предполагаемая функция добавления таба
// }

document.addEventListener('DOMContentLoaded', function() {
  const tabsContainer = document.getElementById('tabs');
  const addTabButton = tabsContainer.querySelector('.add-tab');
  const productFormBody = document.getElementById('productFormBody');
  let tabCount = tabsContainer.querySelectorAll('.tab').length;
  var currentTabToClose = null;
  var closeModalButton = document.getElementById("closeModalButton");

  function addTab() {
      tabCount++;
      const newTab = document.createElement('div');
      newTab.classList.add('tab');
      newTab.dataset.tab = tabCount;
      newTab.innerHTML = `<span>Товар №${tabCount}</span><button type="button" class="close-tab">✕</button>`;
      tabsContainer.insertBefore(newTab, addTabButton);
      createFormContent(tabCount);
      updateTabEvents();
      activateTab(tabCount);
  }

  function activateTab(number) {
      const allTabs = tabsContainer.querySelectorAll('.tab');
      const allForms = productFormBody.querySelectorAll('.product-form__content');

      allTabs.forEach(tab => {
          tab.classList.remove('active');
      });

      allForms.forEach(form => {
          form.style.display = 'none';
      });

      const activeTab = tabsContainer.querySelector(`.tab[data-tab="${number}"]`);
      const activeForm = productFormBody.querySelector(`.product-form__content[data-tab="${number}"]`);

      if (activeTab && activeForm) {
          activeTab.classList.add('active');
          activeForm.style.display = 'block';
          updateSaveButtonState(); // Вызываем функцию после активации вкладки
      } else {
          console.error(`Cannot find elements for tab ${number}`);
      }
  }

  function createFormContent(number) {
      const productFormContent = document.createElement('div');
      productFormContent.classList.add('form-content');
      productFormContent.classList.add('product-form__content');

      productFormContent.dataset.tab = number;
      productFormContent.innerHTML = `
          <div class="input-group">
              <label for="supplier-${number}">Поставщик</label>
              <input type="text" id="supplier-${number}" name="supplier" data-tab="${number}" placeholder="Введите наименование поставщика">
          </div>
          <div class="input-group">
              <label for="brand-${number}">Бренд</label>
              <input type="text" id="brand-${number}" name="brand" data-tab="${number}" placeholder="Введите наименование бренда">
          </div>
          <div class="input-group">
      <label for="taste-${number}">Вкус</label>
      <input type="text" id="taste-${number}" name="taste" data-tab="${number}" placeholder="Введите вкус">
  </div>
  <div class="input-group">
  <label for="taste_group-${number}">Группа вкуса</label>
  <select id="taste_group-${number}" name="taste_group" data-tab="${number}">
      <option value="" disabled selected>Выберите группу вкуса</option>
      <option value="fruity">Фруктовые</option>
      <option value="berry">Ягодные</option>
      <option value="citrus">Цитрусовые</option>
      <option value="alcoholic">Алкогольные</option>
      <option value="spicy">Пряные</option>
      <option value="dessert">Десертные</option>
      <option value="herbal">Травянистые</option>
      <option value="nutty">Ореховые</option>
      <option value="floral">Цветочные</option>
  </select>
</div>
  <div class="input-group">
      <label for="purchase-date-${number}">Дата закупки</label>
      <input type="date" id="purchase-date-${number}" name="purchase-date" data-tab="${number}">
  </div>
  <div class="input-group">
      <label for="best_before_date-${number}">Срок годности</label>
      <input type="date" id="best_before_date-${number}" name="best_before_date" data-tab="${number}">
  </div>
  <div class="input-group">
      <label for="weight-${number}">Вес, г.</label>
      <input type="number" id="weight-${number}" name="weight" data-tab="${number}">
  </div>
  <div class="input-group">
      <label for="price-${number}">Цена закупки, руб.</label>
      <input type="number" id="price-${number}" name="price" data-tab="${number}">
  </div>
      `;
      productFormBody.appendChild(productFormContent);

      // Добавляем слушатели события input на поля ввода
      const inputElements = productFormContent.querySelectorAll('input, select');
      inputElements.forEach(input => {
          input.addEventListener('input', updateSaveButtonState);
      });
  }

  function updateTabEvents() {
      const tabs = tabsContainer.querySelectorAll('.tab');
      tabs.forEach(tab => {
          tab.onclick = () => activateTab(tab.dataset.tab);

          const closeButton = tab.querySelector('.close-tab');
          closeButton.onclick = (event) => {
              event.stopPropagation();
              showConfirmationModal(tab);
          };
      });
  }

  function updateTabsNumbering() {
      const tabs = tabsContainer.querySelectorAll('.tab');
      const forms = productFormBody.querySelectorAll('.product-form__content');

      tabs.forEach((tab, index) => {
          const newIndex = index + 1;
          tab.dataset.tab = newIndex;
          const span = tab.querySelector('span');
          span.textContent = `Товар №${newIndex}`;
      });

      forms.forEach((form, index) => {
          const newIndex = index + 1;
          form.dataset.tab = newIndex;
          updateFormContentIDs(form, newIndex);
      });
  }

  function updateFormContentIDs(productFormContent, index) {
      const inputGroups = productFormContent.querySelectorAll('.input-group');
      inputGroups.forEach(group => {
          const label = group.querySelector('label');
          const input = group.querySelector('input, select');

          if (input && label) {
              const inputType = input.tagName.toLowerCase() === 'input' ? input.name : input.name;
              const newId = `${inputType}-${index}`;
              input.id = newId;
              label.setAttribute('for', newId);
          }
      });
  }

  function showConfirmationModal(tab) {
      currentTabToClose = tab;
      showModal(parseInt(tab.dataset.tab));
  }

  function deleteTab() {
      if (currentTabToClose) {
          const number = parseInt(currentTabToClose.dataset.tab);
          const productFormContent = productFormBody.querySelector(`.product-form__content[data-tab="${number}"]`);
          if (productFormContent) {
              productFormContent.remove();
          }
          currentTabToClose.remove();
          updateTabsNumbering();
          updateTabEvents();

          const allTabs = Array.from(tabsContainer.querySelectorAll('.tab'));
          tabCount = allTabs.length;
          if (tabCount > 0) {
              activateTab(tabCount);
          }
      }
  }

  let confirmationModal = document.getElementById("confirmationModal");
  let modalTabNumber = document.getElementById("modalTabNumber");
  let confirmDeleteButton = document.getElementById("confirmDelete");
  let cancelDeleteButton = document.getElementById("cancelDelete");

  function showModal(tabNumber) {
      modalTabNumber.textContent = tabNumber;
      confirmationModal.style.display = "flex";
  }

  function closeModal() {
      confirmationModal.style.display = "none";
  }

  closeModalButton.onclick = function() {
      closeModal();
  };

  confirmDeleteButton.onclick = function() {
      deleteTab();
      closeModal();
  };

  cancelDeleteButton.onclick = function() {
      currentTabToClose = null;
      closeModal();
  };

  window.onclick = function(event) {
      if (event.target == confirmationModal) {
          closeModal();
      }
  };

  function updateSaveButtonState() {
      const currentTab = tabsContainer.querySelector('.tab.active');
      if (!currentTab) {
          return;
      }

      const tabNumber = currentTab.dataset.tab;
      const productFormContent = productFormBody.querySelector(`.product-form__content[data-tab="${tabNumber}"]`);
      if (!productFormContent) {
          return;
      }

      const inputElements = productFormContent.querySelectorAll('input, select');
      const productFormSaveBtn = document.querySelector('.product-form__save-btn');

      let allFieldsFilled = true;
      inputElements.forEach(input => {
          if (!input.value.trim()) {
              allFieldsFilled = false;
          }
      });

      productFormSaveBtn.disabled = !allFieldsFilled;
  }

  addTabButton.addEventListener('click', addTab);

  if (tabCount === 0) {
      addTab();
  } else {
      activateTab(1);
  }

  updateTabEvents();
});

// --------Отправка формы на сервер_______________

document.querySelector('.product-form__save-btn').addEventListener('click', function() {
  // Предполагаемая функция отправки данных на сервер
  sendAllTabsDataToServer();

  // Скрытие и очистка формы после сохранения
  toggleForm('#productForm', false); // Скрыть форму
  clearFormContent('productForm'); // Очистить содержимое формы

  // Удаление всех табов и создание одного нового
  // resetTabs();
  fetchAndUpdateTobaccoStock();
});


// Функция для сбора данных из всех заполненных табов
function collectDataFromAllTabs() {
  const allTabsData = [];
  const allForms = document.querySelectorAll('.product-form__content');

  allForms.forEach((form, tabIndex) => {
    const tabData = {};
    const inputs = form.querySelectorAll('input');
    const selects = form.querySelectorAll('select');

    inputs.forEach(input => {
      let value = input.value;
      if (input.type === 'number') {
        value = parseFloat(value);
      } else if (input.type === 'date') {
        value = toISO8601String(value); // Убедитесь, что эта функция корректно возвращает строковое представление даты
      }
      let key = input.name.replace(/-/g, '_');
      tabData[key] = value;
    });

    selects.forEach(select => {
      let key = select.name.replace(/-/g, '_');
      tabData[key] = select.value;
    });

    const requiredFields = ['brand', 'supplier', 'taste', 'taste_group', 'purchase_date', 'best_before_date', 'weight', 'price'];
    let allFieldsFilled = requiredFields.every(field => {
      const fieldValue = tabData[field];
      if (typeof fieldValue === 'string') {
        return fieldValue.trim() !== '';
      } else {
        return fieldValue !== null && fieldValue !== undefined; // Проверяем, что числовые значения заполнены (не null и не undefined)
      }
    });
    
    if (!allFieldsFilled) {
      console.error(`Обязательное поле отсутствует или не заполнено для таба ${tabIndex + 1}`);
      // Возможно, стоит прекратить дальнейшую обработку
      return; // Если требуется, чтобы функция полностью остановила выполнение, используйте другой подход, например, выброс исключения
    }

    allTabsData.push(tabData);
  });

  return allTabsData;
}


// Функция отправки данных всех табов на сервер
function sendAllTabsDataToServer() {
  const allTabsData = collectDataFromAllTabs();
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    console.error('Токен аутентификации не найден.');
    return; // Прекращаем выполнение, если токен не найден
  }

  console.log('Начало отправки данных, токен аутентификации найден.');

  allTabsData.forEach((tabData, index) => {
    console.log(`Данные для таба ${index + 1} перед отправкой:`, tabData);

    tabData.organization = 1;

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      },
      body: JSON.stringify(tabData),
    };

    const apiUrl = 'http://188.68.221.107/api/v1/storage/tobacco/';

    fetch(apiUrl, fetchOptions)
      .then(response => {
        console.log(`Ответ сервера для таба ${index + 1}:`, response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Ошибка при отправке данных на сервер для таба ${index + 1}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`Данные успешно отправлены для таба ${index + 1}:`, data);
        // Обработка успешной отправки данных
      })
      .catch(error => {
        console.error(`Ошибка при отправке данных на сервер для таба ${index + 1}:`, error);
      });
  });
}


// _____________Администрирование персонала---------------------------


// Функция для вставки данных в таблицу
function insertDataIntoTable(data) {
  const tableBody = document.querySelector('.staffAdministration__table tbody');
  // Очистить текущее содержимое tbody
  tableBody.innerHTML = '';

  // Добавить строки в таблицу
  data.forEach(worker => {
    const row = document.createElement('tr');
    // Установить атрибут data-id для строки, если у worker есть уникальный идентификатор
    row.setAttribute('data-id', `staff-${worker.id}`);

    // Создание и добавление данных пользователя в строку таблицы, включая кнопки действий
    row.innerHTML = `
      <td>${worker.user.first_name}</td>
      <td>${worker.user.last_name}</td>
      <td>${worker.user.email}</td>
      <td>${worker.user.username}</td>
      <td>${worker.user.user_role}</td>
      <td class="actions">
      <div class="action-buttons">
        <button class="options-button staff-table-options-button" data-action="toggle" data-id="staff-${worker.id}">...</button>
        <div class="table-edit-delete-buttons" id="edit-delete-staff-${worker.id}" style="display: none;">
          <button class="table-edit-button staff-table-edit-button" data-action="edit" data-id="staff-${worker.id}"><i class="ri-edit-line"></i> <span>Редактировать</span></button>
          <button class="table-delete-button staff-table-delete-button" data-action="delete" data-id="staff-${worker.id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
        </div>
      </div>
    </td>
    `;

    // Добавление строки в tbody
    tableBody.appendChild(row);
  });
}




// Функция для получения данных о пользователях
// 222
// function fetchWorkers() {
//   const authToken = localStorage.getItem('authToken');

//   if (!authToken) {
//     console.error('Токен аутентификации не найден.');
//     return; // Прекращаем выполнение, если токен не найден
//   }

//   console.log('Начало отправки данных, токен аутентификации найден.');
  

//   const url = 'http://188.68.221.107/api/v1/worker/';

//   // Настройка запроса
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Token ${authToken}`
//     }
//   };

//   // Отправка запроса
//   fetch(url, options)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       // Обработка полученных данных
//       console.log(data);
//       // Здесь вы можете добавить код для вставки данных в вашу таблицу
//       insertDataIntoTable(data);

//     })
//     .catch(error => {
//       console.error('There has been a problem with your fetch operation:', error);
//     });
// }

// Вызов функции при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchWorkers);



// ___________Отправка на сервер  POST-----------------
document.addEventListener('DOMContentLoaded', () => {
  // Находим кнопку сохранения по классу
  const saveButton = document.querySelector('.user-form__save-btn');

  // Добавляем слушатель событий на кнопку для отправки формы
  saveButton.addEventListener('click', function(e) {
    sendFormData();
  });
});

function sendFormData() {
  // Получаем токен аутентификации из локального хранилища
  const authToken = localStorage.getItem('authToken');

  // Проверяем наличие токена аутентификации
  if (!authToken) {
    console.error('Токен аутентификации не найден.');
    return; // Прекращаем выполнение, если токен не найден
  }

  console.log('Начало отправки данных, токен аутентификации найден.');

  // Собираем данные из формы
  const userData = {
    user: {
      username: document.getElementById('userLogin').value,
      email: document.getElementById('email').value,
      first_name: document.getElementById('name').value,
      last_name: document.getElementById('surname').value,
      password: document.getElementById('userPassword').value,
      user_role: document.getElementById('role-select').value,
    },
    organization: 1
  };

  // Определяем URL API для отправки данных
  const apiUrl = 'http://188.68.221.107/api/v1/worker/';

  // Отправляем данные на сервер с помощью Fetch API
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (!response.ok) {
      console.error(`Ошибка сети: Статус ${response.status} ${response.statusText}`);
      return response.json().then(errorData => {
        console.error('Детали ошибки:', errorData);
        throw new Error('Ошибка при обработке запроса: ' + JSON.stringify(errorData));
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('User created:', data);
    // Здесь можно добавить дальнейшие действия после успешной отправки данных, например, очистку формы или отображение сообщения пользователю
  })
  .catch(error => {
    console.error('Возникла проблема с вашей fetch-операцией:', error);
  });
}

// ___________Отправка на сервер  POST-----------------

    
    //**/ ---------------Редактирование пользователей PATCH____________________
// Функция для обновления данных работника
// Функция для начала редактирования данных работника
function startEditingStaff(id) {
  const row = document.querySelector(`tr[data-id="staff-${id}"]`);
  if (!row) {
    console.error('Строка с id не найдена:', id);
    return;
  }
  const cells = row.querySelectorAll('td');
  // Превращаем каждую ячейку в редактируемое поле
  cells.forEach((cell, index) => {
    if (index > 0 && index < cells.length - 2) { 
      const input = document.createElement('input');
      input.type = 'text';
      input.value = cell.innerText;
      cell.innerText = '';
      cell.appendChild(input);
    }
  });

  // Заменяем кнопки на "Сохранить" и "Отменить"
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Сохранить';
  saveButton.classList.add('staff-save-button');
  saveButton.onclick = () => saveWorkerEdit(id);

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Отменить';
  cancelButton.classList.add('staff-cancel-button');
  cancelButton.onclick = () => staffCancelEdit(id); // Можно использовать уже существующую функцию staffCancelEdit

  const buttonsContainer = document.getElementById(`edit-delete-staff-${id}`);
  if (buttonsContainer) {
    buttonsContainer.innerHTML = '';
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(cancelButton);
  }
}

// Функция для сохранения изменений данных работника
function saveWorkerEdit(id) {
  const row = document.querySelector(`tr[data-id="staff-${id}"]`);
  const inputs = row.querySelectorAll('input');

  // Собираем данные из полей ввода
  const updatedWorkerData = {
    user: {
      first_name: inputs[0].value,
      last_name: inputs[1].value,
      email: inputs[2].value,
      username: inputs[3].value,
      user_role: inputs[4].value
    },
    // Добавьте сюда другие данные, если они есть
  };

  // Отправляем изменения на сервер
  updateWorkerData(id, updatedWorkerData);
}

// _____!!-----
function staffCancelEdit(id) {
  const row = document.querySelector(`tr[data-id="staff-${id}"]`);
  const cells = row.querySelectorAll('td');

  // Восстановление исходных значений ячеек, если они были изменены
  // Ваш код для восстановления исходных значений ячеек...
  if (row) {
    // Восстановление исходной высоты строки
    row.style.height = ''; // Удаление индивидуального стиля высоты для возврата к стандартному CSS
  }
  // Восстановление исходного состояния кнопок
  const actionCell = cells[cells.length - 1];
  actionCell.innerHTML = `
    <div class="action-buttons">
      <button class="options-button staff-table-options-button" data-action="toggle" data-id="staff-${id}">...</button>
      <div class="table-edit-delete-buttons" id="edit-delete-staff-${id}" style="display: none;">
        <button class="table-edit-button staff-table-edit-button" data-action="edit" data-id="staff-${id}"><i class="ri-edit-line"></i> <span>Редактировать</span></button>
        <button class="table-delete-button staff-table-delete-button" data-action="delete" data-id="staff-${id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
      </div>
    </div>
  `;
}

// Функция для обновления строки в таблице работников
function updateWorkerTableRow(id, updatedData) {
const row = document.querySelector(`tr[data-id="staff-${id}"]`);
  if (row) {
    const cells = row.querySelectorAll('td');

    // Обновляем текстовые ячейки
    cells[0].innerText = updatedData.user.first_name;
    cells[1].innerText = updatedData.user.last_name;
    cells[2].innerText = updatedData.user.email;
    cells[3].innerText = updatedData.user.username;

    // Обновляем ячейку с ролью пользователя с использованием элемента select
    const roleSelect = document.createElement('select');
    roleSelect.classList.add('user-role-select'); // Добавьте классы по необходимости
    // Предположим, у нас есть массив всех возможных ролей
    const roles = ['HOOKAH', 'ADMIN']; // Примерный список ролей
    roles.forEach(role => {
      const option = document.createElement('option');
      option.value = role;
      option.text = role;
      roleSelect.appendChild(option);
      if (role === updatedData.user.user_role) {
        option.selected = true;
      }
    });

    // Очищаем содержимое ячейки и добавляем в неё select
    cells[4].innerHTML = ''; // Очищаем текущее содержимое ячейки
    cells[4].appendChild(roleSelect);

    // Возвращаем кнопки "Редактировать" и "Удалить"
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
    <div class="action-buttons">
    <button class="options-button staff-table-options-button" data-action="toggle" data-id="staff-${worker.id}">...</button>
    <div class="table-edit-delete-buttons" id="edit-delete-staff-${worker.id}" style="display: none;">
      <button class="table-edit-button staff-table-edit-button" data-action="edit" data-id="staff-${worker.id}"><i class="ri-edit-line"></i> <span>Редактировать</span></button>
      <button class="table-delete-button staff-table-delete-button" data-action="delete" data-id="staff-${worker.id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
    </div>
  </div>
    `;
  }
}





// Функция для отправки изменений на сервер
function updateWorkerData(id, updatedWorkerData) {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('Токен аутентификации не найден');
    return;
  }

  const url = `http://188.68.221.107/api/v1/worker/${id}/`;
  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    },
    body: JSON.stringify(updatedWorkerData)
  })
  .then(response => {
    if (response.ok) {
      console.log(`Обновлены данные работника с id: ${id}`);
      return response.json();
    } else {
      return response.json().then(error => {
        throw new Error(`Ошибка при обновлении: ${error.detail}`);
      });
    }
  })
  .then(updatedData => {
    // Обновляем данные в таблице
    updateWorkerTableRow(id, updatedData);
    // Обновление данных в таблице можно сделать аналогично функции updateTableRow
  })
  .catch(error => {
    console.error('Ошибка при обновлении данных работника:', error);
  });
}

//* */ ____________________Удаление персонала------------------------------


function deleteStaff(id) {
  const authToken = localStorage.getItem('authToken'); // Или sessionStorage, в зависимости от того, где он хранится
  if (!authToken) {
    console.error('Токен аутентификации не найден');
    return;
  }

  const url = `http://188.68.221.107/api/v1/worker/${id}/`;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${authToken}`,
      'Accept': 'application/json',
    }
  })
  .then(response => {
    if (response.ok) {
      console.log(`Работник с id: ${id} удален`);
      removeWorkerRow(id);
    } else {
      return response.json().then(error => {
        throw new Error(`Ошибка при удалении работника: ${error.message}`);
      });
    }
  })
  .catch(error => {
    console.error('Ошибка при удалении работника:', error);
  });
}

function removeWorkerRow(id) {
  const row = document.querySelector(`.staffAdministration__table tr[data-id="staff-${id}"]`);
  if (row) {
    row.remove();
  }
}

document.addEventListener('click', function(event) {
  if (event.target.matches('[data-action="edit"]')) {
    const idWithPrefix = event.target.getAttribute('data-id'); // Получаем id с префиксом, например, "staff-123"
    const id = idWithPrefix.replace('staff-', ''); // Убираем префикс, чтобы получить чистый id, например, "123"
    startEditingStaff(id);
  }
  // Аналогично обрабатывайте другие действия, например, удаление
});



//* */ ____________________Удаление персонала------------------------------






// ________________Анимация-------------------

import { animateText, animateImage, animatelist } from './animations.js';

// Функция для сброса анимаций
function resetAnimations() {
  // Удаляем инлайновые стили, если они были добавлены через JS
  document.querySelectorAll('.animate-text, .animate-image, .animate-list').forEach(el => {
      el.style = ''; // Сбрасываем все инлайновые стили
  });

  // Дополнительно, если используются классы для анимации, можно удалить эти классы
  document.querySelectorAll('.animated').forEach(el => {
      el.classList.remove('animated'); // Удаляем классы анимации
  });
}



// Функция для запуска анимаций
function startAnimations() {
    animateText();
    animateImage();
    animatelist();
}

// Добавляем обработчик события на клик по ссылке, используя startAnimations напрямую
document.getElementById('startAnimation').addEventListener('click', startAnimations);

// Когда DOM загрузится, запустим анимации, также используя startAnimations напрямую
window.addEventListener('DOMContentLoaded', startAnimations);



// ________________Анимация-------------------
