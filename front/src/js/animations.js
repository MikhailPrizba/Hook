

 function animateText() {
    // Увеличиваем смещение по Y, чтобы текст начинал анимацию выше
    gsap.from(".start-scrin__title", { duration: 1.5, opacity: 0, y: -100, ease: "power1.out" });
  }

 function animateImage() {
    // Анимация для .image-back, чтобы он появлялся сразу
    gsap.to(".start-scrin__image-back", {duration: 1, translateX: 0, ease: "power1.out"});

    // Анимация для .image-front, чтобы он появлялся с задержкой
    gsap.to(".start-scrin__image-front", {duration: 1, translateY: 0, ease: "power1.out", delay: 1});
}


 function animatelist() {
    gsap.fromTo(
      ".business-processes__item",
      { y: 20, opacity: 0, visibility: 'hidden' }, // Начальные значения
      {
        duration: 0.5,
        delay: 1.5, // Общая задержка перед началом анимации всех элементов
        opacity: 1,
        visibility: 'visible', // GSAP не анимирует свойство visibility, его можно установить напрямую
        stagger: 0.5,
        ease: "power1.inOut",
        y: 0 // Конечные значения
      }
    );
  };
  
  export { animateText, animateImage, animatelist };