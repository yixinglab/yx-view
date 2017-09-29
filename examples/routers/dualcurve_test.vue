<template>
    <div>
        <button type="button" @click="onReplace1">替换数据1</button>
        <button type="button" @click="onReplace2">替换数据2</button>
        <YxDualcurve :dataModal1="dataItems1" :dataModal2="dataItems2" :onClick="onClick" width="814px" height="500px" background="#FFFFFF"> </YxDualcurve>   
    </div>
</template>
<script>
    import dualcurvedata from './dualcurve_data.json';
    export default {
        data() {
            return {
                dataItems1: [],
                dataItems2: []
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