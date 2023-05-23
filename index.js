var isFlipping = false;
var totalClicks = 0;
var numOfMatches = 0;
// Amount of pairs to match
var difficulty;
var totalPairs;
var totalTime;
var startTime;
var timerInterval;

const setup = async () => {
  let firstCard = undefined;
  let secondCard = undefined;

  $('#difficulty input[type="radio"]').on("click", function () {
    // Remove active class from all buttons
    $("#difficulty label").removeClass("active");

    // Add active class to the clicked button's parent label
    $(this).parent().addClass("active");
  });

  $("#start").on("click", function () {
    const selectedDifficulty = $(
      '#difficulty input[type="radio"]:checked'
    ).val();
    console.log(selectedDifficulty);
    if (selectedDifficulty == "easy") {
      difficulty = 3;
      totalPairs = difficulty;
      totalTime = 100;
      var width = 600;
      var height = 400;
    } else if (selectedDifficulty == "medium") {
      difficulty = 6;
      totalPairs = difficulty;
      totalTime = 200;
      var width = 800;
      var height = 600;
    } else if (selectedDifficulty == "hard") {
      difficulty = 12;
      totalPairs = difficulty;
      totalTime = 300;
      var width = 1200;
      var height = 800;
    }
    const info = document.getElementById("info");
    info.style.display = "inline";
    const game = document.getElementById("game_grid");
    game.style.display = "";
    game.style.width = `${width}px`;
    game.style.height = `${height}px`;
    const start = document.getElementById("start");
    start.style.display = "none";
    const themes = document.getElementById("themes");
    themes.style.display = "inline";
    fillHTML(difficulty, totalPairs, totalTime);
    startTimer();
  });

  $("#game_grid").on("click", ".card", function () {
    // Check if flipping is already in progress
    if (!$(this).hasClass("flip") && !isFlipping) {
      $(this).toggleClass("flip");
      if (!firstCard) firstCard = $(this).find(".front_face")[0];
      else {
        secondCard = $(this).find(".front_face")[0];
        console.log(firstCard, secondCard);
        if (firstCard.src == secondCard.src) {
          console.log("match");
          $(`#${firstCard.id}`).parent().off("click");
          $(`#${secondCard.id}`).parent().off("click");
          firstCard = undefined;
          secondCard = undefined;
          setTimeout(() => {
            updateValues();
          }, 1000);
        } else {
          console.log("no match");
          isFlipping = true; // Set flipping flag to true
          setTimeout(() => {
            $(`#${firstCard.id}`).parent().toggleClass("flip");
            $(`#${secondCard.id}`).parent().toggleClass("flip");
            firstCard = undefined;
            secondCard = undefined;
            isFlipping = false; // Set flipping flag to false after flipping is done
          }, 1000);
        }
      }
      totalClicks++;
      $("#num_of_clicks").empty();
      $("#num_of_clicks").append(`<h1>Total Clicks: ${totalClicks}</h1>`);
    }
  });

  // Add event listener to the Dark theme button
  $("#dark").on("click", function () {
    $("#game_grid").css("background-color", "black");
    $(".card").css("background-color", "black");
  });

  // Add event listener to the Light theme button
  $("#light").on("click", function () {
    $("#game_grid").css("background-color", "white");
    $(".card").css("background-color", "white");
  });
};

function startTimer() {
  startTime = new Date().getTime(); // Get the current timestamp when the timer starts

  // Update the timer every second
  timerInterval = setInterval(() => {
    var currentTime = new Date().getTime(); // Get the current timestamp
    var timePassed = Math.floor((currentTime - startTime) / 1000); // Calculate the time passed in seconds

    // Update the HTML content for the timer
    $("#timer").empty();
    $("#timer").append(
      `<h1>You have ${totalTime} seconds! Time passed: ${timePassed}s</h1>`
    );

    // Check if the time has reached zero
    if (timePassed >= totalTime) {
      // Perform actions when time runs out
      clearInterval(timerInterval); // Stop the timer
      // Add your code here to handle when the time runs out
      $("header").empty();
      $("header").append(`<h1>Time's up!</h1>`);
      $("#game_grid").empty();
      $("#game_grid").append(`<h1><a href="index.html">Try Again!</h1>`);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

async function fillHTML(difficulty, totalPairs, totalTime) {
  // You could probably make this into a function
  $("#total_pairs").empty();
  $("#total_pairs").append(`<h1>Total Pairs: ${totalPairs}</h1>`);
  $("#num_of_matches").empty();
  $("#num_of_matches").append(`<h1>Number of Matches: ${numOfMatches}</h1>`);
  numToWin = totalPairs;
  $("#num_of_pairs").empty();
  $("#num_of_pairs").append(`<h1>Matches remaining: ${numToWin}<h1>`);
  $("#num_of_clicks").empty();
  $("#num_of_clicks").append(`<h1>Total Clicks: ${totalClicks}</h1>`);
  $("#timer").empty();
  $("#timer").append(`<h1>You have ${totalTime} seconds! Time passed: 0s</h1>`);

  $("#game_grid").empty();

  // TODO: Figure out amount of pairs based on difficulty

  // Create an array to store the card images
  var cardImages = [];

  // Generate pairs of card images
  for (let i = 1; i <= difficulty; i++) {
    let currPoke = [];
    let randomNumber = Math.floor(Math.random() * 810);
    while (currPoke.includes(randomNumber)) {
      randomNumber = Math.floor(Math.random() * 810);
    }
    currPoke.push(randomNumber);
    var pokeSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomNumber}.png`;
    for (let j = 0; j < 2; j++) {
      cardImages.push(`${pokeSprite}`);
    }
  }

  // Randomize the order of card images
  cardImages = shuffle(cardImages);

  // Create card elements with randomized images
  cardImages.forEach((image, index) => {
    $("#game_grid").append(`
      <div class="card">
        <img id="img${index + 1}" class="front_face" src="${image}" alt="">
        <img class="back_face" src="back.webp" alt="">
      </div>
    `);
  });
}

function updateValues() {
  numOfMatches++;
  $("#num_of_matches").empty();
  $("#num_of_matches").append(`<h1>Number of Matches: ${numOfMatches}</h1>`);
  numToWin--;
  $("#num_of_pairs").empty();
  $("#num_of_pairs").append(`<h1>Matches remaining: ${numToWin}<h1>`);
  setTimeout(() => {
    if (numToWin == 0) {
      alert("You win!");
      stopTimer();
    }
  }, 500);
}

// Function to shuffle an array
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

$(document).ready(setup);
