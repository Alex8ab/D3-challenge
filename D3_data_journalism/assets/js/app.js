// console.log("oki doki")
// SVG container dimensions
let svgWidth = parseInt(d3.select("#scatter").style("width"));
let svgHeight = svgWidth - svgWidth / 4;
// let svgWidth = 800;
// let svgHeight = 600;

// margins
let margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
};
// Chart dimensions
let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, 
// and shift the latter by left and top margins.
let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append groups element
let chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data reading the csv file
d3.csv("assets/data/data.csv").then(function(fullData) {

    // Parse data
    fullData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });
    
    // Scale x to chart width
    let xLinearScale = d3
        .scaleLinear()
        .domain([d3.min(fullData, d => d.smokes) * 0.8, d3.max(fullData, d => d.smokes) * 1.2])
        .range([0, chartWidth]);

    // Scale y to chart height
    let yLinearScale = d3
        .scaleLinear()
        .domain([d3.min(fullData, d => d.age) * 0.8, d3.max(fullData, d => d.age) * 1.2])
        .range([chartHeight, 0]);

    // Axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup
        .append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup
        .append("g")
        .call(leftAxis);

    // Create circles
    let circlesGroup = chartGroup
        .selectAll("circle")
        .data(fullData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.smokes))
        .attr("cy", d => yLinearScale(d.age))
        .classed("stateCircle", true)
        .attr("r", "17")
        .attr("opacity", "0.8");
  
    // Create circle labels
    chartGroup
        .append("g")
        .selectAll("text")
        .data(fullData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.smokes))
        .attr("y", d => yLinearScale(d.age))
        .classed("stateText", true)
        .text(d => d.abbr)
        .attr("transform", "translate (0,5)")
        .attr("opacity", "0.8");

    // Create and format "y" axe label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 45)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Age (Median)");

    // Create and format "x" axe label
    chartGroup
        .append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 5})`)
        .attr("class", "axisText")
        .text("Smokers (%)");

    // Create title for chart
    chartGroup
        .append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${-25})`)
        .attr("class", "axisText")
        .text("Smokers Population vs Age by State");

    // Create toolTips for circles
    let toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>${d.state}</strong><br>Smokers: ${d.smokes}%<br>Age (Median): ${d.age}`);
    });

    circlesGroup.call(toolTip);

    // Event listeners
    // Show labels only when mouse is over the circle
    circlesGroup
        .on("mouseover", function(data) {
            toolTip.show(data);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
    });

}).catch(function(error) {
    console.log(error);
});