
import {  getAuthToken, makeFetchRequest  } from './apiService.js';
import {  toISO8601String } from './helpers.js';


function sendWorkerRegistrationData() {
  const authToken = getAuthToken(); 
  if (!authToken) { 
    console.error('Токен аутентификации не найден.');
    return;
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

  // Определяем опции запроса
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    },
    body: JSON.stringify(userData)
  };

  // Используем уже существующую функцию для выполнения запроса
  makeFetchRequest('/worker/', fetchOptions)
    .then(data => {
      console.log('User created:', data);
      // Здесь можно добавить дальнейшие действия после успешной отправки данных
     
      // fetchAndUpdateWorkers();
    })
    .catch(error => {
      // Обработка ошибки уже реализована в makeFetchRequest
    });


}

// Функция отправки данных всех табов на сервер
function sendTobaccoDataFromAllTabs() {
  const allTabsData = collectAndValidateTabFormData();
  const authToken = getAuthToken(); 

  if (!authToken) {
    console.error('Токен аутентификации не найден.');
    return;
  }

  console.log('Начало отправки данных, токен аутентификации найден.');

  allTabsData.forEach((tabData, index) => {
    console.log(`Данные для таба ${index + 1} перед отправкой:`, tabData);

    tabData.organization = 1; // Предполагается, что это обновление данных перед отправкой

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      },
      body: JSON.stringify(tabData),
    };

    makeFetchRequest('/storage/tobacco/', fetchOptions)
      .then(data => {
        console.log(`Данные успешно отправлены для таба ${index + 1}:`, data);
      })
      .catch(error => {
        console.error(`Ошибка при отправке данных на сервер для таба ${index + 1}:`, error);
      });
  });
}

// Функция для сбора данных из всех заполненных табов
function collectAndValidateTabFormData() {
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
        value = toISO8601String(value); 
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


export { 
        sendWorkerRegistrationData,
        sendTobaccoDataFromAllTabs 
                                    };  