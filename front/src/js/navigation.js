// navigation.js

import { fetchAndUpdateTobaccoStock, 
  fetchAndUpdateWorkers, 
  updateStockItemRow} from './dataHandling.js';
// export function showSection(event, sectionId) {
//   event.preventDefault(); // Предотвращаем стандартное поведение ссылки

//   // Скрываем все секции
//   document.querySelectorAll('section').forEach(section => {
//     section.classList.remove('active-section');
//   });

//   // Показываем нужную секцию
//   const section = document.getElementById(sectionId.substring(1)); // Убираем '#' из ID
//   if (section) {
//     section.classList.add('active-section');
//   }
// }


export function showSection(event, sectionId) {
  event.preventDefault(); // Предотвращаем стандартное поведение ссылки

  // Скрываем все секции
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active-section');
  });

  // Показываем нужную секцию и вызываем соответствующую функцию
  const section = document.getElementById(sectionId.substring(1)); // Убираем '#' из ID
  if (section) {
    section.classList.add('active-section');
    
    // Вызываем функцию в зависимости от sectionId
    switch(sectionId) {
      case '#stock':
        fetchAndUpdateTobaccoStock();
        break;
      case '#staffAdministration':
        fetchAndUpdateWorkers();
        break;
      // case '#recipeMenu':
      //   fetchAndUpdateRecipeMenu();
        break;
      // Добавьте здесь другие case для дополнительных секций
      default:
        console.log('No special function to call for this section');
    }
  }
}
