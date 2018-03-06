/**
 * Created by zzg on 2017/10/10.
 */

var FORM;
layui.use(['form'], function () {
    FORM = layui.form;
})
// 获取下拉标示
function getIsFlag() {
    var text = $('#drop-down-box span').text();

    if (text == "我的商机") {
        return "0";
    }
    if (text == "下属商机") {
        return "1";
    }
    if (text == "全部商机") {
        return "2";
    }
}
//获取搜索词语
function getSearchText(domSlecter) {
    var val = $.trim($(domSlecter).val());
    if (val != '请选择') {
        return val;
    }
    return "";
}
// 字段转换
// 商机状态
function transformProjectState(state) {
    if (state == "1") {
        return "签署合同"
    }
    if (state == "2") {
        return "已中标"
    }
    if (state == "3") {
        return "招投标"
    }
    if (state == "4") {
        return "招投标前期"
    }
    if (state == "5") {
        return "编写解决方案"
    }
    if (state == "6") {
        return "提供建设性方案"
    }
    if (state == "7") {
        return "商机沟通"
    }
    if (state == "8") {
        return "政府资金申请"

    }
    if (state == "9") {
        return "联合办学"
    }
}
//预算状态
function transformBudgetStatus(state) {
    if (state == "1") {
        return "待申请"
    }
    if (state == "2") {
        return "申请中（主导）"
    }
    if (state == "3") {
        return "申请中（非主导）"
    }
    if (state == "4") {
        return "已批复"
    }
}
// 审核状态
function transformDecision(state) {
    if (state == "0") {
        return "未提交"
    }
    if (state == "1") {
        return "待审核（主管）"
    }
    if (state == "2") {
        return "审核通过（主管）"
    }
    if (state == "3") {
        return "审核未通过（主管）"
    }
    if (state == "4") {
        return "待审核（总裁）"
    }
    if (state == "5") {
        return "审核通过（总裁）"
    }
    if (state == "6") {
        return "审核未通过（总裁）"
    }
}
// 转换签约主体
function transformContractsubject(state) {
    if (state == "106") {
        return "九次方"
    }
    if (state == "107") {
        return "合资公司"
    }
    if (state == "3") {
        return "其他"
    }
}
// 转换是否转包
function transformIssubcontract(state) {
    if (state == "0") {
        return "否"
    }
    if (state == "1") {
        return "是"
    }
}
//  /* 封装一个下拉框选择功能 */
function DropDown(el) {
    this.dd = el;
    this.span = this.dd.children('span');
    this.li = this.dd.find('ul.dropdown li');
    this.val = '';
}
DropDown.prototype.initEvents = function () {
    var obj = this;
    obj.dd.on('click', function (event) {
        $(this).toggleClass('active').siblings().removeClass('active');
        event.stopPropagation();
    });
    obj.li.on('click', function () {
        var opt = $(this);
        obj.val = opt.html();
        if (obj.span.html() == obj.val) return;
        obj.span.html(obj.val);
        $(document).click(function () {
            $('.test').removeClass('active');
        });
    })
};
/* 调用下拉框 */
var dropDownBox = new DropDown($('#drop-down-box'));
dropDownBox.initEvents();
// 判断高级筛选小红点显示
function isShow() {
    var dataArr = $.merge($('#div4 select'), $('#div4 input'));
    var flag = false;
    $.each(dataArr, function (i, item) {
        if ($(item).prop('type') == 'text') {
            $(item).val() != '' && (flag = true)
        } else if ($(item).val() != '请选择') {
            flag = true;
            return false;
        }
    })
    flag && $('.advanced-filter').addClass('dot')
    !flag && $('.advanced-filter').removeClass('dot')
}
// 高级筛选清空 
function clearFilter() {
    $('#div4  option:first-child').prop('selected', 'selected');
    $('#div4 input').val('');
    isShow();
}
// 获取商机类别
function apiCrmCustomerWordBook(fn) {
    let params = {
        flag: 'BusinessType',
    }
    let data = {
        type: 'get',
        url: 'crmcustomerwordbook/find?' + qs(params),
    };
    Ajax(data).then(function (data) {
        fn(data)
    })
}
// null 转化
function transformNull(obj) {
    if (obj === "0") {
        return obj;
    }
    if (!obj) {
        return '无';
    }
    return obj;
}
// 收起函数
function packUp(handleDom, hideDom, time) {
    $(handleDom).on('click', function () {
        var text = $(this).find('span').text();
        if (text == '收起') {
            $(hideDom).slideUp(time);
            $(this).html('<i class="layui-icon">&#xe61a; </i> <span>展开</span> ')
        }
        if (text == "展开") {
            $(hideDom).slideDown(time);
            $(this).html('<i class="layui-icon">&#xe619; </i> <span>收起</span> ')

        }
    })
}
// 判断跳转路径
function isSkipUrl(flag) {
    if (flag == 11) {
        return '../customerManagement/index.html'
    }
    if (flag == 12) {
        return '../customerManagement/customerDetails.html'
    }
    if (flag == 21) {
        return './index.html'
    }
    if (flag == 22) {
        return './businessDetails.html'
    }
}
// 字符长度限制
function lengthLimitTip(dom, value) {
    layer.msg('该项写内容已超出最大字符限制');
    $(dom).blur();
}
function lengthLimit() {
    var dataArr = $.merge($('#crmcustomerproject input'), $('textarea'));
    $.each(dataArr, function (i, item) {
        $(item).on('input', function () {
            var value = $.trim($(this).val());
            var key = $(this).attr('data-key')
            if ($(this)[0].localName == 'textarea' && value.length > 400) {
                this.value = this.value.slice(0, 400);
                lengthLimitTip(item)
            }
            if ((key == 'leadership' || key == 'presaler' || key == 'executive') && value.length > 20) {
                this.value = this.value.slice(0, 20);
                lengthLimitTip(item)
            }
            if (key == 'deptment' && value.length > 40) {
                this.value = this.value.slice(0, 40);
                lengthLimitTip(item)
            }
            if (key == 'projectname' && value.length > 100) {
                this.value = this.value.slice(0, 100);
                lengthLimitTip(item)
            }
        })
    })
}
// 暂无数据 函数
function noDataStr(flag, num) {
    if (flag == 'table') {
        return '<tr><td colspan="' + num + '">暂无数据</td></tr>'
    }
    if (flag == 'common') {
        return '暂无数据'
    }
}
// 转换<br>
function transformBr(str) {
    return str.replace(/\<br\/\>/g, "\r\n");
}
// 转换逗号为换行
function transformDot(str) {
    return str.replace(/,/g, "<br/>");
}
// 战略合作模块-获取客户类型和状态
function setSelectVal(valData) {
    var str = '<option>请选择</option>'
    $.each(valData, function (i, item) {
        str += '<option value="' + item.id + '">' + item.name + '</option>'
    })
    return str;
}
function setCheckBoxVal(valData) {
    var str = ''
    $.each(valData, function (i, item) {
        str += '<input type="checkbox" name="' + item.name + '" value="' + item.id + '" lay-skin="primary" title="' + item.name + '"><br/>'
    })
    return str;
}
function apiGetTypeAndStatus(myFunc, myFailure) {
    $.when(
        $.ajax(Url + "crmcustomerwordbook/find?flag=companyType"),
        $.ajax(Url + "crmcustomerwordbook/find?flag=companyStatus"),
        $.ajax(Url + "crmcustomerwordbook/find?flag=SCSignSubject")
    ).then(myFunc, myFailure);
}
