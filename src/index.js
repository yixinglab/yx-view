import YxDashboard from './components/dashboard/dashboard.vue';
import YxMoneyFlowCharts from './components/dashboard/dashboard2.vue';
import YxDualcurve from './components/dualcurve/dualcurve.vue';
import YxBarTwoDirection from './components/barCharts/barTwoDirection.vue';
import YxBubbleAnimateCharts from './components/bubbleCharts/bubbleAnimateCharts.vue';


const yixinglab = {
    YxDashboard,
    YxMoneyFlowCharts,
    YxDualcurve,
    YxBarTwoDirection,
    YxBubbleAnimateCharts,
    // YxDataTable
};

const install = function (Vue) {
    Object.keys(yixinglab).forEach((key) => {
        Vue.component(key, yixinglab[key]);
    });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

module.exports = Object.assign(yixinglab, {install});   // eslint-disable-line no-undef
