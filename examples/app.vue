<style lang="less">
    @import "../src/styles/index.less";
</style>
<style scoped>
nav { margin-bottom: 40px; }
ul { display: flex; flex-wrap: wrap; }
li { display: inline-block; }
li + li { border-left: solid 1px #bbb; padding-left: 10px; margin-left: 10px; }
.container{ padding: 10px 40px; }
.routerview{ background: #6C6C6C; padding: 20px; }
.v-link-active { color: #bbb; }
</style>
<template>
    <div class="container">
        <nav>
            <ul>
                <li><router-link to="/uploadtest">上传uploadtest</router-link></li>
                <li><router-link to="/dashboardtest">流向图dashboardtest</router-link></li>
                <li><router-link to="/dualcurvetest">双轴曲线图dashboardtest</router-link></li>
                <li><router-link to="/barchart_twodirection">柱状图两个方向barchart_twodirection</router-link></li>
            </ul>
        </nav>
        <div>routerview container</div>
         <div class="routerview">
        <router-view></router-view>
    </div>
     </div>
</template>
<script>
    module.exports = {
        data: function() {
            return {

            }
        },
        mounted: function() {

        },
        beforeDestroy: function() {

        },
        methods: {

        }
    }
</script>
