import YxUpload from './components/upload/upload.vue';
import YxDashboard from './components/dashboard/dashboard.vue';

import locale from './locale';

const yixinglab = {
    YxUpload,
    YxDashboard
};

const install = function (Vue, opts = {}) {
    locale.use(opts.locale);
    locale.i18n(opts.i18n);

    Object.keys(yixinglab).forEach((key) => {
        Vue.component(key, yixinglab[key]);
    });

    // Vue.prototype.$Loading = LoadingBar;
    // Vue.prototype.$Message = Message;
    // Vue.prototype.$Modal = Modal;
    // Vue.prototype.$Notice = Notice;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

module.exports = Object.assign(yixinglab, {install});   // eslint-disable-line no-undef
