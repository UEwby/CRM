/**
 * Created by wangbinyan on 2017/11/7.
 */

$(function () {
  layui.use('layer', function(){})
  //登录接口
  function apiLogin() {
    let data = {
      type:'get',
      url:'pc/finduser?userNameen='+$('#userName').val()+'&userPasswd='+$('#password').val()
    };
    Ajax(data).then(function (data) {
      console.log(data)
      if(data.backHttpResult.code=='000'){
        setSession('crmMsg',{
          userId:data.userId,
          userNamecn:data.userNamecn,
          userNameen:data.userNameen,
          weeklyType:data.weeklyType,
          department: data.depart,
          left:1,
          top:1,
        });

        //setCookie('netSiteUserId',$("#username").val(),1);
        window.location.href='../../html/index/index.html'
      }else if(data.backHttpResult.code=='111'){
        layer.msg('请修改初始密码')
        window.location.href='../../html/login/updateInitialPwd.html'
      }else{
        layer.msg('密码或帐号输入错误')
      }
    })
  }
  function updateInitialPwd(){
    let params = {
      olduserPasswd: '123456',
      userPasswd: document.getElementById("userPwd").value
    };
    let conPasswd = document.getElementById("conPwd").value;
    var reg = /^[A-Za-z0-9]{6,16}$/;
    if (!params.userPasswd || params.userPasswd == "") {
      layer.msg('新密码不能为空')
      return false
    }
    if (!reg.test(params.userPasswd)) {
      layer.msg('新密码必须为6-16位字母数字组合')
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
    let data = {
      type: 'post',
      url: '/pc/sys/updatepwd',
      data: params
    };
    Ajax(data).then(function (data) {
      if (data == 0) {
        layer.msg('密码修改失败')
      } else if (data == -2) {
        layer.msg('新密码是默认密码请修改')
      } else {
        layer.msg('密码修改成功')
        sessionStorage.clear()
        document.cookie = ""
        location.href = '../../html/login/login.html'
      }
    })
  }
  $('.editpwd').click(function () {
    updateInitialPwd();
  })
})