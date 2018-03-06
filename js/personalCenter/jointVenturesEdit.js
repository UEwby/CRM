/**
 * Created by admin on 2017/11/7.
 */
$(function () {
    var flag, time, weeklyid = JSON.parse(sessionStorage.getItem('personalCenter')).id;
    // apiGetDepInfo();   //团队建设
    // apiGetDlzdInfo();  //独立纵队大数据应用平台技术开发进度及质量反馈
    // apiGetInfo();    //合资公司客户拜访清单
    select('.all','.all-control');
    select('.all1','.all-control1');
    //动态添加正在执行的商机反馈
    apiGetSelect(function (option) {
        Ajax({
            type: 'get',
            url: 'pc/weekly/getcrmWeeklyreporthezigongsiinfo?weeklyid='+weeklyid
        }).then(function (res) {
            console.log(res);
            //顶部基本信息
            var crmweeklyreport = res.crmweeklyreport;
            //填报人
            $('.informant').text(crmweeklyreport.inputpersionname);
            //部门
            $('.department').text(crmweeklyreport.department);
            //填报时间
            $('.reportDate').val(getDateByDay(crmweeklyreport.inputdate));
            $('#cooperateinfo').val(crmweeklyreport.cooperateinfo)
            $('#manageproblemadvice').val(crmweeklyreport.manageproblemadvice)
            $('#marketingproblem').val(crmweeklyreport.marketingproblem)
            $('#supportdetails').val(crmweeklyreport.supportdetails)

            //团队建设情况
            var crmweeklyteambuildlist = res.crmweeklyteambuildlist;
            var sum = 0;
            $.each(crmweeklyteambuildlist,function (i, item) {
                sum += parseFloat(item.membercount);
                $('.content_table1 > tbody').append(
                    '<tr depId='+ item.deptment +'>' +
                    '<td>'+ item.deptmentname +'</td>' +
                    '<td><input class="sum" type="text" value='+ NulltoK(item.membercount) +'></td>' +
                    '<td><input type="text" value='+ NulltoK(item.worksummary) +'></td>' +
                    '</tr>'
                )
            })
            $('.content_table1 > tbody').append(
                '<tr><td>总数</td><td class="sumTotall">'+ (String(sum) == 'NaN'? 0 : sum) +'</td><td>-</td></tr>'
            )


            //客户拜访、签约、回款统计
            var crmweeklycustomerstatisticslist = res.crmweeklycustomerstatisticslist;
            console.log(crmweeklycustomerstatisticslist.length);
            if(crmweeklycustomerstatisticslist.length != 0){
                $('.visitcount').val(crmweeklycustomerstatisticslist[0].visitcount)
                $('.signcount').val(crmweeklycustomerstatisticslist[0].signcount)
                $('.contractmoney').val(crmweeklycustomerstatisticslist[0].contractmoney)
                $('.yearcontractmoney').val(crmweeklycustomerstatisticslist[0].yearcontractmoney)
                $('.payback').val(crmweeklycustomerstatisticslist[0].payback)
                $('.yearpayback').val(crmweeklycustomerstatisticslist[0].yearpayback)
            }

            //合资公司客户拜访清单
            var crmweeklyvisitloglist1 = res.crmweeklyvisitloglist1;
            $.each(crmweeklyvisitloglist1,function (i, item) {
                $('.content_table4 > tbody').append(
                    '<tr prolevel='+ space(item.projectlevel) +' cusid='+ space(item.customerid) +'  proid='+ space(item.projectid) +'  allId='+ space(item.visitid) +'>' +
                    '<td hidden></td>' +
                    '<td>'+ convertNull(item.customername) +'</td>' +
                    '<td>'+ convertNull(item.projectname) +'</td>' +
                    '<td><span>'+ convertNull(item.projectprovince) + '</span><span>' + convertNull(item.projectcity) +'</span></td>' +
                    '<td>'+ convertNull(item.visitpersion) +'</td>' +
                    '<td>'+ convertNull(item.projectlevelname) +'</td>' +
                    '<td>'+ convertNull(item.visitlog) +'</td>' +
                    '<td><i class="layui-icon icon delVisitLog" style="font-size: 20px; color: #FF5722;border:1px solid #ccc;">&#xe640;</i></td>' +
                    '</tr>'
                )
                $('#visitLogInfo > tbody > tr').each(function (j, item) {
                    //console.log(item);
                })
            })

            //正在执行的商机反馈
            var crmweeklyexecutingsubjectlist = res.crmweeklyexecutingsubjectlist;
            var busingHtml = '';
            for(var i=0;i<crmweeklyexecutingsubjectlist.length;i++){
                busingHtml += '<tr>';
                busingHtml += '<td><input type="text" value='+ crmweeklyexecutingsubjectlist[i].customername +'></td>';
                busingHtml += '<td><input type="text" value='+ crmweeklyexecutingsubjectlist[i].projectname +'></td>';
                busingHtml += '<td><select class="doprojectlevel">';
                for(var j=0;j<option.length;j++){
                    busingHtml += '<option value='+ option[j].keystr +'>'+ option[j].valuestr +'</option>';
                }
                busingHtml += '</select></td>'
                busingHtml += '<td><input type="text" value='+ crmweeklyexecutingsubjectlist[i].visitlog +'></td>';
                busingHtml += '<td ><i class="layui-icon icon del" style="font-size: 20px; color: #FF5722;border:1px solid #ccc;">&#xe640;</i></td>';
                busingHtml += '</tr>';

            }
            $('#addBusingTable > tbody').html(busingHtml);
            for(var i=0;i<crmweeklyexecutingsubjectlist.length;i++){
                $('.doprojectlevel').each(function (j,item) {
                    if(j==i){
                        item.value=crmweeklyexecutingsubjectlist[i].projectlevel;
                    }
                })
            }

            //大于50%的商机
            var crmweeklyvisitloglist = res.crmweeklyvisitloglist;
            $.each(crmweeklyvisitloglist,function (i, item) {
                $('.content_table5 > tbody').append(
                    '<tr levId='+ item.projectlevel +' cusId='+ item.customerid +' busId='+ item.projectid +'>'+
                    '<td hidden></td>' +
                    '<td>'+ convertNull(item.customername) +'</td>' +
                    '<td>'+ convertNull(item.projectname) +'</td>' +
                    '<td>'+ convertNull(item.projectlevelname) +'</td>' +
                    '<td>'+ convertNull(item.signmoney) +'</td>' +
                    '<td>'+ getDateByDay(item.signdate) +'</td>' +
                    '<td><input type="text" value='+ item.visitlog +'></td>' +
                    '<td><i class="layui-icon icon delBus" style="font-size: 20px; color: #FF5722;border:1px solid #ccc;">&#xe640;</i></td>' +
                    '</tr>'
                )
            })



        })








        $('.addBusing').click(function () {
            //console.log(option);
            var busingHtml = '';
            busingHtml += '<tr>';
            busingHtml += '<td><input maxlength="20" class="docustomername" type="text"></td>';
            busingHtml += '<td><input maxlength="20" class="doprojectname" type="text"></td>';
            busingHtml += '<td><select class="doprojectlevel" name="" id="">';
            for(var i=0;i< option.length;i++){
                busingHtml += '<option value='+ option[i].keystr +'>'+ option[i].valuestr +'</option>';
            }
            busingHtml += '</select></td>'
            busingHtml += '<td><input maxlength="30" class="dovisitlog" type="text"></td>';
            busingHtml += '<td ><i class="layui-icon icon del" style="font-size: 20px; color: #FF5722;border:1px solid #ccc;">&#xe640;</i></td>';
            busingHtml += '</tr>';
            $('#addBusingTable > tbody').append(busingHtml)
        })


        $.each(option,function (i, item) {
            $('.busLevel').append(
                '<option value='+ item.keystr +'>'+ item.valuestr +'</option>'
            )
        })
        apiGetInfo();    //合资公司客户拜访清单
        apiGetBusTable(); //获取商机大于50%的数据
    })
    // $('.informant').text(crmMsg.userNamecn);
    // $('.department').text(crmMsg.department);
    //$('.reportDate').val();

    layui.use(['laydate'],function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '.reportDate',
            value: new Date(),
            max: 0,
            done:function () {
                $('.content_table4 > .tbo4').children('tr').remove();
                $('.all').removeClass('layui-form-checked');
                $('.visitcount').val(0)
                apiGetInfo()
            }
        })
    })

    //总人数相加
    $('.content_table1').on('keyup','.sum',function () {
        var sum = 0;
        $('.sum').each(function (i, item) {
            if($(item).val() == '' || !/^[0-9]*$/.test($(item).val())){
                $('.sumTotall').text(sum += 0)
            }else {
                $('.sumTotall').text(sum += parseInt($(item).val()))
            }
        })
    })

    // 动态删掉正在执行的商机反馈
    $('#addBusingTable').on('click','.del',function () {
        $(this).parents('tr').remove();
    })

    //点击弹出层（拜访记录）
    $('.opentcc').click(function () {
        layer.open({
            type: 1,
            title: '选择客户跟进记录',
            content: $('#visitLog'),
            area: ['1200px','500px']
        })
    })

    //将选择的跟进记录添加到页面（拜访记录）
    $('.isSure').click(function () {
        var domTr = $('.all-control').children('tr').clone(true);

        domTr.each(function (index, hasTr) {
            var hasTr = $(hasTr)
            if(hasTr.find('div').attr('class').indexOf('layui-form-checked') != -1){
                $(hasTr.children('td')[0]).css('display','none');
                $(hasTr.children('td')[6]).after('<td><i class="layui-icon icon delVisitLog" style="font-size: 20px; color: #FF5722;border:1px solid #ccc;">&#xe640;</i></td>')
                $('.tbo4').append(hasTr);
            }
        })
        var res = [];
        var trs = $('.tbo4').children('tr');
        var json = {};
        for(var i=0;i<trs.length;i++) {
            if (!json[$(trs[i]).attr('allId')]) {
                res.push($(trs[i]));
                json[$(trs[i]).attr('allId')] = 1
            } else {
                $(trs[i]).remove()
            }
        }
        $('.visitcount').val($('.tbo4 > tr').length)
        layer.closeAll();
    })

    //点击弹出层（商机大于50%）
    $('.opentcc1').click(function () {
        layer.open({
            type: 1,
            title: '选择商机',
            content: $('#busHalf'),
            area: ['1200px','500px']
        })
    })

    //增加筛选条件的获取数据
    $('.refer').click(function () {
        apiGetBusTable(); //获取商机大于50%的数据
    })

    //将选择的tr加入到页面中（商机大于50%）
    $('.agr').click(function () {
        var busTr = $('.all-control1').children('tr').clone(true);
        busTr.each(function (i, item) {
            var hasBusTr = $(item);
            if(hasBusTr.find('div').attr('class').indexOf('layui-form-checked') != -1){
                $(hasBusTr.children('td')[0]).css('display','none');
                $(hasBusTr.children('td')[5]).after(
                    '<td>' +
                    '<input class="plan" type="text">' +
                    '</td>' +
                    '<td>' +
                    '<i class="layui-icon icon delBus" style="font-size: 20px; color: #FF5722;border:1px solid #ccc;">&#xe640;</i>' +
                    '</td>'
                )
                $('.tbo5').append(hasBusTr);
            }
        })
        var res1 = [];
        var busTrs = $('.tbo5').children('tr');
        var json1 = {};
        busTrs.each(function (i, item) {
            if(!json1[$(item).attr('busId')]){
                res1.push($(item));
                json1[$(item).attr('busId')] = 1
            }else{
                $(item).remove()
            }
        })
        layer.closeAll();
    })

    //点击取消按钮
    $('.isNotSure').click(function () {
        reset();
        apiGetBusTable();
        layer.closeAll();
    })

    $('body').on('click','.layui-layer-setwin',function () {
        reset();
        apiGetBusTable();
    })

    // 删掉对应的tr（合资公司拜访清单）
    $('.tbo4').on('click','.delVisitLog',function () {
        var allId = $(this).parents('tr').attr('allId');
        $(this).parents('tr').remove();
        $('.visitcount').val($('.tbo4 > tr').length)
        $('.all').removeClass('layui-form-checked');
        for(var i = 0;i<$('.all-control').children('tr').length;i++){
            if(allId == $($('.all-control').children('tr')[i]).attr('allId')){
                $($('.all-control').children('tr')[i]).find('div').removeClass('layui-form-checked');
            }
        }
    })

    //删掉对应的tr（机会大于50%的商机）
    $('.tbo5').on('click','.delBus',function () {
        var busId = $(this).parents('tr').attr('busId');
        $(this).parents('tr').remove();
        $('.all1').removeClass('layui-form-checked');
        for(var i = 0;i<$('.all-control1').children('tr').length;i++){
            if(busId == $($('.all-control1').children('tr')[i]).attr('busId')){
                $($('.all-control1').children('tr')[i]).find('div').removeClass('layui-form-checked');
            }
        }
    })

    //保存周报
    $('.save').click(function () {
        $('.save').attr('disabled',true);
        clearTimeout(time);
        time=setTimeout(function () {
            $('.save').attr('disabled',false);
        },2500);
        checkworn();
        if(flag == 1){
            var obj = 1;
            apiweeklySave(obj)
        }

    })

    //发布周报
    $('.parent').click(function () {
        $('.parent').attr('disabled',true);
        clearTimeout(time);
        time=setTimeout(function () {
            $('.parent').attr('disabled',false);
        },2500);
        checkworn();
        if(flag == 1){
            layer.confirm(
                '<em style="color:red; font-weight: 700">确认发布周报吗？</em>',
                function () {
                    var obj = 2;
                    apiweeklyParent(obj);
                },
                function () {
                    layer.closeAll();
                },
            )
        }
    })

    //获取独立纵队的拜访记录
    function apiGetInfo()  {
        Ajax({
            type: 'get',
            url: 'pc/weekly/findzdproject?userid='+ crmMsg.userId + '&page=' + '1' + '&rows=' + '100000' + '&inputDate=' + ($('.reportDate').val() || getDateByDay(new Date().getTime()))
        }).then(function (res) {
            console.log(res);
            var cusLog = res.visitCustomer,
                busLog = res.visitProject,
                hzLog = res.visitHeziCom;
            if(cusLog.length > 0 || busLog.length > 0 || hzLog.length > 0){
                var allHtml = '';
                for(var i=0;i<cusLog.length;i++){
                    allHtml += '<tr prolevel='+ space(cusLog[i].ProjectLevel) +' cusid='+ space(cusLog[i].CustomerID) +'  proid='+ space(cusLog[i].ProjectID) +'  hzid='+ space(cusLog[i].CoentrepriseID) +'   allId='+ cusLog[i].ID +'>'
                    allHtml += '<td> <div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    allHtml += '<td>' + convertNull(cusLog[i].CustomerName) + '</td>'
                    allHtml += '<td>' + convertNull(cusLog[i].ProjectName)+ '</td>'
                    allHtml += '<td><span class="comprovince">' + convertNull(cusLog[i].CustomerProvinceName) + '</span><span class="comcity">' + convertNull(cusLog[i].CustomerCityName) + '</span></td>'
                    // allHtml += '<td>' + convertNull(cusLog[i].CustomerCityName)+ '</td>'
                    allHtml += '<td>' + convertNull(cusLog[i].CustomerManagerIDs)+ '</td>'
                    allHtml += '<td>' + convertNull(cusLog[i].ProjectLevelName)+ '</td>'
                    allHtml += '<td>' + convertNull(cusLog[i].VisitContent)+ '</td>'
                    allHtml += '</tr>'
                }
                for(var i=0;i<busLog.length;i++){
                    allHtml += '<tr prolevel='+ space(busLog[i].ProjectLevel) +' cusid='+ space(busLog[i].CustomerID) +'  proid='+ space(busLog[i].ProjectID) +'  hzid='+ space(busLog[i].CoentrepriseID) +'   allId='+ busLog[i].ID +'>'
                    allHtml += '<td> <div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    allHtml += '<td>' + convertNull(busLog[i].CustomerName)+ '</td>'
                    allHtml += '<td>' + convertNull(busLog[i].ProjectName)+ '</td>'
                    allHtml += '<td><span class="comprovince">' + convertNull(busLog[i].CustomerProvinceName) + '</span><span class="comcity">' + convertNull(busLog[i].CustomerCityName) + '</span></td>'
                    //allHtml += '<td>' + convertNull(busLog[i].CustomerCityName)+ '</td>'
                    allHtml += '<td>' + convertNull(busLog[i].CustomerManagerIDs)+ '</td>'
                    allHtml += '<td>' + convertNull(busLog[i].ProjectLevelName)+ '</td>'
                    allHtml += '<td>' + convertNull(busLog[i].VisitContent)+ '</td>'
                    allHtml += '</tr>'
                }
                for(var i=0;i<hzLog.length;i++){
                    allHtml += '<tr prolevel='+ space(hzLog[i].ProjectLevel) +' cusid='+ space(hzLog[i].CustomerID) +'  proid='+ space(hzLog[i].ProjectID) +'  hzid='+ space(hzLog[i].CoentrepriseID) +'   allId='+ hzLog[i].ID +'>'
                    allHtml += '<td> <div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    allHtml += '<td>' + convertNull(hzLog[i].CustomerName)+ '</td>'
                    allHtml += '<td>' + convertNull(hzLog[i].ProjectName)+ '</td>'
                    allHtml += '<td><span class="comprovince">' + convertNull(hzLog[i].CustomerProvinceName) + '</span><span class="comcity">' + convertNull(hzLog[i].CustomerCityName) + '</span></td>'
                    // allHtml += '<td>' + convertNull(hzLog[i].CustomerCityName)+ '</td>'
                    allHtml += '<td>' + convertNull(hzLog[i].CustomerManagerIDs)+ '</td>'
                    allHtml += '<td>' + convertNull(hzLog[i].ProjectLevelName)+ '</td>'
                    allHtml += '<td>' + convertNull(hzLog[i].VisitContent)+ '</td>'
                    allHtml += '</tr>'
                }
                $('.visitLogInfo > tbody').html(allHtml);
            }else {
                $('.visitLogInfo > tbody').html('<tr><td colspan="7">暂无数据</td></tr>');
            }

        })
    }

    // //获取机会大于50的商机table的参数
    function params1() {
        var params = {
            userid: crmMsg.userId,
            customername: $('.cusName').val(),
            projectname: $('.busName').val(),
            projectlevel: $('.busLevel').val() == 0? '': $('.busLevel').val(),
            rows: 10,
            page: 1,
        }
        return params;
    }

    //获取机会大于50的商机table
    function apiGetBusTable(obj) {
        var data = params1();
        if(!obj){
            var obj = {};
            obj.curr = data.page;
            obj.limit = data.rows;
        }
        data.page = obj.curr;
        data.rows = obj.limit;
        Ajax({
            type: 'get',
            url: 'pc/weekly/findxsproject?userid='+ data.userid + '&page=' + data.page + '&rows='+ data.rows +'&customername='+ data.customername + '&projectname=' + data.projectname + '&projectlevel=' + data.projectlevel

        }).then(function (res) {
            console.log(res);
            var data = res.rows;
            if(data.length > 0){
                $('.busHalfTab > tbody').html('');
                $.each(data,function (i, item) {
                    $('.busHalfTab > tbody').append(
                        '<tr levId='+ item.ProjectLevel +' cusId='+ item.CustomerID +' busId='+ item.ID +'>'+
                        '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>' +
                        '<td>'+ item.CustomerName +'</td>' +
                        '<td>'+ item.ProjectName +'</td>' +
                        '<td>'+ item.ProjectLevelName +'</td>' +
                        '<td>'+ item.SignMoney +'</td>' +
                        '<td>'+ getDateByDay(item.SignDate) +'</td>' +
                        '</tr>'
                    )
                })
            }else {
                $('.busHalfTab > tbody').html('<tr><td colspan="6">暂无数据</td></tr>');
            }
            pager(obj,res.total,[10,20,50,100],apiGetBusTable,$('.pager'))
        })
    }

    //处理null为空''
    function NulltoK(data) {
        if(data == null){
            data = ''
        }
        return data;
    }

    //处理null和空为-
    function convertNull(data) {
        if(data == null || data == ''){
            data = '-'
        }
        return data;
    }

    //将null处理为 -
    function space(data) {
        if(data == null){
            data = '-'
        }
        return data;
    }

    //将显示为-的处理成空''
    function hrs(data) {
        if(data == '-'){
            data = ''
        }
        return data;
    }

    // 参数
    function params(obj) {
        var params = {
            crmweeklyreport: {
                id: weeklyid,
                inputpersion: crmMsg.userId,    //汇报人id
                inputpersionname: crmMsg.user_namecn,   //汇报人名称
                department: crmMsg.department,        //部门
                inputdate: $('.reportDate').val(),     //汇报时间
                weeklystate: obj,    //周报状态
                weeklytype: crmMsg.weeklyType,
                // startdate: '',     //开始时间
                // enddate: '',       //结束时间
                // reportweekly: '',  //周期
                cooperateinfo: $('#cooperateinfo').val(),       //独立纵队配合情况
                manageproblemadvice: $('#manageproblemadvice').val(), //管理方面的问题与建议
                marketingproblem: $('#marketingproblem').val(),    //市场方面的问题与新发现
                supportdetails: $('#supportdetails').val(),      //需要总部支援事项
            },

            crmweeklyteambuildlist: crmweeklyteambuildlist(),   //团队建设

            crmweeklycustomerstatisticslist: crmweeklycustomerstatisticslist(),  //客户拜访签约回款

            crmweeklyvisitloglist1: crmweeklyvisitloglist1(),  //拜访清单

            crmweeklyexecutingsubjectlist: crmweeklyexecutingsubjectlist(),  //正在执行的商机

            crmweeklyvisitloglist: crmweeklyvisitloglist()

        }
        console.log(JSON.stringify(params));
        console.log(params);
        return params;
    }

    //保存周报
    function apiweeklySave(obj) {
        Ajax({
            type: 'post',
            url:'pc/weekly/create/c',
            data: params(obj)
        }).then(function (res) {
            if(res.backHttpResult.code == '1'){
                layer.msg('草稿保存成功',{time: 1000},function () {
                    window.location.href = './myWeekly.html'
                })
            }
        })
    }

    //发布周报
    function apiweeklyParent(obj) {
        Ajax({
            type: 'post',
            url: 'pc/weekly/create/c',
            data: params(obj)
        }).then(function (res) {
            //console.log(res.backHttpResult.code)
            if(res.backHttpResult.code == '1'){
                layer.msg('发布成功',{time: 1000},function () {
                    window.location.href = './myWeekly.html'
                })
            }else if(res.backHttpResult.code  == '3'){
                layer.msg('此周的周报已经发布，请勿重复提交！',{time: 1000})
            }
        })
    }

    //商机等级获取
    function apiGetSelect(fn) {
        Ajax({
            type: 'get',
            url: 'crmcustomerwordbook/findwordbookall'
        }).then(function (res) {
            fn(res.projectLevelAll);
        })
    }

    //获取团队建设的参数
    function crmweeklyteambuildlist() {
        var buildArr = [];
        var list = $('.content_table1 tbody tr');
        for(var i=0;i<list.length-1;i++){
            buildArr.push({
                id: '-1',
                deptment: $(list[i]).attr('depId'),
                deptmentname: $($(list[i]).children('td')[0]).text(),
                membercount: $($(list[i]).children('td')[1]).find('input').val(),
                worksummary: $($(list[i]).children('td')[2]).find('input').val(),
            })
        }
        console.log(buildArr);
        return buildArr;
    }

    //客户拜访、签约、回款统计 参数
    function crmweeklycustomerstatisticslist() {
        var backMoney = [];
        //var list = $('content_table3 tbody td');
        backMoney.push({
            visitcount: $('.visitcount').val(),
            signcount: $('.signcount').val(),
            contractmoney: $('.contractmoney').val(),
            yearcontractmoney: $('.yearcontractmoney').val(),
            payback: $('.payback').val(),
            yearpayback: $('.yearpayback').val()
        })
        //console.log(backMoney);
        return backMoney;
    }

    //独立纵队客户拜访清单 参数
    function crmweeklyvisitloglist1() {
        var visitLog = [], list = $('.tbo4 > tr');
        for(var i=0;i<list.length;i++){
            visitLog.push({
                visitid: $(list[i]).attr('allId'),
                customerid: hrs($(list[i]).attr('cusid')),
                customername: $($(list[i]).children('td')[1]).text(),
                projectid: hrs($(list[i]).attr('proid')),
                projectname: hrs($($(list[i]).children('td')[2]).text()),
                projectprovince: $($($(list[i]).children('td')[3]).find('span')[0]).text(),
                projectcity: $($($(list[i]).children('td')[3]).find('span')[1]).text(),
                visitpersion: $($(list[i]).children('td')[4]).text(),
                projectlevel: hrs($(list[i]).attr('prolevel')),
                visitlog: $($(list[i]).children('td')[6]).text(),
            })
        }
        //console.log(visitLog)
        return visitLog;
    }

    //正在执行的商机反馈 参数
    function crmweeklyexecutingsubjectlist() {
        var doingPro = [];
        var list = $('#addBusingTable tbody tr');
        for(var i=0;i<list.length;i++){
            doingPro.push({
                customername: $($(list[i]).children('td')[0]).find('input').val(),
                projectname: $($(list[i]).children('td')[1]).find('input').val(),
                projectlevel: $($(list[i]).children('td')[2]).find('select').val(),
                projectLevelName: $($(list[i]).children('td')[2]).find('option:selected').text(),
                visitlog: $($(list[i]).children('td')[3]).find('input').val()
            })
        }
        //console.log(doingPro);
        return doingPro;
    }

    //商机大于50%的   参数
    function crmweeklyvisitloglist() {
        var busLog = [], list = $('.tbo5 > tr');
        for(var i=0;i<list.length;i++){
            busLog.push({
                customerid: $(list[i]).attr('cusId'),
                customername: $($(list[i]).children('td')[1]).text(),
                projectid: $(list[i]).attr('busId'),
                projectname: $($(list[i]).children('td')[2]).text(),
                signmoney: $($(list[i]).children('td')[4]).text(),
                projectlevel: $(list[i]).attr('levId'),
                signdate: $($(list[i]).children('td')[5]).text(),
                visitlog: $($(list[i]).children('td')[6]).find('input').val()
            })
        }
        console.log(busLog);
        return busLog;
    }

    //重置高级筛选方法
    function reset() {
        $('.cusName').val('');
        $('.busName').val('');
        $('.busLevel').val('0')
    }

    function checkworn() {
        if($('.reportDate').val() == ''){
            layer.msg('日期不能为空',{time: 1000},function () {
                $('.reportDate').focus();
            })
            flag = 0;
            return;
        }

        //sum
        for(var i=0;i<$('.sum').length;i++){
            if(!/^[0-9]*$/.test($($('.sum')[i]).val())){
                layer.msg('总人数只能为数字',{time: 1000},function () {
                    $($('.sum')[i]).focus();
                });
                flag = 0;
                return;
            }
        }

        //完成比例
        for(var i=0;i<$('.completionRate').length;i++){
            if(!/^[0-9]*$/.test($($('.completionRate')[i]).val())){
                layer.msg('完成比例只能为数字',{time: 1000},function () {
                    $($('.completionRate')[i]).focus();
                });
                flag = 0;
                return;
            }
        }

        //客户拜访、签约、回款统计内容
        var tables3 = $('.content_table3 > tbody').find('td');
        for(var i=1;i<tables3.length;i++){
            if(!/^[0-9]*$/.test($(tables3[i]).children('input').val())){
                layer.msg('客户拜访、签约、回款统计内容只能为数字',{time: 1000},function () {
                    $(tables3[i]).find('input').focus();
                });
                flag = 0;
                return;
            }
        }

        //正在执行的商机反馈
        var doingbusTab = $('#addBusingTable > tbody').find('td');
        for(var i=0;i<doingbusTab.length;i++){
            if($(doingbusTab[i]).children('input').val() == '' || $(doingbusTab[i]).children('select').val() == '0'){
                layer.msg('添加的商机反馈不能为空',{time: 1000},function () {
                    $(doingbusTab[i]).children('input').focus();
                })
                flag = 0;
                return;
            }
        }


        flag = 1;
    }

    $('.content_top').click(function () {
        crmweeklyteambuildlist();
        crmweeklyvisitloglist();
        //checkworn();
        //crmweeklyvisitloglist();
        //crmweeklyteambuildlist();
        //console.log($('#cooperateinfo').val());
        //crmweeklyappplatformlist();
        //crmweeklycustomerstatisticslist();
        //crmweeklyexecutingsubjectlist();
    })



})
