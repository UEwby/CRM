/**
 * Created by Limbo on 2017/10/11.
 */
const Url = 'http://192.168.1.68:7777/jusfoun-crm/';
// const Url = 'http://192.168.3.144:8080/jusfoun-crm/';
// const Url = 'http://192.168.3.179:8080/jusfoun-crm/';
//const Url = 'http://192.168.3.63:8080/jusfoun-crm/';
//@CrossOrigin(origins = "*", maxAge = 3600)

function Ajax(data) {
    var def = $.Deferred();
    var canceled = false;
    if (data.type == 'get') {
        var jqXHR = $.ajax({
            type: "get",
            url: Url + data.url,
            data: {},
            xhrFields: { withCredentials: true },
            crossDomain: true,
            contentType: "application/json",
            datatype: "json",
            error: function (xhr, status, error) {
                if (canceled) return;
                var data = {
                    result: 4,
                    message: error,
                    status: status
                };
                console.error("调用接口:[" + this.url + "]报错;状态码:[" + xhr.status + "];错误信息:[" + error + "]");
                def.reject(data);
            },
            success: function (data) {
                if (canceled) return;
                def.resolve(data);
            }
        });

        var promise = def.promise();
        var then = promise.then;
        var thenWrapper = function () {
            var promise = then.apply(this, arguments);
            promise.cancel = function () {
                canceled = true;
                jqXHR.abort();
            };
            promise.then = thenWrapper;
            return promise;
        };
        promise.then = thenWrapper;

        return promise;


    } else if (data.type == 'post') {
        var saveData = JSON.stringify(data.data);

        var jqXHR = $.ajax({
            type: "post",
            url: Url + data.url,
            data: saveData,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            contentType: "application/json",
            datatype: "json",

            error: function (xhr, status, error) {
                if (canceled) return;
                var data = {
                    result: 4,
                    message: error,
                    status: status
                };
                console.error("调用接口:[" + this.url + "]报错;状态码:[" + xhr.status + "];错误信息:[" + error + "]");
                def.reject(data);
            },
            success: function (data) {
                if (canceled) return;
                def.resolve(data);
            }
        });

        var promise = def.promise();
        var then = promise.then;
        var thenWrapper = function () {
            var promise = then.apply(this, arguments);
            promise.cancel = function () {
                canceled = true;
                jqXHR.abort();
            };
            promise.then = thenWrapper;
            return promise;
        };
        promise.then = thenWrapper;

        return promise;
    }

}

//下拉框
/* 封装一个下拉框选择功能 */
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

//时间转化精确到分钟
function getDate(time) {
    let oDate = new Date(time);
    return '' + oDate.getFullYear() + '-' + toTen(oDate.getMonth() + 1) + '-' + toTen(oDate.getDate()) + ' ' + toTen(oDate.getHours()) + ':' + toTen(oDate.getMinutes());
    function toTen(number) {
        return parseInt(number) < 10 ? '0' + number : '' + number;
    }
}
//时间转化精确到天
function getDateByDay(time) {
    let oDate = new Date(time);
    return '' + oDate.getFullYear() + '-' + toTen(oDate.getMonth() + 1) + '-' + toTen(oDate.getDate());
    function toTen(number) {
        return parseInt(number) < 10 ? '0' + number : '' + number;
    }
}

//全选、反选
function select(controlSelector, underControlSelector) {
    $(controlSelector).removeClass('layui-form-checked');
    $(underControlSelector + ' .layui-form-checkbox').removeClass('layui-form-checked');
    $(controlSelector).on('click', function () {
        if ($(this).hasClass("layui-form-checked")) {
            $(controlSelector).removeClass('layui-form-checked');
            $(underControlSelector + ' .layui-form-checkbox').removeClass('layui-form-checked');
        } else {
            $(controlSelector).addClass('layui-form-checked');
            $(underControlSelector + ' .layui-form-checkbox').addClass('layui-form-checked');
        }
    });
    $(underControlSelector).on('click', ".layui-form-checkbox", function () {
        $(this).toggleClass('layui-form-checked');
        var flag = true;
        $.each($(underControlSelector + " .layui-form-checkbox"), function (i, item) {
            if (!$(item).hasClass('layui-form-checked')) {
                flag = false;
            }
        });
        if (!flag) {
            $(controlSelector).removeClass('layui-form-checked')
        } else {
            $(controlSelector).addClass('layui-form-checked')
        }
    })
}

//分页 参数含义pageObj{curr:'',limit:''},total总页数，limits分页要求，fn当前函数，dom对象
function pager(pageObj, total, limits, fn, dom) {
    $(".layui-form-checkbox").removeClass('layui-form-checked');
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: dom,
            count: total,//数据总数
            curr: pageObj.curr || 1,
            limits: limits,
            limit: pageObj.limit || 2,
            layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
            prev: '上一页',
            next: '下一页',
            jump: function (obj, first) {
                if (!first) {
                    fn(obj);
                }
            }
        })
    })
}
//sessionStorage保存
function setSession(name, obj) {
    let msg = obj;
    let str = JSON.stringify(msg);
    sessionStorage.setItem(name, str);
}

//sessionStorage读取
function getSession(name) {
    return JSON.parse(sessionStorage.getItem(name))
}

//sessionStorage追加
function pushSession(name, obj) {
    let msg = getSession(name);
    if (!msg) {
        msg = {}
    }
    for (let key in obj) {
        msg[key] = obj[key];
    }
    setSession(name, msg);
}
//URL拼接字符串
function qs(data) {
    var str = '';
    for (var k in data) {
        if (!data[k]) {
            data[k] = '';
        }
        str += k + '=' + data[k] + '&';
    }
    return str.slice(0, -1)
}
//判断null&undefined显示‘-’
function notNull(data) {
    if (!data) {
        return '-';
    } else {
        return data;
    }
}
//登录信息
let crmMsg = getSession("crmMsg");

// layui弹窗
layui.use('layer', function () {
    var layer = layui.layer;
});

//字符长度计算
function lens(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        }
        else {
            len += 2;
        }
    }
    return len;
}
//-- 规则判断
function ruleInp(dom, len, reg, msg) {
    let regs;
    switch (reg) {
        case 1:
            regs = /^1\d{10}$/;//手机
            break;
        case 2:
            regs = /^[0-9]*$/;//电话
            break;
        case 3:
            regs = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;//邮箱[^\u4e00-\u9fa5]/g
            break;
        default:
            regs = /\d\D/;//匹配任意
    }

    if (lens($(dom).val()) == 0) {
        if (msg.msg1) {
            layer.msg(msg.msg1, { time: 1000 });
            $(dom).focus();
            return true;
        }
    } else if (lens($(dom).val()) > len) {
        if (msg.msg2) {
            layer.msg(msg.msg2, { time: 1000 });
            $(dom).focus();
            return true;
        }
    } else if (!regs.test($(dom).val())) {
        if (msg.msg3) {
            layer.msg(msg.msg3, { time: 1000 });
            $(dom).focus();
            return true;
        }
    } else {
        return false;
    }
}

function ruleSel(dom, str, msg) {
    if ($(dom).val() == str) {
        layer.msg(msg, { time: 1000 });
        $(dom).focus();
        return true;
    } else {
        return false
    }
}
//移除空格操作
function delSpace(dom) {
    $(dom).each(function (i, item) {
        item.addEventListener('keyup', function () {
            this.value = this.value.replace(/\s/g, '');
        }, false)
    });
}
//移除首尾空格操作
function delSpace1(dom) {
    $(dom).each(function (i, item) {
        item.addEventListener('keyup', function () {
            this.value = this.value.replace(/(^\s*)|(\s*$)/g, '');
        }, false)
    });
}
//忽略首尾空格
function neglectSpace(dom) {
    return $(dom).val().replace(/(^\s*)|(\s*$)/g, '');
}

// 系统管理封装下拉菜单
function selectBoxInit(el) {
    el.click(function () {
        el.toggleClass('active');
        //console.log(event)
        cancelBubble()
    });

    $(document).click(function () {
        el.removeClass('active');
    });
    el.find(".dropdown").find("li").click(function () {
        el.find('.text').text($(this).text())
        el.attr('li-value', $(this).attr('li-value'))
    })
}
// 2.首页管理封装下拉菜单
function selectBoxInitHomePge(el, fun) {
    el.click(function () {
        el.toggleClass('active');
        cancelBubble()
    });
    $(document).click(function () {
        el.removeClass('active');
    });
    el.find(".dropdown").find("li").click(function () {
        el.find('.text').text($(this).text())
        el.attr('li-value', $(this).attr('li-value'))
        if (fun) {
            fun()
        }
    })
}
//得到事件
function getEvent() {
    if (window.event) {
        return window.event;
    }
    var func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent
                || arg0.constructor == KeyboardEvent)
                || (typeof (arg0) == "object" && arg0.preventDefault
                    && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}
//阻止冒泡
function cancelBubble() {
    var e = getEvent();
    if (window.event) {
        //e.returnValue=false;//阻止自身行为
        e.cancelBubble = true;//阻止冒泡
    } else if (e.preventDefault) {
        //e.preventDefault();//阻止自身行为
        e.stopPropagation();//阻止冒泡
    }
}
