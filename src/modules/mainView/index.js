var Vue = require('vue');
var template = require('./main-view.html');
var eventHelper = require('../../utils/eventHelper');
var moduleController = require('controllers/moduleController');
var serviceHelper = require('../../services/serviceHelper');
//引入组件
var user= require('modules/user');
var routingInspection= require('modules/routingInspection');
var draftDetail= require('modules/draftDetail');
var uploadDetail= require('modules/uploadDetail');
var myMessage= require('modules/myMessage');
var districtInfo= require('modules/districtInfo');
//注册组件
var components = {
    'user':user,
    'routing-inspection':routingInspection,
    'draft-detail':draftDetail,
    'upload-detail':uploadDetail,
    'my-message':myMessage,
    'district-info':districtInfo
};
//components = $.extend(components, moduleController);
var userTemplate = '';
for (var key in moduleController) {
    var newKey = key.toLowerCase();
    components[newKey] = moduleController[key];
    userTemplate += '<' + newKey + '>' + '</' + newKey + '>';
}
template = template.replace('@@', userTemplate);
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isLoading: false,
            currentView: '',
            isLoginSuccess: false
        }
    },
    methods: {
        changeView: function (view) {
            this.currentView = view;
            // clearTimeout(this.changeViewTimer);
            // this.changeViewTimer = setTimeout(function () {
            //     if (!!components[view.menuurl.toLowerCase()]) {
            //         this.currentView = view.menuurl.toLowerCase();
            //         eventHelper.emit('change-menu-success', view);
            //     } else {
            //         eventHelper.emit(view.menuurl);
            //         console.log('出错了！！找不到这个地址[' + view + ']');
            //     }
            // }.bind(this), 10);
        },
        // toggleSearch: function () {
        //     eventHelper.emit('openPointSearch');
        // }
    },
    mounted: function () {
        eventHelper.on('loginSuccess', function () {
            this.isLoginSuccess = true;
        }.bind(this));
        eventHelper.on('mapCreated', function (map) {
            this.map = map;
        }.bind(this));

        this.currentView = 'user';
        eventHelper.on('change-menu', function (model) {
            this.changeView(model);
        }.bind(this));
        eventHelper.on('active-tab', function (tabID) {
            this.changeView({menuurl: tabID});
        }.bind(this));
    },
    components: components
});
module.exports = comm;