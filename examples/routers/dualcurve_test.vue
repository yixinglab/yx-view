<template>
    <div>
     <div><el-button type="danger" size="small" @click="onReplace1"><i class="el-icon-document el-icon--left"></i>替换数据1</el-button>
        <el-button type="danger" size="small" @click="onReplace2"><i class="el-icon-document el-icon--left"></i>替换数据2</el-button></div>
        <YxDualcurve :dataModal="dataItems" :onClick="onClick" width="814px" height="500px" background="#FFFFFF"> </YxDualcurve>   
    </div>
</template>
<script>
    import dualcurvedata from './dualcurve_data.json';
    export default {
        data() {
            return {
                dataItems: []
            };
        },
        methods: {
            onClick: function(tag) {
                console.log(tag);
            },
            filterData: function(name0, name1) {
                var arr = [];
                if (dualcurvedata.driving) {
                    dualcurvedata.driving.forEach(function(d){
                        // debugger;
                        if (d.name === name0 && d.kpiGroup === name1) {
                            arr.push(d);
                        }
                    });
                }
                return arr;
            },
            onReplace1: function() {
                var _data = this.filterData('投诉率', 'primary');
                this.dataItems = _data;
            },
            onReplace2: function() {
                var _data = this.filterData('低价值客户', 'secondary');
                this.dataItems = _data;            
            }
        }
    }
</script>