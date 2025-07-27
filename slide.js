let slideIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('.carousel-item');
  const carouselInner = document.querySelector('.carousel-inner');

  if (index >= slides.length) {
    slideIndex = 0;
  }
  if (index < 0) {
    slideIndex = slides.length - 1;
  }

  carouselInner.style.transform = `translateX(${-slideIndex * 100}%)`;

  slides.forEach(slide => slide.classList.remove('active'));
  slides[slideIndex].classList.add('active');
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}

showSlide(slideIndex);