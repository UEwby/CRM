$(function () {
    function variables() {
        return {
            id: getSession('strategicCooperation').id,
        }
    };
    function MainInfoStr(data) {
        var topStr =
            '<li><span class="tit">协议编号：</span><span class="con">' + data.agreementno + '</span></li>' +
            '<li><span class="tit">公司名称：</span><span class="con">' + data.companyname + '</span></li>' +
            '<li><span class="tit">客户类型：</span><span class="con">' + data.companytypename + '</span></li>' +
            '<li><span class="tit">是否上市：</span><span class="con">' + (data.islisted == 1 ? "是" : "否") + '</span></li>' +
            '<li><span class="tit">状态：</span><span class="con">' + data.companystatusname + '</span></li>' +
            '<li><span class="tit">签约时间：</span><span class="con">' + getDateByDay(data.signdate) + '</span></li>' +
            '<li><span class="tit">跟进人：</span><span class="con">' + data.customermanager + '</span></li>' +
            '<li><span class="tit">联系人：</span><span class="con">' + data.linkmanname + '</span></li>' +
            '<li><span class="tit">联系方式：</span><span class="con">' + data.linkmantel + '</span></li>' +
            '<li><span class="tit">签约主体：</span><span class="con">' + transformDot(data.signsubjectname) + '</span></li>';
        var tabSecStr = '<div class="item">' +
            '<div class="fl-con clearfix more-words">' +
            '<p>' +
            '<span class="fl-con">公司介绍：</span>' +
            '<span class="fl-con w-80">' + data.companydescribe + '</span>' +
            '</p>' +
            '</div>' +
            '<div class="fl-con clearfix  more-words">' +
            '<p>' +
            '<span class="fl-con">资质介绍：</span>' +
            '<span class="fl-con w-80">' + data.qualificationdescribe + '</span>' +
            '</p>' +
            '</div>' +
            '<div class="fl-con clearfix more-words">' +
            '<p>' +
            '<span class="fl-con clearfix">成功案例：</span>' +
            '<span class="fl-con w-80">' + (data.successfulcases || '无') + '</span>' +
            '</p>' +
            '</div>' +
            '<div class="fl-con clearfix more-words">' +
            '<p>' +
            '<span class="fl-con next">战略合作内容：</span>' +
            '<span class="fl-con w-80">' + (data.cooperationcontent || '无') + '</span>' +
            '</p>' +
            '</div>' +
            '<div class="fl-con clearfix more-words">' +
            '<p>' +
            '<span class="fl-con next">进度：</span>' +
            '<span class="fl-con w-80">' + data.progress + '</span>' +
            '</p>' +
            '</div>' +
            '</div>';
        var tabThrStr = '<div class="item">' +
            '<div class="fl-con">' +
            '<p>' +
            '<span class="fl-con">所属人：</span>' +
            '<span class="fl-con">' + data.createusername + '</span>' +
            '</p>' +
            ' <p>' +
            '<span class="fl-con">创建时间：</span>' +
            '<span class="fl-con">' + getDateByDay(data.createdate) + '</span>' +
            '</p>' +
            '<p>' +
            '<span class="fl-con">创建人：</span>' +
            '<span class="fl-con">' + data.createusername + '</span>' +
            '</p>' +
            '<p>' +
            '<span class="fl-con">修改日期：</span>' +
            '<span class="fl-con">' + getDateByDay(data.updatedate) + '</span>' +
            '</p>' +
            '</div>' +
            '<div class="fl-con">' +
            '<p class="system clearfix"><span class="fl-con">跟进人：</span>' + data.createusername + '</p>' +
            '</div>' +
            '</div>'
        return {
            topStr: topStr,
            tabSecStr: tabSecStr,
            tabThrStr: tabThrStr,
        }
    };
    function tabFirInfo(data) {
        var tabFirStr = '';
        $.each(data, function (i, item) {
            tabFirStr +=
                '<div class="item">' +
                '<div class="fl-con clearfix more-words">' +
                '<p>' +
                '<span class="fl-con clearfix">跟进时间：</span>' +
                '<span class="fl-con w-80">' + getDateByDay(item.visitdate) + '</span>' +
                '</p>' +
                '</div>' +
                '<div class="fl-con clearfix more-words">' +
                '<p>' +
                '<span class="fl-con next">沟通内容：</span>' +
                '<span class="fl-con w-80">' + item.visitcontent + '</span>' +
                '</p>' +
                '</div>' +
                '</div>'
        })
        return (tabFirStr || noDataStr('common'));
    }
    function apiMainInfo(fn) {
        let params = {
            id: variables().id
        }
        let data = {
            type: 'get',
            url: 'pc/crmstrategiccooperation/findStrategicCooperationById?' + qs(params),
        }
        Ajax(data).then(function (res) {
            fn(res);
        })
    };
    function apiTabFirInfo(fn) {
        let params = {
            cscid: variables().id
        }
        let data = {
            type: 'get',
            url: 'pc/strategiccooperationvisitlog/finddata?' + qs(params),
        }
        Ajax(data).then(function (res) {
            fn(res);
        })
    };
    function bindEvent() {
        return {
            init: function () {
                this.edit();
            },
            edit: function () {
                $('.edit').on('click', function () {
                    pushSession('strategicCooperation', {
                        id: variables().id,
                        isEdit: 1
                    })
                    location.href = './newStrategicCooperation.html';
                })
            }
        }
    }
    // 除tab[0]之外的信息
    apiMainInfo(function (data) {
        var topStr = MainInfoStr(data).topStr;
        var tabSecStr = MainInfoStr(data).tabSecStr;
        var tabThrStr = MainInfoStr(data).tabThrStr;
        $('.first-con').html(topStr);
        $('.linkmanlist').html(tabSecStr);
        $('.system').html(tabThrStr);
    });
    // tab[0]信息
    apiTabFirInfo(function (data) {
        var tabFirStr = tabFirInfo(data);
        $('.visitLogs').html(tabFirStr);
    });
    // tab栏初始化
    layui.use('element', function () {
        var element = layui.element;
        element.on('tab(demo)', function (data) {
            if (data.index != 0) {
                $('.add') && $('.add').hide();
            } else {
                $('.add') && $('.add').show();
            }
        });
        $('.add').on('click', function (e) {
        })
    });
    // 事件初始化
    bindEvent().init();
})