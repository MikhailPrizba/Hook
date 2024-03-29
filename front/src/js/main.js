




// --------------Header_____________________

function toggleMenu() {
  const header = document.querySelector('.header');
  header.classList.toggle('collapsed');
}

// --------------Выводим секцию__________________

function showSection(event, sectionId) {
  event.preventDefault(); // Предотвращаем стандартное поведение ссылки

  // Скрываем все секции
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active-section');
  });

  // Показываем нужную секцию
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('active-section');
  }
}
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

// Функция для выхода из системы
function logout() {
  localStorage.removeItem('authToken');
  showLoginPage();
}

// Обработчик события загрузки DOM
document.addEventListener('DOMContentLoaded', (event) => {
  // Проверка аутентификации пользователя
  if (localStorage.getItem('authToken')) {
    showMainPage(); // Если токен найден, показываем главную страницу
  } else {
    showLoginPage(); // Если токен не найден, показываем страницу входа
  }

  // Обработка формы входа
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const login = document.getElementById('login').value;
      const password = document.getElementById('password').value;

      const postData = {
        username: login,
        password: password
      };

      fetch('http://188.68.221.107/api/v1/auth/token/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.auth_token) {
          console.log('Токен:', data.auth_token);
          localStorage.setItem('authToken', data.auth_token); // Сохраняем токен в локальном хранилище
          showMainPage();
        } else {
          console.error('Ошибка аутентификации', data);
        }
      })
      .catch(error => {
        console.error('Ошибка сети', error);
      });
    });
  } else {
    console.error('Форма входа не найдена');
  }

  // Настройка кнопки выхода
  const logoutButton = document.querySelector('.output-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  } else {
    console.error('Кнопка выхода не найдена');
  }
});


// -----------------Выход_____________________

// -----------------Склад_____________________

let organization;
// Функция для получения данных с сервера Get
function fetchData() {
  fetch('http://188.68.221.107/api/v1/storage/tobacco/')
    .then(response => response.json())
    .then(data => {
      updateTable(data);

      // Предполагаем, что `data` является массивом объектов, как в вашем примере
      data.forEach(item => {
        if(item.organization) { // Проверяем, существует ли свойство organization в каждом объекте
          organization = item.organization; // Сохраняем значение organization из объекта
          console.log('Organization:', organization); // Выводим значение для проверки
        }
      });
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
}


function toggleEditDeleteButtons(id) {
  const editDeleteButtons = document.getElementById(`edit-delete-${id}`);
  editDeleteButtons.style.display = editDeleteButtons.style.display === 'none' ? 'flex' : 'none';
  toggleRowStyle(id); 
}



// ------------Меняем цвет строки_______________________
function toggleRowStyle(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row.classList.contains('highlighted')) {
    row.classList.remove('highlighted');
  } else {
    row.classList.add('highlighted');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}


function updateTable(data) {
  const tableBody = document.querySelector('.stock__table tbody');
  tableBody.innerHTML = '';
  data.forEach((item, index) => {
    // Преобразовать даты перед отображением
    const formattedPurchaseDate = formatDate(item.purchase_date);
    const formattedBestBeforeDate = formatDate(item.best_before_date);

    const row = `<tr data-id="${item.id}">
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
          <button class="options-button" onclick="toggleEditDeleteButtons(${item.id})">...</button>
          <div class="edit-delete-buttons" id="edit-delete-${item.id}" style="display: none;">
            <button class="edit-button" data-id="${item.id}">Редактировать</button>
            <button class="delete-button" data-id="${item.id}">Удалить</button>
          </div>
        </div>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
  });
  document.querySelector('.stock__box').style.display = data.length === 0 ? 'flex' : 'none';
}



document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  document.querySelector('.stock__table').addEventListener('click', function(e) {
    if (e.target.closest('.edit-button')) {
      const id = e.target.closest('.edit-button').getAttribute('data-id');
      editItem(id);
    } else if (e.target.closest('.delete-button')) {
      const id = e.target.closest('.delete-button').getAttribute('data-id');
      deleteItem(id);
    }
  });
});


function editItem(id) {
  console.log('Редактировать элемент с id:', id);
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

  // Превращаем каждую ячейку в редактируемое поле, кроме первой и последней (индекс и кнопки действий)
  for (let i = 1; i < cells.length - 1; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = cells[i].innerText;
    input.classList.add('reset-default-styles');
    cells[i].innerText = '';
    cells[i].appendChild(input);
  }

  // Добавляем кнопку "Сохранить"
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Сохранить';
  saveButton.onclick = () => saveEdit(id);

  // Добавляем кнопку "Отменить"
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Отменить';
  cancelButton.onclick = () => cancelEdit(id);

  // Получаем контейнер для кнопок редактирования и удаления
  const buttonsContainer = document.getElementById(`edit-delete-${id}`);
  if (buttonsContainer) {
    buttonsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых кнопок
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(cancelButton);
  } else {
    console.error('Элемент для редактирования не найден:', `edit-delete-${id}`);
  }
}

function toISOFormat(dateString) {
  // Разбиваем строку "дд.мм.гггг" на части
  const parts = dateString.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Месяц в JavaScript начинается с 0
  const year = parseInt(parts[2], 10);

  // Создаем объект Date
  const date = new Date(Date.UTC(year, month, day));

  // Возвращаем дату в формате ISO 8601
  return date.toISOString();
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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
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
        <button class="options-button" onclick="toggleEditDeleteButtons(${id})">...</button>
        <div class="edit-delete-buttons" id="edit-delete-${id}" style="display: none;">
          <button class="edit-button" onclick="startEditing(${id})">Редактировать</button>
          <button class="delete-button" onclick="deleteItem(${id})">Удалить</button>
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
      <button class="options-button" onclick="toggleEditDeleteButtons(${id})">...</button>
      <div class="edit-delete-buttons" id="edit-delete-${id}" style="display: none;">
        <button class="edit-button" onclick="startEditing(${id})">Редактировать</button>
        <button class="delete-button" onclick="deleteItem(${id})">Удалить</button>
      </div>
    </div>
  `;
}

// Добавим вызов startEditing в существующий обработчик событий
document.querySelector('.stock__table').addEventListener('click', function(e) {
  if (e.target.closest('.edit-button')) {
    const id = e.target.closest('.edit-button').getAttribute('data-id');
    startEditing(id); // Изменено на startEditing
  } else if (e.target.closest('.delete-button')) {
    const id = e.target.closest('.delete-button').getAttribute('data-id');
    deleteItem(id);
  }
});



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
      'Authorization': `Bearer ${authToken}`

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
// \---Удаление_____





// -----------------Табы_____________________


// Делегирование событий для обработки кликов на кнопках
document.addEventListener('click', function(event) {
  const target = event.target;

// Открытие формы продукта
if (event.target.closest('.stock__btn-add')) {
  showProductForm();
}

   // Закрытие формы продукта
   if (event.target.closest('.product-form__close') || event.target.closest('.cancel')) {
    hideProductForm();
    clearFormContent(); // Очистка содержимого формы
}
});

// Функция для отображения формы продукта
function showProductForm() {
  document.querySelector('#productForm').style.display = 'block';
  document.body.insertAdjacentHTML('beforeend', '<div class="modal-backdrop"></div>');
}

// Функция для скрытия формы продукта
function hideProductForm() {
  document.querySelector('#productForm').style.display = 'none';
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
      modalBackdrop.remove();
  }
}

// Функция для очистки содержимого формы
function clearFormContent() {
  const formBody = document.getElementById('formBody');
  const formContents = formBody.querySelectorAll('.form-content');
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

document.addEventListener('DOMContentLoaded', function() {
  const tabsContainer = document.getElementById('tabs');
  const addTabButton = tabsContainer.querySelector('.add-tab');
  const formBody = document.getElementById('formBody');
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
      const allForms = formBody.querySelectorAll('.form-content');

      allTabs.forEach(tab => {
          tab.classList.remove('active');
      });

      allForms.forEach(form => {
          form.style.display = 'none';
      });

      const activeTab = tabsContainer.querySelector(`.tab[data-tab="${number}"]`);
      const activeForm = formBody.querySelector(`.form-content[data-tab="${number}"]`);

      if (activeTab && activeForm) {
          activeTab.classList.add('active');
          activeForm.style.display = 'block';
          updateSaveButtonState(); // Вызываем функцию после активации вкладки
      } else {
          console.error(`Cannot find elements for tab ${number}`);
      }
  }

  function createFormContent(number) {
      const formContent = document.createElement('div');
      formContent.classList.add('form-content');
      formContent.dataset.tab = number;
      formContent.innerHTML = `
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
      <label for="weight-${number}">Остаток на скаде, г.</label>
      <input type="number" id="weight-${number}" name="weight" data-tab="${number}">
  </div>
  <div class="input-group">
      <label for="price-${number}">Цена закупки, руб.</label>
      <input type="number" id="price-${number}" name="price" data-tab="${number}">
  </div>
      `;
      formBody.appendChild(formContent);

      // Добавляем слушатели события input на поля ввода
      const inputElements = formContent.querySelectorAll('input, select');
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
      const forms = formBody.querySelectorAll('.form-content');

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

  function updateFormContentIDs(formContent, index) {
      const inputGroups = formContent.querySelectorAll('.input-group');
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
          const formContent = formBody.querySelector(`.form-content[data-tab="${number}"]`);
          if (formContent) {
              formContent.remove();
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

  var confirmationModal = document.getElementById("confirmationModal");
  var modalTabNumber = document.getElementById("modalTabNumber");
  var confirmDeleteButton = document.getElementById("confirmDelete");
  var cancelDeleteButton = document.getElementById("cancelDelete");

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
      const formContent = formBody.querySelector(`.form-content[data-tab="${tabNumber}"]`);
      if (!formContent) {
          return;
      }

      const inputElements = formContent.querySelectorAll('input, select');
      const saveButton = document.querySelector('.save');

      let allFieldsFilled = true;
      inputElements.forEach(input => {
          if (!input.value.trim()) {
              allFieldsFilled = false;
          }
      });

      saveButton.disabled = !allFieldsFilled;
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

document.querySelector('.save').addEventListener('click', sendAllTabsDataToServer);

// Функция преобразования даты в строку ISO 8601
function toISO8601String(dateString) {
  const date = new Date(dateString);
  return date.toISOString();
}

// Функция для сбора данных из всех заполненных табов
function collectDataFromAllTabs() {
  const allTabsData = [];
  const allForms = document.querySelectorAll('.form-content');

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
        'Authorization': `Bearer ${authToken}`,
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
