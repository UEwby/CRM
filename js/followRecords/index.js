/**
 * Created by Limbo on 2017/11/3.
 */
window.onresize = function () {
    gaps();
};

apigetCrmcustomervisitlog();
//搜索
$('.input-search').click(function () {
    apigetCrmcustomervisitlog()
});
//导出
$('.export').click(function () {
    exports();
});

//自适应宽度
function gaps() {
    let num = ~~($('.ulFollow').outerWidth() / $('.ulFollow>li').outerWidth());
    let gap = ($('.ulFollow').outerWidth() - num * $('.ulFollow>li').outerWidth()) / num;
    $('.ulFollow>li').css('margin', '0 ' + gap / 2 + 'px 20px')
}

//获取跟进记录接口
function apigetCrmcustomervisitlog(obj) {
    let params = {
        rows: 20,
        page: 1,
        customername: $('#searchName').val(),
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
        url: 'pc/visitlog/getCrmcustomervisitlog?' + qs(params),
    };
    Ajax(data).then(function (res) {
        // console.log(res);
        $('.export').text('导出全部');
        let html = '';
        if (res.total > 0) {
            res.rows.forEach(function (item, i) {
                html += '<li name="' + item.customerid + '">';
                html += '<div class="follow-title clearfix">';
                html += '<div class="checkF layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div>';
                html += '<h3 title="' + item.customername + '">' + item.customername + '</h3>';
                html += '<span class="follow-sp">' + item.counts + '</span>';
                html += '</div>';
                html += ' <div class="follow-main">';
                html += '<ul class="follow-top">';
                if (item.projectVisitlog.length < 6) {
                    html += ' <li>商机（' + item.projectVisitlog.length + '）</li>';
                } else {
                    html += ' <li>商机（' + item.projectVisitlog.length + '）<i></i></li>';
                }
                item.projectVisitlog.forEach(function (val, key) {
                    html += '<li name="' + val.projectid + '">';
                    html += '<a title="' + val.projectname + '">' + val.projectname + '</a>';
                    html += '<span class="follow-sp">' + val.countnum + '</span>';
                    html += '</li>';
                });
                html += '</ul>';
                html += '</div>';
                html += '</li>';
            })
        } else {
            html += '<li>暂无数据</li>'
        }
        $('.ulFollow').html(html);
        pager(obj, res.total, [10, 20, 50, 100], apigetCrmcustomervisitlog, $('.pager'));
        gaps();
        chooseCustomer();
        toLinks();
    })
}

//导出跟进记录
function exports() {
    let params = {
        customername:$('#searchName').val(),
        date:+new Date(),
        customerids:collect(),
    };
    let url = Url +'pc/visitlog/export?'+ qs(params);
    window.location.href = url;
}

//选择客户
function chooseCustomer() {
    $('.checkF').click(function () {
        $(this).toggleClass('layui-form-checked');
        if(collect().length>0){
            $('.export').text('导出跟进');
        }else{
            $('.export').text('导出全部');
        }
    })
}

//收集选中ids
function collect() {
    let ids = [];
    $('.follow-title .layui-form-checked').each(function (i, item) {
        console.log($(item).parent().parent().attr('name'))
        ids.push($(item).parent().parent().attr('name'));
    });
    return ids;
}

//跳转项
function toLinks() {
    //跳转客户
    $('.follow-title').on('click', 'h3,.follow-sp', function () {
        pushSession('customerMsg', {
            id: $(this).parent().parent().attr('name'),
            name: $(this).parent().parent().find('h3').text(),
            commFlag: 1,
            tabFlag: '0',
        });
        window.location.href = '../customerManagement/customerDetails.html'
    });

    //跳转客户商机
    $('.follow-top li:nth-child(1)').click(function () {
        pushSession('customerMsg', {
            id: $(this).parent().parent().parent().attr('name'),
            name: $(this).parent().parent().parent().find('h3').text(),
            commFlag: 1,
            tabFlag: 1,
        });
        window.location.href = '../customerManagement/customerDetails.html'
    });

    //跳转商机
    $('.follow-top li[name]').click(function () {
        pushSession('customerMsg', {
            id: $(this).parent().parent().parent().attr('name'),
            name: $(this).parent().parent().parent().find('h3').text(),
            commFlag: 1,
            tabFlag: '0',
        });
        pushSession('opportunitiesMsg', {
            id: $(this).attr('name'),
            name: $(this).children('a').text(),
            tabFlag: 220,
        });
        window.location.href = '../opportunityManagement/businessDetails.html'
    })
}
