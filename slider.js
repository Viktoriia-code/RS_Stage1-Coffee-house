//START Slider
//Get DOM
let slides = document.querySelectorAll(".slide");
let navLinks = document.querySelectorAll(".slider-control");
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');

let currentSlide = 0;
let currentProgressBar = 0;
let progress = 0;
let isDragging = false;
let isPaused = false;
let shouldExecuteNextSlide = true;
let shouldExecutePrevSlide = true;

const nextSlide = ()=>{
  if (shouldExecuteNextSlide) {
  //console.log("Next slide");
  resetProgressBar();
  //console.log(currentSlide);
  (currentSlide == 2)? currentSlide = 0 : currentSlide++;
  //console.log(currentSlide);
  //navLinkChange();
  changeSlide();
  //resetTimer();
  progress = 0;
  updateProgressBar();
  shouldExecuteNextSlide = false;

    // Set a timeout to reset shouldExecuteNextSlide after a short delay
    setTimeout(() => {
      shouldExecuteNextSlide = true;
    }, 100); // Adjust the delay as needed
  }
}

const prevSlide = () =>{
  if (shouldExecutePrevSlide) {
  resetProgressBar();

  //console.log("prevSlide ",currentSlide);
  (currentSlide == 0)? currentSlide = slides.length - 1 : currentSlide--;
  //console.log("prevSlide after ",currentSlide);
  //console.log(currentSlide);
  //navLinkChange();
  changeSlide();
  //resetTimer();
  progress = 0;
  updateProgressBar();
  shouldExecutePrevSlide = false;

    // Set a timeout to reset shouldExecuteNextSlide after a short delay
    setTimeout(() => {
      shouldExecutePrevSlide = true;
    }, 100); // Adjust the delay as needed
  }
}


const changeSlide = ()=>{
  const container = document.querySelector(".slides");
  const slideWidth = slides[currentSlide].offsetWidth;
  const offset = -slideWidth * currentSlide;
  container.style.transform = `translateX(${offset}px)`;
}
//Click Events
nextButton.addEventListener("click", () => {
  nextSlide();
});

prevButton.addEventListener("click", ()=>{
  prevSlide();
})

let progressInterval;

function resetProgressBar() {
  let progressBars = document.querySelectorAll(".progress-bar");
  progressBars.forEach((progressBar) => {
    //console.log(progressBar);
    let currentWidth = parseFloat(progressBar.style.width)||0; // Get the current width or default to 100%
    //console.log(currentWidth);
    if (currentWidth > 0) {
      let decrement = 1; // Adjust the decrement for a smooth decrease
      // Smoothly decrease to 0
      let decreaseInterval = setInterval(() => {
        currentWidth -= decrement;
        //console.log(currentWidth);
        if (currentWidth == 0) {
          currentWidth = 0;
          progressBar.style.width = `0%`;
          clearInterval(decreaseInterval);
        }
        progressBar.style.width = `${currentWidth}%`;
        //console.log(currentWidth);
      }, 5); // Adjust the interval for a smoother animation
    }
  });
}

function updateProgressBar() {
  clearInterval(progressInterval);
  //console.log("Current slide is: ", currentSlide);
  const progressBar = navLinks[currentSlide].querySelector('.progress-bar');
  progressInterval = setInterval(() => {
    progress += 1; // Adjust the increment for desired speed
    if (progress == 100) {
      progress = 0;
      clearInterval(progressInterval); // Clear the interval
      isPaused = false; // Reset the flag
      nextSlide();
    }
      
    //console.log(progress);
    progressBar.style.width = `${progress}%`; // Adjust the width based on your design
    // Invoke the callback with the current progress
    //console.log(progress);
    /*if (callback && typeof callback === 'function') {
      callback(progress);
    }*/
  }, 70);
}

let timer;

function startSlider() {
  updateProgressBar();
  //timer = setInterval(nextSlide, 7000);
}

startSlider();

//when either button or indicator(nav links) are clicked, stop the timer and then start again
const resetTimer = () => {
  clearInterval(timer);
  timer = setInterval(nextSlide, 7000);
}

const pauseTimer = () => {
  clearInterval(progressInterval);
  clearInterval(timer);
};

const unpauseTimer = () => {
  //console.log('unpause!');
  updateProgressBar();
  //console.log(progress);
  //timer = setInterval(next, 7000 - 7000 * (progress/100));
  clearInterval(timer);
}

// when mouseenter, mouseleave, mousedown, and mouseup
const slidesContainer = document.getElementById('sliderWrapper');
slidesContainer.addEventListener("mouseover", () => {
  //console.log('pause');
  clearInterval(progressInterval);
  pauseTimer();
});

slidesContainer.addEventListener("mouseleave", () => {
  if (!isDragging) {
    unpauseTimer();
    isPaused = false;
    //timer = setInterval(autoChange, 7000);
  }
});

// sliding slides
var slider = document.getElementById('slider'),
    sliderItems = document.getElementById('slides');

function slide(wrapper, items) {
  var posX1 = 0,
      posX2 = 0,
      posInitial,
      posFinal;
  
  // Mouse events
  wrapper.onmousedown = dragStart;
  
  // Touch events
  wrapper.addEventListener('touchstart', dragStart);
  wrapper.addEventListener('touchend', dragEnd);
  wrapper.addEventListener('touchmove', dragAction);
  
  function dragStart (e) {
    isDragging = true;
    pauseTimer();
    e = e || window.event;
    e.preventDefault();
    posInitial = wrapper.offsetLeft;
    
    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      posInitial = posX1;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }
  
  function dragAction (e) {
    e = e || window.event;
    
    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
    }
    posFinal = posInitial - posX2;
    //console.log(posInitial);
    //console.log(posFinal);
  }
  
  function dragEnd (e) {
    //console.log("Dragend posFinal: ", posFinal);
    //console.log("Dragend posInitial: ", posInitial);
    //console.log("Difference:", posFinal-posInitial);
    let difference = posFinal-posInitial;
    if (difference < -75 & posFinal != 0) {
      posX1 = 0;
      posX2 = 0;
      nextSlide();
    } else if (difference > 75 & posFinal != 0) {
      posX1 = 0;
      posX2 = 0;
      prevSlide();
    } else {
      posX1 = 0;
      posX2 = 0;
      posFinal = 0;
      posInitial = 0;
    }
    isDragging = false;

    document.onmouseup = null;
    document.onmousemove = null;
  }
}

slide(slider, sliderItems);
//END Slider