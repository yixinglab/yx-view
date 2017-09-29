<template>
    <div>
        <div id='yx_dashboard_2458973_9' :style="'width:'+ width +';height:' + height"></div>
    </div>
</template>
<script>
    import YXDashBoad from './dashboard2.js';
    let _yxDashBoad = null;
    export default {
        name: 'YxDashboard',
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
            onClick: Function
        },
        mounted() {
            this.init();
        },
        watch: {  
            'dataItems': 'onChange',
        },
        methods: {
            init: function() {
                _yxDashBoad = new YXDashBoad('#yx_dashboard_2458973_9', this.onClick);
                _yxDashBoad.setBackground(this.background);
                _yxDashBoad.setStartAngle(this.startAngle);
                _yxDashBoad.setConfig(this.dataItems);
            },
            onChange: function() {
                // debugger;
                _yxDashBoad.setStartAngle(this.startAngle);
                _yxDashBoad.setConfig(this.dataItems);
            }
        }
    }
</script>
