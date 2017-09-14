<template>
    <div>
        <div><el-button type="danger" size="small" @click="onReplace1"><i class="el-icon-document el-icon--left"></i>替换数据1</el-button>
        <el-button type="danger" size="small" @click="onReplace2"><i class="el-icon-document el-icon--left"></i>替换数据2</el-button></div>
        <YxDashboard :dataItems="dataItems" :onClick="onClick" width="414px" height="400px">
        </YxDashboard>
        
    </div>
</template>
<script>
    import dashboaddata from './dashboard_data.json';
    export default {
        data() {
            return {
                dataItems: dashboaddata
            };
        },
        methods: {
            onClick: function(tag) {
                console.log(tag);
            },
            onReplace1: function() {
                let _data = [];
                for (var i = 0; i < dashboaddata.length; i++) {
                    if (i % 2 === 1) continue;
                    if (i > 1500) continue;
                    _data.push(dashboaddata[i]);
                }
                this.dataItems = _data;
            },
            onReplace2: function() {
                this.dataItems = dashboaddata;
            }
        }
    }
</script>