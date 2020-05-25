// Covid data from:
// https://coronavirus.data.gov.uk/;
let url = 'https://c19downloads.azureedge.net/downloads/json/coronavirus-deaths_latest.json'

let currentCountry = "United Kingdom"

let startEaseValue = 101
let ease = 2
let easeValue = startEaseValue
let animate = true
let slider

let bigArray = []

function preload() {
  // Preload the data
  json = loadJSON(url, gotData);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // make buttons
  let x = 10
  let y = 40
  let buttonHeight = 40
  makeButton("United Kingdom", x, y, focus)
  makeButton("Scotland", x, y + buttonHeight)
  makeButton("Northern Ireland", x, y + buttonHeight * 2)
  makeButton("England", x, y + buttonHeight * 3)
  makeButton("Wales", x, y + buttonHeight * 4)

  bigArray = deaths.countries.concat(deaths.overview);
  // console.log(bigArray)

  slider = createSlider(0, 5, 0.7, 0.01);
  slider.position(10, 10);
  slider.style('width', width /2  + 'px');
}

function gotData(data) {
  // load the data (returned by the preload) into a variable
  deaths = data;
}

function makeGraph() {
  background("white");
  fill(255, 255, 255)

  // multiplier allows graph to progress along axis
  // its the length of the array divided by number of countries
  // minus a small amount to space it from the end of the canvas
  let mulitplier = (width / (deaths.countries.length / 4)) - 2
  let heightScale = (slider.value())
  // scale(0.97)
  // translate(130,-100)
  // rotate(0.15)

  // make bezier
  noFill();
  // beginShape();
  bigArray
    .filter(country => country.areaName === currentCountry)
    .map((country, index) => {
      // console.log(country)
      // if there's no value make it zero
      let diameter = country.dailyChangeInDeaths ? country.dailyChangeInDeaths * heightScale : 0


      // draw from right to left due to the order of the array
      // progress along with the 'multiplier' removing a small amount for spacing
      // also use multiplier to determine width of ellipse (with modifier)
      // use diameter value to determine height of ellipse
      // ((index % 7) === 0) ? fill(0) : fill("gray")
      strokeWeight(1);
    noStroke()
    stroke("cyan")
      if (index % 7 === 0) {
        fill("magenta")
      } else {
        fill("yellow")
      }
      // rotate(-0.005)
      rect(width - index * mulitplier - 58, height - 20, mulitplier, -(diameter / 1.6) / easeValue, 0, 0, 10, 10)
      if (country.dailyChangeInDeaths) {
        let amount = country.dailyChangeInDeaths.toString();
        textSize(12);
        if (index % 7 === 0) {
          fill("grey")
        } else {
          fill("grey")
        }
        if (index == 0) {
          textSize(20)
          // curveVertex(width - index * mulitplier - 50, height - 20 - (diameter / 1.6) / easeValue);
        }
        noStroke()
        text(amount, (width - index * mulitplier - 52), height - 20 - (diameter / 1.6) / easeValue)
        if (index % 7 === 0) {
          noFill()
          stroke(0, 255, 255, 100)
          strokeWeight(40);
          // curveVertex(width - index * mulitplier - 58, height - 20 - (diameter / 1.6) / easeValue);
          point(width - index * mulitplier - 58 + mulitplier/2, height - 20 - (diameter / 1.6) / easeValue);
        } else {
          stroke(255, 255, 0, 70)
          strokeWeight(10);
          // point(width - index * mulitplier - 58, height - 20 - (diameter / 1.6) / easeValue);
        }
      }

    })
  // noFill()
  // strokeWeight(19);
  // stroke(255, 0, 0, 70)
  // endShape()
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
  if (easeValue - ease > 1) {
    easeValue -= ease
  } else {
    easeValue = 1
  }
  if (animate) makeGraph()
  if (easeValue <= 1) {
    easeValue = 1
    // animate = false;
    // draw the graph  
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  animate = true;
  easeValue = startEaseValue
}
