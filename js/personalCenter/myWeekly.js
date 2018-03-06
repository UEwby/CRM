/**
 * Created by admin on 2017/10/25.
 */
/**
 * Created by admin on 2017/10/12.
 */

$(function () {
    //使用分页、日期、弹窗
    var laypage, laydate, weeklyType = crmMsg.weeklyType;
    layui.use(['laypage', 'laydate','layer'], function () {
        laypage = layui.laypage,
            laydate = layui.laydate,
            form = layui.form;
        laydate.render({
            elem: '.starttime'
        })

        laydate.render({
            elem: '.endtime'
        })


        //加载页面默认加载页面的list表格
        getTable(null,{
            userId: String(crmMsg.userId),   //用户的id
            type: 1,         //周报类型（我的周报or下属周报）
            username: '', //模糊查询（输入框)
            inputDateStart: '',   //开始时间
            inputDateEnd: '',     //结束时间
            weeklystate: '',  //日报状态（已发布or草稿）
            rows: 20,
            page: 1,
        })
        select('.all','.all-control');
    })

    //传所需要的查询条件的参数
    function getParams() {
        var params = {
            userId: crmMsg.userId,   //用户的id
            type: $('.weeklyType').text() == '我的周报' ? 1 : 2, //周报类型（我的日报or下属周报）
            username: $('.input-search input').val(), //模糊查询（输入框）
            inputDateStart: $('.starttime').val(),  //开始时间
            inputDateEnd: $('.endtime').val(), //结束时间
            weeklystate: $('.weeklystate').val() == '0' ? '' : ($('.weeklystate').val() == '1' ? 1 : 2), //日报状态（已发布or草稿）
            rows:  20,  //每页的条数
            page: 1,
        }
        return params
    }

    //渲染表格的方法
    function getTable(obj) {
        var data = getParams()
        if(!obj){
            var obj ={};
            obj.curr = data.page;
            obj.limit = data.rows;
        }
        data.page = obj.curr;
        data.rows = obj.limit;
        Ajax({
            type: 'get',
            url: "pc/weekly/common/findmypage?userid=" + data.userId + "&rows=" + data.rows + "&page=" + data.page + "&type=" + data.type + "&username=" + data.username + "&inputDateStart=" + data.inputDateStart + "&inputDateEnd=" + data.inputDateEnd + "&weeklystate=" + data.weeklystate
        }).then(function (res) {
            console.log(res);
            if(res.rows.length > 0){
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows[i].weeklystate == 1) {
                        res.rows[i].weeklystate = '草稿'
                    } else {
                        res.rows[i].weeklystate = '已发布'
                    }
                }
                var html = ''
                for (var i = 0; i < res.rows.length; i++) {
                    html += '<tr weeklyid="' + res.rows[i].weeklyid + '">';
                    html += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    html += '<td>' + getDateByDay(res.rows[i].inputdate) + '</td>';
                    html += '<td>' + res.rows[i].inputpersionname + '</td>';
                    html += '<td>' + (res.rows[i].depart == null? '-': res.rows[i].depart) + '</td>';
                    html += '<td>' + res.rows[i].weeklystate + '</td>';
                    html += '<td class="weeklyContent">' + dateNYR(res.rows[i].startdate) + '&nbsp;-&nbsp;' + dateNYR(res.rows[i].enddate) + '&nbsp;&nbsp;&nbsp;&nbsp;第'+ res.rows[i].weekly + '周' + '</td>';
                    // html += '<td class="weeklyContent">' + res.rows[i].startdate + '&nbsp;-&nbsp;' + res.rows[i].enddate + '&nbsp;&nbsp;&nbsp;&nbsp;第'+ res.rows[i].weekly + '周' + '</td>';
                    if (res.rows[i].weeklystate == "已发布") {
                        html += '<td><span class="gray">编辑</span> <span class="gray" >删除</span></td>';
                    } else {
                        html += '<td><span class="edit">编辑</span> <span class="del" >删除</span></td>';
                    }
                    html += '</tr>'
                }
                $('tbody').html(html);
            }else{
                $('tbody').html('<tr><td colspan="7">暂无数据</td></tr>');
            }
            pager(obj,res.total,[10,20,50,100],getTable,$('.pager'))
        })
    }

    //时间格式处理
    function dateNYR(data) {
        var dateN = data.slice(0,4)+'年';
        var dateY = data.slice(5,7)+'月';
        var dateR = data.slice(8,10)+'日';
        data = dateN + dateY + dateR;
        return data
    }

    //重置高级筛选方法
    function reset() {
        $('.starttime').val('');
        $('.endtime').val('');
        $('.weeklystate').val('0')
    }

    //删除日报信息
    $('tbody').on('click', '.del', function () {
        var _this = this;
        layer.confirm(
            '<em style="color:red; font-weight: 700">确定删除吗？</em>',
            function () {
                var id = Number($(_this).parent().parent().attr('weeklyid'));
                var obj = {
                    type: 'post',
                    url: 'pc/weekly/common/delete',
                    data: {
                        id: id,
                        userid: crmMsg.userId,
                        weeklyType: crmMsg.weeklyType
                    }
                }
                Ajax(obj).then(function (res) {
                    console.log(res);
                    if (res.code == '000') {
                        $(_this).parent('td').parent('tr').remove();
                        getTable();
                        layer.msg('删除成功',{time: 1000})
                    } else if (res.code == '001') {
                        alert('发布状态的日报不能删除')
                    } else if (res.code == '002') {
                        alert('操作异常')
                    }
                })
                layer.closeAll()
            },
            function () {
                layer.closeAll();
            }
        )
    })

    //搜索列表切换
    $('#drop-down-box').on('click', '.dropdown li', function () {
        $('.advanced-filter').removeClass('dot')
        //清空搜索框输入的数据
        $('.input-search input').val('');
        //清空高级帅选框里面的数据
        reset();
        getTable();
    })

    //搜索框查询
    $('.input-search1').click(function () {
        $('.advanced-filter').removeClass('dot')
        //先清空筛选条件的输入数据
        reset();
        getTable();
    })

    //回车搜索
    $('.input-search input').on('keyup', function (e) {
        if (e.keyCode == 13) {
            $('.advanced-filter').removeClass('dot')
            //先清空筛选条件的输入数据
            reset();
            getTable();
        }
    })

    //搜索筛选条件弹出层
    $('.advanced-filter').click(function () {
        layer.open({
            type: 1,
            title: '高级筛选',
            content: $('#div4'),
            area: ['900px', '200px'],
        })

    })

    //搜索点击确定开始渲染表格
    $('.agr').click(function () {
        var page = 1;
        var params = getParams(page)
        params.starttime = $('.starttime').val()
        params.endtime = $('.endtime').val()
        getTable();
        //select();
        layer.closeAll('page'); //关闭所有页面层
        if($('.starttime').val() =='' && $('.endtime').val()== '' && $('.weeklystate').val() == 0) {
            // $('.advanced-filter').css('background','url(../../img/btn2-bg.png) no-repeat left bottom')
            $('.advanced-filter').removeClass('dot')
        }else {
            // $('.advanced-filter').css('background','url(../../img/btn1-bg.png) no-repeat left bottom')
            $('.advanced-filter').addClass('dot')
        }
    })

    //搜索点击重置高级筛选
    $('.act').click(function () {
        reset();
    })

    //点击弹窗的关闭按钮
    $('body').on('click','.layui-layer-setwin',function () {
        reset();
        /*if($('.starttime').val() =='' && $('.endtime').val()== '' && $('.weeklystate').val() == 0) {
         $('.advanced-filter').removeClass('dot')
         }else {
         $('.advanced-filter').addClass('dot')
         }*/
    })








    //导出功能
    function apiexport(ids) {
     // 导出全部所需要的参数
     var paramsAll = {
     userid: crmMsg.userId,
     type: $('.weeklyType').text() == '我的周报' ? 1 : 2,
     user_namecn: $('.input-search input').val(),
     starttime: $('.starttime').val(),
     endtime: $('.endtime').val(),
     weeklystate: isunderling(),
     rows: 10000,
     page: 1
     }
     //导出部分所需要的参数
     var paramsPart = {
     userid: crmMsg.userId,
     weeklyid: ids
     }
     var url = '';
     if(ids){
     url = Url + 'pc/weekly/export?'+ qs(paramsPart);
     }else{
     url = Url + 'pc/weekly/export?'+ qs(paramsAll);
     }
        console.log(url);
     debugger;
        window.location.href = url
     }

    //判断是否为下属周报
    function isunderling() {
        if($('.weeklyType').text() == '下属周报'){
            $('.weeklystate').val('2')
        }else{
            $('.weeklystate').val('')
        }
        return $('.weeklystate').val();
    }

    //导出按钮
    $('.export').click(function () {
     var str = '';
     $('.tab-weekly tbody .layui-form-checked').each(function (i, item) {
     str += $(item).parent().parent().attr('weeklyid') + ','
     })
     var ids = str.slice(0, -1);
     //console.log(Boolean(ids));
     // ids为true就是选择的日报，false就是全部的日报
     apiexport(ids);
     })

    //修改周报信息
    $('tbody').on('click', '.edit', function () {
        var personalCenter = {
            id: $(this).parent('td').parent('tr').attr('weeklyid')
        }
        sessionStorage.setItem('personalCenter',JSON.stringify(personalCenter));
        // window.location.href = "./weekly.html";
        switch (weeklyType) {
            case 254: window.location.href = "./jointVenturesEdit.html";     //合资公司周报
                break;
            case 255: window.location.href = "./separateColumnsEdit.html";        //独立纵队周报
                break;
            case 262: window.location.href = "./unionParttimeEdit.html";           //合纵兼职周报
                break;
            case 370: window.location.href = "./humanResourcesEdit.html";           //人力资源周报
                break;
        }
    })

    //查看周报详情
    $('tbody').on('click', '.weeklyContent', function () {
        console.log($(this).parent('tr').attr('weeklyid'));
        var personalCenter = {
            id: $(this).parent('tr').attr('weeklyid')
        }
        sessionStorage.setItem('personalCenter',JSON.stringify(personalCenter));
        // window.location.href = "./weeklyDetails.html";
        switch (weeklyType) {
            case 254: window.location.href = "./jointVenturesDetails.html";     //合资公司周报
                break;
            case 255: window.location.href = "./separateColumnsDetails.html";        //独立纵队周报
                break;
            case 262: window.location.href = "./unionParttimeDetails.html";           //合纵兼职周报
                break;
            case 370: window.location.href = "./humanResourcesDetails.html";           //人力资源周报
                break;
        }
    })

    //写周报
    $('.writeWeekly').click(function () {
        console.log(weeklyType);
        switch (weeklyType) {
            case 254: window.location.href = "./jointVentures.html";     //合资公司周报
                break;
            case 255: window.location.href = "./separateColumns.html";        //独立纵队周报
                break;
            case 262: window.location.href = "./unionParttime.html";           //合纵兼职周报
                break;
            case 370: window.location.href = "./humanResources.html";           //人力资源周报
                break;
        }
    })

    /* 调用下拉框 */
    var dropDownBox = new DropDown($('#drop-down-box'));
    dropDownBox.initEvents();

})










