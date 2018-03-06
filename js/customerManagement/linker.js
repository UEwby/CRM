/**
 * Created by admin on 2017/10/5.
 */
$(function () {

    //获取联系人信息接口
    function apipcfindpage(obj) {

        let params = {
            userid: crmMsg.userId,
            rows: 20,
            page: 1,
            searchname: $('#searchname').val(),
            searchtype: $('#drop-down-box span').attr('name'),
            srctype: $('#srctype').val() == 0 ? '' : $('#srctype').val(),
            sortname: '', //排序字段
            sortway: '', //排序方式
            _time: new Date().getTime(),
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
            url: 'crmcustomerlinkman/pcfindpage?userid=' + params.userid + '&rows=' + params.rows + '&page=' + params.page + '&searchname=' + params.searchname
            + '&searchtype=' + params.searchtype + '&srctype=' + params.srctype + '&sortname=' + params.sortname + '&sortway=' + params.sortway + '&_time=' + params._time,
        };
        Ajax(data).then(function (data) {
            // console.log(data);
            $('.tab-linker tbody').html('');
            let html = '';
            if(data.rows.length==0){
                html = '<tr><td colspan="10">暂无数据</td></tr>'
            }else{
                for (let i = 0; i < data.rows.length; i++) {
                    html += '<tr name="' + data.rows[i].id + '">';
                    html += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    html += '<td class="linkerDetails po">' + data.rows[i].linkmanname + '</td>';
                    html += '<td>' + data.rows[i].customername + '</td>';
                    html += '<td>' + data.rows[i].linkmanposition + '</td>';
                    html += '<td>' + data.rows[i].linkmanlevel + '</td>';
                    html += '<td>' + data.rows[i].srctype + '</td>';
                    html += '<td>' + data.rows[i].linkmanmobile + '</td>';
                    html += '<td>' + data.rows[i].user_namecn + '</td>';
                    html += '<td>' + getDateByDay(data.rows[i].creatordate) + '</td>';
                    if (data.rows[i].isedit == 1) {
                        html += '<td><span class="toedit">编辑</span></td>';
                    } else {
                        html += '<td><span class="gray">编辑</span></td>';
                    }

                    html += '</tr>';
                }
            }

            $('.tab-linker tbody').html(html);
            pager(obj, data.total, [10, 20, 50, 100], apipcfindpage, $('.pager'));

            tocustomer();
            toedit();
        })
    }

    //跳转新建
    $('.toNewLinker').click(function () {
        pushSession('customerMsg', {
            linkerUrl: 13,
            linkerEdit: '00',//00.完全新建，01.客户，02.商机，03.合资公司；编辑:11.客户，12.商机，13.合资公司
        });
        window.location.href = 'newLinker.html';
    });
    //跳转详情
    function tocustomer() {
        $('.linkerDetails').click(function () {
            // console.log($(this).attr('name'));
            pushSession('customerMsg', {
                linkerId: $(this).parent().attr('name'),
            });
            window.location.href = 'linkerDetails.html';
        })
    }

    //跳转编辑
    function toedit() {
        $('.toedit').click(function () {
            pushSession('customerMsg', {
                id: '',
                name: '',
                linkerId: $(this).parent().parent().attr('name'),
                linkerUrl: 13,
                linkerEdit: 11,
            });
            window.location.href = 'newLinker.html';

        });
    }

    //检测dot是否筛选
    function isDot() {
        if ($('#srctype').val() != 0) {
            $('.advanced-filter').addClass('dot');
        } else {
            $('.advanced-filter').removeClass('dot');
        }
    }

    //重置
    function reset() {
        $('#srctype').val(0);
        isDot();
    }

    apipcfindpage();
    select('.all', '.tab-linker tbody');

    //选择谁的客户
    $('#drop-down-box').click(function () {
        $('#drop-down-box').toggleClass('active');
    });
    //下拉选择框
    $('#drop-down-box ul li').click(function () {
        $('#drop-down-box span').html($(this).html());
        $('#drop-down-box span').attr('name', $(this).attr('name'));
        reset();
        apipcfindpage();
    });

    //搜索
    $('#inp-search').click(function () {
        reset();
        apipcfindpage();
    });
    //高级搜索
    $('#ok1').click(function () {
        isDot();
        apipcfindpage();
        layer.closeAll();
    });
    //重置
    $('#cancel1').click(function () {
        reset();
    });

    //弹层
    //筛选弹窗
    $('.advanced-filter').click(function () {
        layer.open({
            type: 1,
            title: '高级筛选',
            content: $('#filter1'),
            area: ['400px', '240px'],
        });
        //关闭弹层
        $('.layui-layer-close').click(function () {
            isDot()
        });
    })

});
