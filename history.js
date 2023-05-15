var clickedDate = '';

document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById("grid-container");
    const navigation = document.getElementById("navigation");
  
    let images = []; // Array to store the image URLs
    let currentPage = 0;
    const imagesPerPage = 25;
  
    // Filter image URLs based on dates
    const currentDate = new Date();
    const year1 = currentDate.getFullYear();
    const month1 = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day1 = String(currentDate.getDate()).padStart(2, "0");
    const todaysDateStr = `${year1}-${month1}-${day1}`;

    const startDate = new Date("2023-05-14"); // Adjust the start date as needed

    let currentDateIterator = new Date(currentDate); 
    
    let imgCount = 0;
    while (currentDateIterator >= startDate){
        const year = currentDateIterator.getFullYear();
        const month = String(currentDateIterator.getMonth() + 1).padStart(2, "0");
        const day = String(currentDateIterator.getDate()).padStart(2, "0");
        const currentDateStr = `${year}-${month}-${day}`;
        
        const imageUrl = `testing/${currentDateStr}-01.png`;
        images.push(imageUrl);

        currentDateIterator.setDate(currentDateIterator.getDate() - 1); // Move to the next date
        imgCount++;
    }

    let fillGrey = 25 - imgCount;
    for (let i = 0; i < fillGrey; i++){
        const imageUrl = 'error.png';
        images.push(imageUrl);
    }


    // Render grid
    function renderGrid(page) {
      gridContainer.innerHTML = ""; // Clear previous grid
  
      const startIndex = page * imagesPerPage;
      const endIndex = startIndex + imagesPerPage;
      const imagesToRender = images.slice(startIndex, endIndex);
  
      imagesToRender.forEach(function(imageUrl) {
        const gridBox = document.createElement("div");
        gridBox.className = "grid-box";
  
        const imageLink = document.createElement("a");

        function updateClickedDate(date) {
          localStorage.setItem("clickedDate", date);
        }

        imageLink.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default link behavior
            let justDate = imageUrl.replace("testing/","");
            justDate = justDate.substring(0,10);
            if (justDate==todaysDateStr) {
                imageLink.href = "index.html";
            }else{
                updateClickedDate(justDate);
                imageLink.href = "past.html";
            }
            window.location.href = imageLink.href; // Redirect the current page
        });
  
        const image = new Image();
        image.onerror = function() {
          gridBox.style.backgroundColor = "lightgray";
        };
        image.src = imageUrl;
  
        image.onload = function() {
          if (image.height < image.width) {
            image.classList.add("landscape");
          } else {
            image.classList.add("portrait");
          }
          image.style.verticalAlign = "middle"; // Align the image vertically in the middle
          imageLink.style.display = "inline-block"; // Display the anchor element as inline-block
          gridBox.style.borderColor = "lightgray";
        };

        image.onerror = function() {
          gridBox.style.backgroundColor = "lightgray";
          gridBox.style.borderColor = "lightgray";
          image.style.display = "none"; // Hide the image element for the grey box
          imageLink.style.display = "inline-block"; // Display the anchor element as inline-block
        };
  
        imageLink.appendChild(image);
        gridBox.appendChild(imageLink);
        gridContainer.appendChild(gridBox);
      });
    }
  
    // Render navigation
    function renderNavigation() {
      navigation.innerHTML = ""; // Clear previous navigation
  
      const totalPages = Math.ceil(images.length / imagesPerPage);
  
      for (let i = 0; i < totalPages; i++) {
        const pageLink = document.createElement("span");
        pageLink.textContent = i + 1;
        pageLink.addEventListener("click", function() {
          currentPage = i;
          renderGrid(currentPage);
          renderNavigation();
        });
        navigation.appendChild(pageLink);
      }
    }
  
    renderGrid(currentPage);
    renderNavigation();
    
  });


  