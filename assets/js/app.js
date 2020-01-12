// Percentage of people in Poverty compared to percentage of people who smoke per state

// Step 1: Set up our chart
//=================================
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 75
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import and parse data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(povertyData) {
  // print the data
  console.log(povertyData);

  //isolate the state data
  var abbr = povertyData.map(data => data.abbr);
  // print the isolated state data
  console.log(abbr);
  
  //cast the poverty values to a number for each piece of poverty data
  povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
  })

  // Isolate the poverty data
  var povertyLevel = povertyData.map(data => data.poverty)
  // Isolate the smoker's data
  var smokersData = povertyData.map(data => data.smokes) 

  // Verify min and max values for data in the console
  console.log("Poverty Min Value", d3.min(povertyLevel));
  console.log("Poverty Max Value", d3.max(povertyLevel));
  console.log("Poverty Min and Max Value", d3.extent(povertyLevel));
  console.log("Smokers Min Value", d3.min(smokersData));
  console.log("Smokers Max Value", d3.max(smokersData));
  console.log("Smokers Min and Max Value", d3.extent(smokersData));

// Step 4:  
// Design scatterplot container (axis and labels)
// ================================
// Add X axis
var x = d3.scaleLinear()
  // domain is the input values that I give it
  .domain([d3.min(povertyLevel, x)-4, d3.max(povertyLevel, x)+2])
  // range is the values onto which I'm going to map the values that I indicate
  .range([0, width]);

  svg.append("g")
      .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
  
  // Add in x axis label
  svg.append("text")
    .attr("class", "active")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 25)
    .text("In Poverty (%)");

// Add Y axis
var y = d3.scaleLinear()
  // domain is the input values that I give it
  .domain([d3.max(smokersData, y)+2, d3.min(smokersData, y)-4])
  // range is the values onto which I'm going to map the values that I indicate
  .range([0, height]);

  svg.append("g")
    .call(d3.axisLeft(y));

  // Add in y axis label
  svg.append("text")
    .attr("class", "active")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (margin.left / 2))
    .attr("x", 0 - (height / 2))
    .text("Smokers (%)");   

// Step 5:  
// Add data to scatterplot 
// ================================
  // Add circles 
  svg.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => x(d.poverty))
    .attr("cy", d => y(d.smokes))
    .attr("r", "12");
    
  // Add text on the cicles
  svg.selectAll("#circleText")
    .data(povertyData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("class", "stateText")
    .attr("x", d => x(d.poverty))
    .attr("y", d => y(d.smokes)+2)
    .attr("font-size", 10);

//create a function so if there is an error with the csv data an error prints
}).catch(function(error) {
  console.log(error);

});