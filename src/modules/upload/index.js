var template = require('./content.html');
var eventHelper = require('../../utils/eventHelper');
var moduleController = require('controllers/moduleController');
//加载地图组件
var arcgisPlugin = require('modules/arcgisPlugin');
var mapHelper = require('utils/mapHelper');
var mapController = require('controllers/mapController');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            locationTips:false,
            locationStatus:'',
            dialogFormVisible: false,
            reportQuestion: './img/icon/icon-cloud.png',
            searchInput: '',
            showUpLoadBtn: false,
            topNavArr: [
                {
                    id: 'wdsb',
                    img: 'img/icon/icon-history.png',
                    text: '我的上报'
                }, {
                    id: 'bdcg',
                    img: 'img/icon/icon-draft.png',
                    text: '本地草稿'
                }, {
                    id: 'trsb',
                    img: 'img/icon/icon-report.png',
                    text: '他人上报'
                }
            ],
        }
    },
    // watch: {
    //     value:function(val){
    //         if(!!val){
    //             eventHelper.emit('openSub', {type:'sbwt',val:val});
    //             this.dialogFormVisible = false;
    //             //eventHelper.emit('uploadList',val);
    //         }
    //     }
    // },
    methods: {
        locate: function () {
            var self = this;
            if (!!this.currentLocation) {
                this.currentLocation.clear();
            }
            self.location = '正在定位....';
            self.locationTips = true;
            self.locationStatus = '正在定位...';
            navigator.geolocation.getCurrentPosition(function (position) {
                self.location = position.coords.latitude + ',' + position.coords.longitude;
                self.centerPoint = [position.coords.latitude, position.coords.longitude];
                mapController.formatLocation(position.coords.longitude, position.coords.latitude, function (newX, newY) {
                    mapHelper.setCenter(newX, newY, self.map, 10);
                    self.currentLocation = mapHelper.addPoint(self.map, newX, newY, './img/icon/position.png',{});
                }.bind(this));
                self.locationStatus = '定位成功!'
                setTimeout(function () {
                    self.locationTips = false;
                },2000);
            }, function (error) {
                self.location = error.message;
                self.locationStatus = '定位失败!';
                setTimeout(function () {
                    self.locationTips = false;
                },2000);
            });

        },
        addNewPoint: function () {
            this.$toast({
                message: '请点击问题点',
                position: 'middle',
                duration: 1000
            });
            this.showUpLoadBtn = true;
            this.isAddingPoint = true;
        },
        query: function () {
            this.$toast({
                message: '查看问题点',
                position: 'middle',
                duration: 1000
            });
        },
        showSub: function (subId, content) {
            if (!!content) {
                eventHelper.emit('openComment', content);
            }
            if (subId === 'upload') {
                eventHelper.emit('change-menu', subId);
                eventHelper.emit('toggleTabClass', subId);
            } else {
                eventHelper.emit('openSub', subId);
            }
        },
        updateNew: function () {
            this.showSub('entrance');
        }
    },
    mounted: function () {
        eventHelper.on('openUploadBtn', function () {
            this.showUpLoadBtn = true;
        }.bind(this));
        this.map = mapHelper.getArcGISTiledMap('mainMap', 'http://10.194.148.18:6080/arcgis/rest/services/guangzhoumap_gz/MapServer');
        this.map.on('load', function () {
            mapHelper.addPoint(this.map, 39366.73260040782, 29446.950962383147, './img/dirtyPipe.png', {facilityType: 'CP'});
        }.bind(this));
        this.map.on('click', function (evt) {
            if (!!evt.graphic && evt.graphic.attributes.facilityType == 'CP') {
                this.showUpLoadBtn = true;
                eventHelper.emit('openUploadBtn');
            } else if (!!this.isAddingPoint) {
                mapHelper.addPoint(this.map, evt.mapPoint.x, evt.mapPoint.y, './img/dirtyPipe.png', {facilityType: 'CP'});
                this.isAddingPoint = false;
            }
        }.bind(this));
    },
    components: {
        'arcgis-plugin': arcgisPlugin
    }
});
module.exports = comm;