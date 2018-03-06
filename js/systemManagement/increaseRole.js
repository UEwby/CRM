/**
 * Created by admin on 2017/10/6.
 */
$(function () {
  layui.use(['layer', 'tree'], function(){});
  //查询角色列表
  $("#sourole").click(function () {
    apiFindRoleList()
  })
  //获取角色列表
  function apiFindRoleList(obj) {
    if (!obj) {
      obj = {};
      obj.curr = 1,
        obj.limit = 20
    }

    let data = {
      type: 'get',
      url: '/pc/role/findrolepage?rolename='
      + $("#roleName").val() + '&rows=' + obj.limit + '&page=' + obj.curr + '&v=' + Date.parse(new Date())
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      for(let i=0; i<data.rows.length; i++){
        data.rows[i].createtime = getDateByDay(data.rows[i].createtime)
      }
      let html = template('tempRoleList', data);
      $("#roleLists tbody").html(html);

      pager(obj, data.total, [10,20,50,100], apiFindRoleList, $('.pager'))

      //绑定修改角色事件
      $(".editrole").click(function(){
        var olddata = {
          roleid:$(this).parent().parent().attr("data-roleid"),
          rolename:$(this).parent().parent().attr("data-rolename")
        }
        console.log(olddata);
        createHtmlEdit(olddata.roleid, olddata.rolename)
      })

      //绑定删除事件
      $(".del").click(function(){
        var olddata = {
          isdel:parseInt($(this).parent().parent().attr("data-isdel")),
          roleid:parseInt($(this).parent().parent().attr("data-roleid"))
        }
        //console.log(olddata);
        //删除角色
        createHtmlDel(olddata.isdel, olddata.roleid);
      })

      //绑定分配权限事件
      $(".rolemenu").click(function(){
        var olddata = {
          roleid:parseInt($(this).parent().parent().attr("data-roleid"))
        }
        //console.log(olddata);
        //分配权限html函数
        createHtmlRoleMenu(olddata.roleid);
      })
    })
  }
  //分配权限html
  function createHtmlRoleMenu(roleid){
    layer.open({
      title:"分配权限",
      type: 1,
      area: ['470px', '550px'],
      shadeClose: true, //点击遮罩关闭,
      skin: "",
      content: '\<\div class="open-ext">' +
      '<div class="layui-form" style="text-align:center;">' +

      '<div id="tree" class="ztree" class="layui-form-item" style="text-align:left;margin: 0; padding: 20px;overflow: auto;height: 400px;"></div>' +

      '<div class="layui-form-item">' +
      '<div class="">' +
      '<button class="layui-btn saveMenu" lay-submit lay-filter="formDemo">保存</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });

    var id = '';
    findrolemenu(roleid)
    function findrolemenu(roleid){
      let data = {
        type: 'get',
        url: '/pc/role/findrolemenu?roleid='+roleid+'&v=' + Date.parse(new Date())
      };
      Ajax(data).then(function (data) {
        console.log(data)
        var setting = {
          check : {
            enable : true,
            chkDisabledInherit : true
          },
          data : {
            simpleData : {
              enable : true
            }
          }
        };
        $.fn.zTree.init($("#tree"), setting, data);
        disabledNode()
      })
    }
    function disabledNode() {
      var zTree = $.fn.zTree.getZTreeObj("tree");
      var disabled = true;

      var nodes = zTree.getNodes();
      var inheritParent = false;
      var inheritChildren = false;
      if (nodes.length == 0) {
        layer.msg("请先选择一个节点");
      }
      if (disabled) {
        inheritParent = $("#py").attr("checked");
        inheritChildren = $("#sy").attr("checked");
      }

      /*for (var i = 0, l = nodes.length; i < l; i++) {
        if (nodes[i].name == "客户" || nodes[i].name == "商机"
          || nodes[i].name == "联系人" || nodes[i].name == "合资公司") {
          id+=nodes[i].id+",";
          nodes[i].checked=true;
          zTree.setChkDisabled(nodes[i], disabled, inheritParent,
            inheritChildren);
        }
      }*/
    }
    //保存权限分配
    $(".saveMenu").click(function () {
      var zTree = $.fn.zTree.getZTreeObj("tree");
      var nodes = zTree.getCheckedNodes(true);
      for (var i = 0; i< nodes.length; i++) {
        id+=nodes[i].id+",";
      }
      if (id == "") {
        layer.msg("请选择菜单");
        return false;
      }
      let data = {
        type:'post',
        url:'/pc/role/rolemenu',
        data:{menuid: id, roleid: roleid}
      };
      Ajax(data).then(function (data) {
        if (data == 0) {
          layer.msg("操作失败");
          layer.closeAll('page');
        } else {
          layer.msg("操作成功");
          layer.closeAll('page');
        }
      })
    })
    //取消操作
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }

  //删除角色html
  function createHtmlDel(isdel, roleid){
    layer.open({
      title:false,
      type: 1,
      closeBtn: 0,
      area: ['470px', '200px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext open-no-title">' +
      '<div class="layui-form" style="text-align:center;">' +

      '<div class="layui-form-item" style="font-size:20px;">' +
      '确定删除该角色？' +
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
      roledel(
        isdel, roleid
      );
    })
    //取消删除
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }
  // 删除角色服务
  function roledel(isdel, roleid){
    let data = {
      type:'post',
      url:'/pc/role/roledel',
      data:{
        isdel:isdel, roleid:roleid
      }
    };
    Ajax(data).then(function (data) {
      console.log(data)
      if(data == 1){
        layer.msg('删除成功');
        layer.closeAll('page');
        apiFindRoleList()
      }else{
        layer.closeAll('page');
        layer.msg('操作失败');
      }
    })
  }
  // 创建修改角色html
  function createHtmlEdit(roleid, rolename){
    layer.open({
      title:'编辑角色',
      type: 1,
      area: ['470px', '180px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">角色名称：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="editrolename" required  lay-verify="required" placeholder="请输入角色名称" autocomplete="off" class="layui-input">' +
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
    //输入框初始化
    //console.log(roleid, rolename)
    $("#editrolename").val(rolename)
    //保存修改
    $(".edit").click(function () {
      if($("#editrolename").val().length <1){
        layer.msg("角色名称不能为空")
      }else{
        apiEditRole(
          roleid,
          $("#editrolename").val()
        )
      }

    })
    //取消修改
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }
  //修改角色
  function apiEditRole(roleid, rolename){
    let data = {
      type: 'post',
      url: '/pc/role/roleedit',
      data: {
        rolename: rolename,
        roleid: roleid
      }
    };
    Ajax(data).then(function (data) {
      console.log(data)
      if(data == 1){
        layer.closeAll('page');
        layer.msg('修改角色成功');
        apiFindRoleList()
      }else{
        layer.closeAll('page');
        layer.msg('修改角色失败')
      }
    })
  }
  //增加角色
  $("#addrole").click(function () {
    $(this).blur()
    layer.open({
      title:'新建角色',
      type: 1,
      area: ['470px', '175px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +
      '<div class="layui-form-item">' +
      '<label class="layui-form-label">角色名称：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="addrolename" required  lay-verify="required" placeholder="请输入角色名称" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +
      '<div class="layui-form-item">' +
      '<div class="layui-input-block">' +
      '<button class="layui-btn save-role-add" lay-submit lay-filter="formDemo">保存</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });
    //保存角色
    $(".save-role-add").click(function(){
      if($("#addrolename").val().length<1){
        layer.msg("角色名称不能为空")
      }else{
        let data = {
          type: 'post',
          url: '/pc/role/roleedit',
          data: {
            rolename: $("#addrolename").val(),
            roleid:''
          }
        };
        Ajax(data).then(function (data) {
          //console.log(data)
          if(data == 1){
            layer.closeAll('page');
            layer.msg('新建角色成功')
            apiFindRoleList()
          }else{
            layer.closeAll('page');
            layer.msg('新建角色失败')
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
    $("#roleName").val('');
  })
  //初始化列表
  apiFindRoleList();
})