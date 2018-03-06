/**
 * Created by admin on 2017/10/6.
 */
$(function(){

  findwordbookallflag($("#wordflag"))
  findwblist()


  //请求服务

  //1.查询数据字典列表
  function findwblist(obj){
    if (!obj) {
      obj = {};
      obj.curr = 1,
        obj.limit = 20
    }

    let url = ''
    if($("#wordflag").attr('li-value')){
      url = '/pc/sys/findwblist?wordname='+$("#wordname").val() + '&wordflag='+$("#wordflag").attr('li-value')+'&rows='+obj.limit+'&page='+obj.curr+'&v='+ Date.parse(new Date())
    }else{
      url = '/pc/sys/findwblist?wordname='+$("#wordname").val() + '&rows='+obj.limit+'&page='+obj.curr+'&v='+ Date.parse(new Date())
    }
    let data = {
      type:'get',
      url: url
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      $("#wordlist tbody").html('')
      if(data.total > 0){
        data.rows.forEach(function (value, index) {
          var flagname = (value.flagname == null) ? '未知': value.flagname
          var creatordate = getDateByDay(value.creatordate)
          let html = `<tr id="${value.id}" name="${value.name}" value="${value.value}" flagname="${value.flagName}" flag="${value.flag}" sort="${value.sort}">
                        <td>${index+1}</td>
                        <td>${value.name}</td>
                        <td>${flagname}</td>
                        <td>${value.creatorname}</td>
                        <td>${creatordate}</td>
                        <td>
                          <a class="nodec editUser">编辑</a>
                          <a class="nodec del">删除</a>
                        </td>
                      </tr>`
          $("#wordlist tbody").append(html)
        })
      }else{
        $("#wordlist tbody").append('<tr><td colspan="6">暂无数据</td></tr>')
      }
      pager(obj, data.total, [10,20,50,100], findwblist, $('.pager'))

      //编辑事件绑定
      $("#wordlist tbody .editUser ").click(function(){
        var parent = $(this).parent().parent()
        var params = {
          name:parent.attr('name'),
          value:parent.attr('value'),
          flag:parent.attr('flag'),
          flagname:parent.attr('flagname'),
          sort:parent.attr('sort'),
          id:parent.attr('id')
        }
        editwordHtml(params)
      })
      //删除事件绑定
      $("#wordlist tbody .del ").click(function(){
        var parent = $(this).parent().parent()
        var params = {
          isdel: 1,
          id: parent.attr('id')
        }
        //apiwbdel(params)
        apiwbdelHtml(params)
      })
    })
  }

  //2.获取所有字典类型
  function findwordbookallflag(dom){
    let data = {
      type:'get',
      url: '/crmcustomerwordbook/findwordbookallflag'
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      data.forEach(function (value) {
        dom.find(".dropdown").append(`<li li-value="${value.flag}">${value.flagName}</li>`)
      })
      //系统字典类别初始化
      selectBoxInitHomePge(dom)
    })
  }

  //3.编辑字典服务
  function apiwbedit(params) {
    let data = {
      type:'post',
      url:'/pc/sys/wb/edit',
      data:params
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      if(data == 1){
        layer.closeAll('page');
        layer.msg('编辑字典成功');
        findwblist()
      }else{
        layer.closeAll('page');
        layer.msg('编辑字典失败');
      }
    })
  }
  //4.新建字典服务
  function apiwbadd(params) {
    let data = {
      type:'post',
      url:'/pc/sys/wb/add',
      data:params
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      if(data == 1){
        layer.closeAll('page');
        layer.msg('新建字典成功');
        findwblist()
      }else{
        layer.closeAll('page');
        layer.msg('新建字典失败');
      }
    })
  }
  //5.删除字典服务
  function apiwbdel(params) {
    let data = {
      type:'post',
      url:'/pc/sys/wb/del',
      data:params
    };
    Ajax(data).then(function (data) {
      //console.log(data)
      if(data == 1){
        layer.closeAll('page');
        layer.msg('删除字典成功');
        findwblist()
      }else{
        layer.closeAll('page');
        layer.msg('删除字典失败');
      }
    })
  }

  //新建字典点击事件
  $("#addword").click(function(){
    layer.open({
      title:'新建字典',
      type: 1,
      area: ['470px', '340px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">字典名称：</label>' +
      '<div class="layui-input-inline">' +
      '<input maxlength="30" type="text" id="addname" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">字典类型：</label>' +
      '<div class="layui-input-inline">' +
      '<div class="select-box-wrap">' +
      '<div id="addflag" class="select-box" style="width: 305px;" li-value="">' +
      '<span class="text">请选择</span>' +
      '<ul class="dropdown">' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">排序：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="addsort" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">字典值：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="addvalue" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<div class="layui-input-block">' +
      '<button class="layui-btn addword" lay-submit lay-filter="formDemo">保存</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });

    //字典类型初始化
    findwordbookallflag($("#addflag"))
    $("#addflag").attr('li-value', 'AppPlatform')
    $("#addflag .text").text('应用程序类型')
    //保存修改
    $(".addword").click(function () {
      var reg = new RegExp("^[0-9]*$")
      if($("#addname").val().length <1){
        layer.msg("字典名称不能为空")
        return false
      }
      if($("#addflag").attr("li-value").length <1){
        layer.msg("字典类型是必选项")
        return false
      }
      if($("#addsort").val().length <1){
        layer.msg("字典排序不能为空")
        return false
      }
      if($("#addvalue").val().length <1){
        layer.msg("字典值不能为空")
        return false
      }
      if(!reg.test($("#addsort").val())){
        layer.msg("字典排序必须是整数")
        return false
      }

      apiwbadd({
        name: $("#addname").val(),
        value: $("#addvalue").val(),
        flag: $("#addflag").attr('li-value'),
        sort: parseInt($("#addsort").val())
      })
    })
    //取消修改
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  })

  //编辑字典html片段
  function editwordHtml(params){
    layer.open({
      title:'编辑字典',
      type: 1,
      area: ['470px', '340px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">字典名称：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="editname" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">字典类型：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" id="editflag" disabled required  lay-verify="required" placeholder="请输入" style="background-color:#F2F2F2;" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">排序：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="editsort" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">字典值：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="text" maxlength="30" id="editvalue" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<div class="layui-input-block">' +
      '<button class="layui-btn editword" lay-submit lay-filter="formDemo">保存</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });

    //数据初始化
    $("#editname").val(params.name)
    $("#editflag").val(params.flagname)
    $("#editsort").val(params.sort)
    $("#editvalue").val(params.value)
    //保存修改
    $(".editword").click(function () {
      var reg = new RegExp("^[0-9]*$");
      if($("#editname").val().length <1){
        layer.msg("字典名称不能为空")
        return false
      }
      if(!reg.test($("#editsort").val())){
        layer.msg("字典排序必须是整数")
        return false
      }

      apiwbedit({
        id: params.id,
        name: $("#editname").val(),
        value: $("#editvalue").val(),
        flag: params.flag,
        sort: parseInt($("#editsort").val())
      })
    })
    //取消修改
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }

  //删除字典html片段
  function apiwbdelHtml(params){
    layer.open({
      title:false,
      type: 1,
      closeBtn: 0,
      area: ['470px', '200px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext open-no-title">' +
      '<div class="layui-form" style="text-align:center;">' +

      '<div class="layui-form-item" style="font-size:20px;">' +
      '确定删除该字典？' +
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
      apiwbdel(params);
    })
    //取消删除
    $(".close-ext").click(function(){
      layer.closeAll('page');
    })
  }
  //搜索
  $(".sou").click(function(){
    findwblist()
  })
  //重置
  $("button.cz").click(function() {
    $("#wordname").val('');
    $("#wordflag").attr('li-value',0);
    $("#wordflag .text").text('请选择');
  })
})