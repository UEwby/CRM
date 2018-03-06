/**
 * Created by zzg on 2017/10/3.
 */
$(function () {
    var opportunitiesId = getSession("opportunitiesMsg").id;
    var opportunitiesName = getSession("opportunitiesMsg").name;
    var tabFlag = (getSession("opportunitiesMsg").tabFlag + '').slice(-1);
    var customerId = getSession("customerMsg").id;
    var customerName = getSession("customerMsg").name;

    //从跟进记录管理和客户池详情进入的，不可操作
    if(getSession('customerMsg').commFlag==1){
        $('.approval').css('display','none');
        $('.edit').css('display','none');
        $('.add').css('display','none');
    }

    // 判断当前商机是否可编辑、立项
    function apiIsEditProject(fn) {
        let params = {
            id: opportunitiesId,
            userid: crmMsg.userId
        };
        let data = {
            url: 'crmcustomerproject/detail?' + qs(params),
            type: 'get'
        }
        Ajax(data).then(function (res) {
            fn(res);
        })
    }
    apiIsEditProject(function (data) {
        if ((data.crmcustomerproject.isapproval == 0) && (data.crmcustomerproject.projectmanager == crmMsg.userId)) {
            $('.count-drop .edit').show();
            $('.count-drop .approval').show();
        }
    })
    // 判断是否有删除跟进人的权限
    function isdel(id1, id2) {
        var flag = true;
        if (id1 !== id2) {
            return !flag;
        }
        return flag;
    }
    function customerVisit(data, dom) {
        var str = '';
        $.each(data, function (i, item) {
            str += '<tr>' +
                '<td>' + item.linkmanname + '</td>' +
                '<td>' + getDateByDay(item.visitdate) + '</td>' +
                '<td>' + item.linkmanmobile + '</td>' +
                '<td>' + item.linkmanposition + '</td>' +
                '<td>' + item.linkmanlevel + '</td>' +
                '<td>' + item.visitcontent + '</td>' +
                '<td>' + item.nextvisitplan + '</td>' +
                ' </tr>'

        })
        $(dom).html(str);
    }
    // 查询跟进人信息
    function apiFind(fn) {
        let params = {
            projectid: opportunitiesId,
            isdel: "0",
            v: +new Date(),
        }
        let data = {
            url: "crmUserCustomerProject/find?" + qs(params),
            type: 'get',
        }
        Ajax(data).then(function (res) {
            fn(res)
        })
    }
    //删除跟进人函数
    function apiDelete(id, fn) {
        let params = {
            id: id,
        }
        let data = {
            url: "crmUserCustomerProject/delete?" + qs(params),
            type: 'get',
        }
        Ajax(data).then(function (res) {
            fn(res)
        })
    }
    // 详情加载
    function apiOpportunitiesDetail() {
        let params = {
            id: opportunitiesId,
        }
        let data = {
            url: "crmcustomerproject/detail?" + qs(params),
            type: "get"
        }
        Ajax(data).then(function (res) {
            var tit = $('.first-title');
            var linkmanStr = '';
            var visitLogsStr = '';
            var suggestStr = '';
            var crmcustomerproject = res.crmcustomerproject;
            var decisionmaker = res.decisionmaker;
            var businessman = res.businessman;
            var highestleader = res.highestleader;
            var lastvisitobject = res.lastvisitobject;
            var crmCustomerProjectReport = res.crmcustomerprojectreport;
            var linkmanlist = res.crmcustomerlinkmans;
            var crmcustomervisitlogs = res.crmcustomervisitlogs;
            var suggestlist = res.suggestlist;
            var flag = isdel(crmcustomerproject.projectmanager, crmMsg.userId);
            pushSession(
                'customerMsg',
                {
                    name: crmcustomerproject.customername,
                    id: crmcustomerproject.customerid,
                }
            );
            var str1 =
                '<li><span class="tit">商机名称：</span><span class="con">' + crmcustomerproject.projectname + '</span></li>' +
                '<li><span class="tit">商机等级：</span><span class="con">' + crmcustomerproject.projectlevelname + '</span></li>' +
                '<li><span class="tit">商机状态：</span><span class="con">' + transformProjectState(crmcustomerproject.projectstate) + '</span></li>' +
                '<li><span class="tit">商机类别：</span><span class="con">' + crmcustomerproject.businesstypename + '</span></li>' +
                '<li><span class="tit">部门：</span><span class="con">' + crmcustomerproject.deptment + '</span></li>' +
                '<li><span class="tit">商务负责人：</span><span class="con">' + crmcustomerproject.executive + '</span></li>' +
                '<li><span class="tit">技术负责人：</span><span class="con">' + crmcustomerproject.leadership + '</span></li>' +
                '<li><span class="tit">售前负责人：</span><span class="con">' + crmcustomerproject.presaler + '</span></li>' +
                '<li><span class="tit">预计合同金额：</span><span class="con">' + crmcustomerproject.signmoney + '万元</span></li>' +
                '<li><span class="tit">预算状态：</span><span class="con">' + transformBudgetStatus(crmcustomerproject.budgetstatus) + '</span></li>' +
                '<li><span class="tit">是否转包九次方：</span><span class="con">' + transformIssubcontract(crmcustomerproject.issubcontract) + '</span></li>' +
                '<li><span class="tit">我方签约主体：</span><span class="con">' + transformContractsubject(crmcustomerproject.contractsubject) + '</span></li>' +
                '<li><span class="tit">预计签约日期：</span><span class="con">' + getDateByDay(crmcustomerproject.signdate - 0) + '</span></li>'
            var str2 =
                '<li><span class="tit">历次拜访进展：</span><span class="con">' + crmCustomerProjectReport.previousvisits + '</span></li>' +
                '<li><span class="tit">潜在风险：</span><span class="con">' + crmCustomerProjectReport.risk + '</span></li>' +
                '<li><span class="tit">整体评估：</span><span class="con">' + crmCustomerProjectReport.assessment + '</span></li>' +
                '<li><span class="tit">应对策略：</span><span class="con">' + crmCustomerProjectReport.strategy + '</span></li>' +
                '<li><span class="tit">竞争对手：</span><span class="con">' + crmCustomerProjectReport.competitor + '</span></li>' +
                '<li><span class="tit">资源支持：</span><span class="con">' + crmCustomerProjectReport.resources + '</span></li>'
            apiFind(function (data) {
                var spanStr = '<span class="fl-con username-first">' + data[0].username + '</span>'
                var linkManIds = [];
                for (var i = 1; i < data.length; i++) {
                    if (flag) {
                        spanStr += '<span class="fl-con is-del"  username=' + data[i].username + '  usercustomerprojectid=' + data[i].usercustomerprojectid + '>' + data[i].username + '<i class="layui-icon" style="font-weight:700;">&#x1006</i></span>'
                    } else {
                        spanStr += '<span class="fl-con no-del">' + data[i].username + '</span>'
                    }
                }
                // 判断选项卡新建按钮是否显示
                // $.each(data, function (i, item) {
                //     linkManIds.push(item.userid);
                // })
                // if (linkManIds.indexOf(crmMsg.userId) == -1) {
                //     $('.add').remove();
                // }
                var systemStr =
                    '<div class="item">' +
                    '<div class="fl-con">' +
                    '<p>' +
                    '<span class="fl-con">负责人：</span>' +
                    '<span class="fl-con">' + crmcustomerproject.projectmanagername + '</span>' +
                    '</p>' +
                    ' <p>' +
                    '<span class="fl-con">创建时间：</span>' +
                    '<span class="fl-con">' + getDateByDay(crmcustomerproject.createtime) + '</span>' +
                    '</p>' +
                    '<p>' +
                    '<span class="fl-con">创建人：</span>' +
                    '<span class="fl-con">' + crmcustomerproject.creatorname + '</span>' +
                    '</p>' +
                    '<p>' +
                    '<span class="fl-con">修改日期：</span>' +
                    '<span class="fl-con">' + getDateByDay(crmcustomerproject.updatetime) + '</span>' +
                    '</p>' +
                    '</div>' +
                    '<div class="fl-con">' +
                    '<p class="system clearfix"><span class="fl-con">跟进人：</span>' + spanStr + '</p>' +
                    '</div>' +
                    '</div>'
                $('.system').html(systemStr)
            })
            $.each(linkmanlist, function (i, item) {
                linkmanStr +=
                    '<div class="item">' +
                    '<div class="fl-con">' +
                    '<p>' +
                    '<span class="fl-con">联系人：</span>' +
                    '<span class="fl-con">' + item.linkmanname + '</span>' +
                    '</p>' +
                    ' <p>' +
                    '<span class="fl-con">职位：</span>' +
                    '<span class="fl-con">' + item.linkmanposition + '</span>' +
                    '</p>' +
                    '<p>' +
                    '<span class="fl-con">级别：</span>' +
                    '<span class="fl-con">' + item.linkmanlevel + '</span>' +
                    '</p>' +
                    // '<p>' +
                    // '<span class="fl-con">联系人类别：</span>' +
                    // '<span class="fl-con">' + item.linkmantype + '</span>' +
                    // '</p>' +
                    '</div>' +
                    '<div class="fl-con">' +
                    '<p>' +
                    '<span class="fl-con">手机：</span>' +
                    '<span class="fl-con">' + transformNull(item.linkmanmobile) + '</span>' +
                    '</p>' +
                    ' <p>' +
                    '<span class="fl-con">电话：</span>' +
                    '<span class="fl-con">' + transformNull(item.linkmanphone) + '</span>' +
                    '</p>' +
                    '<p>' +
                    '<span class="fl-con">邮箱：</span>' +
                    '<span class="fl-con">' + transformNull(item.linkmanemail) + '</span>' +
                    '</p>' +
                    '</div>' +
                    // '<i class="delete e-linkman" linkmanid=' + item.id + '>编辑</i>' +
                    '</div>'

            })
            $.each(crmcustomervisitlogs, function (i, item) {
                visitLogsStr +=
                    '<div class="item">' +
                    '<div class="fl-con">' +
                    '<p>' +
                    '<span class="fl-con">跟进人：</span>' +
                    '<span class="fl-con">' + transformNull(item.creatorname) + '</span>' +
                    '</p>' +
                    ' <p>' +
                    '<span class="fl-con">跟进时间：</span>' +
                    '<span class="fl-con">' + transformNull(getDateByDay(item.visitdate)) + '</span>' +
                    '</p>' +
                    '<p>' +
                    '<span class="fl-con">联系人：</span>' +
                    '<span class="fl-con">' + transformNull(item.LinkManName) + '</span>' +
                    '</p>' +
                    '<p>' +
                    '<span class="fl-con">拜访方式：</span>' +
                    '<span class="fl-con">' + transformNull(item.name) + '</span>' +
                    '</p>' +
                    '</div>' +
                    '<div class="fl-con clearfix more-words">' +
                    '<p>' +
                    '<span class="fl-con">随访人员：</span>' +
                    '<span class="fl-con w-80">' + transformNull(item.customermanagerids) + '</span>' +
                    '</p>' +
                    '</div>' +
                    '<div class="fl-con clearfix  more-words">' +
                    '<p>' +
                    '<span class="fl-con">拜访目的：</span>' +
                    '<span class="fl-con w-80">' + transformNull(item.visitTarget) + '</span>' +
                    '</p>' +
                    '</div>' +
                    '<div class="fl-con clearfix more-words">' +
                    '<p>' +
                    '<span class="fl-con clearfix">拜访效果：</span>' +
                    '<span class="fl-con w-80">' + transformNull(item.visitcontent) + '</span>' +
                    '</p>' +
                    '</div>' +
                    '<div class="fl-con clearfix more-words">' +
                    '<p>' +
                    '<span class="fl-con next">下一步计划：</span>' +
                    '<span class="fl-con w-80">' + transformNull(item.nextvisitplan) + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</div>'
            })
            $.each(suggestlist, function (i, item) {
                var approveTimeStr = item.approveTime ? getDateByDay(item.approveTime) : getDateByDay(item.commitTime);
                suggestStr +=
                    '<tr>' +
                    '<td>' + transformNull(getDateByDay(item.commitTime)) + '</td>' +
                    '<td>' + transformNull(item.state) + '</td>' +
                    '<td>' + transformNull(item.approveName) + '</td>' +
                    '<td>' + transformDecision(item.decision) + '</td>' +
                    '<td>' + transformNull(item.suggestion) + '</td>' +
                    '<td>' + approveTimeStr + '</td>' +
                    ' </tr>'
            })
            tit.html(crmcustomerproject.projectname);
            $('.first-con').html(str1);
            customerVisit(decisionmaker, '.decisionmaker tbody');
            customerVisit(businessman, '.businessman tbody');
            customerVisit(highestleader, '.highestleader tbody');
            customerVisit(lastvisitobject, '.lastvisitobject tbody');
            $(".third-con").html(str2);
            $(".linkmanlist").html(linkmanStr);
            $('.visitLogs').html(visitLogsStr || noDataStr('common'));
            $('.suggest tbody').html(suggestStr || noDataStr('table', 6));
            $($('.layui-tab-title li')[tabFlag]).addClass('layui-this').siblings().removeClass('layui-this');
            $($('.layui-tab-item')[tabFlag]).addClass('layui-show').siblings().removeClass('layui-show');
        })
    }
    apiOpportunitiesDetail()
    /* 信息列表样式-收起展开 */
    packUp('.second-pack', '.customer-visit', 1000);
    packUp('.third-pack', '.third-con', 800);
    // 删除跟进人
    $('.wrap-con').on('click', '.is-del i', function () {
        var self = $(this);
        var id = self.parent().attr("usercustomerprojectid");
        var name = self.parent().attr("username")
        layer.confirm('确定删除跟进人：<em style="color:red; font-weight: 700">' + name + '</em> 吗?', function () {
            apiDelete(id, function (data) {
                if (data.backHttpResult.code != '000') {
                    layer.msg('删除失败')
                    return;
                }
                self.parent().remove();
            })
            layer.closeAll();
        })
    })
    // 商机打印
    $('.print').on('click', function () {
        var printId = [opportunitiesId];
        pushSession('opportunitiesMsg', {
            printId: printId,
        })
        window.open('./businessReport.html');
    })
    // 商机编辑
    $('.edit').on('click', function () {
        pushSession('opportunitiesMsg', {
            upDate: 221,
            id: opportunitiesId,
            url: 22,
        })
        location.href = "./newOpportunities.html"
    })

    // 商机立项
    function apiCommitProject(fn) {
        let params = {
            crmcustomerproject: {},
        };
        params.crmcustomerproject.id = (opportunitiesId - 0);
        let data = {
            url: 'crmcustomerproject/commitproject',
            type: 'post',
            data: params
        }
        Ajax(data).then(function (res) {
            fn(res);
        })
    }
    $('.approval').on('click', function () {
        layer.confirm('<em style="color:red; font-weight: 700">确定申请立项吗？</em>', function () {
            apiCommitProject(function (data) {
                if (data.backHttpResult.code != '000') {
                    layer.confirm('<em style="color:red; font-weight: 700">'+data.backHttpResult.result+'</em>')
                    return false;
                }
                layer.confirm('<em style="color:red; font-weight: 700">申请立项成功</em>');
                pushSession(
                    'opportunitiesMsg',
                    {
                        tabFlag: 222,
                    }
                );
                location.href = "./businessDetails.html"
            })
        })
    })
    /* 客户详情底部-选项卡 */
    layui.use('element', function () {
        var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
        var skipUrl = skipUrl = "../followRecords/followUpRecord.html";
        var skip = 220;
        element.on('tab(demo)', function (data) {
            if(getSession('customerMsg').commFlag!=1){
                if (data.index != 0 && data.index != 1) {
                    $('.add') && $('.add').hide();
                } else {
                    $('.add') && $('.add').show();
                }
            }

            data.index == 1 && (skipUrl = "../customerManagement/newLinker.html");
            data.index == 0 && (skipUrl = "../followRecords/followUpRecord.html");
            skip = 220 + data.index;
        });
        $('.add').on('click', function (e) {
            pushSession(
                'customerMsg',
                {
                    linkerEdit: '02',
                    linkerUrl: 22,
                    name: customerName,
                    id: customerId,
                }
            );
            pushSession(
                'opportunitiesMsg',
                {
                    id: opportunitiesId,
                    name: opportunitiesName,
                    tabFlag: skip,
                }
            );
            pushSession('followMsg', {
                url: 22
            })
            location.href = skipUrl
        })
    })
    $(".linkmanlist").on('click', '.e-linkman', function () {
        var linkmanid = $(this).attr('linkmanid')
        pushSession(
            'customerMsg',
            {
                linkerId: linkmanid,
                linkerEdit: '12',
                linkerUrl: 22,
            }
        );
        pushSession(
            'opportunitiesMsg',
            {
                id: opportunitiesId,
            }
        );
        location.href = "../customerManagement/newLinker.html"
    })
})

