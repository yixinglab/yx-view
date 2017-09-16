/*!
 * Copyright (c) 2017, yx-view
 * All rights reserved.
 * bamai v0.0.1
 */
import * as d3 from 'd3';

export default function (id, callback) {
    this.getConfig = getConfig;
    this.setConfig = setConfig;
    this.setBackground = setBackground;

    var objId = id;
    // debugger;
    var _colorBorder = '#1E1E1E';    
    var _colorIn = '#C4352A'; // 现金
    var _colorOut = '#2E4F70'; // 支出
    var _colorInvestment = '#999999';  // 资产
    var _nameInvestment = '资产';  // 
    var _nameUnit = '单位：万';  // 
    var _nameIn = '收入';  // 
    var _nameOut = '支出';  // 

    var _durationTime = 500; //毫秒
    


    var _confMoneyflows = null;
    var _width = parseFloat(d3.select(id).style('width'));
    var _height = parseFloat(d3.select(id).style('height'));
    var _centerX = _width / 2.0;
    var _centerY = _height / 2.0 + 15;
    var _radius = _width < _height? _width / 2.0 : _height / 2.0;
    _radius = _radius / 4;
    var _unit = 10000; // 单位 万
    
    // d3.select(objId).style('background-color', '#333333');
    var svgDashboad = d3.select(objId).append('svg')
        .attr('width', _width)
        .attr('height', _height);
    var svgContainer = svgDashboad.append('g')
        .attr('transform', 'translate(' + _centerX + ',' + _centerY + ')');

    var _inited = false;
    var _objArrows = [];
    var _objCircles = [];
    var _objLabels = [];
    
    
    function setBackground(color =  '#333333') {
        d3.select(objId).style('background-color', color);
    }
    function setConfig(_conf) {
        if (_confMoneyflows === _conf) return;
        _confMoneyflows = _conf;
        if(_inited) reinit();
        else {
            _inited = true;
            init();
        }
    }
    function getConfig() {
        if (_confMoneyflows) {
            return _confMoneyflows;
        } else {
            _confMoneyflows = [
                {
                    'amount':963.19,
                    'tagid':3,
                    'tagid2':513,
                    'tagname2':'其他',
                    'date':'2015-11-30'
                },
                {
                    'amount':675.61,
                    'tagid':3,
                    'tagid2':511,
                    'tagname2':'POS机',
                    'date':'2015-11-30'
                },
                {
                    'amount':149.25,
                    'tagid':3,
                    'tagid2':511,
                    'tagname2':'POS机',
                    'date':'2015-11-30'
                },
                {
                    'amount':20258,
                    'tagid':3,
                    'tagid2':513,
                    'tagname2':'其他',
                    'date':'2015-11-30'
                },
                {
                    'amount':288,
                    'tagid':3,
                    'tagid2':512,
                    'tagname2':'保养卡',
                    'date':'2015-11-30'
                }
            ];
        }
    }
    // 获得一级标签
    function getTags() {
        var _tagsValue = [];
        var _tagsConf = getConfig();
       
        for (var _it = 0; _it < _tagsConf.length; _it++) {
            var _tag = _tagsConf[_it];
            var _exists = false;
            for( var _iv = 0; _iv < _tagsValue.length; _iv++) {
                var _tagMark = _tagsValue[_iv];
                if (_tag.tagid === _tagMark.tagid) {
                    if (_tag.amount > 0) {
                        _tagMark.amount += _tag.amount;
                    } else {
                        _tagMark.amount2 += _tag.amount;
                    }
                    _exists = true;
                    break;
                }
            }
            if (!_exists) {
                // debugger;
                var _amount = parseFloat(_tag.amount);
                var _datatag = {
                    'tagid': _tag.tagid,
                    'tagname': _tag.tagname? _tag.tagname:'其他'+_tag.tagid,
                    // 收入
                    'amount':_amount > 0? _amount : 0,
                    // 支出
                    'amount2':_amount < 0? _amount : 0
                };
                _tagsValue.push(_datatag);
            }
        }
        return _tagsValue;
    }
    function clear() {
        svgContainer.selectAll('*').remove();
    }
    function find(id,array) {
        for (var i=0;i<array.length;i++) {
            var _obj = array[i];
            if(_obj.attr('id') === id) return _obj;
        }
        return null;
    }
    function createArrow(id,len,rotate) {
        var datafuc = function(maxlen) {
            var _w = maxlen / 1.5;
            var _h = maxlen;

            var _pLeft0 = { x: -_w / 4.0, y: -_h};
            var _pLeft1 = { x: _w / 8.0, y: -_h * 2 / 3.0};
            var _pLeft2 = { x: -_w / 2.0, y: 0};

            var _pRight0 = { x: -_pLeft0.x, y: _pLeft0.y};
            var _pRight1 = { x: -_pLeft1.x, y: _pLeft1.y};
            var _pRight2 = { x: -_pLeft2.x, y: _pLeft2.y};
            
            return 'M' + _pLeft0.x + ',' + _pLeft0.y + 'L' + _pRight0.x + ',' + _pRight0.y + 
                    'Q' + _pRight1.x + ',' + _pRight1.y + ',' + _pRight2.x + ',' + _pRight2.y + 
                    'L' + _pLeft2.x + ',' + _pLeft2.y + 
                    'Q' + _pLeft1.x + ',' + _pLeft1.y + ',' + _pLeft0.x + ',' + _pLeft0.y;
        };
    
        var _angle = rotate / Math.PI * 180 + 90;
        var _arrowId = id;
        var _arrow = find(_arrowId,_objArrows);
        if(!_arrow) {
            // console.log('already:'+_arrowId);
            _arrow = svgContainer.append('path')
            .attr('id', _arrowId)
            .attr('d', datafuc(1))
            .attr('transform', 'rotate(' + _angle + ')')
            .style('fill','#5C5C5C');
            _objArrows.push(_arrow);
        }

        _arrow.transition()
        .duration(_durationTime)
        .attr('transform', 'scale(' + len + ')rotate(' + _angle + ')');
    }
    // //画圆形
    // function createCircle(centerx, centery, radius, color) {
    //     svgContainer.append('circle')
    //     .attr('cx',centerx)
    //     .attr('cy',centery)
    //     .attr('r', radius)
    //     .style('fill', color)
    //     .style('stroke','#1E1E1E');
    // }
    //画     圆形叶子
    function createLeafCircle(id,tag, toX, toY, fontsize,totalAmount, totalAmount2) {
        var _r = _radius;
        if (totalAmount && totalAmount2) {
            var _maxScale = 1.25;
            var _minScale = 0.75;
            var _scale = Math.abs(tag.amount / totalAmount);
            var _scale2 = Math.abs(tag.amount2 / totalAmount2);
            if (_scale < _scale2) _scale = _scale2;
            if (_scale > _maxScale) {
                _r = _radius * _maxScale;
            }
            else {
                if (_scale < _minScale) {
                    _r = _radius * _minScale;
                }
                else {
                    _r = _radius * _scale;
                }
            }
        }


        // svgContainer.append('circle')
        // // .attr('cx',_centerX)
        // // .attr('cy',_centerY)
        // .attr('r', _r)
        // .style('fill','#2E4F70')
        // .style('stroke','#1E1E1E')
        // .transition()
        // .duration(_durationTime)
        // .attr('transform', 'translate(' + toX + ',' + toY + ')');
        
       

        var isTwo = true;
        if(Math.abs(tag.amount) > _unit && Math.abs(tag.amount2) > _unit) {
            isTwo = true;
        }
        else isTwo = false;

        var _arc = null;
        var _startAngle = 0;
        var _endAngle = 0;
        var _value = Math.abs(parseInt(tag.amount / _unit));
        var _value2 = Math.abs(parseInt(tag.amount2 / _unit));        
        var _cirle = find(id,_objCircles);
        if(!_cirle) {
            _cirle = svgContainer.append('g').attr('id',id);
            if(id != '0') _objCircles.push(_cirle);
            _cirle.append('g');// circle

            _cirle.append('text')
            .attr('id', 'ctext_'+id)                    
            .attr('fill','#FFFFFF')
            .attr('font-size',fontsize)
            .attr('font-family','simsun')
            .attr('font-weight','bold')
            .attr('text-anchor', 'middle')
            .text(0);
            _cirle.append('text')
            .attr('id', 'ctext2_'+id)
            .attr('fill','#FFFFFF')
            .attr('font-size',fontsize)
            .attr('font-family','simsun')
            .attr('font-weight','bold')
            .attr('text-anchor', 'middle')
            .text(0);
        }

        _cirle
        .on('click', function(){
            if (callback) callback(tag);
        })
        .transition()
        .duration(_durationTime)
        .attr('transform', 'translate(' + toX + ',' + toY + ')');

        var _gcircle = _cirle.selectAll('g');
        _gcircle.selectAll('path').remove();
        if(Math.abs(tag.amount2) > _unit) {
            if (isTwo) {
                _startAngle = -Math.PI / 2;
                _endAngle = Math.PI / 2;
            }
            else {
                _startAngle = 0;
                _endAngle = Math.PI * 2;
            }
            var  _color = _colorOut;
            // if (tag.tagname === _nameInvestment) {
            //     _color = _colorInvestment;
            // }
            _arc = d3.arc()
                .startAngle(_startAngle)
                .endAngle(_endAngle)
                .innerRadius(0)
                .outerRadius(_r);

            _gcircle.append('path')
                .attr('d',_arc)
                .style('stroke',_colorBorder)
                // .style('stroke-opacity', 0.5)
                // .style('stroke-width', 1)
                .style('fill',_color);
        }
            
        if(Math.abs(tag.amount) > _unit) {
            if (isTwo) {
                _startAngle = Math.PI / 2;
                _endAngle = Math.PI *3 / 2;
            }
            else {
                _startAngle = 0;
                _endAngle = Math.PI * 2;
            }
            _color = _colorIn;
            if (tag.tagname === _nameInvestment) {
                _color = _colorInvestment;
            }
            _arc = d3.arc()
                .startAngle(_startAngle)  
                .endAngle(_endAngle) 
                .innerRadius(0)  
                .outerRadius(_r); 
            _gcircle.append('path')     
                .attr('d',_arc)
                .style('stroke', _colorBorder)
                // .style('stroke-opacity', 0.5)
                // .style('stroke-width', 1)
                .style('fill', _color);
        }


        _cirle.selectAll('text')
        .transition()
        .duration(_durationTime)
        .on('start', function repeat() {
            d3.active(this)
                .tween('text', function() {
                    var _tY = 0;
                    var that = d3.select(this);
                    var texid = that.attr('id');
                    if (texid === 'ctext_'+id) {
                        if (isTwo) {
                            _tY = fontsize / 8.0 + _r / 2;
                        }
                        else {
                            _tY = fontsize / 2;                
                        }
                        if (_value > 0) that.style('display','');
                        else that.style('display','None');
                    } else {
                        // debugger;
                        if (isTwo) {
                            _tY = fontsize / 2 - _r / 2;
                        }
                        else {
                            _tY = fontsize / 2;                
                        }
                        if (_value2 > 0) that.style('display','');
                        else that.style('display','None');
                    }
                    return function(t) {
                        if (texid === 'ctext_'+id) {
                            that.attr('y', _tY).text(parseInt(_value * t + 0.5));
                        } else {
                            that.attr('y', _tY).text(parseInt(_value2 * t + 0.5));
                        }
                    };
                })
                .on('end', repeat);
        });
        return _r;
    }
    //画圆形
    function createTextLabel(id, toX, toY, fontsize, text='') {
        var _textLabel = find(id,_objLabels);
        if(!_textLabel) {
            _textLabel = svgContainer.append('g').append('text') 
            // .attr('x',_centerX)
            .attr('id', id)  
            .attr('fill','#888888')  
            .attr('font-size',fontsize)  
            .attr('font-family','simsun')  
            .attr('font-weight','bold')
            .attr('text-anchor', 'middle')                
            .text(text);
            
            _objLabels.push(_textLabel);
        }

        _textLabel.transition()
        .duration(_durationTime)
        .attr('transform', 'translate(' + toX + ',' + toY + ')');
    }
    function createLegend() {
        var _margin = 12;
        var _legendWidth = 75;
        var _legendHeight = 100;
        var _fontsize = 13;
        var _fontcolor = '#C8C8C8';
        var svgLegendContainer = svgDashboad.append('g')
            .attr('transform', 'translate(' + (_width - _legendWidth - _margin) + ',' + _margin + ')');
        
        var _r = _fontsize / 1.75;
        
        svgLegendContainer.append('rect')
            .attr('width', _legendWidth)
            .attr('height', _legendHeight)
            .attr('rx', 5)
            .attr('ry', 5)
            .style('fill', '#292929');

        svgLegendContainer.append('circle')
            .attr('cx', _r + _margin)
            .attr('cy', _margin + _r)
            // .attr('transform', 'translate(' + (_r + _margin) + ',' + (_fontsize + _margin)  + ')')
            .attr('r', _r)
            .style('fill', _colorIn)
            .style('stroke',_colorBorder);
        var _text = svgLegendContainer.append('text')
            .attr('x', _r + _margin * 2)
            .attr('y', _fontsize + _margin - 2)
            .attr('fill', _fontcolor)  
            .attr('font-size',_fontsize)  
            .attr('font-family','simsun')  
            .attr('font-weight','bold')
            .attr('text-anchor', 'left')                
            .text(_nameIn);
        
        if (callback) _text.on('click', function(){
            var _datatag = {
                'tagid': 1,
                'tagname': '其他',
                // 收入
                'amount': 1,
                // 支出
                'amount2': -1
            };
            callback(_datatag);
        });//.on('click', callback(_datatag)); 

        
        var curV = 1.5;
        svgLegendContainer.append('circle')
            .attr('cx', _r + _margin)
            .attr('cy', _margin + _r + (_margin / curV + _fontsize) * 1)
            // .attr('transform', 'translate(' + (_r + _margin) + ',' + (_fontsize + _margin)  + ')')
            .attr('r', _r)
            .style('fill', _colorOut)
            .style('stroke',_colorBorder);
        svgLegendContainer.append('text') 
            .attr('x', _r + _margin * 2)
            .attr('y', _fontsize + _margin - 2 + (_margin / curV + _fontsize) * 1)
            .attr('fill', _fontcolor)  
            .attr('font-size',_fontsize)  
            .attr('font-family','simsun')  
            .attr('font-weight','bold')
            .attr('text-anchor', 'left')                
            .text(_nameOut);

        svgLegendContainer.append('circle')
            .attr('cx', _r + _margin)
            .attr('cy', _margin + _r + (_margin / curV + _fontsize) * 2)
            // .attr('transform', 'translate(' + (_r + _margin) + ',' + (_fontsize + _margin)  + ')')
            .attr('r', _r)
            .style('fill', _colorInvestment)
            .style('stroke',_colorBorder);
        svgLegendContainer.append('text') 
            .attr('x', _r + _margin * 2)
            .attr('y', _fontsize + _margin - 2 + (_margin / curV + _fontsize) * 2)
            .attr('fill', _fontcolor)  
            .attr('font-size',_fontsize)  
            .attr('font-family','simsun')  
            .attr('font-weight','bold')
            .attr('text-anchor', 'left')                
            .text(_nameInvestment);

        svgLegendContainer.append('text') 
            .attr('x', _margin)
            .attr('y', _fontsize + _margin - 2 + (_margin / curV + _fontsize) * 3)
            .attr('fill', _fontcolor)  
            .attr('font-size',_fontsize)  
            .attr('font-family','simsun')  
            .attr('font-weight','bold')
            .attr('text-anchor', 'left')                
            .text(_nameUnit);
    }
    // 初始化
    function init() {
        clear();
        createLegend();

        reinit();
    }
    function reinit() {
        var _r = _radius * 2.5; 
        var _tags = getTags();
        
        var _len = 0;
        var _totalAmount = 0;
        var _totalAmount2 = 0;
        for (var i = 0; i < _tags.length; i++) {
            var _tag = _tags[i];
            if (_tag.amount < 1 * _unit && _tag.amount2 > -1 * _unit) continue; 
            _len += 1;

            _totalAmount += _tag.amount;
            _totalAmount2 += _tag.amount2;
        }
        // debugger;
        for (i=0;i<_objArrows.length;i++){
            var _objarrow = _objArrows[i];
            var _objcircle= _objCircles[i];
            var _objtext = _objLabels[i];
            var _existsArrow = false;
            var _existsCircle = false;
            var _existsLabel = false;
            for (var j = 0; j < _len; j++) {
                _tag = _tags[j];
                var _arrowid = 'arrow_' + _tag.tagid;
                var _circleid = 'circle_' + _tag.tagid;
                var _textlabelid = 'textlabel_' + _tag.tagid;
                if (_textlabelid === _objtext.attr('id')) {
                    _existsLabel = true;
                }
                if (_circleid === _objcircle.attr('id')) {
                    _existsCircle = true;
                }
                if (_arrowid === _objarrow.attr('id')) {
                    _existsArrow = true;
                    break;
                }
            }
            if (!_existsArrow) {
                _objarrow
                // .style('display','None')
                .transition()
                .duration(_durationTime)
                .attr('transform', 'scale(1)rotate(0)');
            }

            if (!_existsCircle) {
                _objcircle
                // .style('display','None')
                .transition()
                .duration(_durationTime)
                .attr('transform', 'translate(0,0)');
            }

            if (!_existsLabel) {
                _objtext
                // .style('display','None')
                .transition()
                .duration(_durationTime)
                .attr('transform', 'translate(0,0)');
            }
        }


        for (i = 0; i < _len; i++) {
            _tag = _tags[i];
            if (_tag.amount < 1 * _unit && _tag.amount2 > -1 * _unit) continue; 
            
            var _angle = 1.0 * i * (1.0 / _len) * Math.PI * 2.0 - Math.PI / 2.0;
            _arrowid = 'arrow_' + _tag.tagid;
            createArrow(_arrowid,_r, _angle);
        }

        var _fontsize = 14;
        createLeafCircle('0',{'tagname': '企业', 'amount':_totalAmount, 'amount2':_totalAmount2},0, 0,_fontsize + 6);
        for (i = 0; i < _len; i++) {
            _tag = _tags[i];
            if (_tag.amount < 1 * _unit && _tag.amount2 > -1 * _unit) continue; 
            
            _angle = 1.0 * i * (1.0 / _len) * Math.PI * 2.0 - Math.PI / 2.0;
            var _curX =  _r * Math.cos(_angle);
            var _curY =  _r * Math.sin(_angle);
            _circleid = 'circle_' + _tag.tagid;
            var _rradius = createLeafCircle(_circleid,_tag ,_curX, _curY, _fontsize + 6, _totalAmount, _totalAmount2);
                
            var _rtext = _fontsize * _tag.tagname.length;
            if (i == 0) _rtext = _fontsize;
            _curX = (_r + _rradius + _rtext) * Math.cos(_angle);
            _curY = (_r + _rradius + _rtext) * Math.sin(_angle);
            _textlabelid = 'textlabel_' + _tag.tagid;
            createTextLabel(_textlabelid ,_curX, _curY, _fontsize, _tag.tagname);
        }
    }
}
