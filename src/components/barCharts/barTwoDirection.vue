<template>
    <div id='barchart_47836_2017'></div>
</template>

<script>
    import * as d3 from 'd3';
    export default {
        name: 'YxBarTwoDirection',
        props: {
            dataItems: {
                type: Array,
                default: function(){
                    return [
                        { name: '中国', value: 121 },
                        { name: '俄罗斯', value: 181 }
                    ];
                }
            },
            background: {
                type: [String, Number],
                default: "rgba(51,51,51,0.0)"
            },
            width: {
                type: [String, Number],
                default: "800px"
            },
            height: {
                type: [String, Number],
                default: "500px"
            },
            midwidth: {
                type: [String, Number],
                default: "70px"
            },
            ticksVisible: {
                type: [Boolean, String, Number],
                default: true
            },
            midclass: {
                type: String,
                default: "texttitle"
            },
            leftclass: {
                type: String,
                default: "bar"
            },
            rightclass: {
                type: String,
                default: "bar2"
            },
            leftfontclass: {
                type: String,
                default: "textvalue"
            },
            rightfontclass: {
                type: String,
                default: "textvalue2"
            },
            onClick: Function
        },
        mounted() {
            this.draw(this.dataItems, true); // initial draw
        },
        watch: {  
            'dataItems': 'onChange',
        },
        methods: {
            draw (dataset, isAnimated) {
                var onClick = this.onClick;
                var objId = "#barchart_47836_2017";
                d3.select(objId).select("svg").remove();
                d3.select(objId)
                .style('width', this.width)
                .style('height', this.height)
                .style('background-color', this.background);

                // set the dimensions and margins of the graph
                var margin = {top: 20, right: 40, bottom: 30, left: 40},
                    width = parseInt(this.width) - margin.left - margin.right,
                    height = parseInt(this.height) - margin.top - margin.bottom;
                var midWidth = parseInt(this.midwidth);

                var svg = d3.select(objId).append("svg")
                    .attr("width", this.width)
                    .attr("height", this.height)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                
                // set the ranges
                var x = d3.scaleBand()
                        .range([0, height])
                        .padding(0.1);
                
                var y = d3.scaleLinear()
                        .range([width / 2 - midWidth / 2, 0]);
                var y2 = d3.scaleLinear()
                        .range([0, width / 2 - midWidth / 2]);
                        
                

                // Scale the range of the data in the domains
                x.domain(this.dataItems.map(function(d) { return d.name; }));
                y.domain([0, d3.max(this.dataItems, function(d) { return d.value; })]);
                y2.domain([0, d3.max(this.dataItems, function(d) { return d.value2; })]);


                
                // console.log("max:"+y.domain());
                var tickValues = function(max) {
                    var _values  = [];
                    var _value = 0;
                    var _cstep = 20;
                    if (max > 20000) {
                       _cstep =  10000;
                    }
                    else if (max > 10000) {
                        _cstep =  5000;
                    }
                    else if (max > 2000) {
                        _cstep =  1000;
                    }
                    else if (max > 1000) {
                        _cstep =  500;
                    }
                    else if (max > 200) {
                        _cstep =  100;
                    }
                    else if (max > 100) {
                        _cstep =  50;
                    }
                    // debugger;
                     while(true) {
                            if (_value < max) {
                                _values.push(_value);
                            }
                            else break;
                            _value += _cstep;
                        }
                    return _values
                };
                // add the x Axis
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate("+ (width / 2 + midWidth / 2) +","+ 0 +")")
                    .call(d3.axisLeft(x).ticks(3));
                // add the x Axis
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate("+ (width / 2 - midWidth / 2) +","+ 0 +")")
                    .call(d3.axisRight(x));
                
                // debugger;
                var ticksShow = this.ticksVisible==="true" || this.ticksVisible==="1";
                svg.append("g")
                    .style("display", ticksShow? "" : "none")
                    .call(d3.axisTop(y).tickValues(tickValues(y.domain()[1])));
                svg.append("g")
                    .style("display", ticksShow? "" : "none")
                    .attr("transform", "translate("+ (width / 2 + midWidth / 2) +","+ 0 +")")
                    .call(d3.axisTop(y2).tickValues(tickValues(y2.domain()[1])));

                // console.log("barwidth:" + x.bandwidth());
                // // append the rectangles for the bar chart
                svg.selectAll("." + this.leftclass)
                    .data(this.dataItems)
                    .enter().append("rect")
                    .on("click",function(d){
                        if(onClick)onClick(d,"left")
                    })
                    .attr("class", this.leftclass)
                    .attr("y", function(d) {
                        return x(d.name); })
                    .attr("height", x.bandwidth())
                    .attr("x", width / 2 - midWidth / 2)
                    .transition()
                    .duration(800)
                    .attr("x", function(d) {
                        return y(d.value); })
                    .attr("width", function(d) { return width / 2 - midWidth / 2 - y(d.value); });

                svg.selectAll("." + this.rightclass)
                    .data(this.dataItems)
                    .enter().append("rect")
                    .on("click",function(d){
                        if(onClick)onClick(d,"right")
                    })
                    .attr("class", this.rightclass)
                    .attr("y", function(d) {
                        return x(d.name); })
                    .attr("height", x.bandwidth())
                    .attr("x", width / 2 + midWidth / 2 + 1)
                    .transition()
                    .duration(800)
                    // .attr("x", function(d) {
                    //     return y2(d.value2); })
                    .attr("width", function(d) {
                        return y2(d.value2); 
                    });
                            
                svg.selectAll("." + this.midclass)
                    .data(this.dataItems)
                    .enter().append("text")
                    .on("click",function(d){
                        if(onClick)onClick(d,"mid")
                    })
                    .attr("class", this.midclass)
                    .attr("y", function(d) {
                        return x(d.name) + x.bandwidth() / 2 + 6; })
                    .attr("x", width / 2)
                    .attr('text-anchor', 'middle')                
                    .text(function(d) { return d.name; });
                

                svg.selectAll("."+this.leftfontclass)
                    .data(this.dataItems)
                    .enter().append("text")
                    .on("click",function(d){
                        if(onClick)onClick(d,"left")
                    })
                    .attr("class", this.leftfontclass)
                    .attr('text-anchor', 'right')
                    .attr("y", function(d) {return x(d.name) + x.bandwidth() / 2 + 6; })
                    .attr("x", width / 2 - midWidth / 2 + 5)
                    .text(0)
                    .transition()
                    .duration(800)
                    .text(function(d) { return d.value; })
                    .attr("x", function(d) {
                        return width / 2 - midWidth / 2 + 5 - y2(d.value) - (d.value+"").length * 10; 
                    });
                svg.selectAll("."+this.rightfontclass)
                    .data(this.dataItems)
                    .enter().append("text")
                    .on("click",function(d){
                        if(onClick)onClick(d,"right")
                    })
                    .attr("class", this.rightfontclass)
                    .attr('text-anchor', 'left')
                    .attr("y", function(d) {return x(d.name) + x.bandwidth() / 2 + 6; })
                    .attr("x", width / 2 + midWidth / 2 + 5)
                    .text(0)
                    .transition()
                    .duration(800)
                    .text(function(d) { return d.value2; })
                    .attr("x", function(d) {
                        return width / 2 + midWidth / 2 + 5 + y2(d.value2); 
                    });
                // // add the y Axis
                // svg.append("g")
                //     .call(d3.axisLeft(y));
            },
            onChange: function() {
                this.draw(this.dataItems, true); // initial draw
            }
        }
    }
</script>

<style lang='less'>
    .bar {
        fill: steelblue;
    }
    .bar:hover {
        fill: lighten(#437cc7, 15%);
    }
    .bar2 {
        fill: #BDB76B;
    }
    .bar2:hover {
        fill: lighten(#437cc7, 15%);
    }
    .texttitle {
        fill: #FF0000;
        font-size: 18px;
        font-weight:bold;
        stroke: #ffffff;
        stroke-width: 1px;
    }
    .texttitle:hover {
        fill: lighten(#ffffff, 30%);
    }
    .textvalue {
        fill: #000000;
    }
    .textvalue:hover {
        fill: lighten(#ffffff, 30%);
    }
    .textvalue2 {
        fill: #000000;
    }
    .textvalue2:hover {
        fill: lighten(#ffffff, 30%);
    }
    .axis text {
        display: none;
    }
</style>