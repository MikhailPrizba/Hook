function animateText() {
  // Исправляем селектор согласно вашей разметке
  gsap.from(".start-screen__title", { duration: 1.5, opacity: 0, y: -100, ease: "power1.out" });
}

function animateImage() {
  // Исправляем селекторы для заднего и переднего изображений
  gsap.to(".start-screen__image-back", {duration: 1, translateX: 0, ease: "power1.out"});

  // Добавляем задержку для переднего изображения
  gsap.to(".start-screen__image-front", {duration: 1, translateY: 0, ease: "power1.out", delay: 1});
}

function animateList() {
  // Исправляем селектор для списка бизнес-процессов
  gsap.fromTo(
    ".business-processes__item",
    { y: 20, opacity: 0 }, // Убираем свойство visibility, так как GSAP не может им управлять напрямую
    {
      duration: 0.5,
      delay: 1.5, // Общая задержка перед началом анимации всех элементов
      opacity: 1,
      stagger: 0.5,
      ease: "power1.inOut",
      y: 0, // Конечные значения
      // Добавляем onComplete функцию для установки visibility в 'visible', если необходимо
      onStart: function() {
        document.querySelectorAll(".business-processes__item").forEach(el => {
          el.style.visibility = 'visible';
        });
      }
    }
  );
}

function resetAnimations() {
  // Удаляем инлайновые стили для всех анимированных элементов
  document.querySelectorAll('.start-screen__title, .start-screen__image-back, .start-screen__image-front, .business-processes__item').forEach(el => {
      el.style = ''; // Сбрасываем все инлайновые стили
  });
  
  // Если есть классы для анимации, удаляем их
  document.querySelectorAll('.animated').forEach(el => {
      el.classList.remove('animated'); // Удаляем классы анимации
  });
}

function startAnimations() {
  animateText();
  animateImage();
  animateList();
  // resetAnimations();
  // Возможно, вам не нужно вызывать resetAnimations непосредственно после старта анимаций
  // Это может быть полезно для сброса анимаций перед их повторным запуском
}

export { animateText, animateImage, animateList, resetAnimations, startAnimations };
 