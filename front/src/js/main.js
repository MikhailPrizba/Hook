




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

      fetch('/api/v1/auth/token/login', {
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



// Функция для получения данных с сервера Get
function fetchData() {
  fetch('/api/v1/storage/tobacco/')
    .then(response => response.json())
    .then(data => {
      // Предполагаем, что 'data' - это массив объектов, как на вашем изображении
      updateTable(data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
}

// Функция для обновления таблицы данными
function updateTable(data) {
  const tableBody = document.querySelector('.stock__table tbody');
  tableBody.innerHTML = ''; // Очистите текущее содержимое tbody

  // Перебираем каждый объект данных и создаем строку таблицы
  data.forEach((item, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${item.brand}</td>
        <td>${item.supplier}</td>
        <td>${item.taste}</td>
        <td>${item.taste_group}</td>
        <td>${item.purchase_date}</td>
        <td>${item.best_before_date}</td>
        <td>${item.price}</td>
        <td>${item.weight}</td>
        <td class="actions">
        <div class="action-buttons">
          <button class="options-button" onclick="toggleEditDeleteButtons(${item.id})">...</button>
          <div class="edit-delete-buttons" id="edit-delete-${item.id}" style="display: none;">
            <button class="edit-button" data-id="${item.id}" onclick="editItem(${item.id})">Редактировать</button>
            <button class="delete-button" data-id="${item.id}" onclick="deleteItem(${item.id})">Удалить</button>
          </div>
        </div>
      </td>
      </tr>
    `;
    tableBody.innerHTML += row; // Добавьте строку в tbody таблицы
  });


// Добавьте обработчики событий для кнопок "Редактировать" и "Удалить"
document.addEventListener('click', function(e) {
  if (e.target && e.target.className == 'edit-button') {
    // Действие редактирования
    const id = e.target.getAttribute('data-id');
    editItem(id);
  } else if (e.target && e.target.className == 'delete-button') {
    // Действие удаления
    const id = e.target.getAttribute('data-id');
    deleteItem(id);
  }
});



function editItem(id) {
  // Функция для редактирования элемента
  // Здесь вы можете добавить логику для редактирования элемента
  console.log('Редактировать элемент с id:', id);
}

function deleteItem(id) {
  // Функция для удаления элемента
  // Здесь вы можете добавить логику для удаления элемента
  console.log('Удалить элемент с id:', id);
}

  // Проверяем, пустой ли массив данных
  if (data.length === 0) {
    // Показываем сообщение о пустом складе
    document.querySelector('.stock__box').style.display = 'flex';
  } else {
    // Скрываем сообщение о пустом складе
    document.querySelector('.stock__box').style.display = 'none';
  }
}

// Вызовите функцию fetchData при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchData);

// -----------------Склад_____________________






// -----------------Табы_____________________


// Делегирование событий для обработки кликов на кнопках
document.addEventListener('click', function(event) {
  const target = event.target;

  // Открытие формы продукта
  if (target.classList.contains('stock__btn-add')) {
      showProductForm();
  }

  // Закрытие формы продукта
  if (target.classList.contains('product-form__close') || target.classList.contains('cancel')) {
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
      <label for="flavor-${number}">Вкус</label>
      <input type="text" id="flavor-${number}" name="flavor" data-tab="${number}" placeholder="Введите вкус">
  </div>
  <div class="input-group">
  <label for="flavor-group-${number}">Группа вкуса</label>
  <select id="flavor-group-${number}" name="flavor-group" data-tab="${number}">
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
      <label for="expiration-date-${number}">Срок годности</label>
      <input type="date" id="expiration-date-${number}" name="expiration-date" data-tab="${number}">
  </div>
  <div class="input-group">
      <label for="stock-remainder-${number}">Остаток на скаде, г.</label>
      <input type="number" id="stock-remainder-${number}" name="stock-remainder" data-tab="${number}">
  </div>
  <div class="input-group">
      <label for="purchase-price-${number}">Цена закупки, руб.</label>
      <input type="number" id="purchase-price-${number}" name="purchase-price" data-tab="${number}">
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



// -----------------Табы_____________________
