
import { getAuthToken, makeFetchRequest } from './apiService.js';
import { updateStockItemRow } from './dataHandling.js';
import {  toISOFormat } from './helpers.js';

//! Start
//**/ ---------------Редактирование склада PATCH____________________

function patchStockItemOnServer(id, updatedItem) {
  const authToken = getAuthToken(); // Используем функцию для получения токена
  if (!authToken) {
    console.error('Токен аутентификации не найден.');
    return;
  }

  const endpoint = `/storage/tobacco/${id}/`; // Endpoint для обновления элемента
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    },
    body: JSON.stringify(updatedItem)
  };

  makeFetchRequest(endpoint, options) // Используем общую функцию для запроса
    .then(updatedData => {
      // Обновление данных в таблице
      updateStockItemRow(id, updatedData);
      console.log(`Обновлен элемент с id: ${id}`);
    })
    .catch(error => {
      console.error(`Ошибка при обновлении элемента: ${error}`);
    });
}





function transformRowToEditableFormStock(id) {
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
  productFormSaveBtn.onclick = () => saveStockEditRowChanges(id);

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Отменить';
  cancelButton.classList.add('stock-cancel-button');
  cancelButton.onclick = () => resetStockItemEditState(id);

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

function saveStockEditRowChanges(id) {
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
    
  };
  if (row) {
    // Восстановление исходной высоты строки
    row.style.height = '';
    row.style.background ='';
  }

  patchStockItemOnServer(id, updatedItem);
}

function resetStockItemEditState(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return; // Досрочный выход из функции, если элемент не найден

  getOriginalStockData(id, updateStockItemRow); // Восстановление исходных данных

  // Восстановление исходной высоты строки
  row.style.height = '';
  row.style.background ='';
  // Восстановление исходного состояния кнопок
  const cells = row.querySelectorAll('td');
  const actionCell = cells[cells.length - 1];
  actionCell.innerHTML = `
    <div class="action-buttons">
      <button class="options-button stock-table-options-button" data-action="toggle" data-id="${id}">...</button>
      <div class="table-edit-delete-buttons" id="edit-delete-${id}" style="display: none;">
        <button class="table-edit-button stock-table-edit-button" data-action="edit" data-id="${id}"><i class="ri-edit-2-line"></i> <span>Редактировать</span> </button>
        <button class="table-delete-button stock-table-delete-button" data-action="delete" data-id="${id}"><i class="ri-delete-bin-6-line"></i><span>Удалить</span></button>
      </div>
    </div>
  `;
}

//**/ ---------------Редактирование склада PATCH____________________
//! End
function getOriginalStockData(id, callback) {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('Токен аутентификации не найден');
    return;
  }

  const url = `http://188.68.221.107/api/v1/storage/tobacco/${id}/`;
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
      throw new Error('Ошибка при получении данных акции');
    }
  })
  .then(data => callback(id, data))
  .catch(error => console.error('Ошибка при получении данных акции:', error));
}

//! Start
//**/ -------------Редактирование пользователей PATCH______________



// Функция для начала редактирования данных работника
// function transformRowToEditableFormStaff(id) {
//   const row = document.querySelector(`tr[data-id="${id}"]`);
//   if (!row) {
//     console.error('Строка с id не найдена:', id);
//     return;
//   }
//   const cells = row.querySelectorAll('td');
//   row.style.height = '100px';
//   row.style.background = 'rgb(254, 243, 234)';

//   // Превращаем каждую ячейку в редактируемое поле
//   cells.forEach((cell, index) => {
//     if (index >= 0 && index < cells.length - 1) {
//       if (index === 4) { // Предполагая, что роль находится в пятой ячейке
//         const select = document.createElement('select');
//         select.innerHTML = `<option value="ADMIN">ADMIN</option><option value="HOOKAH">HOOKAH</option>`;
//         select.value = cell.innerText.trim(); // Устанавливаем текущее значение
//         cell.innerText = '';
//         cell.appendChild(select);
//       } else {
//         const input = document.createElement('input');
//         input.type = 'text';
//         input.value = cell.innerText;
//         cell.innerText = '';
//         cell.appendChild(input);
//       }
//     }
//   });

//   // Заменяем кнопки на "Сохранить" и "Отменить"
//   const saveButton = document.createElement('button');
//   saveButton.textContent = 'Сохранить';
//   saveButton.classList.add('staff-save-button');
//   saveButton.onclick = () => saveWorkerEdit(id);

//   const cancelButton = document.createElement('button');
//   cancelButton.textContent = 'Отменить';
//   cancelButton.classList.add('staff-cancel-button');
//   cancelButton.onclick = () => resetStaffItemEditState(id); // Можно использовать уже существующую функцию resetStaffItemEditState

//   const buttonsContainer = document.getElementById(`edit-delete-${id}`);
//   if (buttonsContainer) {
//     buttonsContainer.innerHTML = '';
//     buttonsContainer.appendChild(saveButton);
//     buttonsContainer.appendChild(cancelButton);
//   }
// }


//**/ --------------Редактирование пользователей PATCH____________________
//! end

export { 
        transformRowToEditableFormStock };      