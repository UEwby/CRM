/**
 * Created by wangbinyan on 2017/10/24.
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
      //console.log(data)
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
      }else if(data.backHttpResult.code=='222'){
        setSession('crmMsg',{
          userId:data.userId
        });
        //layer.msg('请修改初始密码')
        window.location.href='../../html/login/updateInitialPwd.html'
      }else if(data.backHttpResult.code=='111'){
        layer.msg('密码或帐号输入错误')
      }else if(data.backHttpResult.code=='444'){
        layer.msg('账号已禁用！')
      }
    })
  }
  $('#submit').click(function () {
    apiLogin();
  })


});
function enterLogin(event){
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if(e && e.keyCode == 13){
    document.getElementById("submit").click()
  }
}