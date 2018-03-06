/**
 * Created by wangbinyan on 2017/10/12.
 */
$(function() {
  //用户列表查询接口
  function apiFindUserPage(obj) {
    $("#userList tbody").html("")
    if (!obj) {
      obj = {};
      obj.curr = 1,
        obj.limit = 20
    }
    let data = {
      type:'get',
      url:'/pc/user/finduserpage?username=' + $("#userNamecn").val()
      +'&roleid=' + ($("#roletype2").attr('li-value') ? parseInt($("#roletype2").attr('li-value')):"")
      +'&isdel=' + ($("#usetype2").attr('li-value') ? parseInt($("#usetype2").attr('li-value')):"")
      +'&rows=' + obj.limit+'&page='+obj.curr+'&v='+ Date.parse(new Date())
    };
    //console.log(data)
    Ajax(data).then(function (data) {
      for(let i=0; i<data.rows.length; i++){
        data.rows[i].userDatetime = getDateByDay(data.rows[i].userDatetime)
      }
      var html = template('tempList', data);
      $("#userList tbody").html(html)
      //getDateByDay
      //console.log(data.rows)
      pager(obj, data.total, [10,20,50,100], apiFindUserPage, $('.pager'));



      //绑定修改用户事件
      $(".editUser").click(function(){
        var olddata = {
          weeklytype:parseInt($(this).parent().parent().attr("data-weeklytype")),
          roleid:parseInt($(this).parent().parent().attr("data-roleid")),
          userNamecn:$(this).parent().parent().attr("data-userNamecn"),
          userNameen:$(this).parent().parent().attr("data-userNameen"),
          roleName:$(this).parent().parent().attr("data-roleName"),
          weeklyName:$(this).parent().parent().attr("data-weeklyName"),
          userId:$(this).parent().parent().attr("data-userId"),
        }
        //console.log(olddata);
        //修改用户
        createHtmlEdit(olddata.userNameen, olddata.userNamecn, olddata.weeklytype, olddata.roleid, olddata.roleName, olddata.weeklyName, olddata.userId)
      })

      //绑定禁用/启用事件
      $(".del").click(function(){
        var olddata = {
          isdel:parseInt($(this).parent().parent().attr("data-isdel")),
          userId:parseInt($(this).parent().parent().attr("data-userId"))
        }
        //console.log(olddata);
        //禁用/启用
        createHtmlEnableOrDisable(olddata.isdel, olddata.userId);
      })

      //绑定交接客户事件
      $(".transfer").click(function(){
        let userId = parseInt($(this).parent().parent().attr("data-userId"))
        //console.log(olddata);
        //
        createHtmlTransfer(userId);
      })
    })
  }
  //创建交接客户html
  function createHtmlTransfer(userId){
    layer.open({
      title:'转移客户',
      type: 1,
      area: ['425px', '480px'],
      shadeClose: true, //点击遮罩关闭
      content: `<div class="open-ext">
      <div id="popTransfer" class="clearfix pop">

      <div class="fl clearfix top">
      <span class="fl toHow">转移给：</span>
      <input type="text" placeholder="请输入姓名" class="fl namecn">
      <div class="fr transfer-name">
      <i class="del-icon"></i>
      <span></span>
      </div>
      </div>

      <ul class="content-name">
      </ul>
      <p class="tips">* 必须选择“转移人”才能进行“保存”</p>
      </div>

      <div class="layui-input-block" style="text-align:center;">
      <button class="layui-btn savetrans" lay-submit lay-filter="formDemo" style="margin: 10px;padding: 0 20px;">保存</button>
      <button type="reset" class="layui-btn layui-btn-primary close-ext" style="margin: 10px;padding: 0 20px;">取消</button>
      </div>

      </div></div>`
    });
    $("#popTransfer .namecn").on('input', function(){
      if ($(this).val() != '') {
        finduserall();
      }
    })
    finduserall()
    //初始化	获取交接的用户
    function finduserall(){
      let data = {
        type:'get',
        url:'/sysuser/finduserall?userid=' +userId + '&usernamecn='+ $("#popTransfer .namecn").val()
      };
      Ajax(data).then(function (data) {
        console.log(data)
        let uls = '';
        data.forEach(function (item, i) {
          let lis = ``;
          let title;
          for (let key in item) {
            title = key;
            item[key].forEach(function (val) {
              lis += `<li class="customer-name" customer-id="${val.userId}"> ${val.userNamecn}</li>`
            })
          }
          uls += `<li><h3 class="title">${title}<i class="layui-icon fr">&#xe625;</i></h3>`
          uls +=`<ul>${lis}</ul></li>`

        });
        $('.content-name').html(uls || '暂无数据');
        $(".content-name li .title").click(function(){
          //console.log($(this))
          $(this).siblings().toggleClass('close')
          $(this).find('i').toggleClass('collapse')
        })
        $(".content-name li.customer-name").click(function(){
          $(this).addClass('select').siblings().removeClass('select')
          $(this).parent().parent().siblings().find('.customer-name').removeClass('select')

          var text = $(this).text()
          var customerid = $(this).attr('customer-id')
          var transfername = `<div class="fr transfer-name"><i class="del-icon"></i><span></span></div>`
          $("#popTransfer .transfer-name span").text($(this).text()).attr('customer-id',$(this).attr('customer-id'))
          $("#popTransfer .transfer-name").css({display:'block'})
        })
        $("#popTransfer .transfer-name i.del-icon").click(function(){
          $("#popTransfer .transfer-name span").text('').attr('customer-id','')
          $(".content-name li.customer-name").removeClass('select')
          $("#popTransfer .transfer-name").css({display:'none'})
        })
      })
    }


    $(".savetrans").click(function(){
      //console.log($("#popTransfer .transfer-name span").attr('customer-id'))
      //console.log(typeof $("#popTransfer .transfer-name span").attr('customer-id'))
      if($("#popTransfer .transfer-name span").attr('customer-id')){
        let params = {
          transferorshare: 'transfer',
          type: 'customerall',
          userid: parseInt(userId),
          transferuserids: parseInt($("#popTransfer .transfer-name span").attr('customer-id')),
          _time: Date.parse(new Date())
        }
        let data = {
          type:'get',
          url:'/crmUserCustomer/transferOrShare?transferorshare=' + params.transferorshare +
          '&type=' + params.type +
          '&userid=' + params.userid +
          '&transferuserids=' + params.transferuserids +
          '&_time=' + params._time
        };
        Ajax(data).then(function (data) {
          //console.log(data.backHttpResult)
          if(data.backHttpResult.code == '000'){
            layer.msg("交接客户成功")
            layer.closeAll('page')
            apiFindUserPage()
          }else if(data.backHttpResult.code == '111'){
            layer.msg("保存异常")
            layer.closeAll('page')
            apiFindUserPage()
          }else if(data.backHttpResult.code == '333'){
            layer.msg("解析异常")
            layer.closeAll('page')
            apiFindUserPage()
          }
        })
      }else{
        layer.msg("必须选择“转移人”才能进行“保存”")
      }
    })

    //取消修改
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }

  //下拉框获取所有角色
  function apiFindRoleType(el, init){
    let data = {
      type:'get',
      url:'/pc/role/find?issuper=0'
    };
    Ajax(data).then(function (data) {
      var html;
      if(init){
        html = template('tempRole2', {data:data});
      }else{
        html = template('tempRole', {data:data});
      }
      el.find(".dropdown").html(html)

      //给下拉菜单绑定切换选择事件
      selectBoxInit(el);
    })
  }

  //下拉框获取所有周报类型
  function apiFindWeeklyTRype(el) {
    let data = {
      type:'get',
      url:'/crmcustomerwordbook/find?flag=WeeklyTRype'
    };
    Ajax(data).then(function (data) {
      let html = template('tempWeeklyTRype', {data:data});
      el.find(".dropdown").html(html)

      //给下拉菜单绑定切换选择事件
      selectBoxInit(el);
    })
  }

  //增加用户
  function apiAddUser(userNameen, userNamecn, weeklytype, roleid) {
    let data = {
      type:'post',
      url:'/pc/user/useradd',
      data:{
        userNameen:userNameen,
        userNamecn:userNamecn,
        weeklytype:weeklytype,
        roleid:roleid
      }
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      if(data == 1){
        layer.closeAll('page');
        layer.msg('增加用户成功');
        apiFindUserPage();
      }else if(data == -1){
        layer.closeAll('page');
        layer.msg('用户账号重复');
        //apiFindUserPage();
      }else if(data == 0){
        layer.closeAll('page');
        layer.msg('数据异常');
        //apiFindUserPage();
      }
    })
  }

  // 创建修改用户html
  function createHtmlEdit(userNameen, userNamecn, weeklytype, roleid, roleName, weeklyName, userId){
    layer.open({
      title:'编辑用户',
      type: 1,
      area: ['470px', '370px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">角色类型：</label>' +
      '<div class="layui-input-inline">' +
      '<div class="select-box-wrap">' +
      '<div id="editroletype" class="select-box" style="width: 305px;">' +
      '<span class="text">请选择</span>' +
      '<ul class="dropdown">' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">姓名：</label>' +
      '<div class="layui-input-inline">' +
      '<input maxlength="16" type="text" id="edituserNamecn" required  lay-verify="required" placeholder="请输入姓名" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">账号：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" id="edituserNameen" disabled="disabled" required  lay-verify="required" placeholder="请输入账号" autocomplete="off" class="layui-input" style="background-color:#F2F2F2;">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">周报类型：</label>' +
      '<div class="layui-input-inline">' +
      '<div class="select-box-wrap">' +
      '<div id="editweeklytype" class="select-box" style="width: 305px;">' +
      '<span class="text">请选择</span>' +
      '<ul class="dropdown">'+
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +
      '<div class="layui-form-item">' +
      '<div class="layui-input-block">' +
      '<button class="layui-btn edituser" lay-submit lay-filter="formDemo" style="margin: 10px;padding: 0 20px;">保存</button>' +
      '<button class="layui-btn resetpwd" lay-submit lay-filter="formDemo" style="margin: 10px;padding: 0 20px;">重置密码</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext" style="margin: 10px;padding: 0 20px;">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });
    //下拉菜单初始化
    //获取角色类型
    apiFindRoleType($("#editroletype"));
    //获取周报类型
    apiFindWeeklyTRype($("#editweeklytype"));

    //输入框、下拉菜单初始化
    //console.log(userNameen, userNamecn, weeklytype, roleid, roleName, weeklyName, userId)

    $("#editroletype").attr("li-value", roleid)
    $("#editroletype .text").text(roleName)
    $("#editweeklytype").attr("li-value", weeklytype)
    $("#editweeklytype .text").text(weeklyName)
    $("#edituserNameen").val(userNameen)
    $("#edituserNamecn").val(userNamecn)
    //保存修改
    $(".edituser").click(function () {
      if($("#edituserNamecn").val().length < 1){
        layer.msg("姓名不能为空")
      }else{
        apiEditUser(
          $("#edituserNamecn").val(),
          $("#editweeklytype").attr("li-value"),
          $("#editroletype").attr("li-value"),
          userId
        )
      }

    })
    //取消修改
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })

    $(".resetpwd").click(function(){
      //重置密码
      let data = {
        type:'post',
        url:'pc/user/update',
        data:{
          userId:userId
        }
      };
      Ajax(data).then(function (data) {
        console.log(data)
        layer.msg("重置密码成功")
      })
    })
  }

  //启用/禁用html
  function createHtmlEnableOrDisable(isdel, userId){
    var label = (isdel == 0) ? '禁用' : '启用';
    isdel=(isdel == 0) ? 1 : 0;
    layer.open({
      title:false,
      type: 1,
      closeBtn: 0,
      area: ['470px', '200px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext open-no-title">' +
      '<div class="layui-form" style="text-align:center;">' +

      '<div class="layui-form-item" style="font-size:20px;">' +
      '确定'+ label +'此用户？' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<div class="">' +
      '<button class="layui-btn ok" lay-submit lay-filter="formDemo">确定</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });

    //保存修改
    $(".ok").click(function () {
      updatestatus(
        isdel, userId
      );
    })
    //取消修改
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }
  // 启用/禁用
  function updatestatus(isdel, userId){
    let data = {
      type:'post',
      url:'/pc/user/updatestatus',
      data:{
        isdel:isdel, userId:userId
      }
    };
    Ajax(data).then(function (data) {
      console.log(data)
      if(data == 1){
        if(isdel == 1){
          layer.msg('禁用成功');
        }else{
          layer.msg('启用成功');
        }
        layer.closeAll('page');
        apiFindUserPage()
      }else{
        layer.closeAll('page');
        layer.msg('操作失败');
      }
    })
  }
  //修改用户服务
  function apiEditUser(userNamecn, weeklytype, roleid, userId) {
    //console.log(userNamecn, weeklytype, roleid, userId)
    let data = {
      type:'post',
      url:'/pc/user/useredit',
      data:{
        userNamecn:userNamecn,
        weeklytype:weeklytype,
        roleid:roleid,
        userId:userId
      }
    };
    Ajax(data).then(function (data) {
      console.log(data)
      if(data == 1){
        layer.closeAll('page');
        layer.msg('修改用户成功');
        //修改当前用户信息的session值
        if(userId == getSession('crmMsg').userId){
          apiGetSysUser(userId)
        }
        apiFindUserPage()
      }else{
        layer.closeAll('page');
        layer.msg('修改用户失败');
      }
    })
  }
  //根据用户id查询用户姓名
  function apiGetSysUser(userId) {
    let data = {
      type:'get',
      url:'/pc/user/getSysUser?userId='+userId
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      if(data){
        setSession('crmMsg',{
          userId:data.userId,
          userNamecn:data.userNamecn,
          userNameen:data.userNameen,
          weeklyType:data.weeklyType,
          department: data.depart,
          left:1,
          top:1,
        })
      }
    })
  }
  //搜索
  $(".sou").click(function(){
    apiFindUserPage()
  })

  //增加用户
  $("#addU").click(function(){
    $(this).blur()
    // 创建修改用户html
    layer.open({
      title:'新建用户',
      type: 1,
      area: ['470px', '370px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">角色类型：</label>' +
      '<div class="layui-input-inline">' +
      '<div class="select-box-wrap">' +
      '<div id="addUroleType" class="select-box" li-value="2" style="width: 305px;">' +
      '<span class="text">普通用户</span>' +
      '<ul class="dropdown">' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">姓名：</label>' +
      '<div class="layui-input-inline">' +
      '<input maxlength="16" type="text" id="usernamezh" required  lay-verify="required" placeholder="请输入姓名" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">账号：</label>' +
      '<div class="layui-input-inline">' +
      '<input maxlength="30" type="text" id="usernameen" required lay-verify="required" placeholder="请输入账号" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">周报类型：</label>' +
      '<div class="layui-input-inline">' +
      '<div class="select-box-wrap">' +
      '<div id="addUweeklyTRype" class="select-box" li-value="254" style="width: 305px;">' +
      '<span class="text">合资公司周报</span>' +
      '<ul class="dropdown">'+
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +
      '<div class="layui-form-item">' +
      '<div class="layui-input-block">' +
      '<button class="layui-btn adduser" lay-submit lay-filter="formDemo">保存</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });

    //获取角色类型
    apiFindRoleType($("#addUroleType"));
    //获取周报类型
    apiFindWeeklyTRype($("#addUweeklyTRype"));
    //保存新增用户
    $(".adduser").click(function () {
      var userNameen = $("#usernameen").val()
      var userNamecn = $("#usernamezh").val()
      var weeklytype = $("#addUweeklyTRype").eq(0).attr('li-value')
      var roleid = $("#addUroleType").eq(0).attr('li-value');
      //console.log(userNameen, userNamecn, weeklytype, roleid)
      if(userNamecn.length <1){
        layer.msg("姓名不能为空")
      }else{
        apiAddUser(userNameen, userNamecn, weeklytype, roleid);
      }

    })

    //取消修改
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  })

  //重置
  $("button.cz").click(function() {
    $("#userNamecn").val('');

    $("#usetype2").attr('li-value','');
    $("#usetype2 .text").text('请选择');

    $("#roletype2").attr('li-value','');
    $("#roletype2 .text").text('请选择');

  })
  //初始化
  apiFindRoleType($("#roletype2"), 'init');
  selectBoxInit($("#usetype2"));
  apiFindUserPage();

})

