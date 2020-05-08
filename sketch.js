// Covid data from:
// https://coronavirus.data.gov.uk/;
let url = 'https://c19downloads.azureedge.net/downloads/json/coronavirus-deaths_latest.json'

let currentCountry = "England"

let startEaseValue = 100
let ease = 2
let easeValue = startEaseValue

function preload() {
  // Preload the data
  json = loadJSON(url, gotData);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // make buttons
  let x  = 10
  let y  = 10
  let buttonHeight = 40
  makeButton("Wales", x, y)
  makeButton("Scotland", x, y + buttonHeight)
  makeButton("Northern Ireland", x, y + buttonHeight*2)
  makeButton("England", x, y + buttonHeight*3, focus)
}

function gotData(data) {
  // load the data (returned by the preload) into a variable
  deaths = data;
}

function makeGraph() {
  background(0);
  fill(255, 255, 255)
  noStroke()
  // multiplier allows graph to progress along axis
  // its the length of the array divided by number of countries
  // minus a small amount to space it from the end of the canvas
  let mulitplier = (width / (deaths.countries.length / 4)) - 2.3
  deaths.countries
    .filter(country => country.areaName === currentCountry)
    .map((country, index) => {
      // if there's no value make it zero
      let diameter = country.dailyChangeInDeaths ? country.dailyChangeInDeaths : 0
      // draw from right to left due to the order of the array
      // progress along with the 'multiplier' removing a small amount for spacing
      // also use multiplier to determine width of ellipse (with modifier)
      // use diameter value to determine height of ellipse
      ellipse(width - index * mulitplier - 15, height / 2, mulitplier / 5, (diameter / 1.6) / easeValue)
    })
}

// make buttons - pass in country, x and y as params
// when the button is pressed, return the country and re-make the graph
function makeButton(country, x, y, focus = false) {
  button = createButton(country);
  button.position(x, y);
  button.mousePressed(() => {
    currentCountry = country
    easeValue = startEaseValue
  });
  if (focus) button.elt.focus()
}

function draw() {
  // ease the size of the graph
  easeValue -= ease
  if (easeValue < 1) easeValue = 1
  // draw the graph
  makeGraph()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}