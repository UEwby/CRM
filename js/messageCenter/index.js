/**
 * Created by wangbinyan on 2017/10/30.
 */
$(function () {
  layui.use('layer', function(){});
  //切换tabs
  $(".msg_tab >ul >li.notice").click(function() {
    $(".wrap_right .todolist").removeClass('active')
    $(".wrap_right .notice").addClass('active')
  })
  $(".msg_tab >ul >li.todolist").click(function() {
    $(".wrap_right .todolist").addClass('active')
    $(".wrap_right .notice").removeClass('active')
  })

  //初始化下拉菜单
  selectBoxInitHomePge($("#messagetypeid"), getUserMessageList);
  selectBoxInitHomePge($("#toDoListType"), undoMessageList);
  getUserMessageList()
  undoMessageList()


  //待处理消息列表
  // /crmMessage/undoMessageList
  function undoMessageList(){
    var param = {
      userId: getSession('crmMsg').userId,
      undoType: parseInt($("#toDoListType").attr("li-value"))
    }
    let data = {
      type: 'get',
      url: '/crmMessage/undoMessageList?userid='+ param.userId +'&undoType=' + param.undoType
    };
    Ajax(data).then(function (data) {
      $(".msg_tab_1").html("")
      console.log(data)
      if(data.backHttpResult.code == '000'){
        //日报待处理模板
        if(data.undoDaily){

          data.undoDaily.forEach(function(value){
            var today = getDateByDay(value.today)
            var html = `<div id="undodaily${value.id}" class="items">
                        <div>
                            <span class="circle items_title">待处理事项：</span><span
                                class="items_date">${today}</span><span class="items_col">${value.message}</span>
                        </div>
                        <a class="handle">处理</a>
                    </div>`
            $(".msg_tab_1").append(html)

            //处理
            $("#undodaily"+value.id ).find("a.handle").click(function () {
              if(value.dailyid){
                pushSession('personalCenter', {
                  id: value.dailyid,
                });
                location.href = "../personalCenter/editDaily.html"
              }else{
                location.href = "../personalCenter/newAddDaily.html"
              }
            })

          })
        }

        //周报待处理模板
        if(data.undoWeekly){

          data.undoWeekly.forEach(function(value){

            var startDay = getDateByDay(value.startDay)
            var endDay = getDateByDay(value.endDay)
            var html = `<div id="undoweekly${value.id}" class="items">
                        <div>
                            <span class="circle items_title">待处理事项：</span><span class="items_date">${startDay} 至 ${endDay}</span><span>${value.weekCount}</span><span
                                class="items_noweekly items_col">${value.message}</span>
                        </div>
                        <a class="handle">处理</a>
                    </div>`
            $(".msg_tab_1").append(html)

            //处理
            $("#undoweekly"+value.id ).find("a.handle").click(function () {
              var weeklyType = getSession('crmMsg').weeklyType
              if(value.weeklyId){//编辑周报
                switch(weeklyType){
                  case 254:
                    location.href = "../personalCenter/jointVenturesEdit.html";     //合资公司周报
                    break;
                  case 255:
                    location.href = "../personalCenter/separateColumnsEdit.html";        //独立纵队周报
                    break;
                  case 262:
                    location.href = "../personalCenter/unionParttimeEdit.html";           //合纵兼职周报
                    break;
                  case 370:
                    location.href = "../personalCenter/jointVenturesEdit.html";           //人力资源周报
                    break;
                }
              }else{//新建周报
                switch(weeklyType){
                  case 254:
                    location.href = "../personalCenter/jointVentures.html";     //合资公司周报
                    break;
                  case 255:
                    location.href = "../personalCenter/separateColumns.html";        //独立纵队周报
                    break;
                  case 262:
                    location.href = "../personalCenter/unionParttime.html";           //合纵兼职周报
                    break;
                  case 370:
                    location.href = "../personalCenter/jointVentures.html";           //人力资源周报
                    break;
                }
              }
            })
          })
        }

        //商机待处理事项模板
        if(data.undoProjectList){
          data.undoProjectList.forEach(function(value){
            var signdate = getDateByDay(value.signdate)
            var html = `<div id="opportunities${value.id}" class="items">
                        <div>
                            <span class="circle items_title">待处理事项：</span><span>预计签约日期超过</span>
                        </div>
                        <div>
                            <span class="items_title">客户名称：</span><span class="items_content1">${value.customername}</span>
                            <span class="items_title">商机名称：</span><span class="items_content2">${value.projectname}</span>
                            <span class="items_title_s">预计签约时间：</span><span class="items_content3">${signdate}</span>
                        </div>
                        <a class="handle">处理</a>
                    </div>`
            $(".msg_tab_1").append(html)

            //商机详情跳转
            $("#opportunities"+value.id ).find("span.items_content2").click(function () {
              pushSession('opportunitiesMsg', {
                id: value.id,
                name: value.projectname,
              });
              pushSession('customerMsg', {
                id: value.customerid,
                name: value.customername,
              });
              location.href = "../opportunityManagement/businessDetails.html"
            })

            //客户详情跳转
            $("#opportunities"+value.id ).find("span.items_content1").click(function () {
              pushSession('customerMsg', {
                id: value.customerid,
                name: value.customername,
              });
              location.href = "../customerManagement/customerDetails.html"
            })

            //处理
            $("#opportunities"+value.id ).find("a.handle").click(function () {
              pushSession('opportunitiesMsg', {
                id: value.id,
                name: value.projectname,
              });
              pushSession('customerMsg', {
                id: value.customerid,
                name: value.customername,
              });
              location.href = "../opportunityManagement/businessDetails.html"
            })
          })
        }

        //招标信息待处理模板
        if(data.undoTenderList){
          data.undoTenderList.forEach(function(value){
            var publishdate = getDateByDay(value.publishdate)
            var enddate = getDateByDay(value.enddate)
            var html = `<div class="items">
                        <div>
                            <span class="circle items_title">待处理事项：</span><span>新的招标信息</span>
                        </div>
                        <div>
                            <span class="items_title">招标名称：</span><span class="items_content1">${value.tendername}</span>
                            <span class="items_title">招标企业名称：</span><span class="items_content2">${value.tenderentname}</span>
                            <span class="items_title">发布日期：</span><span class="items_content3">${publishdate}</span>
                        </div>
                        <div>
                            <span class="items_title">截止日期：</span><span>${enddate}</span>
                        </div>
                        <a class="handle">处理</a>
                    </div>`
            $(".msg_tab_1").append(html)
          })
        }
      }

    })
  }


  //通知列表
  function getUserMessageList(obj){
    if (!obj) {
      obj = {};
      obj.curr = 1,
        obj.limit = 20
    }
    var param = {
      userId: getSession('crmMsg').userId,
      messagetypeid: parseInt($("#messagetypeid").attr("li-value")),
      page:obj.curr,
      rows:obj.limit
    }
    var url = ''
    if(param.messagetypeid == -1){
      url = '/crmMessage/getUserMessageList?userid='+ param.userId +'&rows=' + param.rows +'&page=' + param.page
    }else{
      url = '/crmMessage/getUserMessageList?userid='+ param.userId +'&messagetypeid=' + param.messagetypeid +'&rows=' + param.rows +'&page=' + param.page
    }
    let data = {
      type: 'get',
      url: url
    };
    Ajax(data).then(function (data) {
      $(".msg_tab_2").html("")
      console.log(data)
      //数据陈列
      if(data.total>0){
        data.rows.forEach(function (value,index) {
          var createdate = getDate(value.createdate)
          var html = ``
          //隔行变色
          if(index%2 == 0){
            //未读消息背景图标
            if(value.isreaded == 0){
              html += `<div id="notice${value.messageid}" class="items odd noread">`
            }else{
              html += `<div id="notice${value.messageid}" class="items odd">`
            }

          }else{
            //未读消息背景图标
            if(value.isreaded == 0){
              html += `<div id="notice${value.messageid}" class="items oll noread">`
            }else{
              html += `<div id="notice${value.messageid}" class="items oll">`
            }
          }

          html += `<div>
                            <span style="width: 80px;" class="items_title">发送方：</span><span style="width: 80px;">${value.createUserName}</span>
                            <span style="width: 80px;" class="items_title">接收方：</span><span style="width: 80px;">${value.userName}</span>
                            <span style="width: 50px;" class="items_title">内容：</span><span style="width: 50px;">${value.messagecontent}</span>
                            <span style="width: 50px;" class="items_title">类型：</span><span style="width: 50px;">${value.messagetypename}</span>
                            <span style="width: 80px;" class="items_title">发送时间：</span><span style="width: 150px;">${createdate}</span>
                            </div>`
          //
          if(value.sourceobjecttypeid == 1){
            html +=`<div><span style="width: 80px;" class="items_title">客户：</span><a class="linker" style="cursor: pointer;">${value.sourceobjectname}</a></div>`
          }else if(value.sourceobjecttypeid == 2){
            html +=`<div><span style="width: 80px;" class="items_title">商机：</span><a class="linker" style="cursor: pointer;">${value.sourceobjectname}</a></div>`
          }else if(value.sourceobjecttypeid == 3){
            html +=`<div><span style="width: 80px;" class="items_title">商机：</span><a class="linker" style="cursor: pointer;">${value.sourceobjectname}</a></div>`
          }else if(value.sourceobjecttypeid == 4){
            html +=`<div><span style="width: 80px;" class="items_title">合资公司：</span><a class="linker" style="cursor: pointer;">${value.sourceobjectname}</a></div>`
          }
          html += `</div>`
          $(".msg_tab_2").append(html)

          //跳转处理
          $("#notice"+ value.messageid).find(".linker").click(function () {
            //未读消息已读设置
            if(value.isreaded == 0){
              let data = {
                type: 'post',
                url: '/crmMessage/setReadedById',
                data: {
                  userid: getSession('crmMsg').userId,
                  messageid: value.messageid
                }
              };
              Ajax(data).then(function (data) {
                console.log(data)
                if(data.code == '000' ){
                  if(value.sourceobjecttypeid == 1){//客户
                    pushSession('customerMsg', {
                      id: value.sourceobjectid,
                      name: value.sourceobjectname,
                    });
                    location.href = "../customerManagement/customerDetails.html"
                  }else if(value.sourceobjecttypeid == 2){//商机详情
                    pushSession('opportunitiesMsg', {
                      id: value.sourceobjectid,
                      name: value.sourceobjectname
                    })
                    pushSession('customerMsg', {
                      id: value.customerid,
                      name: value.customername
                    })
                    location.href = "../opportunityManagement/businessDetails.html"
                  }else if(value.sourceobjecttypeid == 3){//联系人
                    pushSession('customerMsg', {
                      linkerId: value.sourceobjectid
                    });
                    location.href = "../customerManagement/linkerDetails.html"
                  }
                  $("#notice"+ value.messageid).removeClass('noread')

                }else if(data.code=='101'){
                  layer.msg("该商机已经被转移走，您没有权限查看！")
                }else if(data.code=='101'){
                  layer.msg("该联系人已经被转移走，您没有权限查看！")
                }else if(data.code=='101'){
                  layer.msg("消息不存在！")
                }
              })
            }else{//已读消息直接跳转
              if(value.sourceobjecttypeid == 1){
                pushSession('customerMsg', {//客户
                  id: value.sourceobjectid,
                  name: value.sourceobjectname,
                });
                location.href = "../customerManagement/customerDetails.html"
              }else if(value.sourceobjecttypeid == 2){//商机
                pushSession('opportunitiesMsg', {
                  id: value.sourceobjectid,
                  name: value.sourceobjectname
                })
                pushSession('customerMsg', {
                  id: value.customerid,
                  name: value.customername
                })
                location.href = "../opportunityManagement/businessDetails.html"
              }else if(value.sourceobjecttypeid == 3){//联系人
                pushSession('customerMsg', {
                  linkerId: value.sourceobjectid
                });
                location.href = "../customerManagement/linkerDetails.html"
              }
            }

          })
          //设置分页
          pager(obj, data.total, [10,20,50,100], getUserMessageList, $('.pager'))

        })
      }
    })
  }
})