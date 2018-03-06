$(function () {
    var transferuserids, transferusername;
    // 判断是否显示合并商机选项
    // function apiFindOperate(fn) {
    //     let params = {
    //         id: crmMsg.userId,
    //         parentid: 30
    //     }
    //     let data = {
    //         type: 'get',
    //         url: 'pc/crmmenu/findoperate?' + qs(params)
    //     }
    //     Ajax(data).then(function (res) {
    //         fn(res)
    //     })
    // }
    // apiFindOperate(function (res) {
    //     $.each(res, function (i, item) {
    //         if (item.menuid == 39 && item.isshow == 1) {
    //             $('.combine').show();
    //         }
    //     })
    // })

    apiCrmCustomerWordBook(function (data) {
        var str = "";
        $.each(data, function (i, item) {
            str += '<option value=' + item.id + '>' + item.name + '</option>'
        })
        $('.businesstype').append(str);
    })
    function getParams(obj) {
        return {
            userid: crmMsg.userId,
            isflag: getIsFlag(),
            rows: obj && obj.limit,
            page: obj && obj.curr,
            v: +new Date(),
            name: getSearchText(".input-search input"),
            businesstype: getSearchText(".businesstype"),
            srctype: getSearchText(".srctype"),
            projectlevel: getSearchText(".projectlevel"),
            projectstate: getSearchText(".projectstate"),
            budgetstatus: getSearchText(".budgetstatus"),
            decision: getSearchText(".decision"),
            isapproval: getSearchText(".isapproval"),
            beginbudgetmoney: getSearchText(".beginbudgetmoney"),
            endbudgetmoney: getSearchText(".endbudgetmoney"),
            // customerprovincename: getSearchText(".customerprovince"),
            // customercityname: getSearchText(".customercity"),
            // customerdistrictname: getSearchText(".customerdistrict"),
            begincreatedate: getSearchText(".begincreatedate"),
            endcreatedate: getSearchText(".endcreatedate"),
        }
    }

    function apiOpportunities(obj, name) {
        if (!obj) {
            obj = {};
            obj.curr = 1;
            obj.limit = 20;
        }
        let params = getParams(obj);
        let data = {
            type: 'get',
            url: "crmcustomerproject/pcfindprojectbypage?" + qs(params)
        };
        Ajax(data).then(function (data) {
            let domStr = '';
            $.each(data.rows, function (i, item) {
                var editStr = '';
                var handleStr = '<span class="handle">跟进</span>';
                var replaceStr = ''
                // item.isshow == 1 && (handleStr = '<span class="handle">跟进</span>')
                item.isedit == 1 && (editStr = '&nbsp;  <span  class="update">编辑</span>');
                !editStr && !handleStr && (replaceStr = '－')
                domStr += '<tr>' +
                    '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary" is-transform-share="' + item.isapproval + '" projectmanagername="' + item.projectmanagername + '"  opportunities-id=' + item.id + ' ><i class="layui-icon"></i></div></td>' +
                    '<td class="name-hover opportunities-name" opportunities-id=' + item.id + '>' + item.projectname + '</td>' +
                    '<td>' + transformProjectState(item.projectState) + '</td>' +
                    '<td class="customer-name" customer-id=' + item.customerid + '>' + item.customername + '</td>' +
                    // '<td>' + transformBudgetStatus(item.budgetStatus) + '</td>' +
                    '<td>' + item.SignMoney + '万元' + '</td>' +
                    '<td>' + item.projectlevelname.slice(0, 2) + '</td>' +
                    '<td>' + item.srctype + '</td>' +
                    '<td>' + item.projectmanagername + '</td>' +
                    '<td>' + getDateByDay(item.signdate) + '</td>' +
                    '<td>' + transformDecision(item.decision) + '</td>' +
                    '<td>' +
                    handleStr +
                    editStr +
                    replaceStr +
                    '</td>' +
                    '</tr>'
            })
            $(".layui-table tbody").html(domStr || noDataStr('table', 11));
            // 分页
            pager(obj, data.total, [10, 20, 50, 100], apiOpportunities, $('.pager'));
        })
    }

    function apiIsUpdate(opportunitiesId, fn) {
        let params = {
            id: opportunitiesId,
            userid: crmMsg.userId,
        }
        let data = {
            url: 'crmcustomerproject/detail?' + qs(params),
            type: 'get'
        }
        Ajax(data).then(function (res) {
            fn(res);
        })
    }

    apiOpportunities();
    select('.all', '.all-control');
    //列表切换
    $('#drop-down-box').on('click', '.dropdown li', function () {
        $(".input-search input").val('');
        clearFilter();
        apiOpportunities();
    })
    //搜索功能
    $(".input-search i").on('click', function (e) {
        getParams().name && clearFilter();
        getParams().name && apiOpportunities();
    })
    $('.input-search input').on('keyup', function (e) {
        if (e.keyCode == 13) {
            getParams().name && clearFilter();
            getParams().name && apiOpportunities();
        }
    })
    // 高级 筛选弹窗
    layui.use(['laydate'], function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: ".begincreatedate",
        })
        laydate.render({
            elem: ".endcreatedate"
        })
    });
    $('.advanced-filter').on('click', function () {
        layer.open({
            skin: 'my-layer',
            type: 1,
            title: '高级筛选',
            content: $("#div4"),
            area: ['1100px', '432px'],
            btn: ['重 置', '确 定'],
            btn1: function () {
                clearFilter();
                layer.msg('已清空条件', {
                    time: 1500,
                })
            },
            btn2: function () {
                isShow();
                apiOpportunities();
                layer.closeAll();
            }
        })
    })
    //切换对应页面
    $('table').on('click', '.layui-form-checkbox', function () {
        var flag = true;
        $('.layui-form-checkbox').each(function (i, item) {
            if ($(item).hasClass('layui-form-checked')) {
                $('.export').text('导出商机');
                flag = false;
                return false;
            }
        })
        flag && $('.export').text('导出全部');
    })
    $(".wrap-top").on('click', ".nav-btn", function () {
        var txt = $(this).text();
        if (txt == "新建商机") {
            pushSession('opportunitiesMsg', {
                upDate: 210,
                url: 21,
            })
            location.href = "./newOpportunities.html"
            return;
        }
        if (txt == '导出全部' || txt == '导出商机') {
            var projectids = [];
            $('.layui-form-checkbox').each(function (i, item) {
                if ($(item).hasClass('layui-form-checked') && $(item).attr('opportunities-id')) {
                    var id = $(item).attr('opportunities-id');
                    projectids.push(id);
                }
            })
            let exportParams = getParams();
            exportParams.projectids = projectids.join();
            let url = Url + 'pc/project/export?' + qs(exportParams);
            window.location.href = url;
            return;
        }
        if (txt == "转移商机") {
            transferOrShare({
                check: '请勾选要转移的商机',
                msg1: '没有可转移用户',
                msg2: '请选择要转移的人员',
                confirmMsg: '确定转移所选商机吗？',
                title: '转移商机',
                apiType: 'transfer',
                txt: '转移给：',
                tip: '* 必须选择“转移人”才能进行“保存”',
                type: '0'
            });
            return;
        }
        if (txt == "共享商机") {
            transferOrShare({
                check: '请勾选要共享的商机',
                msg1: '没有可共享用户',
                msg2: '请选择要共享的人员',
                confirmMsg: '确定共享所选商机吗？',
                title: '共享商机',
                apiType: 'share',
                txt: '共享给：',
                tip: '* 必须选择“共享人”才能进行“保存”',
                type: 1
            });
            return;
        }
        if (txt == '合并商机') {
            apiProjectdetail(function (data) {
                renderMain(data);
                selectMain();
                layer.open({
                    skin: 'my-layer',
                    type: 1,
                    title: '合并商机',
                    content: $("#merge"),
                    area: ['750px', '358px'],
                    btn: ['取 消', '保 存'],
                    btn1: function () {
                        layer.closeAll();
                    },
                    btn2: function () {
                        var postData = {};
                        var flag = true;
                        $('.this-opportunities').each(function (i, item) {
                            if ($(this).hasClass('active')) {
                                flag = false;
                            }
                        })
                        if (flag) {
                            layer.confirm('<em style="color:red; font-weight: 700">请选择其中一条商机</em>');
                            return false;
                        }
                        if (!flag) {
                            layer.confirm('<em style="color:red; font-weight: 700">确定合并吗</em>', function () {
                                $('#merge input:radio').each(function (i, item) {
                                    if ($(this).prop('checked')) {
                                        postData[$(this).attr('data-key')] = $(this).val();
                                    }
                                })
                                apiMergeupdate(data, postData, function (res) {
                                    if (res != 1) {
                                        layer.msg('合并失败');
                                        return false;
                                    }
                                    apiOpportunities();
                                })
                                layer.closeAll();
                            });
                            return false;
                        }

                    },
                })
            })
            return;
        }
        if (txt == '打印商机') {
            var printId = [];
            var num = -1;
            $('tbody .layui-form-checked').each(function (i, item) {
                num = i;
                printId.push($(item).attr('opportunities-id'))
            })
            if (num < 0) {
                layer.confirm('<em style="color:red; font-weight: 700">请选择要打印的商机</em>');
                return;
            }
            pushSession('opportunitiesMsg', {
                printId: printId,
            })
            window.open('./businessReport.html');
            return;
        }
    })
    // 点选以该商机为主
    function setTitleValue(dom, data) {
        var nameKey = $(dom).attr('name'),
            valKey = $(dom).attr('data-key'),
            title = $(dom).attr('title');
        for (var k in data) {
            if (nameKey == k) {
                nameKey != 'signdate' && nameKey != 'signmoney' && $(dom).attr('title', title + '<em>' + data[nameKey] + '</em > ');
                nameKey == 'signdate' && $(dom).attr('title', title + '<em>' + getDateByDay(data[nameKey]) + '</em>');
                nameKey == 'signmoney' && $(dom).attr('title', title + '<em>' + data[nameKey] + ' 万</em>');
            }
            ;
            if (valKey == k) {
                valKey != 'signdate' && $(dom).val(data[valKey]);
                valKey == 'signdate' && $(dom).val(getDateByDay(data[valKey]));
            }
        }
    }

    function renderMain(data) {
        // 渲染数据
        $('.this-opportunities').removeClass('active');
        var str =
            '<input type="radio" data-key="projectname" name="projectname"  title="商机名称： ">' +
            '<input type="radio" data-key="projectlevel" name="projectlevelname" title="商机等级：">' +
            '<input type="radio" data-key="projectmanager" name="projectmanagername"  title="所属人：">' +
            '<input type="radio" data-key="signdate" name="signdate"  title="预计签约日期：">' +
            '<input type="radio" data-key="signmoney" name="signmoney"  title="预计合同金额：">';
        $('.layui-input-block').html(str);
        var opportunitiesFData = data.oldObject;
        var opportunitiesSData = data.newObject;
        $('.opportunities-1 span').attr('opportunities-id', opportunitiesFData.id);
        $('.opportunities-2 span').attr('opportunities-id', opportunitiesSData.id);
        $('.opportunities-1-con input').each(function (i, item) {
            setTitleValue(item, opportunitiesFData)
        })
        $('.opportunities-2-con input').each(function (i, item) {
            setTitleValue(item, opportunitiesSData)
        })
        FORM.render();
    }

    function selectMain() {
        $('.this-opportunities').on('click', function () {
            $(this).addClass('active');
            if ($(this).parent().hasClass('opportunities-1')) {
                $('.opportunities-1-con input:radio').prop('checked', true);
                $('.opportunities-2 span').removeClass('active')
            }
            if ($(this).parent().hasClass('opportunities-2')) {
                $('.opportunities-2-con input:radio').prop('checked', true);
                $('.opportunities-1 span').removeClass('active')
            }
            FORM.render();
        })
    }

    function apiProjectdetail(fn) {
        var l = $('tbody .layui-form-checked').length;
        var ids = [];
        if (l != 2) {
            layer.confirm('<em style="color:red; font-weight: 700">请选择两条商机</em>');
            return false;
        }
        $('tbody .layui-form-checked').each(function (i, item) {
            var opportunitiesId = $(this).parent().parent().children('.opportunities-name').attr('opportunities-id');
            ids.push(opportunitiesId);
        })
        let params = {
            newid: ids[0],
            oldid: ids[1]
        }
        let data = {
            type: 'get',
            url: 'crmcustomerproject/projectdetail?' + qs(params)
        }
        Ajax(data).then(function (res) {
            fn(res);
        })
    }

    function apiMergeupdate(res, postData, fn) {
        var newid, oldid, olduserid;
        $('.this-opportunities').each(function (i, item) {
            if ($(this).hasClass('active')) {
                newid = $(this).attr('opportunities-id');
            }
            if (!$(this).hasClass('active')) {
                oldid = $(this).attr('opportunities-id');
            }
        })
        $('#merge input:radio').each(function (i, item) {
            if (!$(this).prop('checked') && $(this).attr('name') == 'projectmanagername') {
                olduserid = $(this).val();
            }
        })
        let query = {
            newid: newid,
            oldid: oldid,
            issame: res.oldObject.projectmanager != res.newObject.projectmanager ? 0 : 1,
            olduserid: olduserid
        }
        let data = {
            type: 'post',
            url: 'pc/project/mergeupdate?' + qs(query),
            data: postData,
        }
        Ajax(data).then(function (resData) {
            fn(resData)
        })
    }

    // 新建跟进
    $("tbody").on('click', '.handle', function () {
        var opportunitiesId = $(this).parent().parent().children('.opportunities-name').attr('opportunities-id');
        var customerId = $(this).parent().parent().children('.customer-name').attr('customer-id');
        var opportunitiesName = $(this).parent().parent().children('.opportunities-name').html();
        var customerName = $(this).parent().parent().children('.customer-name').html();
        pushSession('opportunitiesMsg', {
            id: opportunitiesId,
            name: opportunitiesName,
        })
        pushSession('customerMsg', {
            id: customerId,
            name: customerName,
            url: 21
        })
        pushSession('followMsg', {
            url: 21
        })
        location.href = '../followRecords/followUpRecord.html'
    })
    // 编辑商机
    $("tbody").on('click', '.update', function () {
        var opportunitiesId = $(this).parent().parent().children('.opportunities-name').attr('opportunities-id');
        var opportunitiesName = $(this).parent().parent().children('.opportunities-name').html();
        apiIsUpdate(opportunitiesId, function (data) {
            pushSession('opportunitiesMsg', {
                upDate: 211,
                id: opportunitiesId,
                url: 21,
            })
            location.href = './newOpportunities.html';
        })
    })
    // 切换详情页面
    $('tbody').on('click', 'td', function () {
        // if ($(this).hasClass('customer-name')) {
        //     var customerId = $(this).attr("customer-id");
        //     var customerName = $(this).text();
        //     pushSession('customerMsg', { id: customerId, name: customerName });
        //     location.href = "../customerManagement/customerDetails.html"
        // }
        if ($(this).hasClass('opportunities-name')) {
            var opportunitiesId = $(this).attr("opportunities-id");
            var opportunitiesName = $(this).text();
            var customerId = $(this).parent().find('.customer-name').attr("customer-id");
            var customerName = $(this).parent().find('.customer-name').text();
            pushSession('opportunitiesMsg', {
                id: opportunitiesId,
                name: opportunitiesName,
                tabFlag: 220,
            });
            pushSession('customerMsg', {
                id: customerId,
                name: customerName,
                commFlag: '0',
            });
            location.href = "./businessDetails.html"
        }
    })

    // 数字验证
    $('.beginbudgetmoney').on('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });
    $('.endbudgetmoney').on('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });
    // 转移商机折叠效果
    $('.content-name').on('click', '.title', function () {
        $(this).children('.layui-icon').toggleClass('collapse')
        var $ul = $(this).parent().children('ul');
        $ul.toggle('500');
    })
    // 转移商机 选中效果
    $('.content-name').on('click', '.customer-name', function () {
        var txt = $(this).text();
        transferuserids = $(this).attr('customer-id');
        transferusername = $(this).text();
        $('.customer-name').removeClass('select');
        $(this).addClass('select');
        $('.transfer-name span').html(txt).parent().css('display', 'block')
    })
    // 删除效果
    $('.top').on('click', '.del-icon', function () {
        $(this).parent().css('display', 'none');
        $('.customer-name').removeClass('select');
    })
    // 获取所有转移或共享客户
    function apiFindPage(fn, usernamecn, type) {
        let params = {
            userid: crmMsg.userId,
            _time: +new Date(),
            usernamecn: usernamecn,
            type: type
        }
        let data = {
            type: 'get',
            url: 'sysuser/finduserall?' + qs(params)
        }
        Ajax(data).then(function (res) {
            fn(res)
        })
    }

    // 转移或共享商机
    function apiTransferOrShare(mold, projectids, transferuserids, fn, usernamecn) {
        let params = {
            transferorshare: mold,
            type: 'project',
            userid: crmMsg.userId,
            transferuserids: transferuserids,
            projectids: projectids,
            _time: +new Date(),
        }
        let data = {
            type: 'get',
            url: 'crmUserCustomer/transferOrShare?' + qs(params)
        }
        Ajax(data).then(function (res) {
            fn(res)
        })
    }

    //转移或共享窗口dom渲染
    function renderTransferOrShare(data) {
        var str = '';
        $.each(data, function (i, item) {
            var lisStr = '';
            var userNamepinyinf = Object.keys(item)[0]
            $.each(item[userNamepinyinf], function (idx, val) {
                lisStr += '<li class="customer-name" customer-id="' + val.userId + '">' + val.userNamecn + '</li>'
            })
            str +=
                '<li>' +
                '<h3 class="title">' + userNamepinyinf.toUpperCase() + '' +
                '<i class="layui-icon fr" style="font-size: 12px; color: #7d8690; margin-right:12px;">&#xe625;</i>' +
                '</h3>' +
                '<ul>' +
                lisStr +
                '</ul>' +
                '</li>'
        })
        $('.content-name').html(str);
    }

    // 转移或共享函数
    function transferOrShare(opt) {
        opt.projectids = isTransferOrShare(opt.check)
        opt.projectids && apiFindPage(function (res) {
            if (res.length == 0) {
                layer.msg(opt.msg1)
                return false;
            }
            renderTransferOrShare(res);
            $('.transfer-share').val('');
            $('.customer-name').removeClass('select');
            $('.transfer-name').css('display', 'none');
            $('.top span:first').text(opt.txt);
            $('.tips').text(opt.tip);
            layer.open({
                skin: 'my-layer',
                type: 1,
                title: opt.title,
                content: $(".transfer"),
                area: ['425px', '480px'],
                btn: ['取 消', '保 存'],
                btn1: function () {
                    layer.closeAll();
                },
                btn2: function () {
                    if (!$('.transfer-name').is(':visible')) {
                        layer.confirm('<em style="color:red; font-weight: 700">' + opt.msg2 + '</em>');
                        return false;
                    }
                    layer.confirm('<em style="color:red; font-weight: 700">' + opt.confirmMsg + '</em>', function () {
                        apiTransferOrShare(opt.apiType, opt.projectids, transferuserids, function (res) {
                            if (res.backHttpResult.code != '000') {
                                layer.msg(res.backHttpResult.result);
                                return;
                            }
                            apiOpportunities();
                            layer.msg('所选商机已' + opt.txt + transferusername, {time: 800}, function () {
                                layer.closeAll();
                            })
                        }, opt.usernamecn)
                    });
                    return false;
                },
            })
        }, '', opt.type)
    }

    // 转移或共享搜索
    $('.transfer-share').on('input', function () {
        var val = $.trim($(this).val());
        var txt = $(this).siblings().text();
        var type;
        if (txt.indexOf('转移') != -1) {
            type = '0';
        }
        if (txt.indexOf('共享') != -1) {
            type = '1';
        }
        apiFindPage(function (res) {
            renderTransferOrShare(res)
        }, val, type)
    })
    // 判断是否可以转移或者共享
    function isTransferOrShare(check) {
        var projectids = [];
        var flag;
        if (getIsFlag() == '1') {
            layer.confirm('<em style="color:red; font-weight: 700">只能操作自己名下的商机</em>');
            return;
        }
        $('tbody .layui-form-checkbox').each(function (i, item) {
            if ($(item).hasClass('layui-form-checked') && crmMsg.userNamecn != $(item).attr('projectmanagername')) {
                layer.confirm('<em style="color:red; font-weight: 700">只能操作自己名下的商机</em>');
                flag = true;
                return false;
            }
            if ($(item).hasClass('layui-form-checked') && 1 == $(item).attr('is-transform-share')) {
                layer.confirm('<em style="color:red; font-weight: 700">不可以操作提交审核立项中的商机</em>');
                flag = true;
                return false;
            }
            if ($(item).hasClass('layui-form-checked')) {
                $(item).attr('opportunities-id') && projectids.push($(item).attr('opportunities-id'))
            }
        })
        if (flag) {
            return;
        }
        if (projectids.length == 0) {
            layer.confirm('<em style="color:red; font-weight: 700">' + check + '</em>');
            return false;
        }
        return projectids.join(',');
    }

})