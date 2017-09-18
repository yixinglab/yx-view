<template>
    <div>
        <YxBarTwoDirection 
        :dataItems="dataItems" 
        width="400px" 
        height="400px" 
        midwidth="75px" 
        ticksVisible=false 
        background="#FCFCFC"
        midclass="midclass"
        leftclass="leftclass"
        rightclass="rightclass"
        leftfontclass="leftfontclass"
        rightfontclass="rightfontclass"

        :onClick = "onClick"
        > </YxBarTwoDirection> 
    </div>
</template>
<script>
    export default {
        data() {
            return {
                dataItems: [
                        { name: '中国', value: 121, value2: 121 },
                        { name: '俄罗斯', value: 218, value2: 218 },
                        { name: '日本', value: 516, value2: 516 },
                        { name: '朝鲜', value: 123, value2: 123 },
                        { name: '韩国', value: 342, value2: 342 },
                        { name: '越南', value: 125, value2: 125 },
                        { name: '泰国', value: 136, value2: 136 },
                        { name: '新加坡', value: 154, value2: 154 }
                    ]
            };
        },
        methods: {
            onClick: function (item, pos) {
                //pos = left  mid   right
                alert(pos + "   " + item.name);
            }
        }
    }
</script>
<style lang='less'>
    .midclass {
        fill: #FF0000;
        font-size: 18px;
        font-weight:bold;
        stroke: #000000;
        stroke-width: 1px;
        cursor: pointer;
    }
    .midclass:hover {
        fill: lighten(#000000, 30%);
    }
    .leftclass {
        fill: blue;
    }
    .leftclass:hover {
        fill: lighten(#437cc7, 15%);
    }
    .rightclass {
        fill: green;
    }
    .rightclass:hover {
        fill: lighten(#437cc7, 15%);
    }
   
    .leftfontclass {
        fill: #FF0000;
    }
    .leftfontclass:hover {
        fill: lighten(#ffffff, 30%);
    }
    .rightfontclass {
        fill: #0000FF;
    }
    .rightfontclass:hover {
        fill: lighten(#ffffff, 30%);
    }
</style>