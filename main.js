// Get current date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 as months are zero-based
const day = String(currentDate.getDate()).padStart(2, "0");
const firstDay = '2023-05-14';
const formattedDate = `${year}-${month}-${day}`;
let resultText = '';
let answer = '';
let firstTry = '';
let secondTry = '';
let gotWords = '';
let correctPrompt = false;

//start
const maxTries = 4;
let slideIndex = 0;
let tryCount = 1;

function start() {
  //localStorage.clear();
  resultText = document.getElementById("resultText");
  fetchUserTrial(formattedDate);
  showSlide(slideIndex);

  let datep = document.getElementById("datep");
  datep.textContent = formattedDate;

  const submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", handleButtonClick);

  const shareButton = document.getElementById("share");
  shareButton.addEventListener("click", shareModal);

  const helpButton = document.getElementById("help");
  helpButton.addEventListener("click", helpModal);

  const prevDateElement = document.getElementById("prevDate");
  const nextDateElement = document.getElementById("nextDate");
  prevDateElement.addEventListener("click", prevDate);

  nextDateElement.style.color = '#ccc';
  nextDateElement.style.cursor = 'default';
  
  loadImages(formattedDate);
  loadTextContent(formattedDate);
}

//store user data
function storeUserTrial(date, trial, rtHTML, dateGotWords){
  var key = 'userdata_' + date;

  var data = {
    trial: trial,
    rtHTML: rtHTML,
    dateGotWords: dateGotWords
  };

  var jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
}

function fetchUserTrial(date){
  var key = 'userdata_' + date;
  
  var jsonData = localStorage.getItem(key);

  // if (jsonData!==null){
  //   var data = JSON.parse(jsonData);
  //   tryCount = data.trial;
  //   resultText.innerHTML = data.rtHTML;
  //   gotWords = data.dateGotWords;
  //   btnControl(tryCount);
  // }else{
    tryCount = 1;
    resultText.innerHTML = '';
    gotWords = [];
    loadTextContent();
  //}
}

// prev & next date
function prevDate(){
  let previousDate = getDate(formattedDate,-1)

  if (checkDate(previousDate,0)==0){
    localStorage.setItem("clickedDate", previousDate);
    window.location.href = 'past.html';
  }
}

function getDate(fDate,n) {
  // Assuming the formatted date has the format "YYYY-MM-DD"
  const ndate = new Date(fDate);
  ndate.setDate(ndate.getDate()+n+1);

  let nyear = ndate.getFullYear();
  let nmonth = ndate.getMonth() + 1; // Adding 1 as months are zero-based
  let nday = ndate.getDate();
  let updatedDate = `${nyear}-${String(nmonth).padStart(2, "0")}-${String(nday).padStart(2, "0")}`;
  return updatedDate;
}

function checkDate(fdate,n) {
  let ndate = getDate(fdate,n);
  ndate = new Date(ndate);
  let fday = new Date(firstDay);

  if (ndate < fday) {
    return -1;
  } 
  else{
    return 0;
  }
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
      answer = data.toUpperCase();
      scoreSentence('',tryCount);
    })
    .catch((error) => {
      console.error("Error loading text content:", error);
    });
}

// Trial button click handler
function handleButtonClick() {
  const phraseInput = document.getElementById("phraseInput");
  inputValue = phraseInput.value.toUpperCase();

  if(tryCount<maxTries){
    tryCount++;
  }
  scoreSentence(inputValue, tryCount);

  if (tryCount < maxTries && !correctPrompt) {
    const submitBtn = document.getElementById("submit");

    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = 'grey';
    setTimeout(function() {
      btnControl(tryCount);
    }, 700);
  }
  if (tryCount == maxTries) {
    trialComplete();
  }

  storeUserTrial(formattedDate,tryCount,resultText.innerHTML,gotWords);
}

function btnControl(tryCount){
  const submitBtn = document.getElementById("submit");
  submitBtn.disabled = false;
  submitBtn.setAttribute("value", `TRY ${tryCount}/${maxTries-1}`);
  if (tryCount==2){
    submitBtn.style.backgroundColor = "rgb(252, 163, 38)";
  }else if (tryCount==3){
    submitBtn.style.backgroundColor = "rgb(255, 104, 59)";
  }else{
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

  let numGotWords = 0;
  answerwords.forEach((word, index) => {
    if (gotWords.includes(removeNonAlpha(word))){
      resultText.innerHTML += `<span class="highlighted">${word}</span>`;
      numGotWords++;
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

  if (numGotWords==answerwords.length){
    trialComplete();
  }
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
  document.getElementById('selected-date').textContent = formattedDate;

  // Set the source of Image 1
  document.getElementById('shareImage').src = `testing/${formattedDate}-01.png`; // Replace 'path_to_image_1' with the actual path

  // Clear previous result boxes
  //document.getElementById('result-text').innerHTML = resultText.innerHTML;
  let resultDisplay = '';
  let answerwords = answer.split(" ");
  answerwords.forEach((word, index) => {
    if (gotWords.includes(removeNonAlpha(word))){
      for (let i = 0; i < word.length; i++){
        resultDisplay += '<img src="greenSqr.svg" width="15px" height="15px"><wbr>';
      }
    }else{
      for (let i = 0; i < word.length; i++){
        resultDisplay += '<img src="greySqr.svg" width="15px" height="15px"<wbr>';
      }
    }
    resultDisplay += '<wbr>&nbsp;&nbsp;<wbr>'
  });
  document.getElementById('result-text').innerHTML = resultDisplay;

  // Show the Share Modal
  document.getElementById('share-modal').style.display = 'block';
  saveImage('share-modal');
}

function saveImage(divID){
  // Get the div element you want to save as an image
  const divElement = document.getElementById(divID);
  document.getElementsById("shareX").style.display = 'none';

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set the canvas size to match the div element
  canvas.width = divElement.offsetWidth;
  canvas.height = divElement.offsetHeight;

  // Draw the div element content onto the canvas
  context.drawWindow(window, divElement.offsetLeft, divElement.offsetTop, divElement.offsetWidth, divElement.offsetHeight, 'rgb(255,255,255)');

  // Convert the canvas to a data URL
  const dataURL = canvas.toDataURL('image/png');

  // Create a link element
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `craick-${formattedDate}.png`;

  // Simulate a click event on the link element to trigger the download
  link.dispatchEvent(new MouseEvent('click'));
  document.getElementsById("shareX").style.display = 'block';
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
