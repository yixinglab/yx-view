<template>
    <div>
        <div id='yx_dashboard_2458973_10' :style="'width:'+ width +';height:' + height"></div>
    </div>
</template>
<script>
    import YXDashBoad from './dashboard2.js';
    let _yxDashBoad = null;
    export default {
        name: 'YxMoneyFlowCharts',
        props: {
            dataItems: {
                type: Array,
                default: function(){
                    return [];
                }
            },
            background: {
                type: [String, Number],
                default: "rgba(51,51,51,0.0)"
            },
            startAngle: {
                type: [String, Number],
                default: 0
            },
            width: {
                type: [String, Number],
                default: "800px"
            },
            height: {
                type: [String, Number],
                default: "500px"
            },
            showshadow: {
                type: [Boolean, String, Number],
                default: false
            },
            onClick: Function
        },
        mounted() {
            this.init();
        },
        watch: {  
            'dataItems': 'onChange',
            'dataItems': {
                handler: function (newVal) {
                    // this.dataItems = newVal;
                    // console.log(newVal);
                    // console.log(this.dataItems);
                    this.onChange();
                },
                deep: true
            }
        },
        methods: {
            init: function() {
                _yxDashBoad = new YXDashBoad('#yx_dashboard_2458973_10', this.onClick);
                _yxDashBoad.setBackground(this.background);
                _yxDashBoad.setStartAngle(this.startAngle);
                _yxDashBoad.showShadow(this.showshadow==='true');
                _yxDashBoad.setConfig(this.dataItems);
            },
            onChange: function() {
                // debugger;
                _yxDashBoad.setStartAngle(this.startAngle);
                _yxDashBoad.showShadow(this.showshadow==='true');
                _yxDashBoad.setConfig(this.dataItems);
            }
        }
    }
</script>
