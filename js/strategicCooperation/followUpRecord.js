$(function () {
    function variables() {
        return {
            paramsArr: [
                'visitdate',
                'visitcontent'
            ],
            id: getSession('strategicCooperation').id,
        }
    };
    function getParams(obj) {
        return {
            visitdate: '',
            visitcontent: '',
            id: variables().id,
            v: +new Date(),
        }
    };
    function isEmpty() {
        var paramsArr = variables().paramsArr;
        for (var i = 0; i < paramsArr.length; i++) {
            var item = paramsArr[i];
            var _this = $('#' + item);
            var val = $.trim(_this.val());
            var tips = _this.parent().siblings().text().slice(0, -2);
            if (item == 'visitdate' && val == '') {
                location.href = '#visitdate';
                _this.blur();
                layer.msg('必填项' + tips + '未填写');
                return;
            }
            if (val == '') {
                _this.focus();
                layer.msg('必填项' + tips + '未填写');
                return;
            }
        }
        return true;
    };
    function apiSave(fn) {
        let data = {
            data: getParams(),
            type: 'post',
            url: 'pc/strategiccooperationvisitlog/save'
        }
        Ajax(data).then(function (res) {
            fn(res)
        })
    }
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
                        && apiSave(function (res) {
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
                    location.href = './index.html';
                })
            }
        }
    }
    // 日期控件初始化
    layui.use(['laydate'], function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: "#visitdate",
        })
    });
    bindEvent().init();
})