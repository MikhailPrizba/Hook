// navigation.js
export function showSection(event, sectionId) {
  event.preventDefault(); // Предотвращаем стандартное поведение ссылки

  // Скрываем все секции
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active-section');
  });

  // Показываем нужную секцию
  const section = document.getElementById(sectionId.substring(1)); // Убираем '#' из ID
  if (section) {
    section.classList.add('active-section');
  }
}
