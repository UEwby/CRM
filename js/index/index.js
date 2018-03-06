/**
 * Created by wangbinyan on 2017/10/26.
 */
$(function() {
  //初始化近一年/近半年
  selectBoxInitHomePge($("#trendyb"), getTeamRecordTrendData)
  selectBoxInitHomePge($("#teamyb"), getTeamSituation)

  //初始化当前用户：
  $("#userName").html(getSession('crmMsg').userNamecn)
  //选择时间选项初始化
  var months = get12Months()
  $("#selectdate").attr("li-value", months[0].str)
  $("#selectdate .text").text(months[0].label)
  months.forEach(function(value){
    $("#selectdate .dropdown").append(`<li li-value="${value.str}">${value.label}</li>`)
  })
  selectBoxInitHomePge($("#selectdate"), getaddedatas)

  //查看下属选项初始化
  getSubordinates()
  getTeamSituation()
  getTeamRecordTrendData()
  findWorkList()

  //工作圈切换
  $("#workLst .tab li").click(function() {
    $(this).siblings().removeClass('active')
    $(this).addClass('active')
    //按类型重新请求数据
    findWorkList()
  })
  /*请求服务start*/
  //1./viewcrmcustomerauthorize/find
  function getSubordinates (){
    var userid = getSession('crmMsg').userId
    let data = {
      type: 'get',
      url: '/viewcrmcustomerauthorize/find?puserid='+ userid +'&sortname="user_namecn"'
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      $("#findXiaShu .dropdown").append(`<li li-value="-1">请选择下属</li>`)
      data.forEach(function (value) {
        $("#findXiaShu .dropdown").append(`<li li-value="${value.userid}">${value.userNamecn}</li>`)
      })
      selectBoxInitHomePge($("#findXiaShu"), getaddedatas)
    })
  }

  //2.查看新增数据
  function getaddedatas(){
    var params = {
      selectUser: (parseInt($("#findXiaShu").attr("li-value"))!=-1)? (parseInt($("#findXiaShu").attr("li-value"))):(parseInt(getSession('crmMsg').userId)),
      selectDate: $("#selectdate").attr("li-value"),
      isHasDownling: (parseInt($("#findXiaShu").attr("li-value"))==-1)? 1:0

    }
    let data = {
      type: 'get',
      url: '/pc/home/getaddedatas?selectUser='+ params.selectUser +'&selectDate=' + params.selectDate +'&isHasDownling=' + params.isHasDownling
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      $(".statistical ul").html("")
      data.result.forEach(function(value){
        $(".statistical ul").append(`<li><p>${value.typeName}</p><p><span id="typeID${value.typeID}">${value.typeCount}</span></p></li>`)
        $("#typeID"+value.typeID).click(function() {
          switch (value.typeID){
            case 1:
              break;
            case 2:
              break;
            case 3:
              break;
            case 4:
              break;
            case 5:
              break;
            default:
              break;
          }
        })
      })

    })
  }

  //3.客户拜访记录情况（团队）
  function getTeamSituation(){
    var params = {
      selectYearType: (parseInt($("#teamyb").attr("li-value")))
    }
    let data = {
      type: 'get',
      url: '/pc/home/getTeamSituation?selectYearType='+ params.selectYearType
    };
    Ajax(data).then(function (data) {
      var one_half = params.selectYearType ? 12 : 6
      var myChart1 = echarts.init(document.getElementById('echart1'));
      var d1=new Date();
      d1.setMonth(d1.getMonth()-one_half);
      var xAxisData=[];
      var series1Data=[];
      var series2Data=[];
      var series3Data=[];
      for(i=0;i<one_half;i++){

        d1.setMonth(d1.getMonth()+1);
        var year=d1.getFullYear();
        var month=d1.getMonth()+1;
        var key=year+"-"+month;
        var value1=0;
        var value2=0;
        var value3=0;
        for(j=0;j<data.result1.length;j++){
          if(year==data.result1[j].cYear&&month==data.result1[j].cMonth)
          {
            value1=data.result1[j].typeCount;
          }
        }

        for(j=0;j<data.result2.length;j++){
          if(year==data.result2[j].cYear&&month==data.result2[j].cMonth)
          {
            value2=data.result2[j].typeCount;
          }
        }

        for(j=0;j<data.result3.length;j++){
          if(year==data.result3[j].cYear&&month==data.result3[j].cMonth)
          {
            value3=data.result3[j].typeCount;
          }
        }
        xAxisData.push(key);
        series1Data.push(value1);
        series2Data.push(value2);
        series3Data.push(value3);
      }

      var option1 = {
        title: {
          text: '',
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          top:'10%',
          left: '3%',
          right: '4%',
          bottom: '13%',
          containLabel: true
        },
        calculable: true,
        legend: {
          top:'0',
          x:'right',
          itemGap: 54,
          orient:'horizontal',
          textStyle:{
            color:'#585858'
          },
          data:['新增客户','新增联系人','新增商机']
          // icon:'circle'
        },
        color:["#7BC83B","#30AF8A",'#29B7EB'],
        xAxis: [{
          type: 'category',
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: "#0E3D4E",
              width: 1
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}'
            ,textStyle:{
              color:'#0E3D4E'
            }
          },splitLine: {
            show: false,

          }
        }],

        yAxis: [{
          min:0,
          type: 'value',
          name: '',
          axisLabel: {
            formatter: '{value}',
            textStyle:{
              color:'#333'
            }
          },
          axisLine: {
            lineStyle: {
              color: "red",
              width: 0
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ccc',
              type : "dashed"
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
            color: ['rgba(255,255,255,0)','rgba(237,242,252,0.5)']
          }
      },
          axisTick: {
            show: false
          },
        }],
        barWidth:12,
        series: [{
          name: '新增客户',
          type: 'bar',
          data: [],
          label:{
            normal:{
              show: false,
              position: 'insideTop',
              textStyle:{
                color:'#fff'
              }
            }
          }
        }, {
          name: '新增联系人',
          type: 'bar',
          data: [],
          label:{
            normal:{
              show: false,
              position: 'insideTop',
              textStyle:{
                color:'#fff'
              }
            }
          }
        },{
          name: '新增商机',
          type: 'bar',
          data: [],
          label:{
            normal:{
              show: false,
              position: 'insideTop',
              // formatter:'{c}',
              textStyle:{
                color:'#fff'
              }
            }
          }
        }]
      };

      option1.series[0].data=series1Data;
      option1.series[1].data=series2Data;
      option1.series[2].data=series3Data;
      myChart1.setOption(option1);

    })
  }

  //4.客户拜访记录情况（团队）
  function getTeamRecordTrendData(){
    var params = {
      selectYearType: (parseInt($("#trendyb").attr("li-value")))
    }
    let data = {
      type: 'get',
      url: '/pc/home/getTeamRecordTrendData?selectYearType='+ params.selectYearType
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      var one_half = params.selectYearType ? 12 : 6
      var myChart2 = echarts.init(document.getElementById('echart2'));
      var d1=new Date();
      d1.setMonth(d1.getMonth()-one_half);
      var xAxisData=[];
      var series1Data=[];
      var series2Data=[];
      for(i=0;i<one_half;i++){

        d1.setMonth(d1.getMonth()+1);
        var year=d1.getFullYear();
        var month=d1.getMonth()+1;
        var key=year+"-"+month;

        var value1=0;
        var value2=0;
        for(j=0;j<data.result1.length;j++){
          if(year==data.result1[j].cYear&&month==data.result1[j].cMonth)
          {
            value1=data.result1[j].CustomerCount;
          }
        }

        for(j=0;j<data.result2.length;j++){
          if(year==data.result2[j].cYear&&month==data.result2[j].cMonth)
          {
            value2=data.result2[j].CustomerCount;
          }
        }
        xAxisData.push(key);
        series1Data.push(value1);
        series2Data.push(value2);
      }

      var option = {

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['客户拜访次数','客户拜访数量'],
          textStyle: {
            // color: ''
          },
          x:'right',
          top:'0'
        },
        grid: {
          top:'10%',
          left: '3%',
          right: '4%',
          bottom: '13%',
          containLabel: true
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine:{
            show:false,
          },
          axisLine: {
            lineStyle: {
              color: "#0E3D4E",
              width: 1
            }
          },
          data: xAxisData
        },
        yAxis : [
          {
            min:0,
            type: 'value',
            name: '',
            axisLabel: {
              formatter: '{value}',
              textStyle:{
                color:'#333'
              }
            },
            axisLine: {
              lineStyle: {
                color: "red",
                width: 0
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ccc',
                type : "dashed"
              }
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['rgba(255,255,255,0)','rgba(237,242,252,0.5)']
              }
            }
          }
        ],
        series: [
          {
            name:'客户拜访次数',
            type:'line',
            symbolSize:10,
            data:[],
            itemStyle: {
              normal: {
                color: '#30B08B'
              }
            }
          },
          {
            name:'客户拜访数量',
            type:'line',
            symbolSize:10,
            data:[],
            itemStyle: {
              normal: {
                color: '#2AB7EB',
                type:'line'
              }
            }
          }
        ]
      }

      option.xAxis.data=xAxisData;
      option.series[0].data=series1Data;
      option.series[1].data=series2Data;

      myChart2.setOption(option);

    })
  }

  //5.工作圈
  function findWorkList() {
    var params = {
      userId: parseInt(getSession('crmMsg').userId),
      workType: parseInt($("#workLst .tab li.active").eq(0).attr('li-value'))
    }
    let data = {
      type: 'get',
      url: '/crmWorkList/find?userId=' + params.userId +'&workType=' + params.workType
    };
    Ajax(data).then(function (data) {
      //$("#workLst .tab_con").html("")
      console.log(data)
      if(data.length > 0){
        var html = ``
        data.forEach(function(value,index){

          var createTime = getDate(value.createTime)
          html += `<div class="list-box">
                        <p class="p1">
                          <span>${value.createUserName}</span>
                          <span>|</span>
                          <a weeklyType="${value.weeklyType}" workDescType="${value.workDescType}" workID="${value.workID}" workDesc="${value.workDesc}" customerid="${value.customerid}" customername="${value.customername}">${value.workTitle}</a>
                        </p>
                        <p class="p2">${createTime}</p>
                        <p class="p3">${value.workDesc}</p>
                    </div>`

          $("#workLst .tab_con").html(html)


        })
        //页面跳转
        $(".list-box .p1 a").click(function () {
          var workDescType = parseInt($(this).attr("workDescType"))
          var workID = parseInt($(this).attr("workID"))
          var workDesc = $(this).attr("workDesc")
          var customerid = $(this).attr("customerid")
          var customername = $(this).attr("customername")
          //console.log(workID)
          if(workDescType == 1){
            //客户详情跳转
            pushSession('customerMsg', {
              id: workID,
              name: workDesc,
            });
            location.href = "../customerManagement/customerDetails.html"
          }else if(workDescType == 2){
            //联系人跳转
            pushSession('customerMsg', {
              linkerId: workID
            });
            location.href = "../customerManagement/linkerDetails.html"
          }else if(workDescType == 3){//跳转 3=日报
            //日报跳转
            setSession('personalCenter',{
              id: workID
            })
            location.href = "../personalCenter/dailyDetails.html"
          }else if(workDescType == 4){//跳转 4=周报
            var weeklyType = $(this).attr('weeklyType')
            //周报跳转
            setSession('personalCenter',{
              id: workID,
              weeklyType: weeklyType
            })
            switch (parseInt(weeklyType)){
              case 254:
                location.href = "../personalCenter/jointVenturesDetails.html";     //合资公司周报
                break;
              case 255:
                location.href = "../personalCenter/separateColumnsDetails.html";        //独立纵队周报
                break;
              case 262:
                location.href = "../personalCenter/unionParttimeDetails.html";           //合纵兼职周报
                break;
              case 370:
                location.href = "../personalCenter/jointVenturesDetails.html";           //人力资源周报
                break;
            }

            //等待相关页面接口调通
          }else if(workDescType == 5){//跳转 5=商机
            pushSession('opportunitiesMsg', {
              id: workID,
              name: workDesc,
              tabFlag:220
            })
            pushSession('customerMsg', {
              id: customerid,
              name: customername,
            })
            location.href = "../opportunityManagement/businessDetails.html"
          }
        })
      }else{
        $("#workLst .tab_con").html('<div class="list-box" style="text-align: center">暂无数据</div>')
      }
    })
  }

  ///pc/user/getSysUser
  function getSysUser(){

  }

  /*请求服务end*/


  /*用到的一些算法 start*/
  //1.获取当前之前的12个月份算法
  function get12Months(){
    var monthArr = []
    var now = new Date()
    var month = parseInt(now.getMonth() + 1)
    var year = now.getFullYear()
    for(let i=0;i<12;i++){
      if(month == 0){
        --year
        month = 12
      }
      var obj = {
        label:year + '年' + (month>9?month:('0'+month)) + '月',
        str:year + '-' + month
      }
      monthArr.push(obj)
      --month
    }
    return monthArr
  }



  getaddedatas()
})

