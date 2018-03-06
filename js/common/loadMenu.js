/**
 * Created by wangbinyan on 2017/10/22.
 */
var menus = {}
$(function () {

  //登录接口
  function apiFindMenu() {
    var userId = getSession('crmMsg').userId
    let data = {
      type: 'get',
      url: '/pc/crmmenu/findmenu?id=' + userId
    };
    Ajax(data).then(function (data) {
      menus = data
      $("#barRole").append('<li class="bar-index" name="1"><a href="../index/index.html">首  页</a></li>');
      data.forEach(function (value) {
        switch (value.menuname) {
          case '客户管理':
            $("#barRole").append('<li class="bar-customer" name="2"><a href="../customerManagement/index.html">客户管理</a></li>');
            break;
          case '商机管理':
            $("#barRole").append('<li class="bar-opportunity" name="3"><a href="../opportunityManagement/index.html">商机管理</a></li>');
            break;
          case '合资公司':
            $("#barRole").append('<li class="bar-joint" name="4"><a href="../jointVenture/index.html">合资公司</a></li>');
            break;
          case '跟进记录':
            $("#barRole").append('<li class="bar-follow" name="5"><a href="../followRecords/index.html">跟进记录</a></li>');
            break;
          case '招标管理':
            $("#barRole").append('<li class="bar-tender" name="6"><a href="../tenderManagement/index.html">招标管理</a></li>');
            break;
          case '战略合作':
            $("#barRole").append('<li class="bar-strategic" name="7"><a href="../strategicCooperation/index.html">战略合作</a></li>');
            break;
          case '系统管理':
            $("#barRole").append('<li class="bar-system" name="8"><a href="../systemManagement/index.html">系统管理</a></li>');
            break;
          case '个人中心':
            $("#barRole").append('<li class="bar-personal" name="9"><a href="../personalCenter/index.html">个人中心</a></li>');
            break;
          default:
            break;
        }
      });
      menuHead();
    })

  }

  function menuHead() {
    let html='';
    switch (getSession('crmMsg').left){
      case '0':
        html += '<li name="1"><a href="../messageCenter/index.html">消息中心</a></li>';
        $('.topUlL').html(html);
        break;
      case '1':
        html += '<li name="1"><a href="../index/index.html">首页</a></li>';
        $('.topUlL').html(html);
        break;
      case '2':
        html += '<li name="1"><a href="../customerManagement/index.html">客户</a></li>';
        html += '<li name="2"><a href="../customerManagement/customerPool.html">客户池</a></li>';
        html += '<li name="3"><a href="../customerManagement/linker.html">客户联系人</a></li>';
        $('.topUlL').html(html);
        break;
      case '3':
        html += '<li name="1"><a href="../opportunityManagement/index.html">商机</a></li>';
        $('.topUlL').html(html);
        break;
      case '4':
        html += '<li name="1"><a href="../jointVenture/index.html">合资公司</a></li>';
        $('.topUlL').html(html);
        break;
      case '5':
        html += '<li name="1"><a href="../followRecords/index.html">跟进记录</a></li>';
        $('.topUlL').html(html);
        break;
      case '6':
        html += '<li name="1"><a href="../tenderManagement/index.html">招标管理</a></li>';
        $('.topUlL').html(html);
        break;
      case '7':
        html += '<li name="1"><a href="../strategicCooperation/index.html">战略合作</a></li>';
        $('.topUlL').html(html);
        break;
      case '8':
        html += '<li name="1"><a href="../systemManagement/index.html">用户管理</a></li>';
        html += '<li name="2"><a href="../systemManagement/increaseRole.html">角色管理</a></li>';
        html += '<li name="3"><a href="../systemManagement/addTeam.html">团队管理</a></li>';
        html += '<li name="4"><a href="../systemManagement/addDictionary.html">系统字典</a></li>';
        $('.topUlL').html(html);
        break;
      case '9':
        html += '<li name="1"><a href="../personalCenter/index.html">我的日报</a></li>';
        html += '<li name="2"><a href="../personalCenter/myWeekly.html">我的周报</a></li>';
        html += '<li name="3"><a href="../personalCenter/myTender.html">我的招标</a></li>';
        html += '<li name="4"><a href="../personalCenter/businessReview.html">商机审核</a></li>';
        $('.topUlL').html(html);
        break;

    }
    //给导航栏和header添加active
    $('#barRole li[name='+getSession('crmMsg').left+']').attr('class','active');
    $('.topUlL li[name='+getSession('crmMsg').top+']').attr('class','active');

    $('.topUlL li a').click(function () {
      pushSession('crmMsg',{
        top:$(this).parent().attr('name'),
      })
    });
    $('#barRole li').click(function () {
      pushSession('crmMsg',{
        left:$(this).attr('name'),
        top:1,
      })
    });
    $(".msgs").click(function() {
      pushSession('crmMsg',{
        left:$(this).attr('name'),
        top:1
      })
    })

  }

  // 登陆溢出判断
  function isLogin(){
    let data = {
      type: 'get',
      url: '/sysuser/isLogin'
    };
    Ajax(data).then(function (data) {
      if (data.loginType == "-1") {
        location.href = '../../html/login/login.html'
      }else{
        apiFindMenu()
      }
    })
  }

  //1.未登录判断接口
  //isLogin()

  //2.暂时不进行未登录判断，直接加载权限，调试完毕后放开isLogin()接口
  apiFindMenu()



  //退出事件绑定
  $(".loginout a").click(function () {
    $(this).blur()
    layer.open({
      title: false,
      type: 1,
      closeBtn: 0,
      area: ['470px', '200px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext open-no-title">' +
      '<div class="layui-form" style="text-align:center;">' +

      '<div class="layui-form-item" style="font-size:20px;">' +
      '确定退出登录？' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<div class="">' +
      '<button class="layui-btn loginout-ok" lay-submit lay-filter="formDemo">确定</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });

    //确定
    $(".loginout-ok").click(function () {
      loginout()
    });
    //取消删除
    $(".close-ext").click(function () {
      layer.closeAll('page');
    })

  });

  //退出登录事件
  function loginout(){
    let data = {
      type: 'get',
      url: '/pc/loginOut'
    };
    Ajax(data).then(function (data) {
      if (data.backHttpResult.code == '000') {
        sessionStorage.clear()
        document.cookie = ""
        location.href = '../../html/login/login.html'
      }
    })
  }

  //修改密码事件绑定
  $(".setpw a").click(function () {
    $(this).blur()
    layer.open({
      title: '修改密码',
      type: 1,
      area: ['470px', '275px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div class="open-ext">' +
      '<hr />' +
      '<div class="layui-form">' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">原密码：</label>' +
      '<div class="layui-input-inline">' +
      '<input type="password" id="olduserPwd" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">' +
      '</div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">新密码：</label>' +
      '<div class="layui-input-inline">' +
      '<input maxlength="16" type="password" id="userPwd" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input"></div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<label class="layui-form-label">确认密码：</label>' +
      '<div class="layui-input-inline">' +
      '<input maxlength="16" type="password" id="conPwd" required  lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input"></div>' +
      '<span class="color-red">*</span>' +
      '</div>' +

      '<div class="layui-form-item">' +
      '<div class="layui-input-block">' +
      '<button class="layui-btn editpwd" lay-submit lay-filter="formDemo">保存</button>' +
      '<button type="reset" class="layui-btn layui-btn-primary close-ext">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>\<\/div>'
    });
    $(".editpwd").click(function () {
      let params = {
        olduserPasswd: document.getElementById("olduserPwd").value,
        userPasswd: document.getElementById("userPwd").value
      };
      let conPasswd = document.getElementById("conPwd").value;
      if (!params.olduserPasswd || params.olduserPasswd == "") {
        layer.msg('原密码不能为空')
        return false
      }
      if (!params.userPasswd || params.userPasswd == "") {
        layer.msg('新密码不能为空')
        return false
      }
      if (!conPasswd || conPasswd == "") {
        layer.msg('确认密码不能为空')
        return false
      }
      if (params.userPasswd != conPasswd) {
        layer.msg('新密码和确认密码必须相等')
        return false
      }
      var reg = /^[A-Za-z0-9]{6,16}$/;
      if(!reg.test(params.userPasswd)){
        layer.msg('新密码必须为6-16位字母数字组合')
        return false
      }
      let data = {
        type: 'post',
        url: '/pc/sys/updatepwd',
        data: params
      };
      Ajax(data).then(function (data) {
        if (data == -1) {
          layer.msg('原密码错误')
        } else if (data == 0) {
          layer.msg('密码修改失败')
          layer.closeAll('page')
        } else if (data == -2) {
          layer.msg('新密码是默认密码请修改')
          layer.closeAll('page')
        } else {
          layer.msg('密码修改成功')
          layer.closeAll('page')
          loginout()
        }
      })
    });
    //取消
    $(".close-ext").click(function () {
      //console.log(111)
      layer.closeAll('page');
    })
  })

})