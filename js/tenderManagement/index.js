/**
 * Created by Limbo on 2017/10/18.
 */
$(function () {
  layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
      elem: '#beginvisitdate'
    });
    laydate.render({
      elem: '#endvisitdate'
    })
  });
  setSession('opportunities', {});
  $("#citys").citySelect({prov: '省份', city: '地级市', dist: '市、县级市'})
  function apiOpportunities(obj) {
    if (!obj) {
      obj = {};
      obj.curr = 1;
      obj.limit = 20;
    }
    let params = {
      //userid: crmMsg.userId,
      rows: obj.limit,
      page: obj.curr,
      v: +new Date(),
      sortname: '',//'排序字段',
      sortway: 'desc',
      searchName: $(".input-search input").val(),
      status: $("#customertype").val() == -1 ? '' : $("#customertype").val() ,
      publishdate: $("#beginvisitdate").val(),
      enddate: $("#endvisitdate").val(),
      provincename: $('#s_province').val() == '省份' ? '' : $('#s_province').val(),//'北京',
      cityname: $('#s_city').val() == '地级市' ? '' : $('#s_city').val(),//'北京市',
      districtname: $('#s_county').val() == '市、县级市' ? '' : $('#s_county').val()//'朝阳区'
    }
    let data = {
      type: 'get',
      url: "pc/tender/findpage?" + qs(params)
    };
    Ajax(data).then(function (data) {
      $(".layui-table tbody").html('');
      let domStr = '';
      //console.log(data)
      $.each(data.rows, function (i, item) {
        domStr += `<tr>
                    <td class="name-hover opportunities-name" style="max-width:150px;overflow: hidden;">
                    <a class="detial" tenderid="${item.tenderid}" style="height: 42px;line-height: 42px;display: block;" title="${item.tendername}">${item.tendername}</a>
                    </td>
                    <td>${item.tenderentname}</td>
                    <td>${transformTendersState(item.status)}</td>
                    <td>${item.province}</td>
                    <td>${transformTime(item.publishdate)}</td>
                    <td>${transformTime(item.enddate)}</td>
                    <td style="max-width:150px;overflow: hidden;"><a style="width:100%;overflow: hidden;display: block" href="${item.wensties}" target="_blank" title="${item.wensties}">${item.wensties}</a></td>
                    <td>${item.manageusername}</td>
                    </tr>`
      })

      $(".layui-table tbody").html(domStr);
      $(".layui-table tbody td a.detial").click(function () {
        pushSession('tenderDetail', {tenderid: $(this).attr('tenderid'), userid: crmMsg.userId });
        location.href = "./details.html"
      })
      // 分页
      pager(obj, data.total, [10, 20, 50, 100], apiOpportunities, $('.pager'));
    })
  }
  apiOpportunities();
  //列表切换
  $('#drop-down-box').on('click', '.dropdown li', function () {
    $(".input-search input").val('');
    apiOpportunities();
  })
  //搜索功能
  $(".input-search i").on('click', function () {
    apiOpportunities();
  })

  $('.advanced-filter').on('click', function () {
    var layer_ = layer.open({
      type: 1,
      title: '高级筛选',
      content: $("#popFilter"),
      area: ['750px', '260px']
    });
    $("#cancel1").click(function() {
      reset()
    })
    $("#ok1").click(function() {
      isDot();
      apiOpportunities();
      layer.close(layer_);
    })

  })

  //上传招标信息
  $("#uploadtender").click(function() {
    var layer_ = layer.open({
      type: 1,
      title: '上传招标文件',
      shadeClose: true, //点击遮罩关闭
      content: `
      <form id="update" class="layui-form" action="http://192.168.1.68:7777/jusfoun-crm/pc/tender/import" method="post"
				enctype="multipart/form-data">
          <div class="layui-form-item" style="margin: 10px 0 0;">
            <label class="layui-form-label">上传文件 :</label>
            <input style="padding: 5px 0;" class="layui-input-inline" type="file" accept="application/vnd.ms-excel" name="uploadFile">
          </div>
          <div class="layui-form-item" style="margin: 0;">
            <label class="layui-form-label">模板 :</label>
            <a target="_blank" style="padding: 9px 0;display: inherit;" href="../../template/template.xls" class="layui-upload-button">下载模板</a>
          </div>
          <p class="footer" style="margin: 20px auto;">
              <input type="button" value="取消" class="resetinput">
              <input type="submit" value="确定" class="update">
          </p>
      </form>`,
      area: ['450px', '210px']
    });
    //console.log('/')
    $(".resetinput").click(function() {
      layer.close(layer_)
    })
    $(".update").click(function() {

    })
  })

  //检测dot是否筛选
  function isDot() {
    if ($('#customertype').val() != "-1"
      || $('#s_province').val() != '省份'
      || $('#s_city').val() != '地级市'
      || $('#s_county').val() != '市、县级市'
      || $('#beginvisitdate').val() != ''
      || $('#endvisitdate').val() != '') {
      $('.advanced-filter').addClass('dot');
    } else {
      $('.advanced-filter').removeClass('dot');
    }
  }

  //重置
  function reset() {
    $('#customertype').val(-1);
    $('#beginvisitdate').val('');
    $('#endvisitdate').val('');
    $("#citys").citySelect({prov: '省份', city: '地级市', dist: '市、县级市'})
    isDot();
  }


})