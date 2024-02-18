// import { getAuthToken, makeFetchRequest} from './apiService.js';  

// import { showMainPage, 
//           showLoginPage, 
//           clearLoginFormFields,
//           setErrorMessage 
//         } from './apiService.js'; 

//         async function login(username, password) {
//           const postData = { username, password };
        
//           try {
//             const data = await makeFetchRequest('http://188.68.221.107/api/v1/auth/token/login', {
//               method: 'POST',
//               headers: {
//                 'Accept': 'application/json',
//                 'User-Agent': 'Thunder Client (https://www.thunderclient.io)',
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify(postData),
//             });
        
//             if (data.auth_token) {
//               console.log('Токен:', data.auth_token);
//               localStorage.setItem('authToken', data.auth_token);
//               showMainPage();
//               clearLoginFormFields();
//             } else {
//               console.error('Ошибка аутентификации', data);
//               setErrorMessage('Ошибка аутентификации');
//             }
//           } catch (error) {
//             console.error('Ошибка сети', error);
//             setErrorMessage('Неверный логин или пароль');
//           }
//         }
        
//         function logout() {
//           localStorage.removeItem('authToken');
//           showLoginPage();
//           clearLoginFormFields();
//         }
        
//         function initAuth() {
//           if (getAuthToken()) {
//             showMainPage();
//           } else {
//             showLoginPage();
//           }
        
//           const loginForm = document.querySelector('.login-form');
//           const logoutButton = document.querySelector('.output-btn');
        
//           if (loginForm) {
//             loginForm.addEventListener('submit', async (e) => {
//               e.preventDefault();
//               const username = document.getElementById('login').value;
//               const password = document.getElementById('password').value;
//               login(username, password);
//             });
//           } else {
//             console.error('Форма входа не найдена');
//           }
        
//           if (logoutButton) {
//             logoutButton.addEventListener('click', logout);
//           } else {
//             console.error('Кнопка выхода не найдена');
//           }
//         }
//         export { init };     