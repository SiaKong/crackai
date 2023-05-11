// Get current date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 as months are zero-based
const day = String(currentDate.getDate()).padStart(2, "0");
const formattedDate = localStorage.getItem("clickedDate");

//start
const maxTries = 4;
let slideIndex = 0;
let tryCount = 1;

function start() {
  showSlide(slideIndex);

  let datep = document.getElementById("datep");
  datep.textContent = formattedDate;

  const submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", handleButtonClick);

  loadImages(formattedDate);
  loadTextContent(formattedDate);
}


// Image slide
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

// Load images based on selected date
function loadImages(date) {
  const slideshowContainer = document.querySelector(".slideshow-container");
  slideshowContainer.innerHTML = ""; // Clear the existing images

  for (let i = 1; i <= 3; i++) {
    const imageSrc = `testing/${date}-${String(i).padStart(2, "0")}.png`;
    const imageAlt = `Image ${i}`;
    const imageElement = document.createElement("img");
    imageElement.classList.add("slide");
    imageElement.src = imageSrc;
    imageElement.alt = imageAlt;
    slideshowContainer.appendChild(imageElement);
  }

  showSlide(0); // Show the first slide
}

// Load text content based on selected date
function loadTextContent(date) {
  const filePath = `testing/${date}.txt`;

  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      const resultText = document.getElementById("resultText");
      resultText.textContent = data;
    })
    .catch((error) => {
      console.error("Error loading text content:", error);
    });
}

// Trial button click handler
function handleButtonClick() {
  if (tryCount < maxTries) {
    tryCount++;
    document.getElementById("submit").setAttribute("value", `TRY ${tryCount}/${maxTries-1}`);
  }
  if (tryCount == maxTries) {
    document.getElementById("submit").style.display = "none";
    document.getElementById("resultText").style.display = "block";

    document.getElementById("icon2").src = "share.svg";
  }
}

window.addEventListener("load", start, false);
