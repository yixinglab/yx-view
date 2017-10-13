<template>
    <div>
        <button type="button" @click="onReplace1">替换数据1</button>
        <button type="button" @click="onReplace2">替换数据2</button>
        <YxDualcurve :dataModal1="dataItems1" :dataModal2="dataItems2" 
        axisBottomClass="axisBottomClass"
        axisLeftClass="axisLeftClass"
        axisRightClass="axisRightClass"
        axisLeftContentClass="axisLeftContentClass"
        axisRightContentClass="axisRightContentClass"
        :onClick="onClick" width="414px" height="400px" background="#FFFFFF"> </YxDualcurve>   
    </div>
</template>
<script>
    import dualcurvedata from './dualcurve_data.json';
    export default {
        data() {
            return {
                dataItems1: [],
                dataItems2: [],

            };
        },
        methods: {
            onClick: function(tag) {
                console.log(tag);
            },
            filterData: function(name0) {
                var arr = [];
                if (dualcurvedata.driving) {
                    dualcurvedata.driving.forEach(function(d){
                        // debugger;
                        if (d.name === name0) {
                            arr.push(d);
                        }
                    });
                }
                return arr;
            },
            onReplace1: function() {
                var _data1 = this.filterData( '低价值客户');
                var _data2 = this.filterData('投诉率');
                this.dataItems1 = _data1;
                this.dataItems2 = _data2;
            },
            onReplace2: function() {
                var _data1 = this.filterData( '高价值客户');
                var _data2 = this.filterData('正价单比率');
                this.dataItems1 = _data1;
                this.dataItems2 = _data2;         
            }
        }
    }
</script>
<style> /* set the CSS */

.axisLeftContentClass{
    stroke: darkred;
    fill: none;
    stroke-width: 2;
}
.axisLeftContentClass_L{
    fill: darkred;
    font-size: 12px;
    font-family: '宋体';
}
.axisRightContentClass{
    stroke: lightsteelblue;
    fill: none;
    stroke-width: 2;
}
.axisRightContentClass_L{
    fill: lightsteelblue;
    font-size: 12px;
    font-family: '宋体';
}


.axisBottomClass line{
  stroke: lightgray;
}

.axisBottomClass path{
   stroke: lightgray;
}

.axisBottomClass text{
  fill: lightgray;
  font: bold 1em "宋体",Arial,Times;
}


.axisLeftClass line{
  stroke: darkred;
}

.axisLeftClass path{
   stroke: darkred;
}

.axisLeftClass text{
  fill: darkred;
  font: bold 1em "宋体",Arial,Times;
}  

.axisRightClass line{
  stroke: lightsteelblue;
}

.axisRightClass path{
   stroke: lightsteelblue;
}

.axisRightClass text{
  fill: lightsteelblue;
  font: bold 1em "宋体",Arial,Times;
}
</style>