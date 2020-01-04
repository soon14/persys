function randomColor(){
    return `rgb(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)})`
}

var vm = new Vue({
    el:"#app",
    data:function(){
        return {
            line: {
                title: {
                    text: '状态信息统计'
                },
                tooltip: {},
                legend: {
                    data:['统计数']
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [{
                    name: '统计数',
                    type: 'line',
                    data: [],
                    animation: true,
                    smooth: true
                }]
            },
            pie: {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:[]
                },
                series: [
                    {
                        name:'连接信息',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'inside'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '10',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[

                        ]
                    }
                ]
            },
            list:[]
        }
    },
    created:function(){
        this.loadData();
    },
    mounted:function(){

    },
    methods:{
      loadData:function(){
          get({
              url:"/monitoring/redis/state"
          }).then(function(res){
              if(res.code == 200){
                  vm.initLine(res.data);
                  vm.initPie(res.data);
                  vm.initList("",res.data);
              }
          }).catch(function(err){
              console.log(err)
          })
      },
      initLine:function (data) {
          for (key in data.stats){
              vm.line.xAxis.data.push(key);
              vm.line.series[0].data.push(data.stats[key])
          }
          var myChart = echarts.init(document.getElementById('line'));
          myChart.setOption(this.line);
      },
      initPie:function(data){
          var clients = data.clients;
          for (key in clients) {
              vm.pie.series[0].data.push({
                  value: clients[key],
                  name: key + "-->" + clients[key]
              });
              vm.pie.legend.data.push(key + "-->" + clients[key])
          }
          var myChart = echarts.init(document.getElementById('pie'));
          myChart.setOption(this.pie);
      },
      initList:function(preKey,data){
          for(key in data){
              if(key != 'stats' & key != 'clients'){
                  if(data[key] instanceof Object){
                      if(!preKey){
                          vm.initList(key,data[key])
                      }else{
                          vm.initList(preKey + "." + key,data[key])
                      }
                  }else{
                      if(!preKey){
                          vm.list.push({
                              key: key,
                              value: data[key]
                          })
                      }else{
                          vm.list.push({
                              key: preKey + "." + key,
                              value: data[key]
                          })
                      }

                  }
              }
          }
      }
    }
});