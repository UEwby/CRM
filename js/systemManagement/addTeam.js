/**
 * Created by admin on 2017/10/6.
 */
$(function(){
  layui.use('layer', function(){});
  //查询团队列表
  $(".sou").click(function(){
    apiFindGroupList()
  })
  //获取团队列表
  function apiFindGroupList(obj) {
    if (!obj) {
      obj = {};
      obj.curr = 1,
        obj.limit = 20
    }
    let data = {
      type:'get',
      url:'/pc/sys/findgrouplist?groupname='
      +$("#groupname").val()+'&groupcategory='+$("#teamTypeList").attr('li-value')+'&rows='+obj.limit+'&page='+obj.curr+'&v='+ Date.parse(new Date())
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      for(let i=0; i<data.rows.length; i++){
        data.rows[i].createtime = getDateByDay(data.rows[i].createtime)
      }
      let html = template('tempTeamList', data);
      $("#teamList tbody").html(html)

      pager(obj, data.total, [10,20,50,100], apiFindGroupList, $('.pager'))

      //绑定修改团队事件
      $(".editteam").click(function(){
        var olddata = {
          groupname:$(this).parent().parent().attr("data-groupname"),
          groupcategory:$(this).parent().parent().attr("data-groupcategory"),
          groupid:$(this).parent().parent().attr("data-groupid"),
          groupcategoryname:$(this).parent().parent().attr("data-groupcategoryName")
        }
        //console.log(olddata);
        createHtmlEdit(olddata.groupname, olddata.groupcategory, olddata.groupcategoryname, olddata.groupid)
      })
      //绑定删除事件
      $(".del").click(function(){
        var groupid = parseInt($(this).parent().parent().attr("data-groupid"))
        //console.log(olddata);
        //删除团队
        createHtmlDel(groupid);
      })

      //绑定成员管理事件
      $(".member").click(function () {
        var groupid = parseInt($(this).parent().parent().attr("data-groupid"))
        //console.log(olddata);
        //团队成员管理
        createHtmlNumber(groupid);
      })

    })
  }
  //团队成员管理html
  function createHtmlNumber(groupid){
    var leaderUserId = '';
    layer.open({
      title:"团队成员管理",
      type: 1,
      area: ['650px', '480px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<div class="layui-form" style="text-align:center;">' +
      '<div class="ct-cell purview-list">' +
      '<div class="pur-list-cell">' +
      '<div class="pur-list-cell-label">当前团队成员</div>' +
      '<ul class="has-purview getListLeft1 no-purviewnew" id="groupuserlist" style="width:250px">' +
      '</ul>' +
      '</div>' +
      '<div class="pur-list-mid">' +
      '<div class="add-to-left1"></div>' +
      '<div class="add-to-right1"></div>' +
      '<div class="add-allto-right1"></div>' +
      '<div class="add-allto-left1"></div>' +
      '</div>' +
      '<div class="pur-list-cell">' +
      '<div class="pur-list-cell-label">' +
      '<span>团队外成员 </span>' +
      '<div class="pur-search">' +
      '<input type="text" id="otheruser"><span id="souwai">搜索</span>' +
      '</div>' +
      '</div>' +
      '<ul class="no-purview getListRight1 no-purviewnew" id="othergroupuserlist" style="width:250px"></ul>' +
      '</div>' +
      '</div>' +

      '<div class="layui-form-item btn-wrap">' +
      '<button class="layui-btn savenumber" lay-submit lay-filter="formDemo">保存</button>' +
      '<button class="layui-btn setleader" lay-submit lay-filter="formDemo">设置领导</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>\<\/div>'
    });

    //加载当前团队成员
    function getgroupuser(groupid){
      var data = {
        type:'get',
        url:'/pc/sys/getgroupuser?groupid='+ groupid + '&v='+ Date.parse(new Date())
      };
      Ajax(data).then(function (data) {
        //console.log(data)
        var html = '';
        data.forEach(function (value) {
          html += '<li style="position: relative;" class="eve" data-userId="'+ value.userId + '" data-isleader="'+ value.isLeader + '"><span>' + value.userNamecn + '</span>';
          if(value.isLeader == 1){
            html += '<i class="right" style="position: absolute;right: 5px;font-size: 13px;">部门领导</i>'
          }
          html +='</li>'
        })
        $("#groupuserlist").html(html)
        $("#groupuserlist li.eve span").click(function(){
          $(this).parent().toggleClass('active')
        })
      })
    }

    //加载当前团队外成员
    function othergroupuser(groupid){
      var data = {
        type:'get',
        url:'/pc/sys/othergroupuser?groupid='+ groupid + '&userNamecn=' + $("#otheruser").val() + '&v='+ Date.parse(new Date())
      };
      Ajax(data).then(function (data) {
        //console.log(data)
        var html = '';
        data.forEach(function (value) {
          html += '<li class="eve" data-userId="'+ value.userId + '" data-isleader="0"><span>' + value.userNamecn + '</span></li>'
        })
        $("#othergroupuserlist").html(html)
        $("#othergroupuserlist li.eve span").click(function(){
          $(this).parent().toggleClass('active')
        })
      })
    }

    getgroupuser(groupid);
    othergroupuser(groupid);
    $("#souwai").click(function(){
      othergroupuser(groupid)
    })
    // 移入成员
    $(".add-to-left1").click(function () {
      var eve = $("#othergroupuserlist li.active");
      if(!eve){
        return false
      }
      eve.remove().removeClass("active").appendTo("#groupuserlist").click(function(){
        $(this).toggleClass('active')
      })
    })
    // 移出成员
    $(".add-to-right1").click(function () {
      var eve = $("#groupuserlist li.active");
      if(!eve){
        return false
      }

      if(eve.find("i")){
        eve.find("i").remove()
      }
      eve.remove().removeClass("active").appendTo("#othergroupuserlist").click(function(){
        $(this).toggleClass('active')
      }).attr("data-isleader", 0);
    })

    // 移入所有成员
    $(".add-allto-left1").click(function () {
      var eve = $("#othergroupuserlist li");
      if(!eve){
        return false
      }
      eve.remove().removeClass("active").appendTo("#groupuserlist").click(function(){
        $(this).toggleClass('active')
      })
    })
    // 移出所有成员
    $(".add-allto-right1").click(function () {
      var eve = $("#groupuserlist li");
      if(!eve){
        return false
      }
      if(eve.find("i")){
        //console.log(eve.find("i"))
        eve.find("i").remove()
      }
      eve.remove().removeClass("active").appendTo("#othergroupuserlist").click(function(){
        $(this).toggleClass('active')
      }).removeAttr("data-isleader");
    })
    $(".setleader").click(function() {
      if($("#groupuserlist li").length == 0){
        layer.msg("请添加团队成员")
        return false
      }
      var _layer_ = layer.open({
        title:"团队成员管理",
        type: 1,
        area: ['650px', '480px'],
        shadeClose: true, //点击遮罩关闭
        content: '\<\div class="open-ext">' +
        '<div class="layui-form" style="text-align:center;">' +
        '<div class="ct-cell purview-list">' +
        '<div class="pur-list-cell" style="margin-right:30px;">' +
        '<div class="pur-list-cell-label">当前团队成员</div>' +
        '<ul class="has-purview getListLeft1 no-purviewnew" id="groupuserlist2" style="width:250px">' +
        '</ul>' +
        '</div>' +
        '<div class="pur-list-cell">' +
        '<div class="pur-list-cell-label">' +
        '<span>当前领导： </span>' +
        '</div>' +
        '<ul class="no-purview getListRight1 no-purviewnew" id="curLeader" style="width:250px"></ul>' +
        '</div>' +
        '</div>' +

        '<div class="layui-form-item" style="margin-top:10px;">' +
        '<div class="layui-input-inline" style="line-height:32px;">' +
        '备注：领导有权利监督团队成员工作进度' +
        '</div>' +
        '<div class="layui-input-inline">' +
        '<button class="layui-btn setleader2" lay-submit lay-filter="formDemo">保存</button>' +
        '<button type="reset" class="layui-btn layui-btn-primary close-ext2">取消</button>' +
        '</div>' +
        '</div>' +
        '</div>\<\/div>'
      });
      //装在当前组成员及单选框
      $("#groupuserlist li").each(function(){
        var html = '';
        html += '<li data-userId="'+ $(this).attr("data-userId") + '" data-isleader="'+ $(this).attr("data-isleader") + '">';

        if($(this).attr("data-isleader") == '1'){
          html += '<input style="float: left;margin-top: 4px;display: inline-block;" type="radio" name="isleader" checked value="'+$(this).attr("data-userId")+'">';
          $('<li data-userId="'+ $(this).attr("data-userId") + '"></li>').append("<span>"+$(this).find("span").text()+"</span>").appendTo($("#curLeader"))
        }else {
          html += '<input style="float: left;margin-top: 4px;display: inline-block;" type="radio" name="isleader" value="'+$(this).attr("data-userId")+'">';
        }

        html += '<span style="float: left;display: inline-block;padding: 0 5px;">'+$(this).find("span").text() + '</span></li>';
        $("#groupuserlist2").append(html);


      })
      //设置领导按钮
      $(".setleader2").click(function () {
        if($("#groupuserlist2 input[name='isleader']:checked").length == 0){
          layer.msg("请设置团队领导")
          return false
        }
        leaderUserId = $("#groupuserlist2 input[name='isleader']:checked").val();
        $("#groupuserlist li").each(function () {
          if($(this).attr('data-userId') == leaderUserId){
            //console.log('是' )
            if($(this).attr('data-isleader') == '0'){
              $(this).append('<i class="right" style="position: absolute;right: 25px;font-size: 13px;">部门领导</i>');
            }
            $(this).attr('data-isleader', 1).siblings().attr('data-isleader', 0);
            $(this).siblings().find("i").remove();

          }
        })
        layer.close(_layer_);
      })
      //取消
      $(".close-ext2").click(function(){
        layer.close(_layer_);
      })
    })
    //确定
    $(".savenumber").click(function () {
      //console.log(leaderUserId)
      var leaderFlag = false//用于判断是否设置了领导
      var userlist = []
      $("#groupuserlist li").each(function() {
        var obj = {
          userid: parseInt($(this).attr("data-userId")),
          isleader: parseInt($(this).attr("data-isleader"))
        }
        //
        if(obj.isleader == 1){
          leaderFlag = true
        }
        userlist.push(obj)
      })
      if($("#groupuserlist li").length == 0){
        layer.msg("请添加团队成员")
        return false
      }else{
        if(!leaderFlag){
          layer.msg("请设置团队领导")
          return false
        }
      }
      let data = {
        type:'post',
        url:'/pc/sys/addgroupuser',
        data:{
          groupid:groupid,
          list:userlist,
        }
      };
      Ajax(data).then(function (data) {
        console.log(data)
        if(data == 1){
          layer.msg('操作成功');
          layer.closeAll('page');
          apiFindGroupList()
        }else{
          layer.closeAll('page');
          layer.msg('操作失败');
          apiFindGroupList()
        }
      })

    })
    //取消
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
    function ii(){

    }
  }
  //删除团队html
  function createHtmlDel(groupid){
    layer.open({
      title:false,
      type: 1,
      closeBtn: 0,
      area: ['470px', '200px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext open-no-title">' +
      '<div class="layui-form" style="text-align:center;">' +

      '<div class="layui-form-item" style="font-size:20px;">' +
      '确定删除该团队？' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<div class="">' +
      '<button class="layui-btn ok" lay-submit lay-filter="formDemo">确定</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });

    //删除按钮
    $(".ok").click(function () {
      roledel(groupid);
    })
    //取消删除
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }
  // 删除团队服务
  function roledel(groupid){
    let data = {
      type:'post',
      url:'/pc/sys/group/del',
      data:{
        isdel:1, groupid:groupid
      }
    };
    Ajax(data).then(function (data) {
      console.log(data)
      if(data == 1){
        layer.msg('删除成功');
        layer.closeAll('page');
        apiFindGroupList()
      }else{
        layer.closeAll('page');
        layer.msg('操作失败');
      }
    })
  }
  // 创建修改html
  function createHtmlEdit(groupname, groupcategory, groupcategoryname, groupid){
    layer.open({
      title:'编辑团队',
      type: 1,
      area: ['470px', '275px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">团队名称：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="editgroupname" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">团队类型：</label>' +
      '<div class="layui-input-inline">' +
      '<div class="select-box-wrap">' +
      '<div id="editteamtype" class="select-box" li-value="260" style="width: 305px;">' +
      '<span class="text">合资公司</span>' +
      '<ul class="dropdown">' +
      '<li li-value="260">合资公司</li>' +
      '<li li-value="261">独立纵队</li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<div class="layui-input-block">' +
      '<button class="layui-btn edit" lay-submit lay-filter="formDemo">保存</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });
    //下拉菜单初始化
    selectBoxInit($("#editteamtype"))
    //输入框、下拉菜单初始化
    //console.log(groupname, groupcategory, groupcategoryname, groupid)

    $("#editteamtype").attr("li-value", groupcategory)
    $("#editteamtype .text").text(groupcategoryname)
    $("#editgroupname").val(groupname)
    //保存修改
    $(".edit").click(function () {
      if($("#editgroupname").val().length <1){
        layer.msg("团队名称不能为空")
      }else{
        apiEditTeam(
          $("#editgroupname").val(),
          parseInt($("#editteamtype").attr("li-value")),
          groupid
        )
      }
    })
    //取消修改
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }

  //编辑团队服务
  function apiEditTeam(groupname, groupcategory, groupid) {

    let data = {
      type:'post',
      url:'/pc/sys/group/edit',
      data:{
        groupname:groupname,
        groupcategory:groupcategory,
        groupid:groupid
      }
    };
    Ajax(data).then(function (data) {
      console.log(data)
      if(data == 1){
        layer.closeAll('page');
        layer.msg('编辑团队成功');
        apiFindGroupList()
      }else{
        layer.closeAll('page');
        layer.msg('编辑团队失败');
      }
    })
  }
  //添加团队
  $("#addteam").click(function () {
    $(this).blur()
    layer.open({
      title:'新建团队',
      type: 1,
      area: ['470px', '275px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +
      '<div class="layui-form-item">' +
      '<label class="layui-form-label">团队名称：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="addteamname" required  lay-verify="required" placeholder="请输入团队名称" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +
      '<div class="layui-form-item">' +
      '<label class="layui-form-label">团队类型：</label>' +
      '<div class="layui-input-inline">' +
      '<div class="select-box-wrap">' +
      '<div id="addteamtype" class="select-box" li-value="260" style="width: 305px;">' +
      '<span class="text">合资公司</span>' +
      '<ul class="dropdown">'+
      '<li li-value="260">合资公司</li>' +
      '<li li-value="261">独立纵队</li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +
      '<div class="layui-form-item">' +
      '<div class="layui-input-block">' +
      '<button class="layui-btn save-team-add" lay-submit lay-filter="formDemo">保存</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });
    selectBoxInit($("#addteamtype"))
    //保存团队
    $(".save-team-add").click(function(){
      if($("#addteamname").val().length <1){
        layer.msg("团队名称不能为空")
      }else{
        let data = {
          type: 'post',
          url: '/pc/sys/group/add',
          data: {
            groupname : $("#addteamname").val(),
            groupcategory : $("#addteamtype").attr('li-value')
          }
        };
        Ajax(data).then(function (data) {
          //console.log(data)
          if(data == 1){
            layer.closeAll('page');
            layer.msg('新建团队成功');
            apiFindGroupList()
          }else{
            layer.closeAll('page');
            layer.msg('新建团队失败')
          }
        })
      }
    })
    //取消新建
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  })

  //重置
  $("button.cz").click(function() {
    $("#groupname").val('');
    $("#teamTypeList").attr('li-value',0);
    $("#teamTypeList .text").text('请选择');
  })

  //初始化
  apiFindGroupList();
  selectBoxInit($("#teamTypeList"))
})