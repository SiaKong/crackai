// Get current date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 as months are zero-based
const day = String(currentDate.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;
let resultText = '';
let answer = '';
let firstTry = [];
let secondTry = [];
let gotWords = [];
let correctPrompt = false;

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

  const shareButton = document.getElementById("share");
  shareButton.addEventListener("click", shareModal);

  const helpButton = document.getElementById("help");
  helpButton.addEventListener("click", helpModal);

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

  currentSlideElement.textContent = `IMAGE ${slideIndex + 1}`;
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
      resultText = document.getElementById("resultText");
      resultText.innerHTML = '';
      answer = data.toUpperCase();
      for (let i = 0; i < answer.length; i++){
        if (isAlpha(data[i])){
          resultText.innerHTML += '__&nbsp;';
        }else if (data[i]==' '){
          resultText.innerHTML += '<wbr>&nbsp;&nbsp;<wbr>';
        }else{
          resultText.innerHTML += `${data[i]}&nbsp;`;
        }
      }
    })
    .catch((error) => {
      console.error("Error loading text content:", error);
    });
}

// Trial button click handler
function handleButtonClick() {
  const phraseInput = document.getElementById("phraseInput");
  let inputValue = phraseInput.value.toUpperCase();

  tryCount++;
  scoreSentence(inputValue, tryCount);

  if (tryCount < maxTries && !correctPrompt) {
    document.getElementById("submit").setAttribute("value", `TRY ${tryCount}/${maxTries-1}`);
  }
  if (tryCount == maxTries) {
    trialComplete();
  }
}

//score sentence

function scoreSentence(userInput, tryCount){
  const display = document.getElementById("resultText");
  display.style.display = "block";
  let inputwords = userInput.split(" ");
  let answerwords = answer.split(" ");
  resultText.innerHTML = '';

  let answerAlpha = '';
  for (let i = 0; i < answer.length; i++){
    if (isAlpha(answer[i]) || answer[i]==' '){
      answerAlpha += answer[i];
    }
  }
  answerAlpha = answerAlpha.split(" ");

  inputwords.forEach((word, index) => {
    word = removeNonAlpha(word);
    answerAlpha = removeNonAlpha(answer);
    if (answerAlpha.includes(word)) {
      gotWords.push(word);
    } 
  });

  //figure out how to deal with early trial complete

  answerwords.forEach((word, index) => {
    if (gotWords.includes(removeNonAlpha(word))){
      resultText.innerHTML += `<span class="highlighted">${word}</span>`;
    }else{
      if (tryCount == maxTries){
        resultText.innerHTML += `${word}`;
      }else{
        for (let i = 0; i < word.length; ++i){
          if ((i==0 && tryCount==3) || !isAlpha(word[i])){
            resultText.innerHTML += `${word[i]}&nbsp;`;
          }else{
            resultText.innerHTML += `__&nbsp;`;
          }
        }
      }
    }
    if (index < answerwords.length - 1) {
      resultText.innerHTML += "<wbr>&nbsp;&nbsp;<wbr>";
    }
  });
}

function removeNonAlpha(str) {
  return str.replace(/[^a-zA-Z\s]/g, '');
}

function isAlpha(char) {
  return /^[a-zA-Z]$/.test(char);
}

function trialComplete(){
  document.getElementById("submit").style.display = "none";
  document.getElementById("share").style.display = "";
  phraseInput.disabled = true;
  correctPrompt = true;
}

//share modal
function shareModal() {
  var modal = document.getElementById('shareModal');
  modal.style.display = 'block';

  var closeButton = document.getElementsByClassName('close')[0];
  if (closeButton) {
    closeButton.addEventListener('click', closeShareModal);
  }
}

function closeShareModal() {
  var modal = document.getElementById('shareModal');
  modal.style.display = 'none';
}

window.addEventListener('click', function(event) {
  var modal = document.getElementById('shareModal');
  if (event.target === modal) {
      modal.style.display = 'none';
  }
});

//help model
function helpModal() {
  var modal = document.getElementById('helpModal');
  modal.style.display = 'block';

  var closeButton = document.getElementsByClassName('close')[1];
  if (closeButton) {
    closeButton.addEventListener('click', closeHelpModal);
  }
}

function closeHelpModal() {
  var modal = document.getElementById('helpModal');
  modal.style.display = 'none';
}

window.addEventListener('click', function(event) {
  var modal = document.getElementById('helpModal');
  if (event.target === modal) {
      modal.style.display = 'none';
  }
});

window.addEventListener("load", start, false);
