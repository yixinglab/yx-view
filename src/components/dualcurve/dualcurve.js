/*!
 * Copyright (c) 2017, yx-view
 * All rights reserved.
 */
import * as d3 from 'd3';

export default function (id) {
    this.getConfig = getConfig;
    this.setConfig = setConfig;
    this.setBackground = setBackground;

    // debugger;
    var objId = id;

    // 渲染显示对象  坐标轴和折线
    var _axisX = null;
    var _axisYs = null;
    var _axisYs_Content = null;
    var _legends = [];

    var _y0Name = '测试1';
    var _y1Name = '测试2';
    var _y0Color = 'steelblue';
    var _y1Color = 'red';  
    var _fontSize = 12;

    var _conf = null;
    var _dataJson = null;

    var _margin = {top: 20, right: 40, bottom: 30, left: 50};
    
    var _width = parseFloat(d3.select(objId).style('width'));
    var _height = parseFloat(d3.select(objId).style('height'));
    
    var svgDashboad = d3.select(objId).append('svg')
    .attr('width', _width)
    .attr('height', _height);

    var svgContainer = svgDashboad.append('g')
    .attr('transform', 'translate(' + _margin.left + ',' + _margin.top + ')');

    var _tooltipWidow = null;
    var _legendWindow = null;
    var _inited = false;
    
    function setBackground(color =  '#333333') {
        d3.select(objId).style('background-color', color);
    }
    function setConfig(conf) {
        if (_conf === conf) return;
        _conf = conf;
        if (_conf.length > 0) {
            _y0Name = _conf[0].name;
            _y1Name = _conf[0].kpiGroup;
        }
        // console.log(_inited);
        if(_inited) reinit();
        else {
            _inited = true;
            init();
        }
    }
    function getConfig() {
        return _conf;
    }
    
    function clear() {
        svgDashboad.selectAll('*').remove();
        svgContainer = svgDashboad.append('g')
        .attr('transform', 'translate(' + _margin.left + ',' + _margin.top + ')');
        _axisX = null;
        _axisYs = null;
        _axisYs_Content = null;
        _legends = null;
    
        _tooltipWidow = null;
        _legendWindow = null;    
    }
    function getFilterData() {
        var arr = [];
        if (_conf) {
            _conf.forEach(function(d){
                // debugger;
                if (d.name === _y0Name && d.kpiGroup === _y1Name) {
                    var b = new Object();
                    // "id": 5,
                    // "name": "投诉率",
                    // "type": "percentage",
                    // "value": 0.0000,
                    // "date": "2014-09-14",
                    // "kpiGroup": "primary",
                    // "priority": 30
                    b.id = d.id;
                    b.name = d.name;
                    b.type = d.type;
                    b.value = d.value;
                    b.date = d.date;
                    b.kpiGroup = d.kpiGroup;
                    b.priority = d.priority;
                    arr.push(b);
                }
            });
        }
        return arr;
    }
    function find(curdate) {
        var minV = null;
        var _values = 9999999999999;
        _dataJson.forEach(function(d){
            // debugger;
            var _values1 = Math.abs(d.date.getTime() - curdate.getTime());
            // console.log(_values1);
            if (_values > _values1) {
                _values = _values1;
                minV = d;
            }
        });
        return minV;
    }
    function onShow(legend){
        var _fill = legend.selectAll('circle').attr('fill');
        //必须显示一条
        var _existsNum = 0;
        var _index = -1;
        var lindex = 0;
        _legends.forEach(function(leg){
            var _fillLeg = leg.selectAll('circle').attr('fill');
            if (_fillLeg !== 'none') {
                _existsNum += 1;
            }
            if (leg === legend) {
                _index = lindex;
                var _axisY = _axisYs[_index];
                var _axisY_Content = _axisYs_Content[_index];
                if (_fill === 'none') {
                    _axisY.style('display','none');
                    _axisY_Content.style('display','none');
                } else {
                    _axisY.style('display','');
                    _axisY_Content.style('display','');
                }
            }
            lindex++;
        });
        
        if (_existsNum === 0 && _index >= 0) {
            _index = 0;
            _legends.forEach(function(leg){
                if (leg !== legend) {
                    var _axisY = _axisYs[_index];
                    var _axisY_Content = _axisYs_Content[_index];
                    _axisY.style('display','');
                    _axisY_Content.style('display','');
                    leg.selectAll('circle').attr('fill', leg.selectAll('circle').attr('stroke'));
                    return;
                }
                _index++;
            });
        }
    }
    function LegendClass() {
        // debugger;
        var _r = 6;
        var _left = 20;
        var _top = 0;
        var _dispatch = d3.dispatch('legendClick', 'legendMouseover', 'legendMouseout');
        _dispatch.on('legendClick', function(d) {
            // debugger;
            var _fill = d.selectAll('circle').attr('fill');
            if (_fill === 'none') {
                _fill = d.selectAll('circle').attr('stroke');
                d.selectAll('circle').attr('fill', _fill);
            }
            else {
                d.selectAll('circle').attr('fill', 'none');
            }
            onShow(d);
        });
        _dispatch.on('legendMouseover', function(d) {
            d.selectAll('circle').style('cursor', 'pointer');
            d.selectAll('text').style('cursor', 'pointer');
        });
        _dispatch.on('legendMouseout', function(d) {
            d.selectAll('circle').style('cursor', '');
            d.selectAll('text').style('cursor', '');
        });
        

        // dispatch 事件
        var _legend0 = svgContainer.append('g');
        var _legend1 = svgContainer.append('g');
        _legends = [];
        _legends.push(_legend0);
        _legends.push(_legend1);
        _legends.forEach(function(leg){
            leg.on('click', function() {
                _dispatch.call('legendClick', this,leg);
            })
            .on('mouseover', function() {
                _dispatch.call('legendMouseover',this,leg);
            })
            .on('mouseout', function() {
                _dispatch.call('legendMouseout',this,leg);
            });
        });

        var _legend0Circle = _legend0.append('circle')
        .attr('fill', _y0Color)            
        .attr('stroke', _y0Color)            
        .attr('stroke-width', 2)            
        .attr('r', _r)
        .attr('cx', _width - (_r+2) * 4 - _margin.right - _fontSize * (_y1Name.length + _y0Name.length) - _left)
        .attr('cy',_top - 4);
        var _legend0Text = _legend0.append('text')
        .text(_y0Name)
        .attr('fill', _y0Color)            
        .attr('font-size', _fontSize)
        .attr('font-family','simsun')
        .attr('font-weight','bold')        
        .attr('dy', _top)
        .attr('dx',  _width - (_r+2) * 3 -_margin.right - _fontSize * (_y1Name.length + _y0Name.length) - _left);

        var _legend1Circle = _legend1.append('circle')
        .attr('fill', _y1Color)
        .attr('stroke', _y1Color)            
        .attr('stroke-width', 2)      
        .attr('r', _r)
        .attr('cx', _width - _r - 2 - _margin.right - _fontSize * _y1Name.length - _left)
        .attr('cy',_top - 4);
        var _legend1Text = _legend1.append('text')
        .text(_y1Name)
        .attr('fill', _y1Color)            
        .attr('font-size', _fontSize)
        .attr('font-family','simsun')
        .attr('font-weight','bold')        
        .attr('dy', _top)
        .attr('dx',  _width - _margin.right - _fontSize * _y1Name.length - _left);

        this.update = update;
        function update() {
            // debugger;
            _legend0Circle.attr('cx', _width - (_r+2) * 4 - _margin.right - _fontSize * (_y1Name.length + _y0Name.length) - _left);
            
            _legend0Text.text(_y0Name)
            .attr('dx', _width - (_r+2) * 3 -_margin.right - _fontSize * (_y1Name.length + _y0Name.length) - _left);
    
            _legend1Circle
            .attr('cx', _width - _r - 2 - _margin.right - _fontSize * _y1Name.length - _left);
            
            _legend1Text
            .text(_y1Name)
            .attr('dx',  _width - _margin.right - _fontSize * _y1Name.length - _left);
        }
    }
    function TootipClass() {
        var _marginTootip = 12;
        var _tooltipWidth = 160;
        var _tooltipHeight = 70;
        var _fontsize = _fontSize;
        var _fontcolor = '#000000';

        var svgLegendContainer = svgContainer.append('g')
        .style('display', 'none')
        .attr('transform', 'translate(' +  _marginTootip + ',' + (_marginTootip + _fontsize) + ')');
        
        var _r = _fontsize / 1.75;
        var _tooltipRect = svgLegendContainer.append('rect')
        .attr('width', _tooltipWidth)
        .attr('height', _tooltipHeight)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('opacity', 0.5)
        .style('stroke','#000000')        
        .style('fill', '#FFFFFF');

        var _tooltipTitle = svgLegendContainer.append('text')
        .attr('x', _marginTootip)
        .attr('y', _marginTootip + _fontsize)
        .attr('fill', _fontcolor)  
        .attr('font-size',_fontsize + 4)  
        .attr('font-family','simsun')  
        .attr('font-weight','bold')
        .attr('text-anchor', 'left');

        var _rectX = _marginTootip;
        var _rectY = _marginTootip + _fontsize + _fontsize / 2;
        svgLegendContainer.append('rect')
        .attr('width', _fontsize)
        .attr('height', _fontsize)
        .attr('transform', 'translate(' +  _rectX + ',' + _rectY + ')')
        .attr('r', _r)
        .style('fill', _y0Color)
        .style('stroke','#808080');
        var _tooltipItemName0 = svgLegendContainer.append('text')
        .attr('x', _r + _marginTootip + _rectX)
        .attr('y', _fontsize + _rectY)
        .attr('fill', _fontcolor)  
        .attr('font-size',_fontsize)  
        .attr('font-family','simsun')  
        .attr('text-anchor', 'left');
        var _tooltipItemValue0 = svgLegendContainer.append('text')
        .attr('x', _r + _marginTootip + _rectX + 80)
        .attr('y', _fontsize  + _rectY)
        .attr('fill', _fontcolor)  
        .attr('font-size',_fontsize)  
        .attr('font-family','simsun')  
        .attr('font-weight','bold')
        .attr('text-anchor', 'right');

        _rectY = _marginTootip + _fontsize + _fontsize * 2;
        svgLegendContainer.append('rect')
        .attr('width', _fontsize)
        .attr('height', _fontsize)
        .attr('transform', 'translate(' +  _rectX + ',' + _rectY + ')')
        .attr('r', _r)
        .style('fill', _y1Color)
        .style('stroke','#808080');
        var _tooltipItemName1 = svgLegendContainer.append('text')
        .attr('x', _r + _marginTootip + _rectX)
        .attr('y', _fontsize + _rectY)
        .attr('fill', _fontcolor)  
        .attr('font-size',_fontsize)  
        .attr('font-family','simsun')  
        .attr('text-anchor', 'left');
        var _tooltipItemValue1 = svgLegendContainer.append('text')
        .attr('x', _r + _marginTootip + _rectX + 80)
        .attr('y', _fontsize  + _rectY)
        .attr('fill', _fontcolor)
        .attr('font-size',_fontsize)
        .attr('font-family','simsun')
        .attr('font-weight','bold')
        .attr('text-anchor', 'right');

        this.update = update;
        this.show = show;
        function update(_tagModal) {
            var _widthRect = _fontsize * (_tagModal.name + _tagModal.value).length + _r + _marginTootip * 2;
            var _widthRect2 = _fontsize * (_tagModal.kpiGroup + _tagModal.priority).length + _r + _marginTootip * 2;
            if (_widthRect2 > _widthRect) _widthRect = _widthRect2;
            _tooltipWidth = _widthRect;
            
            _tooltipRect.attr('width', _tooltipWidth);
            _tooltipTitle.text(_tagModal.date.getFullYear()+'-' +(_tagModal.date.getMonth() + 1)+'-' +_tagModal.date.getDate());
            
            _tooltipItemName0.text(_tagModal.name);
            _tooltipItemValue0.text(_tagModal.value);
    
            _tooltipItemName1.text(_tagModal.kpiGroup);
            _tooltipItemValue1.text(_tagModal.priority);
        }

        function show(isshow, posx, posy) {
            if (isshow) {
                if (svgLegendContainer.style('display') === 'none') svgLegendContainer.style('display', '');
                var _positionX = posx;
                var _positionY = posy;

                if (_positionX + _tooltipWidth > (_width - _margin.right)) _positionX = _positionX -_tooltipWidth - _marginTootip;
                else _positionX = _positionX + _marginTootip;
                if (_positionY < _tooltipHeight) _positionY = _positionY + _marginTootip;
                else _positionY = _positionY - _tooltipHeight;

                svgLegendContainer.attr('transform', 'translate( ' + _positionX + ', ' + _positionY + ' )');
            }
            else {
                svgLegendContainer.style('display', 'none');
            }
        }
    }

    // 初始化
    function init() {
        clear();
        // debugger;        
        if (!_legendWindow) _legendWindow = new LegendClass();
        reinit();
    }
    function reinit() {
        _dataJson = getFilterData();
        if (_dataJson.length === 0) return;
        
        _legendWindow.update();
        // debugger;
        var width = _width - _margin.left - _margin.right;
        var height = _height - _margin.top - _margin.bottom;
    
        // parse the date / time
        var parseTime = d3.timeParse('%Y-%m-%d');
        // var formatTime = d3.time.format('%Y-%m-%d');
        
        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y0 = d3.scaleLinear().range([height, 0]);
        var y1 = d3.scaleLinear().range([height, 0]);
        // debugger;

        // define the 1st line
        var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y0(d.value); });
        
        // define the 2nd line
        var valueline2 = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y1(d.priority); });

        // format the _dataJson
        _dataJson.forEach(function(d) {
            d.date = parseTime(d.date);
            d.priority = +d.priority;
            d.value = +d.value;
        });

        // Scale the range of the _dataJson
        x.domain(d3.extent(_dataJson, function(d) { return d.date; }));
        y0.domain([0, d3.max(_dataJson, function(d) {return Math.max(d.value);})]);
        y1.domain([0, d3.max(_dataJson, function(d) {return Math.max(d.priority); })]);        

        if(!_tooltipWidow) {
            _tooltipWidow = new TootipClass();
            const gtootip = svgContainer.append('g');
            const tipBox = gtootip.append('rect');
            const tooltipLine = gtootip.append('path');
            tipBox.attr('width', width)
            .attr('height', height)
            .attr('opacity', 0)
            
            .on('mousemove', function() {
                var _mousepoint = d3.mouse(tipBox.node());
                var _mouseX = _mousepoint[0];
                var _mouseY = _mousepoint[1];

                tooltipLine
                .attr('stroke', 'grey')
                .attr('d', 'M' + _mouseX + ',' + 0 + 'L' + _mouseX + ',' + height );

                const _date = x.invert(_mouseX);
                if (_date) {
                    var _modal = find(_date);
                    // console.log(_date);
                    // console.log(_modal.date);
                    // console.log(d3.select(objId).style('left'));
                    _tooltipWidow.update(_modal);
                    _tooltipWidow.show(true,_mouseX,_mouseY);
                } 
            })
            .on('mouseout', function () {
                if (_tooltipWidow) _tooltipWidow.show(false);
                if (tooltipLine) tooltipLine.attr('stroke', 'none');
            });
        }

        // console.log('log   1');
        // debugger;
        // Add the X Axis
        if (!_axisX) {
            _axisX = svgContainer.append('g')
            .attr('transform', 'translate(0,' + height + ')');
        }
        
        // _axisX.selectAll('*').remove();
        var xAxis = d3.axisBottom().scale(x);
        xAxis.ticks(10)
       .tickFormat(d3.timeFormat('%Y-%m-%d'));
        _axisX.call(xAxis);

        // console.log('log   2');        
        // debugger;
        if (!_axisYs) _axisYs = [];
        if (!_axisYs_Content) _axisYs_Content = [];
        var _axis = null;
        // Add the valueline0 path.
        if (_axisYs_Content.length === 0) {
            _axis = svgContainer.append('path')
            .attr('fill', 'none')
            .style('stroke', _y0Color)
            .style('stroke-width', 2);
            _axisYs_Content.push(_axis);
        } 
        else _axis = _axisYs_Content[0];

        _axis.data([_dataJson])
        .attr('d', valueline);
        // console.log('log   3');
        
        // Add the valueline1 path.
        if (_axisYs_Content.length === 1) {
            _axis = svgContainer.append('path')
            .attr('fill', 'none')
            .style('stroke', _y1Color)        
            .style('stroke-width', 2);
            _axisYs_Content.push(_axis);
        } 
        else _axis = _axisYs_Content[1];
        _axis.data([_dataJson])
        .attr('d', valueline2);

        // Add the Y0 Axis
        if (_axisYs.length === 0) {
            _axis = svgContainer.append('g')
            .attr('fill', _y0Color)
            .attr('stroke', _y0Color);
            
            _axisYs.push(_axis);
        }
        else _axis = _axisYs[0];
        _axis.call(d3.axisLeft(y0));

        // Add the Y1 Axis
        if (_axisYs.length === 1) {
            _axis = svgContainer.append('g')
            .attr('transform', 'translate( ' + width + ', 0 )')            
            .attr('fill', _y1Color)
            .attr('stroke', _y1Color) ;
            
            _axisYs.push(_axis);
        }
        else _axis = _axisYs[1];

        _axis.call(d3.axisRight(y1));
    }
}
