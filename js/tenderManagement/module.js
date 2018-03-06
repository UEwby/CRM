/**
 * Created by Limbo on 2017/10/10.
 */



// 招标状态
function transformTendersState(state) {
    if (state == "1") {
        return "已参与未反馈"
    }
    if (state == "2") {
        return "未参与未反馈"
    }
    if (state == "3") {
        return "未参与已反馈"
    }
    if (state == "4") {
        return "已参与已反馈"
    }
    if (state == "0") {
        return "新标"
    }
}

// 转换时间戳
function transformTime(t) {
    return new Date(t).toJSON().slice(0, 10)
}
//获取搜索词语
function getSearchText(domSlecter) {
    var val = $(domSlecter).val();
    if (val != '请选择' && val != '省份' && val != '地级市' && val != '市、县级市') {
        return val;
        return "";
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
}
/* 调用下拉框 */
var dropDownBox = new DropDown($('#drop-down-box'));
dropDownBox.initEvents();
// 高级筛选清空
function clearFilter() {
    $('#div4  option:first-child').prop('selected', 'selected');
    $('#div4 input').val('');
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