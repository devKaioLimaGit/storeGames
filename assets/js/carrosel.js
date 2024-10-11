let slideIndex = 0;

showSlide(slideIndex);

function changeSlide(n) {
  showSlide(slideIndex += n);
}

function showSlide(n) {
  const slides = document.getElementsByClassName("slide");
  if (n >= slides.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  for (let i in slides) {
    if (slides.hasOwnProperty(i)) {
      slides[i].style.display = "none";
      slides[i].classList.remove("slide-transition");
    }
  }
  
  slides[slideIndex].style.display = "block";
  slides[slideIndex].classList.add("slide-transition");
}

function autoSlide() {
  changeSlide(1);
}

setInterval(autoSlide, 3000);






