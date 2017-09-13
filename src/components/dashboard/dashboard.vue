<template>
    <div>
        <div id='yxdashboad' :data = "dataItems" :style="'width:'+ width +';height:' + height"></div>
    </div>
</template>
<script>
    import YXDashBoad from './dashboard.js';
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
                if (!_yxDashBoad) _yxDashBoad = new YXDashBoad('#yxdashboad', this.onClick);
                _yxDashBoad.setConfig(this.dataItems);
            },
            onChange: function() {
                // debugger;
                _yxDashBoad.setConfig(this.dataItems);
            }
        }
    }
</script>
