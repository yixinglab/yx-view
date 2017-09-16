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
                // debugger;
                // console.log('3333');
                _yxDualcurveChart = new YXDualcurveChart('#yx_dashboard_2458973_10');
                _yxDualcurveChart.setBackground(this.background);
                _yxDualcurveChart.setConfig(this.dataModal1,this.dataModal2);
            },
            onChange: function() {
                _yxDualcurveChart.setConfig(this.dataModal1,this.dataModal2);
            }
        }
    }
</script>
