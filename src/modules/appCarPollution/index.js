var template = require('./content.html');
var controller = require('controllers/rightPanelController');
var facilityController = require('controllers/facilityController');
var serviceHelper = require('services/serviceHelper');
var moment = require('moment');
var removePic = require('../arcgisPlugin/plugin/arcgisExpand/arcgis-load-map');
var mathUtils = require('utils/mathUtils');
var eventHelper = require('../../utils/eventHelper');
var historySearchServices = require('services/historySearchServices');
var deviceModel = require('modules/arcgisPlugin/plugin/arcgisExpand/deviceModel');
var mapHelper = require('utils/mapHelper');
var arcgisHelper = require('modules/arcgisPlugin/plugin/arcgisExpand/arcgis-load-map');
var echarts = require('echarts');
var Q = require('q');
var refreshTime = 1000;
var defaultSpeed = 1000;
var currentThread;

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            carCases:[{
                name:'路面泥土撒漏：',
                value:22
            },{
                name:'PM2.5:',
                value:8
            },{
                name:'PM10：',
                value:10
            }],
            carLists: [
                {
                    num: '',
                    name: '',
                    truckNum: '',
                    check: false,
                    id: ''
                }
            ],
            datatheads: ['实时位置', '车辆编号', '所属公司'],
            // historyTableHead: ['车辆编号', '所属公司', '操作'],
            // carLists1: [
            //     {
            //         num: '桂AD2375',
            //         name: '南宁泰斗运输信息咨询有限公司（渣土）',
            //         terminalNum: ''
            //     }
            // ],
            playSpeed: defaultSpeed,
            rightPanelOpen: false,
            isRealTimeMode: true,
            // isPlay: true,
            alertMessage: '',
            activeIndex: '1',
            // facilityPic: '../src/img/combImg.png',
            facilityName: '',
            selectedMode: '',
            facilityType: '',
        }
    },
    computed: {},
    mounted: function () {
        var carPolluteLine = echarts.init(document.getElementById('carPolluteLine'));
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['7月11日','7月12日','7月13日'],
                y:'bottom'
            },
            grid: {
                x:10,
                y:20,
                x2:10,
                y2:10,
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            toolbox: {
                feature: {
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: ['0','2','4','6','8','10','12','14','16','18','20','22','24']
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 60,
                interval:20,
            },
            series: [
                {
                    name:'7月11日',
                    type:'line',
                    symbol:'none',
                    stack: '总量1',
                    data:[11, 15, 18, 30, 24, 33, 44, 24,28,38,45,21,16],
                },
                {
                    name:'7月12日',
                    type:'line',
                    symbol:'none',
                    stack: '总量2',
                    data:[25, 26, 14, 33, 26, 13, 34,40,28,23,41,33,24]
                },
                {
                    name:'7月13日',
                    type:'line',
                    symbol:'none',
                    stack: '总量3',
                    data:[14, 23, 33, 24, 28, 40, 34,44,50,44,41,33,24]
                }
            ]
        };
        carPolluteLine.setOption(option, true);
        this.queryCarData();
        eventHelper.on('close-right-panel', function () {
            this.closePanel();
        }.bind(this));
        eventHelper.on('mapCreated', function (map) {
            this.map = map;
        }.bind(this));
        eventHelper.on('app-car-pollution', function () {
            this.rightPanelOpen = true;
        }.bind(this));
        eventHelper.on('car-trace-play', function (car) {
            this.isPlay = true;
            this.playSpeed = defaultSpeed;
        }.bind(this));
        eventHelper.on('car-trace-pause', function (car) {
            this.isPlay = false;
        }.bind(this));
        eventHelper.on('car-trace-move', function (car) {
            this.playSpeed = 200;
        }.bind(this));
        eventHelper.on('car-trace-replay', function (car) {
            this.isReplay = true;
        }.bind(this));
        eventHelper.on('stop-player', function () {
            this.stopPlay();
        }.bind(this));
    },
    methods: {
        stopPlay: function () {
            clearInterval(this.pointer);
            this.removeDistance();
            this.map.removeLayer(this.preLayer);
        },
        // submitForm: function (formName) {
        //     this.$refs[formName].validate(function (valid) {
        //         if (valid) {
        //             alert('submit!');
        //             this.$refs[formName].resetFields();
        //         } else {
        //             console.log('error submit!!');
        //             return false;
        //         }
        //     }.bind(this));
        // },
        // resetForm: function (formName) {
        //     this.$refs[formName].resetFields();
        //     this.removeDistance();
        // },
        queryCarData: function () {
            var self = this;
            //从后台获取车辆信息数据
            historySearchServices.getCarListData(function (data) {
                if (!!data) {//初始化数组
                    self.carLists.splice(0);
                    // self.carLists1.splice(0);
                }
                data.forEach(function (menu) {//把后台接口车辆数据加入到数组里
                    self.carLists.push({
                        truckNum: menu.truckNum,
                        terminalNum: menu.terminalNum,
                        check: false,
                        id: menu.id
                    });
                })
                // for (var i = 0; i < 10; i++) {
                //     self.carLists1.push({
                //         num: data[i].truckNum,
                //         terminalNum: data[i].terminalNum
                //     });
                // }
            });
        },
        // carTrace: function (points, carNum) {//车辆运行
        //     this.preLayer = {};
        //     var index = 0;
        //     var maxIndex = points.length;
        //     this.pointer = setInterval(function () {
        //         if (this.isPlay) {
        //             if (!!this.isReplay) {
        //                 index = 0;
        //                 this.isReplay = false;
        //             }
        //             if (!!this.preLayer) {
        //                 this.map.removeLayer(this.preLayer);
        //             }
        //             if (index == maxIndex) {
        //                 clearInterval(this.pointer);
        //             }
        //             var point = points[index++];
        //             this.map.centerAt([parseFloat(point.x), point.y]);
        //             var afterPoint = points[index];
        //             var angel = mathUtils.getAngle(point.x, point.y, afterPoint.x, afterPoint.y);
        //             eventHelper.emit('car-speed-change', point);
        //             this.preLayer = mapHelper.createSymbol(this.map, point.x, point.y, './img/car.png', carNum, 30, 40, angel);
        //         }
        //     }.bind(this), this.playSpeed);
        // },
        getCoordinate: function (list) {//通过点击车辆列表进行获取该车辆的坐标
            list.check = !list.check;
            if (list.check == true) {//如果车辆被选中获取该车辆的坐标
                historySearchServices.getCoordinateData(list.terminalNum, function (data) {
                    deviceModel.ssjkCreatePoint(this.map, list.id, 'f' + list.id, list.truckNum, 'abc', data.x, data.y, '', './img/toolbar/car.png', '22', '22', 'abc', {
                        terminalNum: list.terminalNum,
                        id: list.id,
                        truckNum: list.truckNum
                    });
                }.bind(this));
            } else {
                removePic.removePoints({layer: this.map.getLayer('f' + list.id)});
            }
        },
        // removeDistance: function () {
        //     this.cardistanceArr.forEach(function (graphic) {
        //         arcgisHelper.removeGraphic(graphic);
        //     })
        // },
        //点击查看历史轨迹进行调用
        // drawCarHistory: function (car) {
        //     var self = this;
        //     if (!this.search.dateStart || !this.search.dateEnd) {
        //         return;
        //     } else {
        //         self.cardistanceArr = [];
        //         var dateStart = this.search.dateStart.getFullYear() + '-' + (this.search.dateStart.getMonth() + 1) + '-' + this.search.dateStart.getDate();
        //         var dateEnd = this.search.dateEnd.getFullYear() + '-' + (this.search.dateEnd.getMonth() + 1) + '-' + this.search.dateEnd.getDate();
        //         if (dateStart && dateEnd) {
        //             historySearchServices.getCarHistoryCountData(car.terminalNum, dateStart, dateEnd, function (data) {
        //                 console.log(data);
        //                 var carHistoryCount = parseInt(data.count);
        //                 console.log(carHistoryCount);
        //                 var pageCount;
        //                 if (carHistoryCount % 200 !== 0) {
        //                     pageCount = parseInt(carHistoryCount / 200) + 1;
        //                 } else {
        //                     pageCount = parseInt(carHistoryCount / 200);
        //                 }
        //                 var resultArr = [];
        //                 for (var page = 0; page < pageCount; page++) {
        //                     facilityController.traceCarHistory(car.terminalNum, dateStart, dateEnd, page, resultArr);
        //                 }
        //                 eventHelper.emit('loading-start');
        //                 var counter = setInterval(function () {
        //                     if (resultArr.length == carHistoryCount) {
        //                         clearInterval(counter);
        //                         eventHelper.emit('loading-end');
        //                         var dateSort = function (pre, after) {
        //                             var preDate = moment(pre.date, 'YYYY-MM-DD hh:mm:ss');
        //                             var afterDate = moment(after.date, 'YYYY-MM-DD hh:mm:ss');
        //                             return !preDate.isBefore(afterDate);
        //                         }
        //                         resultArr.sort(dateSort);
        //                         for (var i = 0; i < resultArr.length - 1; i++) {
        //                             var graLayer = mapHelper.drawLine(self.map, [resultArr[i].x, resultArr[i].y], [resultArr[i + 1].x, resultArr[i + 1].y]);
        //                             self.cardistanceArr.push(graLayer);
        //                         }
        //                         self.carTrace(resultArr, car.num);
        //                         eventHelper.emit('app-car-playback');
        //                         self.rightPanelOpen = false;
        //                         // console.log(resultArr);
        //                     }
        //                 }, 100);
        //                 // console.log(resultArr);
        //                 //
        //             }.bind(this));
        //
        //         }
        //     }
        //
        // },
        // handleSelect: function () {
        //     console.log('select');
        // },
        closePanel: function () {
            eventHelper.emit('right-panel-close');
            this.rightPanelOpen = false;
        },
        // open: function (facility) {
        //     eventHelper.emit('isLoading');
        //     var self = this;
        //     clearInterval(currentThread);
        //     if (!this.isRealTimeMode) {
        //         $('#historicalMode').removeClass('is-active');
        //         setTimeout(function () {
        //             $('#realTimeMode').addClass('is-active');
        //         }.bind(this), 100);
        //     }
        //     this.isRealTimeMode = true;
        //     this.rightPanelOpen = true;
        // },
        // switchMode: function (key, keyPath) {
        //     this.isRealTimeMode = key === '1';
        //     if (!this.isRealTimeMode) {
        //         eventHelper.emit('isLoading');
        //         $('#realTimeMode').removeClass('is-active');
        //         $('#historicalMode').addClass('is-active');
        //     }
        //     else {
        //         $('#historicalMode').removeClass('is-active');
        //         $('#realTimeMode').addClass('is-active');
        //     }
        // }
    },
    computed: {

    },
    components: {}
});
module.exports = comm;