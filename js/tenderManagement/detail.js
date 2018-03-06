/**
 * Created by wangbinyan on 2017/11/10.
 */
$(function () {
  layui.use('layer', function () {
  })
  initDetail()
  function initDetail(){
    let params = {
      tenderid: getSession('tenderDetail').tenderid,
      userid: crmMsg.userId
    }
    let data = {
      type: 'get',
      url: "pc/tender/find?" + qs(params)
    };
    Ajax(data).then(function (data) {
      var detail = data.rows[0]
      //招标名称
      $(".wrap-top.title h2").text(detail.tendername)
      let status = ''
      switch (detail.status){
        case 0:
          status = '新标'
          break;
        case 1:
          status = '已参与未反馈'
          break;
        case 2:
          status = '未参与未反馈'
          break;
        case 3:
          status = '未参与已反馈'
          break;
        case 4:
          status = '已参与已反馈'
          break;
      }

      $(".wrap-top .count-info-stop").html(`
        <li class="one"><span class="tit">中标金额：</span><span class="con">${notNull(detail.biaomoney)}</span></li>
        <li class="two"><span class="tit">招标名称：</span><span class="con">${notNull(detail.tendername)}</span></li>
        <li class="one"><span class="tit">招标单位预算：</span><span class="con">${notNull(detail.tendermoney)}</span></li>
        <li class="two"><span class="tit">创建日期：</span><span class="con">${notNull(getDateByDay(detail.createdate))}</span></li>
        <li class="one"><span class="tit">负责人：</span><span class="con">${notNull(detail.manageusername)}</span></li>
        <li class="two"><span class="tit">招标信息：</span><span class="con">${notNull(detail.tenderinfo)}</span></li>
        <li class="one"><span class="tit">中标单位：</span><span class="con">${notNull(detail.biaoent)}</span></li>
        <li class="two"><span class="tit">招标金额：</span><span class="con">${notNull(detail.zbiaomonry)}</span></li>
        <li class="one"><span class="tit">竞标单位：</span><span class="con">${notNull(detail.biddingent)}</span></li>
        <li class="two"><span class="tit">不参与类型：</span><span class="con">${notNull(detail.noparticipatetype)}</span></li>
        <li class="one"><span class="tit">招标单位：</span><span class="con">${notNull(detail.tenderentname)}</span></li>
        <li class="two"><span class="tit">不参与原因：</span><span class="con">${notNull(detail.noparticipatereason)}</span></li>
        <li class="one"><span class="tit">截止时间：</span><span class="con">${notNull(getDateByDay(detail.enddate))}</span></li>
        <li class="two"><span class="tit">所在省：</span><span class="con">${notNull(detail.procinvename)}</span></li>
        <li class="one"><span class="tit">招标发布日期：</span><span class="con">${notNull(getDateByDay(detail.publishdate))}</span></li>
        <li class="two"><span class="tit">反馈发布日期：</span><span class="con">${notNull(getDateByDay(detail.fpublishdate))}</span></li>
        <li class="one"><span class="tit">招标状态：</span><span class="con">${notNull(status)}</span></li>
        <li class="two"><span class="tit">网址：</span><span class="con">${notNull(detail.wensties)}</span></li>
        <div style="clear: both;"></div>
      `)
    })
  }
  function isNull(str){
    if(str == null || str == "" || str == 'undefined'){
      return '无'
    }else{
      return str
    }
  }
})