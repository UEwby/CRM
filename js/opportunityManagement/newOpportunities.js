$(function () {
    var customerId,
        popDataList = [],
        isUpdate,
        opportunitiesId,
        skipUrl,
        linkmanid,
        crmcustomerprojectreportId,
        sjFlag;
    // // 禁止空格输入
    // delSpace('.content_w input')
    // delSpace('.content_w textarea')
    // 判断是否为编辑系统
    var isUpDate = (getSession('opportunitiesMsg').upDate + '').slice(-1) == 1 ? 1 : 0;
    // 客户详情新建商机
    var customerCreate = (getSession('opportunitiesMsg').upDate + '').slice(0, 1);
    if (customerCreate == 1) {
        var customerName = getSession('customerMsg').name;
        customerId = getSession('customerMsg').id;
        $('#khmc').val(customerName).prop('disabled', true);
        apiFindCustomerLinkManAll(customerId);
    }
    opportunitiesId = getSession('opportunitiesMsg').id;
    skipUrl = isSkipUrl(getSession('opportunitiesMsg').url);
    // 获取商机类别
    apiCrmCustomerWordBook(function (data) {
        var str = '<option>请选择</option>';
        $.each(data, function (i, item) {
            str += ' <option value="' + item.id + '">' + item.name + '</option>'
        });
        $('#sjlb').html(str);
        isUpDate && apiDetail(function (data) {
            // 修改标题为编辑信息
            $('.opp-tit').html('编辑商机');
            $('title').html('编辑商机');
            $('#khmc').prop('disabled', true);
            popDataList = data.visitlogList;
            // 客户档案部分
            var linkmanList = data.linkmanList[0];
            customerId = linkmanList.CustomerID;
            linkmanList.linkmanname = data.linkmanname;
            linkmanid = data.linkmanid;
            setFormVal(linkmanList, ['#crmcustomerlinkman input']);
            // 商机基本信息
            var crmcustomerproject = data.crmcustomerproject;
            setFormVal(crmcustomerproject, ['#crmcustomerproject input', '#crmcustomerproject select']);
            // 客户跟进记录
            var decisionmaker = data.decisionmaker,
                businessman = data.businessman,
                highestleader = data.highestleader,
                lastvisitobject = data.lastvisitobject;
            var crmcustomerprojectexternaldecision = [
                decisionmaker,
                businessman,
                highestleader,
                lastvisitobject
            ];
            setTableVal(crmcustomerprojectexternaldecision);
            // 综合情况
            var crmcustomerprojectreport = data.crmcustomerprojectreport;
            crmcustomerprojectreportId = crmcustomerprojectreport.id - 0;
            setFormVal(crmcustomerprojectreport, ['#crmcustomerprojectreport textarea'])
        })
    });

    // 获取商机编辑信息接口
    function apiDetail(fn) {
        let params = {
            id: opportunitiesId,
            userid: crmMsg.userId,
        };
        let data = {
            url: 'crmcustomerproject/detail?' + qs(params),
            type: 'get'
        };
        Ajax(data).then(function (res) {
            fn(res);
        })
    }

    // 设置表单信息
    function setFormVal(value, domSelectorArr) {
        var keyArr = [];
        for (var i = 0; i < domSelectorArr.length; i++) {
            keyArr = $.merge(keyArr, $(domSelectorArr[i]));
        }
        $.each(keyArr, function (i, item) {
            if ($(item).attr('data-key')) {
                var key = $(item).attr('data-key');
                key == "signdate" ? $(item).val(getDateByDay(value[key])) : $(item).val(value[key]);
                key == "previousvisits" && $('.visitcontent').val(transformBr(value[key]))
            }
        })
    }

    // 设置表格信息
    function setTableVal(value) {
        $('#crmcustomerprojectexternaldecision tbody').each(function (i, item) {
            fillTable($(item), value[i]);
        })
    }

    function fillTable($dom, data) {
        var str = '';
        $.each(data, function (i, item) {
            str +=
                '<tr>' +
                '<td hidden><div class="layui-form-checkbox layui-unselect" lay-skin="primary" visit-id="' + item.vlmid + '"><i class="layui-icon"></i></div></td>' +
                '<td>' + item.linkmanname + '</td>' +
                '<td>' + getDateByDay(item.visitdate) + '</td>' +
                '<td>' + item.linkmanmobile + '</td>' +
                '<td>' + item.linkmanposition + '</td>' +
                '<td>' + item.linkmanlevel + '</td>' +
                '<td>' + item.visitcontent + '</td>' +
                '<td>' + item.nextvisitplan + '</td>' +
                '<td><i class="layui-icon remove" style="font-size: 20px; color: #FF5722;border:1px solid #ccc">&#xe640;</i></td>' +
                '</tr>'
        });
        $dom.html(str);
    }

    // 清空客户档案部分
    function clearAll() {
        $('#zw').val('');
        $('#jb').val('');
        $('#sj').val('');
        // $('#lxrlb').val('');
        $('#yx').val('');
        $('#zj').val('')
    }

    // 获取客户名称
    function apiFindCommonCustomer() {
        let params = {
            uUserids: crmMsg.userId,
            customerName: $.trim($('#khmc').val()),
            commFlag: '0'
        };
        let data = {
            type: 'get',
            url: 'pc/customer/findCommonCustomerProject?' + qs(params),
        };
        Ajax(data).then(function (data) {
            $('.lx-box').html('');
            if (data.length > 0) {
                $('.lx-box').addClass('bd-all');
                let docfrag = document.createDocumentFragment();
                for (let i = 0; i < data.length; i++) {
                    let lis = document.createElement('li');
                    lis.setAttribute('customerId', data[i].ID);
                    lis.innerHTML = data[i].CustomerName;
                    docfrag.appendChild(lis);
                }
                $('.lx-box').append(docfrag);
                liClick();
            }
        });
    }

    // 联系人下拉筛选
    $('.p-down').on('change', function () {
        clearAll();
        var id = $(this).val();
        if (id == '请选择') {
            return;
        }
        apiFindCustomerLinkManAll(customerId, id, true)
    });
    // 获取联系人信息
    function apiFindCustomerLinkManAll(customerId, id, flag) {
        let params = {
            customerid: customerId,
            id: id || '',
            visitdatatype: 1
        };
        let data = {
            type: 'get',
            url: 'crmcustomerlinkman/findcustomerlinkmanall?' + qs(params),
        };
        Ajax(data).then(function (data) {
            if (flag) {
                var item = data.linkmanList[0];
                $('#zw').val(item.LinkManPosition);
                $('#jb').val(item.LinkManLevel);
                $('#sj').val(item.LinkManMobile);
                // $('#lxrlb').val(item.LinkManType);
                $('#yx').val(item.LinkManEmail);
                $('#zj').val(item.LinkManPhone)
            } else {
                $("#khlxr").hide();
                $('.p-down').show();
                var str = '<option>请选择</option>'
                var item = data.linkmanList;
                $.each(item, function (i, item) {
                    str += ' <option value="' + item.ID + '">' + item.LinkManName + '</option>'
                });
                $('.p-down').html(str);
                // 跟进记录判断
                data.visitlogList.length == 0 && layer.alert('<em style="color:red; font-weight: 700">该客户名下没有任何跟进记录，请选择其他客户?</em>', function () {
                    $('#khmc').val('');
                    $("#khlxr").show();
                    $('.p-down').html('').hide();
                    layer.closeAll();
                });
                $('.visitcontent-h').val(data.visitcontent);
                $('.visitcontent').val(transformBr(data.visitcontent));
                popDataList = data.visitlogList;
            }

        })
    }

    // 客户名称下拉筛选框
    function liClick() {
        $('.lx-box li').click(function () {
            $('#khmc').val(this.innerText);
            customerId = $(this).attr('customerId');
            apiFindCustomerLinkManAll(customerId);
            $('.lx-box').css('display', 'none');
        });
    }

    $('#khmc').on('input', function () {
        clearAll();
        $("#khlxr").show();
        $('.p-down').html('').hide();
        $('.lx-box').css('display', 'block');
        $('.lx-box').removeClass('bd-all');
        $('.lx-box').html('');
        if ($('#khmc').val() != '') {
            apiFindCommonCustomer();
        }
    });
    // 日期控件初始化
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: "#plan-date ",
        });

    });
    //全选、反选初始化
    select('.all-5', '.all-control-5')
    // 渲染弹窗表格
    function renderPop(popDataList, idData) {
        var str = '';
        $.each(popDataList, function (i, item) {
            str +=
                '<tr>' +
                '<td>' +
                '<div class="layui-form-checkbox layui-unselect" lay-skin="primary" visit-id="' + item.vlmid + '">' +
                '<i class="layui-icon"></i>' +
                '</div>' +
                '</td>' +
                '<td>' + item.LinkManName + '</td>' +
                '<td>' + item.visitsort + '</td>' +
                '<td>' + item.name + '</td>' +
                '<td>' + getDateByDay(item.visitdate) + '</td>' +
                '<td>' + item.visitTarget + '</td>' +
                '<td>' + item.visitcontent + '</td>' +
                '<td>' + item.nextvisitplan + '</td>' +
                '</tr>'
        });
        $('.all-control-5').html(str)
        var flag1, flag2;
        $.each(idData, function (i, item) {
            var id = item;
            flag1 = i;
            $('.all-control-5 .layui-form-checkbox').each(function (i, item) {
                if (id == $(this).attr('visit-id')) {
                    $(this).addClass('layui-form-checked')
                }
                flag2 = i;
            })
        });
        if (idData.length > 0) {
            flag1 == flag2 && $('.all-5').addClass('layui-form-checked');
        }
    }

    // 点击获取跟进记录并添加
    $('#visit-log').on('click', '.append', function () {
        var dom = $(this).parents('.layui-table').children('tbody');
        var idData = [];
        $(this).parents('.layui-table').find('.layui-form-checkbox').each(function (i, item) {
            $(item).attr('visit-id') && idData.push($(item).attr('visit-id'));
        });
        $('.all-5').removeClass('layui-form-checked');
        renderPop(popDataList, idData);
        layer.open({
            skin: 'my-layer',
            type: 1,
            title: '选择客户拜访记录',
            content: $(".pop-visit-log"),
            area: ['930px', '350px'],
            btnAlign: 'c',
            btn: ['取 消', '保 存'],
            btn1: function () {
                layer.closeAll();
            },
            btn2: function () {
                var str = '';
                $('.all-control-5  .layui-form-checked').each(function (i, item) {
                    var id = $(item).attr('visit-id')
                    $.each(popDataList, function (i, item) {
                        if (item.vlmid == id) {
                            str +=
                                '<tr>' +
                                '<td hidden><div class="layui-form-checkbox layui-unselect" lay-skin="primary" visit-id="' + item.vlmid + '"><i class="layui-icon"></i></div></td>' +
                                '<td>' + item.LinkManName + '</td>' +
                                '<td>' + getDateByDay(item.visitdate) + '</td>' +
                                '<td>' + item.LinkManMobile + '</td>' +
                                '<td>' + item.LinkManPosition + '</td>' +
                                '<td>' + item.LinkManLevel + '</td>' +
                                '<td>' + item.visitcontent + '</td>' +
                                '<td>' + item.nextvisitplan + '</td>' +
                                '<td><i class="layui-icon remove" style="font-size: 20px; color: #FF5722;border:1px solid #ccc">&#xe640;</i></td>' +
                                '</tr>'
                        }
                    })
                });
                $(dom).html(str);
                layer.closeAll();
            }
        })
    });
    // 删除跟进记录
    $('tbody').on('click', '.remove', function () {
        var $trDom = $(this).parent().parent()
        layer.confirm('<em style="color:red; font-weight: 700">确定删除该条信息吗?</em>', function () {
            $trDom.remove();
            layer.closeAll();
        })
    });
    // 保存或立项
    function getParams(domSelector) {
        var val = {};
        $(domSelector + " input").each(function (i, item) {
            var key = $(item).attr('data-key');
            var value = $(item).val();
            key && (val[key] = value)
        });
        $(domSelector + " select").each(function (i, item) {
            var key = $(item).attr('data-key');
            var value = $(item).val();
            key && (val[key] = value)
        });
        $(domSelector + " textarea").each(function (i, item) {
            var key = $(item).attr('data-key');
            var value = $(item).val();
            key && (val[key] = value)
        });
        return val;
    }

    function getDecision() {
        var val = [
            {
                "vids": [],
                "decisiontype": 1
            },
            {
                "vids": [],
                "decisiontype": 2
            },
            {
                "vids": [],
                "decisiontype": 3
            },
            {
                "vids": [],
                "decisiontype": 4
            }
        ];
        $("#crmcustomerprojectexternaldecision  td").each(function (i, item) {
            var decisiontype = $(item).parent().parent().attr('data-decisiontype');
            var id = $(item).children().attr('visit-id') - 0;
            id && val[decisiontype - 1].vids.push(id);
        });
        return val;
    }

    function apiSaveOrcommit(flag, fn) {
        var params = {};
        // 联系人Id
        params.linkmanid = $('#linkmanid').val();
        isUpDate && (params.linkmanid = linkmanid);
        // 商机基本信息
        params.crmcustomerproject = getParams("#crmcustomerproject");
        params.crmcustomerproject.customerid = customerId;
        isUpDate && (params.crmcustomerproject.id = opportunitiesId - 0);
        // 决策人信息
        params.crmcustomerprojectexternaldecision = getDecision();
        // 综合情况
        params.crmcustomerprojectreport = getParams("#crmcustomerprojectreport");
        // 编辑时综合情况的id
        params.crmcustomerprojectreport.id = crmcustomerprojectreportId;
        flag == '001' && (url = 'crmcustomerproject/save');
        flag == '002' && (url = 'crmcustomerproject/commitproject');
        flag == '003' && (url = 'crmcustomerproject/updateproject');
        let data = {
            url: url,
            type: 'post',
            data: params
        };
        Ajax(data).then(function (res) {
            fn(res)
        })
    }

    function sendMsg(flag, successMsg, errMsg) {
        var msg = (flag == '002' ? "确定该商机申请立项吗？" : "确定保存该商机吗？")
        if (!customerId) {
            layer.alert('<em style="color:red; font-weight: 700">对不起没有选择客户，无法进行此操作！！！</em>', function () {
                layer.closeAll();
            });
            return;
        }
        required([
            '#linkmanid',
            '#crmcustomerproject input',
            '#crmcustomerproject select',
            '.all-control-1',
            '.all-control-2',
            '.all-control-3',
            '.all-control-4',
            'textarea'
        ]) && sjNameRepetition() && layer.confirm('<em style="color:red; font-weight: 700">' + msg + '</em>', function () {
            apiSaveOrcommit(flag, function (data) {
                if (data.backHttpResult.code != '000') {
                    layer.msg(errMsg);
                    return;
                }
                layer.msg(successMsg, {time: 500}, function () {
                    location.href = skipUrl;
                })
            });
        })
    }

    // 点击保存
    $('.act').on('click', function () {
        isUpDate ? sendMsg('003', '商机保存成功', '商机保存失败') : sendMsg('001', '商机保存成功', '商机保存失败')

    });
    // 点击立项
    $('.sjlx').on('click', function () {
        sendMsg('002', '商机申请立项成功', '商机申请立项失败')
    });
    // 验证数字
    $('#yjhtje').on('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });
    // 验证是否为空
    function required(domSelectorArr) {
        var dataArr = [], tipWord;
        for (var i = 0; i < domSelectorArr.length; i++) {
            dataArr = $.merge(dataArr, $(domSelectorArr[i]))
        }
        var flag = true;
        $.each(dataArr, function (i, item) {
            if ($(item)[0].localName == 'tbody' && $(item).children().length == 0) {
                tipWord = $(item).parent().find('th:eq(1)').text();
                location.href = '#' + $(item).parent()[0].id;
                flag = false;
            }
            if ($(item).attr('data-key') && (($.trim($(item).val()) == '' || $(item).val() == '请选择'))) {
                tipWord = $(item).parent().parent().find('label').text().slice(0, -1);
                if (tipWord == '预计签约日期') {
                    location.href = '#plan-date';
                    $(item).blur();
                } else {
                    $(item).focus();
                }
                flag = false;
            }
            if (!flag) {
                layer.msg('对不起，请填选必填项： ' + tipWord);
                return false;
            }
        });
        return flag;
    }

    // 字符长度限制
    lengthLimit();

    //商机name查重
    $('#khmc2').on('input', function () {
        sjFlag = 1;
        $('.ul-opportunityName').html('').css('display', 'block');
        if (customerId && $('#khmc2').val() != '') {
            apivalidateprojectname();
        }
    });
    $(document).on('click', function (e) {
        var target = e.target;
        if ($(target).parent()[0] != $('.ul-opportunityName')[0]) {
            $('.ul-opportunityName').css('display', 'none');
        }
    });

    //查询该客户下已有商机
    function apivalidateprojectname() {
        let params = {
            customerid: customerId,
            projectname: $('#khmc2').val(),
        };
        let data = {
            type: 'get',
            url: 'crmcustomerproject/validateprojectname?' + qs(params),
        };
        Ajax(data).then(function (res) {
            console.log(res);
            $('.ul-opportunityName').html('');
            if (res.length > 0) {
                let docfrag = document.createDocumentFragment();
                for (let i = 0; i < res.length; i++) {
                    let lis = document.createElement('li');
                    lis.innerHTML = res[i].projectname;
                    docfrag.appendChild(lis);

                    if (neglectSpace('#khmc2') == lis.innerHTML) {
                        sjFlag = 0;
                        layer.msg('商机名称重复', {time: 1000});
                        // checkUsername();
                    }
                }
                $('.ul-opportunityName').append(docfrag);
                liClick1();
            }
        })
    }

    //对ul-opportunityName下li绑定事件
    function liClick1() {
        $('.ul-opportunityName li').click(function () {
            $('#khmc2').val(this.innerText);
            apivalidateprojectname();
            $('.ul-opportunityName').css('display', 'none');
        });

    }

    //商机名称重复验证
    function sjNameRepetition() {
        if (sjFlag == 0) {
            $('#khmc2').focus();
            layer.msg('商机名称重复', {time: 1000});
            return;
        }
        return sjFlag;
    }

});