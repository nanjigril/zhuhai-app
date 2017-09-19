var template = require('./content.html');
var eventHelper = require('../../utils/eventHelper');
var mapHelper = require('utils/mapHelper');
var echarts = require('echarts');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            message: 'Vue Module Seed',
            currentDate:new Date().toLocaleDateString(),
        }
    },
    methods: {},
    mounted: function () {
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            // legend: {
            //     orient: 'vertical',
            //     left: 'left',
            //     top:'10%',
            //     data: ['路面','雨水口','各类检查井','管道、渠箱','边沟','倒虹管','排放口','闸门、阀门、拍门']
            // },
            series : [
                {
                    name: '巡查类型',
                    type: 'pie',
                    radius : '50%',
                    center: ['50%', '50%'],
                    data:[
                        {value:3, name:'路面'},
                        {value:1, name:'雨水口'},
                        // {value:234, name:'各类检查井'},
                        // {value:135, name:'管道、渠箱'},
                        // {value:224, name:'边沟'},
                        // {value:335, name:'倒虹管'},
                        // {value:333, name:'排放口'},
                        // {value:312, name:'闸门、阀门、拍门'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var chartsDiv = document.getElementById('xunChaEcharts');
        var xunChaEcharts = echarts.init(chartsDiv);
        xunChaEcharts.setOption(option);
        var xunChaMap = new AMap.Map('xunChaMap', {
            resizeEnable: true,
            center: [113.336224, 23.14706],
            zoom: 16
        });
        xunChaMap.on('click',function (evt) {
            console.log(evt);
        })
        var lineArr = [
            [113.336224, 23.14706],
            [113.335709, 23.146034],
            [113.335248, 23.145591],
            [113.334154,23.145541],
            [113.334042,23.145388],
            [113.33396, 23.144861],
            [113.333638, 23.143962],
            [113.33466,23.13787],
            [113.335301,23.134535],
            [113.335499,23.133352],
            [113.33566,23.132735],
            [113.335918,23.12981],
            [113.336009,23.126219],
            [113.336572,23.122148],
            [113.336476,23.121695],
            [113.334845,23.119746],
            [113.334539,23.116988],
            [113.333874,23.115972],
            [113.33139,23.114112],
            [113.330344,23.113559],
            [113.329942,23.112439],
        ];
        var polyline = new AMap.Polyline({
            path: lineArr,          //设置线覆盖物路径
            strokeColor: "#FF0000", //线颜色
            strokeOpacity: 2,       //线透明度
            strokeWeight: 2,        //线宽
            strokeStyle: "solid",   //线样式
            strokeDasharray: [10, 5] //补充线样式
        });
        polyline.setMap(xunChaMap);
        var marker = new AMap.Marker({
            icon:"./img/icon/qidian.png",
            position:new AMap.LngLat(113.33616,23.146813),
            extData:{
                facilityType:'CP'
            }
        });
        marker.setLabel({
            offset: new AMap.Pixel(15, 15),
            content: "起点"
        });
        marker.setMap(xunChaMap);
        // var lineArr = [
        //     {x:44843.37172308447,y:31504.230321858864},
        //     {x:44760.42468219039,y:31343.098749595716},
        //     {x:44730.26212186527,y:31318.889326176868},
        //     {x:44633.02755239613,y: 31326.8268420519},
        //     {x:44620.32752699608,y: 31319.683077764374},
        //     {x:44615.56501747106,y:31310.158058714333},
        //     {x:44606.03999842102,y: 31241.101670601558},
        //     {x:44574.686810714644,y:31164.10776661375},
        //     {x:44572.30555595213,y:31139.898343194902},
        //     {x:44609.21500477104,y:30913.679140756492},
        //     {x:44602.864992071016,y: 30909.313507025225},
        //     {x:44601.277488896005,y:30902.9634943252},
        //     {x:44609.61188056479,y:30865.65716971255},
        //     {x:44617.54939643982,y:30862.08528756879},
        //     {x:44691.10371021511,y:30408.98542303572},
        //     {x:44694.27871656512,y:30398.66665239818},
        //     {x:44728.145450965254,y:30186.47039467233},
        //     {x:44731.71733310905,y:30178.741229672323},
        //     {x:44755.1330049404,y:30006.894010977885},
        //     {x:44774.579918834206,y:29919.12857683591},
        //     {x:44799.97996963431,y:29612.74046405968},
        //     {x:44813.73833048437,y:29210.043825333065},
        //     {x:44803.68414370933,y:29197.872967658015},
        //     {x:44853.293617928284,y:28711.83241224357},
        //     {x:44697.18913905266,y:28508.102838117757},
        //     {x:44646.91820517746,y:28150.914623741315},
        //     {x:44515.81690130817,y:27988.836832738543},
        //     {x:44224.5100686945,y:27796.748948562774},
        //     {x:44199.26806602147,y:27669.158922518483},
        //     {x:44222.683737852814,y:27665.58704037472},
        //     {x:44244.51190650915,y:27740.199689600024},
        //     {x:44273.08696365926,y:27783.856026912697},
        //     {x:44355.16642528448,y:27830.974984331096},
        //     {x:44563.65850893532,y:27984.16904071921},
        //     {x:44682.72124706079,y:28124.663071707277},
        //     {x:44698.59627881086,y:28115.13805265724},
        //     {x:44705.74004309838,y:28118.31305900725},
        //     {x:44688.01292431082,y:28152.576669201135},
        //     {x:44704.417123785875,y:28334.742658533116},
        //     {x:44717.11714918593,y:28383.955256958314},
        //     {x:44729.81717458597,y:28476.030441108684},
        //     {x:44823.34756998013,y:28583.18690542161},
        //     {x:44838.16426628018,y:28571.545215471568},
        //     {x:44848.747620780225,y:28572.33896705907},
        //     {x:44895.719857853335,y:28659.670024400664},
        //     {x:44910.79253653673,y:28722.990183412003},
        //     {x:44828.639247230145,y:29583.681488127942},
        //     {x:44795.83084828001,y:29913.88214852926},
        //     {x:44769.90162975491,y:30009.661506754645},
        //     {x:44772.54746837992,y:30060.46160835485},
        //     {x:44760.235938335776,y:30142.438697150614},
        //     {x:44750.314043491984,y:30167.441872156964},
        //     {x:44728.0889990419,y:30285.710858694936},
        //     {x:44718.16710419812,y:30309.92028211378},
        //     {x:44705.86395459182,y:30410.99131758918},
        //     {x:44635.04551807546,y:30854.577412233666},
        //     {x:44638.61740021922,y:30861.324300727443},
        //     {x:44586.8576683897,y:31138.575423882397},
        //     {x:44625.88378810861,y:31260.94546028914},
        //     {x:44634.08588784614,y:31313.7299408581},
        //     {x:44734.62775559654,y:31307.115344295573},
        //     {x:44769.28824158418,y:31329.07580488316},
        //     {x:44862.95092890956,y:31506.082408896367},
        //     {x:44844.694642396986,y:31507.40532820887},
        //     {x:44843.37172308447,y:31504.230321858864},];
        // this.map = mapHelper.getArcGISTiledMap('xunChaMap', 'http://10.194.148.18:6080/arcgis/rest/services/guangzhoumap_gz/MapServer');
        // this.map.on('click',function (event) {
        //         console.log(event);
        // });
        // this.map.on('load', function (event) {
        //     mapHelper.setCenter(44843.37172308447, 31504.230321858864,this.map,7);
        //     for(var i=0;i<lineArr.length-1;i++){
        //         mapHelper.drawLine(this.map, [lineArr[i].x,lineArr[i].y ], [lineArr[i+1].x,lineArr[i+1].y],3,'#f00');
        //     }
        //     mapHelper.addPointAndName(this.map, 44844.323522799015,31508.066787865133, './img/icon/qidian.png',20,20,true,{facilityType: 'tupian'});
        // }.bind(this));

    },
    components: {}
});
module.exports = comm;