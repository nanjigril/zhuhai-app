//bootstrap的js
require('bootstrap/dist/js/bootstrap.js');

//此功能对应的视图（html）
var template = require('./componentDemo.html');
var serviceHelper = require('services/serviceHelper.js');

// Vue.extend实现vue组件
module.exports = Vue.extend({
    //设置模板
    template: template,
    //vue组件外部给组件内部传值使用props
    props: ["companyName"],
    data: function () {
        return {
            //当前整个html元素的id，考虑到页面内可能同时存在多个这个控件，因此id随机生成，保证不重复
            //需要id是因为bootstrap的model弹窗是基于jquery实现的
            divId: "div" + Math.random().toString(36).substr(2),
            //选择后的回调
            okHandler: null,
        }
    },
    created: function () {

    },
    mounted: function () {

    },
    methods: {
        //初始化
        init: function () {

        },
        //弹窗
        showForm: function () {
            //弹出模态窗
            $("#" + this.divId).modal("show");
        },
        //关闭窗体
        hideForm: function () {
            //关闭模态窗
            $("#" + this.divId).modal("hide");
        },
        //确定按钮点击事件
        okClick: function () {
            //调用选择后回调函数
            if (this.okHandler) {
                this.okHandler(this.companyName);
            }
            //关闭窗体
            this.hideForm();
        }
    }
});