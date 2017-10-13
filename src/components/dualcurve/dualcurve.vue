<template>
<div>
    <div id="yx_dashboard_2458973_10" :style="'width:'+ width +';height:' + height"></div>
</div>
</template>
<script>
    import YXDualcurveChart from './dualcurve.js';
    let _yxDualcurveChart = null;
    export default {
        name: 'YxDualcurve',
        props: {
            dataModal1: {
                type: Array,
                default: function(){
                    return [];
                }
            },
            dataModal2: {
                type: Array,
                default: function(){
                    return [];
                }
            },
            background: {
                type: [String, Number],
                default: "rgba(51,51,51,0.0)"
            },
            axisBottomClass: {
                type: [String, Number],
                default: "axisExample"
            },
            axisLeftClass: {
                type: [String, Number],
                default: "axisExample"
            },
            axisRightClass: {
                type: [String, Number],
                default: "axisExample"
            },
            axisLeftContentClass: {
                type: [String, Number],
                default: "axisExample1"
            },
            axisRightContentClass: {
                type: [String, Number],
                default: "axisExample1"
            },
            width: {
                type: [String, Number],
                default: "420px"
            },
            height: {
                type: [String, Number],
                default: "500px"
            },
            onClick: Function
        },
        mounted() {
            this.init();
        },
        watch: {  
            'dataModal1': 'onChange',
            'dataModal2': 'onChange',
        },
        methods: {
            init: function() {
                _yxDualcurveChart = new YXDualcurveChart('#yx_dashboard_2458973_10');
                _yxDualcurveChart.setBackground(this.background);
                _yxDualcurveChart.setAxisClass(this.axisBottomClass,this.axisLeftClass,this.axisRightClass,this.axisLeftContentClass,this.axisRightContentClass);
                _yxDualcurveChart.setConfig(this.dataModal1,this.dataModal2);
            },
            onChange: function() {
                _yxDualcurveChart.setAxisClass(this.axisBottomClass,this.axisLeftClass,this.axisRightClass,this.axisLeftContentClass,this.axisRightContentClass);
                _yxDualcurveChart.setConfig(this.dataModal1,this.dataModal2);
            }
        }
    }
</script>
<style> /* set the CSS */

.grid line {
    stroke: lightgrey;
    stroke-opacity: 0.7;
    shape-rendering: crispEdges;
}

.grid path {
    stroke-width: 0;
}
.axisExample1{
    stroke: red;
    fill: none;
    stroke-width: 3;
}
.axisExample line{
  stroke: red;
}

.axisExample path{
   stroke: red;
}

.axisExample text{
  fill: red;
  font: bold 1em "宋体",Arial,Times;
}  
</style>
