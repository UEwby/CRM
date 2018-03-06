/**
 * Created by admin on 2017/10/12.
 */

$(function () {
    //使用分页、日期、弹窗
    var laypage, laydate;
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
            type: 1,         //日报类型（我的日报or下属日报
            user_namecn: '', //模糊查询（输入框)
            starttime: '',   //开始时间
            endtime: '',     //结束时间
            dailystate: '',  //日报状态（已发布or草稿
            rows: 20,
            page: 1,
        })
        select('.all','.all-control');
    })

    //传所需要的查询条件的参数
    function getParams() {
        var params = {
            userId: crmMsg.userId,   //用户的id
            type: $('.dailyType').text() == '我的日报' ? 1 : 2, //日报类型（我的日报or下属日报）
            user_namecn: $('.input-search input').val(), //模糊查询（输入框）
            starttime: $('.starttime').val(),  //开始时间
            endtime: $('.endtime').val(), //结束时间
            dailystate: $('.dailystate').val() == '0' ? '' : ($('.dailystate').val() == '1' ? 1 : 2), //日报状态（已发布or草稿）
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
            url: "pc/daily/findpage?userid=" + data.userId + "&rows=" + data.rows + "&page=" + data.page + "&type=" + data.type + "&user_namecn=" + data.user_namecn + "&starttime=" + data.starttime + "&endtime=" + data.endtime + "&dailystate=" + data.dailystate
        }).then(function (res) {
            console.log(res);
            if(res.rows.length >0){
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows[i].dailystate == 1) {
                        res.rows[i].dailystate = '草稿'
                    } else {
                        res.rows[i].dailystate = '已发布'
                    }
                }
                var html = ''
                for (var i = 0; i < res.rows.length; i++) {
                    html += '<tr dailyid="' + res.rows[i].dailyid + '">';
                    html += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    html += '<td>' + getDateByDay(res.rows[i].inputdate) + '</td>';
                    html += '<td>' + res.rows[i].user_namecn + '</td>';
                    html += '<td>' + notNull(res.rows[i].department) + '</td>';
                    html += '<td>' + res.rows[i].dailystate + '</td>';
                    html += '<td class="dailyContent" title=' + res.rows[i].dailycontent + '>' + res.rows[i].dailycontent + '</td>';
                    if (res.rows[i].dailystate == "已发布") {
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

    //重置高级筛选方法
    function reset() {
        $('.starttime').val('');
        $('.endtime').val('');
        $('.dailystate').val('0')
    }

    //导出功能
    function apiexport(ids) {
        // 导出全部所需要的参数
        var paramsAll = {
            userid: crmMsg.userId,
            type: $('.dailyType').text() == '我的日报' ? 1 : 2,
            user_namecn: $('.input-search input').val(),
            starttime: $('.starttime').val(),
            endtime: $('.endtime').val(),
            // dailystate: $('.dailystate').val() == '0' ? '' : ($('.dailystate').val() == '1' ? 1 : 2),
            dailystate: isunderling(),
            rows: 10000,
            page: 1
        }
        //导出部分所需要的参数
        var paramsPart = {
            userid: crmMsg.userId,
            dailyid: ids
        }
        var url = '';
        if(ids){
            url = Url + 'pc/daily/export?'+ qs(paramsPart);
        }else{
            url = Url + 'pc/daily/export?'+ qs(paramsAll);
        }
        console.log(url);
        window.location.href = url
    }

    // //判断是否为下属日报
    function isunderling() {
        if($('.dailyType').text() == '下属日报'){
            console.log(1)
            $('.dailystate').val('2')
        }else{
            $('.dailystate').val('')
        }
        return $('.dailystate').val();
    }

    //导出按钮
    $('.export').click(function () {
        var str = '';
        $('.tab-daily tbody .layui-form-checked').each(function (i, item) {
            str += $(item).parent().parent().attr('dailyid') + ','
        })
        var ids = str.slice(0, -1);
        //console.log(Boolean(ids));
        // ids为true就是选择的日报，false就是全部的日报
        apiexport(ids);
    })

    //搜索列表切换
    $('#drop-down-box').on('click', '.dropdown li', function () {
        //alert(1)
        //$('.advanced-filter').css('background','url(../../img/btn2-bg.png) no-repeat left bottom')
        $('.advanced-filter').removeClass('dot')
        //清空搜索框输入的数据
        $('.input-search input').val('');
        //清空高级帅选框里面的数据
        reset();
        getTable();
        //select();
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
        if($('.starttime').val() =='' && $('.endtime').val()== '' && $('.dailystate').val() == 0) {
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

    $('body').on('click','.layui-layer-setwin',function () {
        reset();
        /*if($('.starttime').val() =='' && $('.endtime').val()== '' && $('.dailystate').val() == 0) {
         $('.advanced-filter').removeClass('dot')
         }else {
         $('.advanced-filter').addClass('dot')
         }*/
    })

    //删除日报信息
    $('tbody').on('click', '.del', function () {
        var _this = this;
        layer.confirm(
            '<em style="color:red; font-weight: 700">确定删除吗？</em>',
            function () {
                var id = Number($(_this).parent().parent().attr('dailyid'));
                var obj = {
                    type: 'post',
                    url: 'pc/daily/delete',
                    data: {
                        id: id
                    }
                }
                Ajax(obj).then(function (res) {
                    res = JSON.parse(res);
                    if (res.code == '000') {
                        //console.log($(_this));
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
        })

    })

    //修改日报信息
    $('tbody').on('click', '.edit', function () {
        var personalCenter = {
            id: $(this).parent('td').parent('tr').attr('dailyid')
        }
        sessionStorage.setItem('personalCenter',JSON.stringify(personalCenter));
        window.location.href = "./editDaily.html";
    })

    //查看日报详情
    $('tbody').on('click', '.dailyContent', function () {
        console.log($(this).parent('tr').attr('dailyid'));
        var personalCenter = {
            id: $(this).parent('tr').attr('dailyid')
        }
        sessionStorage.setItem('personalCenter',JSON.stringify(personalCenter));
        window.location.href = "./dailyDetails.html";
    })

    //写日报
    $('.writeDaily').click(function () {
        window.location.href = "./newAddDaily.html"
    })

    /* 调用下拉框 */
    var dropDownBox = new DropDown($('#drop-down-box'));
    dropDownBox.initEvents();

})










