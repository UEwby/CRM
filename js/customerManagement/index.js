/**
 * Created by Limbo on 2017/10/13.
 */
$(function () {
    var layClose;//弹层index
    $("#citys").citySelect({prov: '省份', city: '地级市', dist: '市、县级市'})
    //调用时间控件
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#beginvisitdate'
        });
        laydate.render({
            elem: '#endvisitdate'
        })
    });


    apiCustomertype();
    apiPCfindCrmcustomerListByUserid();
    select('.all', '.tab-customer tbody');

    //跳转新建
    $('.toNewCustomer').click(function () {
        pushSession('customerMsg', {
            isedit: 0,
            url: 21,
        });
        window.location.href = 'newCustomer.html';
    });

    //转移客户
    $('.toTransfer').click(function () {
        limits(1);
    });
    //共享客户
    $('.toShare').click(function () {
        limits(2);
    });
    // 转移共享 折叠效果
    $('.content-name').on('click', '.title', function () {
        $(this).children('.layui-icon').toggleClass('collapse');
        var $ul = $(this).parent().children('ul');
        $ul.toggle('500');
    });
    // 转移共享 选中效果
    $('.content-name').on('click', '.customer-name', function () {
        let txt = $(this).text();
        let id = $(this).attr('customer-id');

        $('.customer-name').removeClass('select');
        $(this).addClass('select');
        $('.transfer-name span').html(txt).attr('customer-id', id).parent().css('display', 'block')
    });
    // 删除效果
    $('.top').on('click', '.del-icon', function () {
        clearTo();
        $('.customer-name').removeClass('select');
    });
    //转移共享搜索
    searchSelect();

    //导出字段变换
    $('.tab-customer').on('click', '.layui-form-checkbox', function () {
        let ids = collect();
        if (ids.length == 0) {
            $('.export').text('导出全部')
        } else {
            $('.export').text('导出客户')
        }
    });
    //导出按钮
    $('.export').click(function () {
        let ids = collect();
        if (ids.length == 0) {
            apiexport(ids, '0');
        } else {
            apiexport(ids, 1);
        }
    });

    //选择谁的客户
    $('#choose-customer').click(function () {
        $('#choose-customer').toggleClass('active');
    });
    //下拉选择框
    $('#choose-customer ul li').click(function () {
        $('#choose-customer span').html($(this).html());
        $('#choose-customer span').attr('name', $(this).attr('name'));
        reset();
        apiPCfindCrmcustomerListByUserid();
    });

    //搜索
    $('#inp-search').click(function () {
        reset();
        apiPCfindCrmcustomerListByUserid();
    });
    //高级搜索
    $('#ok1').click(function () {
        isDot();
        apiPCfindCrmcustomerListByUserid();
        layer.close(layClose);
    });
    //筛选弹窗
    $('.advanced-filter').click(function () {
        layClose = layer.open({
            type: 1,
            title: '高级筛选',
            content: $('#popFilter'),
            area: ['900px', '320px'],
        });
        //关闭弹层
        $('.layui-layer-close').click(function () {
            isDot()
        });
    });
    //重置
    $('#cancel1').click(function () {
        reset();
    });

    //客户类型接口
    function apiCustomertype() {
        let data = {
            type: 'get',
            url: 'crmcustomerwordbook/find?flag=CustomerType',
        };

        Ajax(data).then(function (data) {
            let html = '';
            html += '<option value="0">请选择</option>';
            for (let i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
            }
            $('#customertype').html(html);
        })
    }

    //获取客户信息接口
    function apiPCfindCrmcustomerListByUserid(obj) {

        let params = {
            userId: crmMsg.userId,
            Isall: '',
            rows: 20,
            page: 1,
            searchname: $('#searchname').val(),
            searchtype: $('#choose-customer span').attr('name'),
            srctype: $('#srctype').val() == 0 ? '' : $('#srctype').val(),
            sortname: '', //排序字段
            sortway: '', //排序方式
            customertype: $('#customertype').val() == 0 ? '' : $('#customertype').val(),
            customerprovincename: $('#s_province').val() == '省份' ? '' : $('#s_province').val(),
            customercityname: $('#s_city').val() == '地级市' ? '' : $('#s_city').val(),
            customerdistrictname: $('#s_county').val() == '市、县级市' ? '' : $('#s_county').val(),
            beginvisitdate: $('#beginvisitdate').val(),
            endvisitdate: $('#endvisitdate').val(),
            _time: +new Date(),
        };
        if (!obj) {
            obj = {};
            obj.limit = params.rows;
            obj.curr = params.page;
        }
        params.rows = obj.limit;
        params.page = obj.curr;
        let data = {
            type: 'get',
            url: 'crmcustomer/PCfindCrmcustomerListByUserid?' + qs(params),
        };
        Ajax(data).then(function (data) {
            // console.log(data);
            $('.export').text('导出全部');
            $('.tab-customer tbody').html('');
            let html = '';
            if (data.rows.length == 0) {
                html = '<tr><td colspan="9">暂无数据</td></tr>';
            } else {
                for (let i = 0; i < data.rows.length; i++) {
                    html += '<tr name="' + data.rows[i].id + '">';
                    html += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    html += '<td class="customerDetails po">' + data.rows[i].customername + '</td>';
                    html += '<td class="customermanager" name="' + data.rows[i].customerManager + '" branch="' + data.rows[i].userid + '">' + data.rows[i].user_namecn + '</td>';
                    html += '<td>' + data.rows[i].srctypename + '</td>';
                    html += '<td>' + data.rows[i].customerprovincename + data.rows[i].customercityname + notNull(data.rows[i].customerdistrictname) + '</td>';
                    html += '<td>' + data.rows[i].customertypename + '</td>';
                    html += '<td>' + getDateByDay(data.rows[i].createdate) + '</td>';
                    html += '<td>' + (data.rows[i].lastvisitdate ? getDateByDay(data.rows[i].lastvisitdate) : '暂无') + '</td>';
                    if (data.rows[i].isedit == 1) {
                        html += '<td><span class="tofollowup">跟进</span>&nbsp;&nbsp;&nbsp;<span class="toedit">编辑</span></td>';
                    } else {
                        html += '<td><span class="tofollowup">跟进</span>&nbsp;&nbsp;&nbsp;<span class="gray">编辑</span></td>';
                        // if(data.rows[i].isMyShare==1){
                        //     html += '<td><span class="tofollowup">跟进</span>&nbsp;&nbsp;&nbsp;<span class="gray">编辑</span></td>';
                        // }else{
                        //     html += '<td><span class="gray">跟进</span>&nbsp;&nbsp;&nbsp;<span class="gray">编辑</span></td>';
                        // }
                    }
                    html += '</tr>';
                }
            }

            $('.tab-customer tbody').html(html);
            pager(obj, data.total, [10, 20, 50, 100], apiPCfindCrmcustomerListByUserid, $('.pager'));
            tocustomer();
            toedit();
            tofollowup()
        })
    }

    //跳转详情
    function tocustomer() {
        $('.customerDetails').click(function () {
            // console.log($(this).attr('name'));
            pushSession('customerMsg', {
                id: $(this).parent().attr('name'),
                name: $(this).html(),
                viewuserid: $(this).parent().find('.customermanager').attr('branch'),
                customermanager: $(this).parent().find('.customermanager').attr('name'),
                commFlag: '0',
                tabFlag: '0',
            });
            window.location.href = 'customerDetails.html';
        })
    }

    //跳转编辑
    function toedit() {
        $('.toedit').click(function () {
            pushSession('customerMsg', {
                id: $(this).parent().parent().attr('name'),
                name: $(this).parent().parent().children('.customerDetails').html(),
                isedit: 1
            });
            window.location.href = 'newCustomer.html';

        });
    }

    //跳转跟进
    function tofollowup() {
        $('.tofollowup').click(function () {

            pushSession('customerMsg', {
                id: $(this).parent().parent().attr('name'),
                name: $(this).parent().parent().children('.customerDetails').html(),
            });
            pushSession('followMsg', {
                flag: 1,
                url: 11,
            });
            window.location.href = '../followRecords/followUpRecord.html';
        });
    }

    //检测dot是否筛选
    function isDot() {
        if ($('#customertype').val() != 0 || $('#srctype').val() != 0 || $('#s_province').val() != '省份'
            || $('#s_city').val() != '地级市' || $('#s_county').val() != '市、县级市' || $('#beginvisitdate').val() != ''
            || $('#endvisitdate').val() != '') {
            $('.advanced-filter').addClass('dot');
        } else {
            $('.advanced-filter').removeClass('dot');
        }
    }

    //重置
    function reset() {
        $('#customertype').val(0);
        $('#srctype').val(0);
        $('#beginvisitdate').val('');
        $('#endvisitdate').val('');
        $("#citys").citySelect({prov: '省份', city: '地级市', dist: '市、县级市'})
        isDot();
    }

    //收集选中ids
    function collect() {
        let ids = [];
        $('.tab-customer tbody .layui-form-checked').each(function (i, item) {
            ids.push($(item).parent().parent().attr('name'));
        });
        return ids;
    }

    //选中ids是否有权限
    function isCollect() {
        let flag = 1;
        $('.tab-customer tbody .layui-form-checked').each(function (i, item) {
            if ($(item).parent().parent().find('.toedit').length == 0) {
                flag = 0;
            }
        });
        return flag;
    }

    //导出客户
    function apiexport(ids, num) {
        let params = {
            customerids: ids,
            isall: num,//0:全部，1:勾选
            userId: crmMsg.userId,
            _time: new Date().getTime(),
            commFlag: '0',//0：客户，1：客户池
            rows: 10000,
            page: 1,
            searchname: $('#searchname').val(),
            searchtype: $('#choose-customer span').attr('name'),
            srctype: $('#srctype').val() == 0 ? '' : $('#srctype').val(),
            sortname: '', //排序字段
            sortway: '', //排序方式
            customertype: $('#customertype').val() == 0 ? '' : $('#customertype').val(),
            customerprovincename: $('#s_province').val() == '省份' ? '' : $('#s_province').val(),
            customercityname: $('#s_city').val() == '地级市' ? '' : $('#s_city').val(),
            customerdistrictname: $('#s_county').val() == '市、县级市' ? '' : $('#s_county').val(),
            beginvisitdate: $('#beginvisitdate').val(),
            endvisitdate: $('#endvisitdate').val(),
        };
        let url = '';
        url = Url + 'pc/customer/export?' + qs(params);
        window.location.href = url
    }

    //转移共享 为空和权限的判断
    function limits(num) {
        let ids = collect();
        if (ids.length == 0) {
            if (num == 1) {
                layer.alert('请选择转移客户');
            } else if (num == 2) {
                layer.alert('请选择共享客户');
            }

        } else {
            if (isCollect() == 0) {
                if (num == 1) {
                    layer.alert('只能转移自己的客户');
                } else if (num == 2) {
                    layer.alert('只能共享自己的客户');
                }
            } else {
                if (num == 1) {
                    openLayer({
                        transferorshare: 'transfer',
                        customerIds: ids,
                        msg: '请选择转移人',
                        num: '0',
                    });
                } else if (num == 2) {
                    openLayer({
                        transferorshare: 'share',
                        customerIds: ids,
                        msg: '请选择共享人',
                        num: 1,
                    });
                }

            }
        }
    }

    //open转移或共享弹层
    function openLayer(opt) {
        apiRefer(domRender, opt.num);
        let titles;
        if (opt.transferorshare == 'transfer') {
            titles = '转移客户';
            $('#popTransfer .toHow').text('转移给：');
            $('.tips').text('* 必须选择“转移人”才能进行“保存”');
        } else {
            titles = '共享客户';
            $('#popTransfer .toHow').text('共享给：');
            $('.tips').text('* 必须选择“共享人”才能进行“保存”');
        }
        layer.open({
            title: titles,
            type: 1,
            skin: 'my-layer',
            content: $('#popTransfer'),
            area: ['425px', '480px'],
            btn: ['取消', '保 存'],
            btn1: function () {
                clearTo();
                layer.closeAll();
            },
            btn2: function () {
                if (!$('.transfer-name span').attr('customer-id')) {
                    layer.alert(opt.msg);
                    return false;
                } else {
                    apiTransferOrShare({
                        transferorshare: opt.transferorshare,
                        id: $('.transfer-name span').attr('customer-id'),
                        customerIds: opt.customerIds,
                    });
                    clearTo();
                }

            },
            cancel: function () {
                clearTo();
            }
        })
    }

    // 获取所有转移或共享客户
    function apiRefer(fn, num) {
        let params = {
            userid: crmMsg.userId,
            type: num,
        };
        let data = {
            type: 'get',
            url: 'sysuser/finduserall?' + qs(params)
        };
        Ajax(data).then(function (res) {
            fn(res)
        })
    }

    //转移或共享窗口dom渲染
    function domRender(data) {
        let uls = '';
        data.forEach(function (item, i) {
            let lis = '';
            let title;
            for (let key in item) {
                title = key;
                item[key].forEach(function (val) {
                    lis += '<li class="customer-name" customer-id="' + val.userId + '">' + val.userNamecn + '</li>'
                })
            }
            uls += '<li>';
            uls += '<h3 class="title">' + title + '<i class="layui-icon fr">&#xe625;</i></h3>';
            uls += '<ul>' + lis + '</ul></li>';

        });
        $('.content-name').html(uls || '暂无数据');
    }

    //转移共享搜索
    function searchSelect() {
        $('#popTransfer input').on('input', function () {
            $('.content-name>li').each(function (i, item) {
                let flag = 0;
                $(item).find('li').each(function (key, val) {
                    if ($('#popTransfer input').val() == '') {
                        val.style.display = 'block';
                        flag = 1
                    } else {
                        if (val.innerText.indexOf($('#popTransfer input').val()) >= 0) {
                            val.style.display = 'block';
                            flag = 1;
                        } else {
                            val.style.display = 'none';
                        }
                    }
                });
                if (flag) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    //清空选中转移者
    function clearTo() {
        $('.transfer-name i').parent().css('display', 'none').children('span').html('').attr('customer-id', '');
    }

    // 转移或转移客户确认接口
    function apiTransferOrShare(opt) {
        let params = {
            type: 'customer',
            userid: crmMsg.userId,
            _time: +new Date(),
            transferorshare: opt.transferorshare,
            transferuserids: opt.id,
            customerids: opt.customerIds,
            fromuserids: crmMsg.userId,
        };
        let data = {
            type: 'get',
            url: 'crmUserCustomer/transferOrShare?' + qs(params)
        };
        Ajax(data).then(function (res) {
            if (res.backHttpResult.code == '000') {
                layer.msg('操作成功', {time: 1000}, function () {
                    window.location.href = 'index.html';
                })
            } else {
                layer.msg('操作失败', {time: 1000})
            }
        })
    }
});