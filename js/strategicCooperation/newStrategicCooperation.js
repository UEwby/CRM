$(function () {
    function variables() {
        return {
            paramsArr: [
                'AgreementNO',
                'CompanyName',
                'CompanyType',
                'IsListed',
                'CompanyStatus',
                'SignDate',
                'CustomerManager',
                'LinkManName',
                'LinkManTel',
                'SignSubject',
                'CompanyDescribe',
                'QualificationDescribe',
                'SuccessfulCases',
                'CooperationContent',
                'Progress'
            ],
            isEdit: getSession('strategicCooperation').isEdit,
            id: getSession('strategicCooperation').id,
            newTitleStr: "新建战略合作",
            editTitleStr: "编辑战略合作"
        }
    };
    function apiGetData(fn) {
        let params = {
            id: variables().id
        }
        let data = {
            type: 'get',
            url: 'pc/crmstrategiccooperation/find?' + qs(params),
        }
        Ajax(data).then(function (res) {
            fn(res);
        })
    };
    function getParams() {
        var paramsArr = variables().paramsArr;
        var params = {}
        $.each(paramsArr, function (i, item) {
            if (item == 'SignSubject') {
                var ids = [];
                $('#SignSubject input').each(function (i, item) {
                    if ($(item).prop('checked')) {
                        ids.push($(this).val());
                    }
                })
                params.SignSubject = ids.join(',');;
            } else {
                params[item] = $.trim($('#' + item).val());
            }
        })
        variables().isEdit && (params.id = variables().id)
        return params;
    };
    function apisSave(fn) {
        let data = {
            type: 'post',
            data: getParams(),
            url: variables().isEdit ? 'pc/crmstrategiccooperation/update' : 'pc/crmstrategiccooperation/save',
        }
        Ajax(data).then(function (res) {
            fn(res);
        })

    };
    function isEmpty() {
        var paramsArr = variables().paramsArr;
        for (var i=0;i< paramsArr.length;i++) {
            var item = paramsArr[i];
            var _this = $('#' + item);
            if (item == 'SignSubject') {
                var ids = [];
                $('#SignSubject input').each(function (i, item) {
                    if ($(item).prop('checked')) {
                        ids.push($(this).val());
                    }
                })
                if (ids.length == 0) {
                    location.href = '#SignSubject';
                    layer.msg('请选择签约主体(可多选)');
                    return;
                }
            } else if ($(_this).parent().hasClass('important')) {
                var val = $.trim($(_this).val());
                var tips = $(_this).parent().siblings().text().slice(0, -2);
                if (val == '' || val == '请选择') {
                    $(_this).focus();
                    layer.msg('必填项' + tips + '未填写');
                    return;
                }
            }
        }
        return true;
    };
    function bindEvent() {
        return {
            init: function () {
                this.save();
                this.cancel();
            },
            save: function () {
                $('.save1').on('click', function () {
                    isEmpty()
                        && $(this).prop('disabled', true)
                        && apisSave(function (res) {
                            if (res.backHttpResult.code != '000') {
                                layer.msg('保存失败');
                                $('.save1').prop('disabled', false);
                                return;
                            }
                            layer.msg('保存成功', { time: 500 }, function () {
                                location.href = './index.html'
                            })
                        })
                })
            },
            cancel: function () {
                $('.cancel1').on('click', function () {
                    location.href = './index.html'
                })
            },
        }
    };
    function setValue(data) {
        var keysArr = variables().paramsArr,
            obj = {},
            lowerKeys = [];
        for (var i = 0; i < keysArr.length; i++) {
            lowerKeys[i] = keysArr[i].toLowerCase();
        }
        $.each(lowerKeys, function (i, item) {
            obj[keysArr[i]] = data[item];
        })
        $.each(keysArr, function (i, item) {
            if (item == 'SignSubject') {
                var ids = obj[item].split(',');
                $('#SignSubject input').each(function (idx, val) {
                    ids.indexOf($(this).val()) != -1 && $(this).prop('checked', 'true')
                    FORM.render();
                })
            }
            item == 'SignDate' ? ($('#' + item).val(getDateByDay(obj[item]))) : $('#' + item).val(obj[item]);
        })
    };
    $('.content_w h2').text(variables().isEdit ? variables().editTitleStr : variables().newTitleStr);
    // 获取客户类型和状态
    apiGetTypeAndStatus(function (typeRes, statusRes, SignSubject) {
        $('#CompanyType').html(setSelectVal(typeRes[0]));
        $('#CompanyStatus').html(setSelectVal(statusRes[0]));
        $('#SignSubject').html(setCheckBoxVal(SignSubject[0]));
        // 获取页面编辑数据
        variables().isEdit && apiGetData(function (data) {
            var dataObj = data[0];
            setValue(dataObj)
        })
        FORM.render();
    }, function () {
        layer.msg('获取数据异常，请稍后重试')
    });
    // 日期控件初始化
    layui.use(['laydate'], function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: "#SignDate",
        })
    });
    // 事件处理初始化；
    bindEvent().init();
})