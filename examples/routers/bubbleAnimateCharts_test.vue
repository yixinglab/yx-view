<template>
    <div>
    <div><el-button type="danger" size="small" @click="onReplace1"><i class="el-icon-document el-icon--left"></i>All Grants</el-button>
        <el-button type="danger" size="small" @click="onReplace2"><i class="el-icon-document el-icon--left"></i>Grants By Year</el-button></div>
        <YxBubbleAnimateCharts 
        :dataItems="dataItems"
        :dataItemsHeader = "dataItemsHeader"
        :displayStatus="displayStatus"
        width="800px" 
        height="600px"
        :onClick = "onClick"> </YxBubbleAnimateCharts> 
    </div>
</template>
<script>
    import dataj from './bubbledata.json';
    export default {
        data() {
            return {
                dataItems: [],
                dataItemsHeader: [],
                displayStatus: ''
            };
        },
        mounted() {
            this.dataItems = this.filterData();
            this.dataItemsHeader = this.filterDataHeader();
        },
        methods: {
            onClick: function (item, pos) {
                //pos = left  mid   right
                alert(pos + "   " + item.name);
            },
            filterData: function() {
                var aarr = [];
                dataj.forEach(function(d){
                    // debugger;
                    if (d.parrentid > 0) {
                        var ddd = d;
                        dataj.forEach(function(p){
                            if (p.parrentid < 0 && ddd.parrentid === p.id) {
                                ddd.parrentname = p.name;
                                // break;
                            }
                        });
                        aarr.push(d);
                    }
                });
                return aarr;
            },
            filterDataHeader: function() {
                var aarr = [];
                dataj.forEach(function(p){
                    if (p.parrentid < 0) {
                        aarr.push(p);
                    }
                });
                return aarr;
            },
            onReplace1: function() {
                this.displayStatus = "";
            },
            onReplace2: function() {
                this.displayStatus = "year";
            }
        }
    }
</script>