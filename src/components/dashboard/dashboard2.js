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
    this.setStartAngle = setStartAngle;

    var objId = id;
    // debugger;
    var _angleStart = 0; //单位 度
    var _colorBackground = '#ffffff';    
    
    var _durationTime = 500; //毫秒
    
    var _conf = null;
    var _width = parseFloat(d3.select(id).style('width'));
    var _height = parseFloat(d3.select(id).style('height'));
    var _centerX = _width / 2.0;
    var _centerY = _height / 2.0;
    var _radius = _width < _height? _width : _height;
    _radius -= 10;
    // r + r + 0.6r = _radius / 2
    _radius = _radius / 5.2;
    var _radiusLeaf = _radius * 0.6;
    
    // var _unit = 10000; // 单位 万
    
    var selectCircle = null;
    var selectCircleShow = false;

    var svgDashboad = d3.select(objId).append('svg')
        .on('click', function(){
            if(selectCircleShow) {
                selectCircleShow = false;
                return;
            }
            select(0 , 0 ,_radius , false);
        })
        .attr('width', _width)
        .attr('height', _height);
    
    initFilter();
    var svgContainer = svgDashboad.append('g')
        .attr('transform', 'translate(' + _centerX + ',' + _centerY + ')');


    function setBackground(color =  '#333333') {
        _colorBackground = color;
        d3.select(objId).style('background-color', _colorBackground);
    }
    function setStartAngle(angle =  0) {
        _angleStart = angle;
    }
    function setConfig(conf) {
        // if (_conf === conf) return;
        _conf = conf;
        init();
    }
    function getConfig() {
        return _conf;
    }
    function clear() {
        svgContainer.selectAll('*').remove();
    }

    function ctreateCenter(_r, tag){
        // svgContainer.selectAll('circle').remove();
        var _g = svgContainer.append('g');

        _g.append('circle')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r', 0)
        .style('stroke',tag.stroke)            
        .style('fill',_colorBackground)
        .transition()
        .duration(_durationTime)
        .attr('r', _r * 2);

        _g.append('circle')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r', 0)
        .style('stroke',tag.stroke)            
        .style('fill',tag.fill)
        .attr('filter', 'url(#f1)')
        .transition()
        .duration(_durationTime)
        .attr('r', _r);

        _g.append('text')
        .attr('y', - tag.fontsizetitle)
        .attr('fill',tag.fontcolortitle)  
        .attr('font-size',tag.fontsizetitle)  
        .attr('font-family','simsun')  
        .attr('font-weight','bold')
        .attr('text-anchor', 'middle')                
        .text(tag.tagname);

        _g.append('text')
        .attr('y', tag.fontsize / 2)
        .attr('fill',tag.fontcolor)  
        .attr('font-size',tag.fontsize)  
        .attr('font-family','simsun')  
        .attr('font-weight','bold')
        .attr('text-anchor', 'middle')                
        .text(tag.amount>0?'+'+tag.amount:tag.amount);

        _g.on('click', function() {
            selectCircleShow = true;
            select(0 , 0 ,_radius , selectCircleShow);
            if (callback) callback(null);
        });
    }
    //画  圆形叶子
    function createLeaf(r, toX, toY, tag) {
        var _g = svgContainer.append('g');
        _g.append('circle')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r', r)
        .attr('filter', 'url(#f1)')
        .style('stroke',tag.stroke)            
        .style('fill',tag.fill);

        _g.on('click', function() {
            selectCircleShow = true;
            select(toX , toY ,r , selectCircleShow);
            if (callback) callback(tag);
        })
        .transition()
        .duration(_durationTime)
        .attr('transform', 'translate(' + toX + ',' + toY + ')');

        if (tag.icon) {
            _g.append('g')
            .attr('transform', 'translate(-' + (tag.fontsizetitle-2)+ ',-' + tag.fontsizetitle + ')rotate(180)')
            .append('path')  
            .attr('d',tag.icon)
            .attr('transform', 'scale(0.017)')    
            .style('fill', tag.fontcolortitle);
        }
       
        _g.append('text')
        .attr('x', 6)
        .attr('y', -tag.fontsizetitle-2)
        .attr('fill',tag.fontcolortitle)  
        .attr('font-size',tag.fontsizetitle)  
        .attr('font-family','simsun')  
        .attr('text-anchor', 'middle')                
        .text(tag.tagname);

        var _y = 0;
        if (tag.amount2 && tag.amount2!==0){
            _y = tag.fontsize2 / 2;
            _g.append('text')
            .attr('y', _y)
            .attr('fill',tag.fontcolor2)  
            .attr('font-size',tag.fontsize2)  
            .attr('font-family','simsun')  
            .attr('font-weight','bold')
            .attr('text-anchor', 'middle')                
            .text(tag.amount2>0?'+'+tag.amount2:tag.amount2);
        }
        
        if (tag.amount && tag.amount!==0){
            if (_y === 0) _y = tag.fontsize / 2;
            else _y += tag.fontsize + 2;
            _g.append('text')
            .attr('y', _y)
            .attr('fill',tag.fontcolor)  
            .attr('font-size',tag.fontsize)  
            .attr('font-family','simsun')  
            .attr('font-weight','bold')
            .attr('text-anchor', 'middle')                
            .text(tag.amount>0?'+'+tag.amount:tag.amount);
        }
    }
    function initFilter() {
        /**<defs>
    <filter id="f1" x="0" y="0" width="200%" height="200%">
      <feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" />
      <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    </filter>
  </defs> */
        var blurSize = 1;
        var _filter = svgDashboad.append('defs').append('filter')
            .attr('id', 'f1')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', '150%')
            .attr('height', '150%')
            ;

        _filter.append('feOffset')
        .attr('result', 'offset3')
        .attr('in', 'SourceAlpha')
        .attr('dx', blurSize)
        .attr('dy', blurSize)
        ;

        _filter.append('feGaussianBlur')
        .attr('result', 'blur3')
        .attr('in', 'offOut')
        .attr('stdDeviation', blurSize )
        ;

        /**<feColorMatrix in="SourceAlpha" type="matrix"
  values="-1 0 0 0 1, 0 -1 0 0 1, 0 0 -1 0 1, 0 0 0 1 0"
  result="matrix"/> */

        // _filter.append('feColorMatrix')
        // .attr('result', 'matrix')
        // .attr('in', 'SourceGraphic')
        // .attr('type', 'matrix')
        // .attr('values', '-1 0 0 0 1, 0 -1 0 0 1, 0 0 -1 0 1, 0 0 0 1 0')
        // ;

        _filter.append('feBlend')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'blur3')
        // x="-10" width="160"
        // .attr('x', -1000)
        // .attr('width', 100)
        .attr('mode', 'screen')
        ;
    }
    // 初始化
    function init() {
        clear();
        reinit();
        select(0 , 0 ,_radius , false);
    }
    function select(x, y , r ,show = true) {
        if (!selectCircle) {
            selectCircle = svgContainer.append('circle')
            .style('opacity',0.2)
            .style('fill','#FFA500');
        }
        selectCircle.attr('r', r + r / 6);

        if (show) selectCircle.style('display','');
        else selectCircle.style('display','none');
        
        selectCircle.attr('transform', 'translate(' + x + ',' + y + ')');
    }
    function reinit() {
        var _tags = getConfig();
        
        var _len = _tags.length;
        if (_len === 0) return;
        var _angle = 0;
        ctreateCenter(_radius, _tags[0]);
        // debugger;
        for (var j = 1; j < _len; j++) {
            var _tag = _tags[j];
            var i = j - 1;
                        
            _angle = 1.0 * i * (1.0 / (_len-1)) * Math.PI * 2.0 - Math.PI / 2.0;
            _angle += _angleStart / 180 * Math.PI;
            var _curX =  _radius * 2 * Math.cos(_angle);
            var _curY =  _radius * 2 * Math.sin(_angle);

            createLeaf(_radiusLeaf, _curX, _curY,_tag);
        }
    }
}
