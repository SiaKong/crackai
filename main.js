
//start
const maxTries = 3;
let slideIndex = 0;
let tryCount = 1;

function start(){
    showSlide(slideIndex);

    const submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", handleButtonClick);
}

//image slide 
  function changeSlide(n) {
    showSlide(slideIndex += n);
  }

  function showSlide(n) {
    const slides = document.getElementsByClassName("slide");
    const currentSlideElement = document.getElementById("currentSlide");

    if (n >= slides.length) {
      slideIndex = 0;
    } else if (n < 0) {
      slideIndex = slides.length - 1;
    } else {
      slideIndex = n;
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("active");
    }

    slides[slideIndex].classList.add("active");

    currentSlideElement.textContent = `${slideIndex + 1}/${slides.length}`;
  }


//trial button
function handleButtonClick() {
  if (tryCount < maxTries) {
    tryCount++;
    document.getElementById("submit").setAttribute("value",`TRY ${tryCount}/${maxTries}`);
  }
  if (tryCount == maxTries){
    document.getElementById("submit").style.display = "none";
    document.getElementById("resultText").style.display = "block";

    document.getElementById("icon2").src = "share.svg";
  }

}

window.addEventListener("load",start,false);