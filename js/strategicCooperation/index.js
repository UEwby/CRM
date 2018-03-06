$(function () {
    function getParams(obj) {
        return {
            rows: obj && obj.limit,
            page: obj && obj.curr,
            searchName: getSearchText('.input-search input'),
            selectHasIPO: getSearchText('.select-has-IPO'),
            companyType: getSearchText('.company-type'),
            companyStatus: getSearchText('.company-status'),
            v: +new Date(),
        }
    }
    function apiFinddata(obj) {
        if (!obj) {
            obj = {};
            obj.curr = 1;
            obj.limit = 20;
        }
        let params = getParams(obj);
        let data = {
            type: 'get',
            url: "pc/crmstrategiccooperation/finddata?" + qs(params)
        };
        Ajax(data).then(function (data) {
            let domStr = '';
            $.each(data.rows, function (i, item) {
                domStr += '<tr>' +
                    '<td strategic-cooperation-id="' + item.id + '"><div class="layui-form-checkbox layui-unselect"  strategic-cooperation-id="' + item.id + '"  lay-skin="primary"><i class="layui-icon"></i></div></td>' +
                    '<td >' + item.rownumber + '</td>' +
                    '<td class="agreementno">' + item.agreementno + '</td>' +
                    '<td>' + item.companyname + '</td>' +
                    '<td>' + (item.islisted == 1 ? '是' : '否') + '</td>' +
                    '<td>' + item.companytypename + '</td>' +
                    '<td>' + item.companystatusname + '</td>' +
                    '<td>' + item.customermanager + '</td>' +
                    '<td>' + item.linkmanname + '</td>' +
                    '<td>' + item.progress + '</td>' +
                    '<td> ' +
                    '<span class="handle">跟进</span>' +
                    ' &nbsp;  <span  class="update">编辑</span>' +
                    '</td>' +
                    '</tr>'
            })
            $(".layui-table tbody").html(domStr || noDataStr('table', 10));
            // 分页
            pager(obj, data.total, [10, 20, 50, 100], apiFinddata, $('.pager'));
        })
    }
    // 事件处理
    function bindEvent() {
        return {
            init: function () {
                this.search();
                this.edit();
                this.newBuildOrExport();
                this.detail();
                this.followUpRecord();
            },
            // 筛选按钮
            filter: function () {
                $('.advanced-filter').on('click', function () {
                    layer.open({
                        skin: 'my-layer',
                        type: 1,
                        title: '高级筛选',
                        content: $("#div4"),
                        area: ['400px', '310px'],
                        btn: ['重 置', '确 定'],
                        btn1: function () {
                            clearFilter();
                            layer.msg('已清空条件', {
                                time: 1500,
                            })
                        },
                        btn2: function () {
                            isShow();
                            apiFinddata();
                            layer.closeAll();
                        }
                    })
                })
            },
            // 搜索
            search: function () {
                $(".input-search i").on('click', function (e) {
                    getParams().searchName && apiFinddata();
                    getParams().searchName && clearFilter();
                })
                $('.input-search input').on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        getParams().searchName && apiFinddata();
                        getParams().searchName && clearFilter();
                    }
                })
            },
            newBuildOrExport: function () {
                $('.wrap-top').on('click', '.nav-btn', function () {
                    if ($(this).text() == '新建合作') {
                        pushSession('strategicCooperation', {
                            isEdit: 0
                        })
                        location.href = './newStrategicCooperation.html';
                        return;
                    }
                    if ($(this).text() == '导出全部') {

                        return;
                    }
                })
            },
            edit: function () {
                $('tbody').on('click', '.update', function () {
                    var id = $(this).parent().parent().find('td:first').attr('strategic-cooperation-id')
                    pushSession('strategicCooperation', {
                        id: id,
                        isEdit: 1
                    })
                    location.href = './newStrategicCooperation.html';
                })
            },
            followUpRecord: function () {
                $('tbody').on('click', '.handle', function () {
                    var id = $(this).parent().parent().find('td:first').attr('strategic-cooperation-id')
                    pushSession('strategicCooperation', {
                        id: id,
                    })
                    location.href = './followUpRecord.html';
                })
            },
            detail: function () {
                $('tbody').on('click', '.agreementno', function () {
                    var id = $(this).parent().find('td:first').attr('strategic-cooperation-id')
                    pushSession('strategicCooperation', {
                        id: id,
                    })
                    location.href = './strategicCooperationDetail.html';
                })
            }
        }
    }
    // 获取列表数据
    apiFinddata();
    bindEvent().init();
    // 获取客户类型和状态
    apiGetTypeAndStatus(function (typeRes, statusRes) {
        $('.company-type').html(setSelectVal(typeRes[0]));
        $('.company-status').html(setSelectVal(statusRes[0]));
        bindEvent().filter();
    }, function () {
        layer.msg('获取数据异常，请稍后重试')
    })
    // 复选框功能初始化
    select('.all', '.all-control');
})