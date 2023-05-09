document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById("grid-container");
    const navigation = document.getElementById("navigation");
  
    let images = []; // Array to store the image URLs
    let currentPage = 0;
    const imagesPerPage = 25;
    const totalImages = 100; // Total number of images (example value)
  
    // Generate image URLs (example URLs)
    for (let i = 0; i < totalImages; i++) {
      images.push(`image${i + 1}.jpg`);
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
        imageLink.href = "index.html"; // Link each image to index.html
        imageLink.addEventListener("click", function(event) {
          event.preventDefault(); // Prevent the default link behavior
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
        };

        image.onerror = function() {
          gridBox.style.backgroundColor = "lightgray";
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
