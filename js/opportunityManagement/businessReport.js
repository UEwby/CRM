$(function () {
    var opportunitiesIds = getSession('opportunitiesMsg').printId.join(',');
    var department = crmMsg.department || '－';
    apiOpportunitiesDetail(function (res) {
        var str = '';
        $.each(res, function (i, item) {
            var data = item;
            // 客户档案部分
            var linkmanList = data.linkmanList[0];
            linkmanList.LinkManPhone = linkmanList.LinkManPhone || '－';
            linkmanList.LinkManEmail = linkmanList.LinkManEmail || '－';
            // 商机基本信息
            var crmcustomerproject = data.crmcustomerproject;
            crmcustomerproject.contractsubject = transformContractsubject(crmcustomerproject.contractsubject);
            crmcustomerproject.projectstate = transformProjectState(crmcustomerproject.projectstate);
            crmcustomerproject.budgetstatus = transformBudgetStatus(crmcustomerproject.budgetstatus);
            crmcustomerproject.issubcontract = transformIssubcontract(crmcustomerproject.issubcontract);
            crmcustomerproject.signdate = getDateByDay(crmcustomerproject.signdate);
            // 商机跟进信息
            var crmcustomervisitlogsStr = getVisitlogStr(data.crmcustomervisitlogs);
            // 客户跟进信息
            var decisionmakerStr = getStr(data.decisionmaker);
            var businessmanStr = getStr(data.businessman);
            var highestleaderStr = getStr(data.highestleader);
            var lastvisitobjectStr = getStr(data.lastvisitobject);
            // 综合情况
            var crmcustomerprojectreport = data.crmcustomerprojectreport;
            str +=
                '<li class="list-item">' +
                '<ul class="print-tit">' +
                '<li>' +
                '<span>商机名称：</span>' +
                '<span>' + crmcustomerproject.projectname + '</span>' +
                '</li>' +
                '<li>' +
                '<span>填写人：</span>' +
                '<span>' + crmcustomerproject.creatorname + '</span>' +
                '</li>' +
                '<li>' +
                '<span>所属部门：</span>' +
                '<span>' + department + '</span>' +
                '</li>' +
                '<li>' +
                '<span>商机编号：</span>' +
                '<span>' + crmcustomerproject.projectcode + '</span>' +
                '</li>' +
                '</ul>' +
                '<table>' +
                '<tbody id="linkmanList">' +
                '<tr>' +
                '<td colspan="4">客户档案</td>' +
                '</tr>' +
                '<tr>' +
                '<td>客户名称</td>' +
                '<td id="customername">' + linkmanList.customername + '</td>' +
                '<td>客户联系人</td>' +
                '<td >' + linkmanList.LinkManName + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>职位</td>' +
                '<td>' + linkmanList.LinkManPosition + '</td>' +
                '<td>级别</td>' +
                '<td>' + linkmanList.LinkManLevel + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>手机</td>' +
                '<td>' + linkmanList.LinkManMobile + '</td>' +
                '<td>电话</td>' +
                '<td>' + linkmanList.LinkManPhone + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>邮箱</td>' +
                '<td colspan="3">' + linkmanList.LinkManEmail + '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<table class="customer-visit">' +
                '<tbody>' +
                '<tr>' +
                '<td colspan="5" class="customer-visit-info">商机跟进信息</td>' +
                '</tr>' +
                '<tr class="customer-visit-tit">' +
                '<td>拜访时间</td>' +
                '<td>拜访方式</td>' +
                '<td>拜访目的</td>' +
                '<td>拜访效果</td>' +
                '<td>下一步计划</td>' +
                '</tr>'
                + crmcustomervisitlogsStr +
                '</tbody>' +
                '</table>' +
                '<table>' +
                '<tbody id="crmcustomerproject">' +
                '<tr>' +
                '<td colspan="4">商机基本信息</td>' +
                '</tr>' +
                '<tr>' +
                '<td>商机名称</td>' +
                '<td id="projectname">' + crmcustomerproject.projectname + '</td>' +
                '<td>商机等级</td>' +
                '<td>' + crmcustomerproject.projectlevelname + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>商机状态</td>' +
                '<td>' + crmcustomerproject.projectstate + '</td>' +
                '<td>预算状态</td>' +
                '<td>' + crmcustomerproject.budgetstatus + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>商务负责人</td>' +
                '<td>' + crmcustomerproject.executive + '</td>' +
                '<td>商机类别</td>' +
                '<td>' + crmcustomerproject.businesstypename + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预计合同金额(万)</td>' +
                '<td>' + crmcustomerproject.signmoney + '</td>' +
                '<td>部门</td>' +
                '<td>' + crmcustomerproject.deptment + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>售前责任人</td>' +
                '<td>' + crmcustomerproject.presaler + '</td>' +
                '<td>技术责任人</td>' +
                '<td>' + crmcustomerproject.leadership + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>是否转包九次方</td>' +
                '<td>' + crmcustomerproject.issubcontract + '</td>' +
                '<td>我方签约主体</td>' +
                '<td>' + crmcustomerproject.contractsubject + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预计签约日期</td>' +
                '<td colspan="3">' + crmcustomerproject.signdate + '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<table class="crmcustomerprojectexternaldecision">' +
                '<tbody>' +
                '<tr>' +
                '<td colspan="7" class="visit-info">客户联系人跟进信息</td>' +
                '</tr>' +
                '<tr class="info-tit">' +
                '<td>项目最高决策人</td>' +
                '<td>联系方式</td>' +
                '<td>职位</td>' +
                '<td>级别</td>' +
                '<td>拜访效果</td>' +
                '<td>下一步计划</td>' +
                '</tr>'
                + decisionmakerStr +
                '</tbody>' +
                '<tbody>' +
                '<tr class="info-tit">' +
                '<td>业务对接人</td>' +
                '<td>联系方式</td>' +
                '<td>职位</td>' +
                '<td>级别</td>' +
                '<td>拜访效果</td>' +
                '<td>下一步计划</td>' +
                '</tr>'
                + businessmanStr +
                '</tbody>' +
                '<tbody>' +
                '<tr class="info-tit">' +
                '<td>拜访最高负责人</td>' +
                '<td>联系方式</td>' +
                '<td>职位</td>' +
                '<td>级别</td>' +
                '<td>拜访效果</td>' +
                '<td>下一步计划</td>' +
                '</tr>'
                + highestleaderStr +
                '</tbody>' +
                '<tbody>' +
                '<tr class="info-tit">' +
                '<td>上次拜访对象</td>' +
                '<td>联系方式</td>' +
                '<td>职位</td>' +
                '<td>级别</td>' +
                '<td>拜访效果</td>' +
                '<td>下一步计划</td>' +
                '</tr>'
                + lastvisitobjectStr +
                '</tbody>' +
                '</table>' +
                '<table>' +
                '<tbody id="crmcustomerprojectreport">' +
                '<tr>' +
                '<td colspan="4">综合情况</td>' +
                '</tr>' +
                '<tr>' +
                '<td>历次拜访进展</td>' +
                '<td>' + crmcustomerprojectreport.previousvisits + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>整体评估</td>' +
                '<td>' + crmcustomerprojectreport.assessment + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>竞争对手</td>' +
                '<td>' + crmcustomerprojectreport.competitor + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>潜在风险</td>' +
                '<td>' + crmcustomerprojectreport.risk + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>应对策略</td>' +
                '<td>' + crmcustomerprojectreport.strategy + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>资源支持</td>' +
                '<td>' + crmcustomerprojectreport.resources + '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</li>'

        });
        $('.print-list').html(str);
        $('.date').html('打印日期：' + getDateByDay(+new Date()))

    })
    $('.print').on('click', function () {
        layer.confirm('<em style="color:red; font-weight: 700">确定打印商机吗？</em>', function () {
            print();
            layer.closeAll();
        })
    })
    function print() {
        $("#print-area").jqprint({
            debug: false,
            importCSS: true,
            printContainer: true,
            operaSupport: true
        });
    }
    function getVisitlogStr(data) {
        var str = "";
        $.each(data, function (i, item) {
            str += '<tr>' +
                '<td>' + getDateByDay(item.visitdate) + '</td>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.visitTarget + '</td>' +
                '<td>' + item.visitcontent + '</td>' +
                '<td>' + item.nextvisitplan + '</td>' +
                '</tr>'
        })
        var strNull = '<tr>' +
            '<td>－</td>' +
            '<td>－</td>' +
            '<td>－</td>' +
            '<td>－</td>' +
            '<td>－</td>' +
            '</tr>'
        return str || strNull;
    }
    function getStr(data) {
        var str = ''
        $.each(data, function (i, item) {
            str += '<tr>' +
                '<td>' + item.linkmanname + '</td>' +
                '<td>' + item.linkmanmobile + '</td>' +
                '<td>' + item.linkmanposition + '</td>' +
                '<td>' + item.linkmanlevel + '</td>' +
                '<td>' + item.visitcontent + '</td>' +
                '<td>' + item.nextvisitplan + '</td>' +
                '</tr>'
        })
        return str
    }
    function apiOpportunitiesDetail(fn) {
        let params = {
            ids: opportunitiesIds,
        }
        let data = {
            url: "crmcustomerproject/print?" + qs(params),
            type: "get"
        }
        Ajax(data).then(function (data) {
            fn(data)
        })
    }

})