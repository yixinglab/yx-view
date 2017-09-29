<template>
    <div id='bubbleanimatechart_20170920'></div>
</template>

<script>
    import bubbleChart from './bubble_chart.js';
    var yxbubbleChart_2017_786 = null;
    export default {
        name: 'YxBarTwoDirection',
        props: {
            dataItems: {
                type: Array,
                default: function(){
                    return [
                    ];
                }
            },
            dataItemsHeader: {
                type: Array,
                default: function(){
                    return [
                    ];
                }
            },
            displayStatus: {
                type: String,
                default: ""
            },
            background: {
                type: [String, Number],
                default: "rgba(51,51,51,0.0)"
            },
            width: {
                type: [String, Number],
                default: "800px"
            },
            height: {
                type: [String, Number],
                default: "500px"
            },
            midwidth: {
                type: [String, Number],
                default: "70px"
            },
            onClick: Function
        },
        watch: {  
            'dataItems': 'onChange',
            'displayStatus': 'onDisplay',
        },
        methods: {
            init: function() {
                if(!yxbubbleChart_2017_786) yxbubbleChart_2017_786 = new bubbleChart("#bubbleanimatechart_20170920", this.dataItemsHeader, this.dataItems, this.background, parseInt(this.width), parseInt(this.height));
            },
            onDisplay: function() {
                yxbubbleChart_2017_786.displayStatus(this.displayStatus);
            },
            onChange: function() {
                this.init();
                yxbubbleChart_2017_786.displayStatus(this.displayStatus);
            }
        }
    }
</script>

<style>
    .year {
        fill: #FFFFFF;
    }
    .textvalue2:hover {
        fill: lighten(#ffffff, 30%);
    }
    .axis text {
        display: none;
    }
</style>