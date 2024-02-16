
//apiService
const API_BASE_URL = 'http://188.68.221.107/api/v1';

// Функция для получения токена аутентификации
function getAuthToken() {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('Authentication token not found.');
    return null;
  }
  return authToken;
}


function makeFetchRequest(endpoint, options) {
  const url = `${API_BASE_URL}${endpoint}`; // Используем базовый URL и конечную точку
  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      throw error;
    });
}

export { 
        getAuthToken,  
        makeFetchRequest  
                           };            
                          
