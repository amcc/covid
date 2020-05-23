// Covid data from:
// https://coronavirus.data.gov.uk/;
let url = 'https://c19downloads.azureedge.net/downloads/json/coronavirus-deaths_latest.json'

let currentCountry = "United Kingdom"

let startEaseValue = 101
let ease = 2
let easeValue = startEaseValue
let animate = true

let bigArray = []

function preload() {
  // Preload the data
  json = loadJSON(url, gotData);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // make buttons
  let x = 10
  let y = 10
  let buttonHeight = 40
  makeButton("United Kingdom", x, y, focus)
  makeButton("Scotland", x, y + buttonHeight)
  makeButton("Northern Ireland", x, y + buttonHeight * 2)
  makeButton("England", x, y + buttonHeight * 3)
  makeButton("Wales", x, y + buttonHeight * 4)
  
  bigArray = deaths.countries.concat(deaths.overview);
  // console.log(bigArray)
}

function gotData(data) {
  // load the data (returned by the preload) into a variable
  deaths = data;
}

function makeGraph() {
  background("black");
  fill(255, 255, 255)
  noStroke()
  // multiplier allows graph to progress along axis
  // its the length of the array divided by number of countries
  // minus a small amount to space it from the end of the canvas
  let mulitplier = (width / (deaths.countries.length / 4)) - 2
  // scale(0.97)
  // translate(130,-100)
  // rotate(0.15)
  bigArray
    .filter(country => country.areaName === currentCountry)
    .map((country, index) => {
      // console.log(country)
      // if there's no value make it zero
      let diameter = country.dailyChangeInDeaths ? country.dailyChangeInDeaths : 0
      // draw from right to left due to the order of the array
      // progress along with the 'multiplier' removing a small amount for spacing
      // also use multiplier to determine width of ellipse (with modifier)
      // use diameter value to determine height of ellipse
      // ((index % 7) === 0) ? fill(0) : fill("gray")
      if(index % 7 === 0) {
        fill("tomato")
      } else {
        fill("gray")
      }
      // rotate(-0.005)
      rect(width - index * mulitplier - 58, height - 20, mulitplier/1.5, -(diameter / 1.6) / easeValue)
      if (country.dailyChangeInDeaths) {
        let amount = country.dailyChangeInDeaths.toString();
        textSize(12);
        if(index % 7 === 0) {
        fill("tomato")
      } else {
        fill(255,255,255,180)
      }
        if (index == 0) {
          textSize(20)
        }
        text(amount, (width - index * mulitplier - 52), height -20 - (diameter / 1.6) / easeValue)
      }

    })
}

function showText() {}

// make buttons - pass in country, x and y as params
// when the button is pressed, return the country and re-make the graph
function makeButton(country, x, y, focus = false) {
  button = createButton(country);
  button.position(x, y);
  button.mousePressed(() => {
    currentCountry = country
    easeValue = startEaseValue
    animate = true
  });
  if (focus) button.elt.focus()
}

function draw() {
  // ease the size of the graph
  easeValue -= ease
  if (animate) makeGraph()
  if (easeValue <= 1) {
    easeValue = 1
    animate = false;
    // draw the graph  
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
