
export function toggleMenu() {
  const header = document.querySelector('.header');
  header.classList.toggle('collapsed');
}



// --------------Выводим секцию__________________

export function showSection(event, sectionId) {
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