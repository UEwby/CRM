/**
 * Created by admin on 2017/11/3.
 */
$(function () {
    var weeklyid = JSON.parse(sessionStorage.getItem('personalCenter')).id
    Ajax({
        type: 'get',
        url: 'pc/weekly/getcrmWeeklyreportduzonginfo?weeklyid='+weeklyid
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
        $('.reportDate').prop('readOnly',true);
        $('#cooperateinfo').val(crmweeklyreport.cooperateinfo)
        $('#cooperateinfo').prop('readOnly',true);
        $('#manageproblemadvice').val(crmweeklyreport.manageproblemadvice)
        $('#manageproblemadvice').prop('readOnly',true);
        $('#marketingproblem').val(crmweeklyreport.marketingproblem)
        $('#marketingproblem').prop('readOnly',true);
        $('#supportdetails').val(crmweeklyreport.supportdetails)
        $('#supportdetails').prop('readOnly',true);

        //团队建设情况
        var crmweeklyteambuildlist = res.crmweeklyteambuildlist;
        var sum = 0;
        $.each(crmweeklyteambuildlist,function (i, item) {
            sum += parseFloat(item.membercount);
            $('.content_table1 > tbody').append(
                '<tr>' +
                '<td>'+ item.deptmentname +'</td>' +
                '<td>'+ item.membercount +'</td>' +
                '<td>'+ item.worksummary +'</td>' +
                '</tr>'
            )
        })
        $('.content_table1 > tbody').append(
            '<tr><td>总数</td><td>'+ sum +'</td><td>-</td></tr>'
        )

        //独立纵队大数据应用平台技术开发进度及质量反馈
        var crmweeklyappplatformlist = res.crmweeklyappplatformlist;
        $.each(crmweeklyappplatformlist,function (i, item) {
            $('.content_table2 > tbody').append(
                '<tr>' +
                '<td>'+ item.platformname +'</td>' +
                '<td>'+ NulltoK(item.completionrate) +'</td>' +
                '<td>'+ NulltoK(item.manageperson) +'</td>' +
                '<td>'+ NulltoK(item.feedback) +'</td>' +
                '</tr>'
            )
        })

        //客户拜访、签约、回款统计
        var crmweeklycustomerstatisticslist = res.crmweeklycustomerstatisticslist;
        console.log(crmweeklycustomerstatisticslist.length);
        if(crmweeklycustomerstatisticslist.length != 0){
            $('.visitcount').parent().text(crmweeklycustomerstatisticslist[0].visitcount)
            $('.signcount').parent().text(crmweeklycustomerstatisticslist[0].signcount)
            $('.contractmoney').parent().text(crmweeklycustomerstatisticslist[0].contractmoney)
            $('.yearcontractmoney').parent().text(crmweeklycustomerstatisticslist[0].yearcontractmoney)
            $('.payback').parent().text(crmweeklycustomerstatisticslist[0].payback)
            $('.yearpayback').parent().text(crmweeklycustomerstatisticslist[0].yearpayback)
        }

        //独立纵队客户拜访清单
        var crmweeklyvisitloglist = res.crmweeklyvisitloglist;
        $.each(crmweeklyvisitloglist,function (i, item) {
            $('.content_table4 > tbody').append(
                '<tr>' +
                '<td>'+ convertNull(item.customername) +'</td>' +
                '<td>'+ convertNull(item.projectname) +'</td>' +
                '<td>'+ convertNull(item.projectprovince) + convertNull(item.projectcity) +'</td>' +
                '<td>'+ convertNull(item.visitpersion) +'</td>' +
                '<td>'+ convertNull(item.projectlevelname) +'</td>' +
                '<td>'+ convertNull(item.visitlog) +'</td>' +
                '</tr>'
            )
        })

        //正在执行的商机反馈
        var crmweeklyexecutingsubjectlist = res.crmweeklyexecutingsubjectlist;
        $.each(crmweeklyexecutingsubjectlist,function (i, item) {
            $('#addBusingTable').append(
                '<tr>' +
                '<td>'+ item.customername +'</td>' +
                '<td>'+ item.projectname +'</td>' +
                '<td>'+ item.projectLevelName +'</td>' +
                '<td>'+ item.visitlog +'</td>' +
                '</tr>'
            )
        })
    })

    //处理null和空为-
    function convertNull(data) {
        if(data == null || data == ''){
            data = '-'
        }
        return data;
    }

    //处理null为空''
    function NulltoK(data) {
        if(data == null){
            data = ''
        }
        return data;
    }
})