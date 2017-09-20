/*!
 * Copyright (c) 2017, yx-view
 * All rights reserved.
 * bamai v0.0.1
 */
import * as d3 from 'd3';

export default function (divid,headerData, rawData, background='#FFFFFF', _width=500, _height=400) {
    var width = _width;
    var height = _height;
  
    var center = { x: width / 2, y: height / 2 };
  
    var yearCenters = {};
    var yearsTitleX = {};
    // var yearCenters = {
    //     2008: { x: width / headerData.length, y: height / 2 },
    //     2009: { x: width / 2, y: height / 2 },
    //     2010: { x: 2 * width / 3, y: height / 2 }
    // };;
    var indexV = 1;
    headerData.forEach(function(d){
        yearCenters[d.name] = { x: width * indexV / headerData.length, y: height / 2 };
        yearsTitleX[d.name] = width * indexV / headerData.length;
        
        indexV += 1;
    });
  
    // var yearsTitleX = {
    //     2008: 160,
    //     2009: width / 2,
    //     2010: width - 160
    // };
  
    // strength to apply to the position forces
    var forceStrength = 0.05;
  
    var svg = null;
    var bubbles = null;
    var nodes = [];
  

    function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
    }
  
    // Here we create a force layout
    var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);
  
    // which we don't want as there aren't any nodes yet.
    simulation.stop();
  
    // Nice looking colors - no reason to buck the trend
    var fillColor = d3.scaleOrdinal()
    .domain([1, 2, 3,4,5])
    .range(['#d84b2a', '#beccae', '#7aa25c', '#67322c', '#aaa25c']);
  
  
    /*
     * This function returns the new node array, with a node in that
     * array for each element in the rawData input.
     */
    function createNodes(rawData) {
        // Use the max total_amount in the data as the max in the scale's domain
        // note we have to ensure the total_amount is a number.
        var maxAmount = d3.max(rawData, function (d) { return +d.id; });

        // Sizes bubbles based on area.
        // @v4: new flattened scale names.
        var radiusScale = d3.scalePow()
        .exponent(0.5)
        .range([20, 45])
        .domain([0, maxAmount]);

        // Use map() to convert raw data into node data.
        // working with data.
        var myNodes = rawData.map(function (d) {
            return {
                id: d.id,
                radius: radiusScale(+d.id),
                value: +d.id,
                name: d.name,
                org: d.organization,
                group: d.parrentname,
                year: d.parrentid,
                x: Math.random() * width,
                y: Math.random() * height
            };
        });

        myNodes.sort(function (a, b) { return b.value - a.value; });

        return myNodes;
    }
  
    /*
     * Callback function that is called after every tick of the
     * force simulation.
     * Here we do the acutal repositioning of the SVG circles
     * based on the current x and y values of their bound node data.
     * These x and y values are modified by the force simulation.
     */
    function ticked() {
        bubbles
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    }
  
    /*
     * Provides a x value for each node to be used with the split by year
     * x force.
     */
    function nodeYearPos(d) {
        return yearCenters[d.year].x;
    }
  
  
    /*
     * Sets visualization in "single group mode".
     * The year labels are hidden and the force layout
     * tick function is set to move all nodes to the
     * center of the visualization.
     */
    function groupBubbles() {
        hideYearTitles();
    
        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
    
        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }
  
    function splitBubbles() {
        showYearTitles();
    
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos));
    
        simulation.alpha(1).restart();
    }
  
    function hideYearTitles() {
        svg.selectAll('.year').remove();
    }
  
    function showYearTitles() {
        var yearsData = d3.keys(yearsTitleX);
        var years = svg.selectAll('.year')
        .data(yearsData);

        years.enter().append('text')
        .attr('class', 'year')
        .attr('x', function (d) { return yearsTitleX[d]; })
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text(function (d) { return d; });
    }

    this.displayStatus = function (displayName) {
        if (displayName === 'year') {
            splitBubbles();
        } else {
            groupBubbles();
        }
    };

    
    nodes = createNodes(rawData);

    d3.select(divid)
    .style('width', width)
    .style('height', height)
    .style('background-color', background);
    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(divid)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
    .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
    .classed('bubble', true)
    .attr('r', 0)
    .attr('fill', function (d) { return fillColor(d.group); })
    .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
    .attr('stroke-width', 2);
    // .on('mouseover', showDetail)
    // .on('mouseout', hideDetail);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
    .duration(2000)
    .attr('r', function (d) { 
        // console.log(d.radius);
        return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
}