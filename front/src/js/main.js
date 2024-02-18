

// import { init } from './authorization';

import { animateText, animateImage, animateList, resetAnimations, startAnimations } from './animations.js';

import { toggleMenu } from './header.js';
import { showSection } from './navigation.js';
import { getAuthToken, makeFetchRequest} from './apiService.js';  
import { formatDate, toISOFormat, toISO8601String, showMainPage, 
         showLoginPage, clearLoginFormFields, setErrorMessage } from './helpers.js';
import { fetchAndUpdateTobaccoStock, 
        fetchAndUpdateWorkers, 
        updateStockItemRow} from './dataHandling.js';

import { sendWorkerRegistrationData,
         sendTobaccoDataFromAllTabs
                                      } from './formHandling.js'; 

import { transformRowToEditableFormStock 
                                          } from './tableManipulation.js';

// --------------Header_____________________

document.querySelector('.burger-menu').addEventListener('click', toggleMenu);

// document.addEventListener("DOMContentLoaded", function() {
//   const burgerMenu = document.querySelector('.burger-menu');
//   const header = document.querySelector('.header');
//   const navigationItems = document.querySelectorAll('.navigation, .menu__item-link, .supports span');

//   burgerMenu.addEventListener('click', function() {
//     header.classList.toggle('collapsed');

//     // Плавное появление или исчезновение элементов меню
//     if (header.classList.contains('collapsed')) {
//       // Переключение на сжатое состояние
//       navigationItems.forEach(item => {
//         item.style.opacity = '0';
//         item.style.transform = 'translateX(-20px)';
//       });
//     } else {
//       // Переключение на расширенное состояние
//       navigationItems.forEach(item => {
//         item.style.opacity = '1';
//         item.style.transform = 'translateX(0)';
//       });
//     }
//   });
// });

 

// --------------Выводим секцию__________________

document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('.menu__item-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const sectionId = link.getAttribute('href');
  
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
// function showMainPage() {
//   document.querySelector('.wrap-authorization').style.display = 'none';
//   document.querySelector('.page-container').style.display = 'flex';
// }

// // Функция для отображения страницы входа
// function showLoginPage() {
//   document.querySelector('.wrap-authorization').style.display = 'flex';
//   document.querySelector('.page-container').style.display = 'none';
// }

// // Обработчик события загрузки DOM
// function clearLoginFormFields() {
//   document.getElementById('login').value = '';
//   document.getElementById('password').value = '';
// }

// function setErrorMessage(message) {
//   const errorMessageElement = document.getElementById('error-message');
//   errorMessageElement.textContent = message;
// }

async function login(username, password) {
  const postData = { username, password };

  try {
    const data = await makeFetchRequest('/auth/token/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Thunder Client (https://www.thunderclient.io)',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (data.auth_token) {
      console.log('Токен:', data.auth_token);
      localStorage.setItem('authToken', data.auth_token);
      showMainPage();
      clearLoginFormFields();
    } else {
      console.error('Ошибка аутентификации', data);
      setErrorMessage('Ошибка аутентификации');
    }
  } catch (error) {
    console.error('Ошибка сети', error);
    setErrorMessage('Неверный логин или пароль');
  }
}

function logout() {
  localStorage.removeItem('authToken');
  showLoginPage();
  clearLoginFormFields();
}

function initAuth() {
  if (getAuthToken()) {
    showMainPage();
  } else {
    showLoginPage();
  }

  const loginForm = document.querySelector('.login-form');
  const logoutButton = document.querySelector('.output-btn');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login').value;
      const password = document.getElementById('password').value;
      login(username, password);
    });
  } else {
    console.error('Форма входа не найдена');
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  } else {
    console.error('Кнопка выхода не найдена');
  }
}

document.addEventListener('DOMContentLoaded', initAuth);


// -----------------Выход_____________________

// -----------------Склад_____________________

let organization;

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
    transformRowToEditableFormStock(id);
  } else if (event.target.matches('[data-action="delete"]')) {
    const id = event.target.getAttribute('data-id');
    deleteItem(id);
  }
});

function toggleEditDeleteButtons(id, isStockTable, isStaffTable) {
  let editDeleteDiv;
  if (isStockTable) {
    editDeleteDiv = document.querySelector(`.table__stock #edit-delete-${id}`);
  } else if (isStaffTable) {
    editDeleteDiv = document.querySelector(`.table__staff #edit-delete-${id}`);
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


// ___!!!!


document.addEventListener('DOMContentLoaded', () => {
  // Загрузка данных о товарах
  fetchAndUpdateTobaccoStock();
  
  // Загрузка данных о сотрудниках
  fetchAndUpdateWorkers();

  // Обработчик событий для таблицы товаров
  document.querySelector('.table__stock').addEventListener('click', function(e) {
    if (e.target.closest('.stock-table-edit-button')) {
      const id = e.target.closest('.stock-table-edit-button').getAttribute('data-id');
      transformRowToEditableFormStock(id);
    } else if (e.target.closest('.stock-table-delete-button')) {
      const id = e.target.closest('.stock-table-delete-button').getAttribute('data-id');
      deleteItem(id);
    }
  });

  // Обработчик событий для таблицы сотрудников
  document.querySelector('.table__staff').addEventListener('click', function(e) {
    if (e.target.closest('.staff-table-edit-button')) {
      const id = e.target.closest('.staff-table-edit-button').getAttribute('data-id');
      transformRowToEditableFormStaff(id); // Предполагается, что у вас есть функция transformRowToEditableFormStaff для редактирования данных сотрудников
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
  const rows = document.querySelectorAll('.table__stock tbody tr');
  rows.forEach((row, index) => {
    row.cells[0].textContent = index + 1; // Обновляем номер строки, предполагая что номер находится в первой ячейке
  });
}
// \---Удаление_____






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

// -----------------Табы_____________________

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
      <input type="number" id="weight-${number}" placeholder="0" name="weight" data-tab="${number}">
  </div>
  <div class="input-group">
      <label for="price-${number}">Цена закупки, руб.</label>
      <input type="number" id="price-${number}" name="price" data-tab="${number}" placeholder="0">
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

document.addEventListener('DOMContentLoaded', () => {
  initFormHandlers();
});

function initFormHandlers() {
  const productSaveBtn = document.querySelector('.product-form__save-btn');
  const userSaveBtn = document.querySelector('.user-form__save-btn');

  productSaveBtn.addEventListener('click', () => handleFormSave(sendTobaccoDataFromAllTabs, '#productForm', 'productForm', fetchAndUpdateTobaccoStock));
  userSaveBtn.addEventListener('click', () => handleFormSave(sendWorkerRegistrationData, '#userForm', 'userForm', fetchAndUpdateWorkers));
}

async function handleFormSave(sendDataFunction, formSelector, formName, fetchDataFunction) {
  await sendDataFunction();
  toggleForm(formSelector, false);
  clearFormContent(formName);
  await fetchDataFunction();
}

// _____________Администрирование персонала---------------------------

// Вызов функции при загрузке страницы
// document.addEventListener('DOMContentLoaded', fetchAndUpdateWorkers);






    
    //**/ ---------------Редактирование пользователей PATCH____________________
// Функция для начала редактирования данных работника
function transformRowToEditableFormStaff(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) {
    console.error('Строка с id не найдена:', id);
    return;
  }
  const cells = row.querySelectorAll('td');
  row.style.height = '100px';
  row.style.background = 'rgb(254, 243, 234)'
  // Превращаем каждую ячейку в редактируемое поле
  cells.forEach((cell, index) => {
    if (index >= 0 && index < cells.length - 1) {
      if (index === 4) { // Предполагая, что роль находится в пятой ячейке
        const select = document.createElement('select');
        select.innerHTML = `<option value="ADMIN">ADMIN</option><option value="HOOKAH">HOOKAH</option>`;
        select.value = cell.innerText.trim();
        select.classList.add('reset-default-styles');
        cell.innerText = '';
        cell.appendChild(select);
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = cell.innerText;
        input.classList.add('reset-default-styles');
        cell.innerText = '';
        cell.appendChild(input);
      }
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
  cancelButton.onclick = () => resetStaffItemEditState(id); 

  const buttonsContainer = document.getElementById(`edit-delete-${id}`);
  if (buttonsContainer) {
    buttonsContainer.innerHTML = '';
    buttonsContainer.classList.add('edit-save-cancel-buttons');
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(cancelButton);
  }
}


// Функция для сохранения изменений данных работника
function saveWorkerEdit(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) {
    console.error(`Строка с id ${id} не найдена`);
    return;
  }

  row.style.height = '';
  row.style.background ='';
  // Получаем все элементы input и select в строке
  const inputs = row.querySelectorAll('input');
  const select = row.querySelector('select'); // Селектор для user_role

  if (inputs.length < 4 || !select) {
    console.error(`Не все элементы ввода были найдены в строке с id ${id}`);
    return;
  }

  // Собираем данные из полей ввода и выпадающего списка
  const updatedWorkerData = {
    user: {
      first_name: inputs[0].value,
      last_name: inputs[1].value,
      email: inputs[2].value,
      username: inputs[3].value,
      user_role: select.value
      // password: 'potomYberem' // Задайте новый пароль здесь
    },
    // is_active: true, 
    organization: 1
   };

  // Отправляем изменения на сервер
  updateWorkerData(id, updatedWorkerData)
}


function getOriginalWorkerData(id, callback) {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('Токен аутентификации не найден');
    return;
  }

  const url = `http://188.68.221.107/api/v1/worker/${id}/`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Ошибка при получении данных работника');
    }
  })
  .then(data => callback(id, data))
  .catch(error => console.error('Ошибка при получении данных работника:', error));
}



// _____!!-----
function resetStaffItemEditState(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const cells = row.querySelectorAll('td');
  
  if (!row) return; // Досрочный выход из функции, если элемент не найден
  
  getOriginalWorkerData(id, updateWorkerTableRow);

  if (row) {
    // Восстановление исходной высоты строки
    row.style.height = '';
    row.style.background ='';
   }
  // Восстановление исходного состояния кнопок
  const actionCell = cells[cells.length - 1];
  actionCell.innerHTML = `
    <div class="action-buttons">
      <button class="options-button staff-table-options-button" data-action="toggle" data-id="${id}">...</button>
      <div class="table-edit-delete-buttons" id="edit-delete-${id}" style="display: none;">
        <button class="table-edit-button staff-table-edit-button" data-action="edit" data-id="${id}"><i class="ri-edit-2-line"></i>
 <span>Редактировать</span></button>
        <button class="table-delete-button staff-table-delete-button" data-action="delete" data-id="${id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
      </div>
    </div>
  `;
}

// Функция для обновления строки в таблице работников
function updateWorkerTableRow(id, updatedData, isEditable = false) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    const cells = row.querySelectorAll('td');

    // Обновляем текстовые ячейки
    cells[0].innerText = updatedData.user.first_name;
    cells[1].innerText = updatedData.user.last_name;
    cells[2].innerText = updatedData.user.email;
    cells[3].innerText = updatedData.user.username;

    if (isEditable) {
      // Если редактируемый режим, отображаем select
      const roleSelect = document.createElement('select');
      roleSelect.classList.add('user-role-select');
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
      cells[4].innerHTML = ''; // Очищаем текущее содержимое ячейки
      cells[4].appendChild(roleSelect);
    } else {
      const roleSpan = document.createElement('span');
      roleSpan.innerText = updatedData.user.user_role;
      roleSpan.className = 'user-role-span'; // Присваиваем класс для стилизации
      cells[4].innerHTML = ''; // Очищаем текущее содержимое ячейки
      cells[4].appendChild(roleSpan);
    }

    // Восстанавливаем кнопки "Редактировать" и "Удалить"
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
    <div class="action-buttons">
      <button class="options-button staff-table-options-button" data-action="toggle" data-id="${id}">...</button>
      <div class="table-edit-delete-buttons" id="edit-delete-${id}" style="display: none;">
        <button class="table-edit-button staff-table-edit-button" data-action="edit" data-id="${id}"><i class="ri-edit-2-line"></i>
 <span>Редактировать</span></button>
        <button class="table-delete-button staff-table-delete-button" data-action="delete" data-id="${id}"> <i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
      </div>
    </div>
  `; // Ваш HTML для кнопок
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
  console.log(`Вызов deleteStaff с id: ${id}`); // Логирование при вызове функции

  const authToken = localStorage.getItem('authToken');
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
    console.log('Ответ сервера на deleteStaff', response); // Логирование ответа сервера
    if (response.ok) {
      console.log(`Работник с id: ${id} удален`);
      removeWorkerRow(id);
    } else {
      return response.json().then(error => {
        console.error('Данные ошибки на deleteStaff', error); // Логирование ошибки
        throw new Error(`Ошибка при удалении работника: ${error.message}`);
      });
    }
  })
  .catch(error => {
    console.error('Ошибка при удалении работника:', error);
  });
}


function removeWorkerRow(id) {
  const row = document.querySelector(`.table__staff tr[data-id="${id}"]`);
  if (row) {
    row.remove(); // Просто удаляем строку, без дополнительных действий
  }
}


//* */ ____________________Удаление персонала------------------------------


// ________________Анимация-------------------


document.addEventListener('DOMContentLoaded', function() {
  // Этот обработчик будет вызван, когда весь DOM загрузится
  const startAnimationButton = document.getElementById('startAnimation');

  startAnimationButton.addEventListener('click', function(e) {
      e.preventDefault(); // Предотвращаем стандартное поведение ссылки
      
      // Сбрасываем анимации
      resetAnimations();

      // Даем небольшую задержку перед перезапуском анимаций, чтобы убедиться, что они полностью сброшены
      setTimeout(function() {
          startAnimations();
      }, 400); // Задержка в 100 мс

      // Переход к секции, если необходимо
      window.location.href = '#startScrin';
  });
});



// Когда DOM загрузится, запустим анимации, также используя startAnimations напрямую
// window.addEventListener('DOMContentLoaded', startAnimations);



// ________________Анимация-------------------
