// Get current date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 as months are zero-based
const day = String(currentDate.getDate()).padStart(2, "0");
const firstDay = '2023-05-14';

let today = `${year}-${month}-${day}`;
let formattedDate = localStorage.getItem("clickedDate");

let boxes = '';
let resultText = '';
let displayBoxes = '';
let answer = '';
let currBox = 0;
let userinput = [];
let got = [];
let pholder = [];

const prewords = ['AT','IN','ON','BY','FOR','TO','FROM','WITH','WITHOUT','THE','A','AN',
                  'AND','BUT','OR','SO','YET','NOR','INTO','ONTO','BE','IS','ARE','THIS',
                  'THAT','THESE','THOSE'];
//start
const maxTries = 4;
let slideIndex = 0;
let tryCount = 1;

function start() {
  //localStorage.clear();
  resultText = document.getElementById("resultText");
  displayBoxes = document.getElementById("displayBoxes");
  
  fetchUserTrial();
  showSlide(slideIndex);

  let datep = document.getElementById("datep");
  datep.textContent = formattedDate;

  document.addEventListener('keydown',function(event){
    keyPressed(event.key);
  });
  var virtualKeyboard = document.getElementById("virtual-keyboard");
  
  virtualKeyboard.addEventListener("click",keyPressed);
  virtualKeyboard.addEventListener("click", function(event) {
    var key = event.target.innerText;
    
    keyPressed(key);
    
  });

  document.getElementById("keyTrigger").addEventListener("click",function(){
    document.getElementById("virtual-keyboard").style.display = "block";
    document.getElementById("keycontainer").style.display = "none";
  });

  document.getElementById("hidekey").addEventListener("click",function(){
    document.getElementById("virtual-keyboard").style.display = "none";
    document.getElementById("keycontainer").style.display = "block";
  });


  const submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", handleButtonClick);

  const shareButton = document.getElementById("share");
  shareButton.addEventListener("click", shareModal);

  const helpButton = document.getElementById("help");
  helpButton.addEventListener("click", helpModal);

  const prevDateElement = document.getElementById("prevDate");
  const nextDateElement = document.getElementById("nextDate");
  prevDateElement.addEventListener("click", prevDate);
  nextDateElement.addEventListener("click", nextDate);

  if (checkDate(formattedDate,-1)==-1){
    prevDateElement.style.color = '#ccc';
    prevDateElement.style.cursor = 'default';
  }
  if (checkDate(formattedDate,1)==1){
    nextDateElement.style.color = '#ccc';
    nextDateElement.style.cursor = 'default';
  }
  
  loadImages(formattedDate);
  loadTextContent(formattedDate);
}

//store user data
function storeUserTrial(date, trial, gotWords){
  var key = 'userdata_' + date;

  var data = {
    trial: trial,
    gotWords: gotWords,
  };

  var jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
}

function fetchUserTrial(){
  var key = 'userdata_' + formattedDate;
  
  var jsonData = localStorage.getItem(key);

  if (jsonData){
    var data = JSON.parse(jsonData);
    tryCount = data.trial;
    got = data.gotWords;
    btnControl(tryCount);
  }else{
    tryCount = 1;
    got = [];
  }
}

// prev & next date
function prevDate(){
  let previousDate = getDate(formattedDate,-1)

  if (checkDate(previousDate,0)==0){
    localStorage.setItem("clickedDate", previousDate);
    window.location.href = 'past.html';
  }
}

function nextDate(){
  let nextDate = getDate(formattedDate,1)

  if (nextDate==today){
    window.location.href = 'index.html';
  }
  else if (checkDate(nextDate,0)==0){
    localStorage.setItem("clickedDate", nextDate);
    location.reload();
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
      let currWord = '';
        for (let i = 0; i < answer.length; i++){
          if (isAlpha(data[i])){
            displayBoxes.innerHTML += `<div class="display"></div>`;
          }else if (data[i]==' '){
            displayBoxes.innerHTML += '<img src="spacebar.svg">';
          }else{
            displayBoxes.innerHTML += `${data[i]}&nbsp;`;
          }
        }
        boxes = document.getElementsByClassName("display");

        let answerAlpha = removeNonAlphaSpace(answer);
        for (let i = 0; i < boxes.length; i++){
          if (got[i]){
            boxes[i].textContent = answerAlpha[i];
          }
        }

        if (tryCount==maxTries){
          let answerAlpha = removeNonAlphaSpace(answer);
          trialComplete(answerAlpha);
        }else{
          scoreSentence(tryCount);
        }
  
      
    })
    .catch((error) => {
      console.error("Error loading text content:", error);
    });
}

//keypress
function keyPressed(event){
  const pressed = event.toUpperCase();
  if (isAlpha(pressed) && currBox < boxes.length){
    while (got[currBox]){
      currBox++;
    }
    userinput[currBox] = pressed;
    boxes[currBox].style.color = "#5c5c5c";
    boxes[currBox].textContent = pressed;
    currBox++;
  }else if ((event == "Backspace" || event == "←")&& (currBox > 0)){
    if (got[currBox-1]){
      while (got[currBox-1]){
        currBox--;
      }
      if (currBox > 0){
        currBox--;
        userinput[currBox] = '';
        boxes[currBox].textContent = '';
      }
    }else{
      currBox--;
      if(pholder[currBox]){
        userinput[currBox] = '';
        boxes[currBox].style.color = "#bfbfbf";
        boxes[currBox].textContent = pholder[currBox];
      }else{
        userinput[currBox] = '';
        boxes[currBox].textContent = '';
      }
    }
  }else if (event.keyCode == 13){
    handleButtonClick();
  }
}


// Trial button click handler
function handleButtonClick() {

  let answerAlpha = removeNonAlphaSpace(answer);

  if(tryCount<maxTries){
    tryCount++;
  }
  //console.log("button click working, tryCount: " + tryCount);
  userinput = '';
  currBox = 0;
  scoreSentence(tryCount);

  if (tryCount < maxTries) {
    const submitBtn = document.getElementById("submit");

    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = 'grey';
    setTimeout(function() {
      btnControl(tryCount);
    }, 700);
  }

  if (tryCount == maxTries) {
    finish = true;
    trialComplete(answerAlpha);
  }
  
  storeUserTrial(formattedDate,tryCount,got);
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
    let answerAlpha = removeNonAlphaSpace(answer);
    trialComplete(answerAlpha);
  }
}


//score sentence

function scoreSentence(tryCount){
  let temp = removeNonAlpha(answer);
  answerWords = temp.split(" ");
  for (let i = 0; i < answerWords.length; i++){
    if (prewords.includes(answerWords[i])){
      let tword = '';
      for (let j = 0; j < answerWords[i].length; j++){
        tword += "@";
      }
      answerWords[i] = tword;
    }
  }
  answerWords = answerWords.join("");

  let answerAlpha = removeNonAlphaSpace(answer);
  pholder = new Array(answerAlpha.length);
  if (!got){
    got = new Array(answerAlpha.length);
  }

  for(let i = 0; i < boxes.length; i++){
    if ((boxes[i].textContent === answerAlpha[i] && !pholder[i])){
      got[i] = answerAlpha[i];
      boxes[i].style.backgroundColor = "#8bd47d";
      boxes[i].style.border = "3px solid #76b06b";
      boxes[i].style.color = "#ffffff";
    }
    else if(answerWords[i]=='@'){
      boxes[i].textContent = answerAlpha[i];
      got[i] = answerAlpha[i];
      boxes[i].style.backgroundColor = "#8bd47d";
      boxes[i].style.border = "3px solid #76b06b";
      boxes[i].style.color = "#ffffff";
    }
    else{
      boxes[i].textContent = '';
    }
    
  }
  
  if (tryCount==maxTries-1){
    let answerSpace = removeNonAlpha(answer);
    let answerSplit = answerSpace.split(" ");
    let curri = 0;
    for (let i = 0; i < answerSplit.length; i++){
      if (i>0){
        curri = curri + answerSplit[i-1].length;
      }
      if(boxes[curri].textContent!=answerAlpha[curri]){
        pholder[curri] = answerSplit[i][0];
        boxes[curri].style.color = "#bfbfbf";
        boxes[curri].textContent = answerSplit[i][0];
      }
    }
  }

  if (got.length>0){
    let allmatch = true;
    for(let i = 0; i < boxes.length; i++){
      
      if (got[i]==null){
        allmatch = false;
  
      }
    }
    if (allmatch){
      trialComplete(answerAlpha);
    }
  }
  
}

function removeNonAlpha(str) {
  return str.replace(/[^a-zA-Z\s]/g, '');
}

function removeNonAlphaSpace(str){
  return str.replace(/[^a-zA-Z]/g, '');
}

function isAlpha(char) {
  return /^[a-zA-Z]$/.test(char);
}

function trialComplete(answerAlpha){
  document.getElementById("submit").style.display = "none";
  document.getElementById("share").style.display = "";

  for(let i = 0; i < boxes.length; i++){
    if (got[i] == answerAlpha[i]){
      boxes[i].style.backgroundColor = "#8bd47d";
      boxes[i].style.border = "3px solid #76b06b";
      boxes[i].style.color = "#f5f5f5";
      boxes[i].textContent = answerAlpha[i]
    }else{
      boxes[i].style.backgroundColor = "#8f8f8f";
      boxes[i].style.border = "3px solid #7a7a7a";
      boxes[i].style.color = "#d9d9d9";
      boxes[i].textContent = answerAlpha[i];
    }
  }

  storeUserTrial(formattedDate,tryCount,got);
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
  let answerSpace = removeNonAlpha(answer);
  let j = 0;
  for (let i = 0; i < answerSpace.length; i++){
    if (answerSpace[i]!=' '){
      if (got[j]){
        resultDisplay += '<img src="greenSqr.svg" width="15px" height="15px"><wbr>';
      }else{
        resultDisplay += '<img src="greySqr.svg" width="15px" height="15px"<wbr>';
      }
      j++;
    }else{
      resultDisplay += '<wbr>&nbsp;&nbsp;<wbr>';
    }
  }

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



var display = document.getElementById('display');

// Add event listener to each key
var keys = document.querySelectorAll('.key');
keys.forEach(function(key) {
  key.addEventListener('click', function() {
    var letter = key.textContent;
    console.log('Pressed: ' + letter);
    display.textContent = letter;
  });
});