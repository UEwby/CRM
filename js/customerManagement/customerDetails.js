/**
 * Created by admin on 2017/10/5.
 */
$(function () {
    var tabFlag=(getSession('customerMsg').tabFlag==''?0:getSession('customerMsg').tabFlag);
    /* 客户详情底部-选项卡 */
    layui.use('element', function () {
        // var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
        // element.on('tab(tabs)', function(data){
        //     console.log(this); //当前Tab标题所在的原始DOM元素
        //     console.log(data.index); //得到当前Tab的所在下标
        //     console.log(data.elem); //得到当前的Tab大容器
        // });
    });
    // 页面初始化
    apicustomerview();
    apivisitlogByCustomer();
    apifindprojectByCrmcustomer();
    // apifindinfo();合资公司


    //跳转到编辑
    $('.edit').click(function () {
        pushSession('customerMsg', {
            isedit: 2
        });
        window.location.href = 'newCustomer.html';

    });
    //跳转新建跟进、商机、合资公司、联系人
    $('.add').click(function () {
        switch ($('.layui-this').attr('name')) {
            case '1':
                pushSession('followMsg', {
                    flag: 1,
                    url: 12,
                });
                window.location.href = '../followRecords/followUpRecord.html';
                break;
            case '2':
                apifindcustomerlinkmanall();

                break;
            case '3':
                window.location.href = '';
                break;
            case '4':
                pushSession('customerMsg', {
                    linkerUrl: 12,//0.新建，1.客户，2.商机，3.合资公司
                    linkerEdit: '01',//,//00.完全新建，01.客户，02.商机，03.合资公司；编辑:11.客户，12.商机，13.合资公司
                });
                window.location.href = 'newLinker.html';
                break;
        }
    });

    //获取客户详情接口
    function apicustomerview() {
        let params = {
            id: getSession('customerMsg').id,
            userid: crmMsg.userId,
            _time: new Date().getTime(),
        };
        let data = {
            type: 'get',
            url: 'crmcustomer/customerview?' + qs(params),
        };
        Ajax(data).then(function (data) {
            // console.log(data);
            if(data.isedit!=1){
                $('.edit').css('display','none');
            }
            //跟进记录管理及客户池只有查看权限
            if(getSession('customerMsg').commFlag==1){
                $('.edit').css('display','none');
                $('.add').css('display', 'none');
            }else{
                tabControls();
            }
            $('.count-title').html(data.customername);
            $('#customername').html(data.customername);
            $('#site').html(data.customerprovincename + data.customercityname + (data.customerdistrictname?data.customerdistrictname:'')+data.customeraddress);
            $('#customertypename').html(data.customertypename);
            $('#customertelphone').html(notNull(data.customertelphone));
            //联系人
            let html;
            if (data.crmcustomerlinkmanlist.length > 0) {
                html = '';
                for (let i = 0; i < data.crmcustomerlinkmanlist.length; i++) {
                    html += '<div class="tabControl"> ';
                    html += '<div> ';
                    html += '<span class="spL">联系人：</span>';
                    html += '<span class="spR">'+data.crmcustomerlinkmanlist[i].linkmanname+'</span>';
                    html += '</div> ';

                    html += '<div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">职位：</span>';
                    html += '<span class="spR">'+notNull(data.crmcustomerlinkmanlist[i].linkmanposition)+'</span>';
                    html += '</div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">手机：</span>';
                    html += '<span class="spR">'+notNull(data.crmcustomerlinkmanlist[i].linkmanmobile)+'</span>';
                    html += '</div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">电话：</span>';
                    html += '<span class="spR">'+notNull(data.crmcustomerlinkmanlist[i].linkmanphone)+'</span>';
                    html += '</div> ';
                    html += '</div> ';

                    html += '<div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">级别：</span>';
                    html += '<span class="spR">'+data.crmcustomerlinkmanlist[i].linkmanlevel+'</span>';
                    html += '</div> ';
                    // html += '<div class="box3"> ';
                    // html += '<span class="spL">联系人类别：</span>';
                    // html += '<span>'+data.crmcustomerlinkmanlist[i].linkmantype+'</span>';
                    // html += '</div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">邮箱：</span>';
                    html += '<span class="spR">'+notNull(data.crmcustomerlinkmanlist[i].linkmanemail)+'</span>';
                    html += '</div> ';
                    html += '</div> ';

                    html += '</div> ';
                }
            } else {
                html = '<span>暂无数据</span>';
            }

            $('.linkerDetails').html(html);
            //其他资料
            $('#customermanagername').html(data.customermanagername);
            $('#createdate').html(getDateByDay(data.createdate));
            $('#creatorname').html(data.creatorname);
            $('#customerupdatetime').html(getDateByDay(data.customerupdatetime));
            $('#namelist').html(notNull((data.namelist.replace(/,/g,'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '))));
        })
    }

    //查询跟进记录接口
    function apivisitlogByCustomer() {
        let params = {
            page: 1,
            rows: 10000,
            customerid: getSession('customerMsg').id,
            userid: crmMsg.userId,
            ismanager: '',
            timestamp: +new Date(),
            viewuserid:getSession('customerMsg').viewuserid,
            customermanager:getSession('customerMsg').customermanager,
            commFlag:getSession('customerMsg').commFlag,
        };
        let data = {
            type: 'get',
            url: 'crmcustomervisitlog/visitlogByCustomer?' + qs(params),
        };
        Ajax(data).then(function (data) {
            // console.log(data);
            var html;
            if (data.rows.length > 0) {
                html = '';
                for (let i = 0; i < data.rows.length; i++) {
                    html += '<div class="tabControl"> ';
                    html += '<div> ';
                    html += '<span class="spL">跟进人：</span>';
                    html += '<span class="spR">'+data.rows[i].creatorname + '<em>' + isFollowHow(data.rows[i].VisitDataType) + '</em></span>';
                    html += '</div> ';

                    html += '<div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">跟进时间：</span>';
                    html += '<span class="spR">'+getDateByDay(data.rows[i].visitdate)+'</span>';
                    html += '</div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">联系人：</span>';
                    html += '<span class="spR">'+data.rows[i].linkmanname+'</span>';
                    html += '</div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">拜访方式：</span>';
                    html += '<span class="spR">'+data.rows[i].visittypename+'</span>';
                    html += '</div> ';
                    html += '</div> ';

                    // html += '<div> ';
                    // html += '<div class="box3"> ';
                    // html += '<span class="spL">拜访类别：</span>';
                    // html += '<span class="spR">'+data.rows[i].visitsort+'</span>';
                    // html += '</div> ';
                    // html += '<div class="box3"> ';
                    // html += '<span class="spL">随访人员：</span>';
                    // html += '<p class="p2">'+data.rows[i].customermanagerids+'</p>';
                    // html += '</div> ';
                    // html += '</div> ';


                    html += '<div> ';
                    html += '<span class="spL">随访人员：</span>';
                    html += '<p class="p2">'+notNull(data.rows[i].customermanagerids)+'</p>';
                    html += '</div> ';

                    html += '<div> ';
                    html += '<span class="spL">拜访目的：</span>';
                    html += '<p class="p2">'+notNull(data.rows[i].visitTarget)+'</p>';
                    html += '</div> ';

                    html += '<div> ';
                    html += '<span class="spL">拜访效果：</span>';
                    html += '<p class="p2">'+data.rows[i].visitcontent+'</p>';
                    html += '</div> ';

                    html += '<div> ';
                    html += '<span class="spL">下一步计划：</span>';
                    html += '<p class="p3">'+data.rows[i].nextvisitplan+'</p>';
                    html += '</div> ';

                    html += '</div> ';

                }
            } else {
                html = '<span>暂无数据</span>';
            }

            $('.layui-show').html(html);

            $($('.layui-tab-title li')[tabFlag]).addClass('layui-this').siblings().removeClass('layui-this');
            $($('.layui-tab-item')[tabFlag]).addClass('layui-show').siblings().removeClass('layui-show');
        })
    }

    //查询商机接口
    function apifindprojectByCrmcustomer() {
        let params = {
            customerid: getSession('customerMsg').id,
            userid:getSession('crmMsg').userId,
            isflag:getSession('customerMsg').commFlag,
        };
        let data = {
            type: 'get',
            url: 'crmcustomerproject/findprojectByCustomer?' + qs(params),
        };
        Ajax(data).then(function (data) {
            // console.log(data);
            var html;
            if (data.list.length > 0) {
                html = '';
                for (let i = 0; i < data.list.length; i++) {
                    html += '<div class="tabControl"> ';
                    html += '<div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">商机名称：</span>';
                    html += '<span class="spR toGo toOpportunity" name="'+data.list[i].projectid+'">'+data.list[i].projectname+'</span>';
                    html += '</div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">商务负责人：</span>';
                    html += '<span class="spR">'+notNull(data.list[i].executive)+'</span>';
                    html += '</div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL hides">商机等级：</span>';
                    html += '<span class="spR">'+data.list[i].projectlevelname+'</span>';
                    html += '</div> ';
                    html += '</div> ';

                    html += '<div> ';
                    html += '<div class="box3"> ';
                    html += '<span class="spL">商机状态：</span>';
                    html += '<span class="spR">'+notNull(data.list[i].projectstatename)+'</span>';
                    html += '</div> ';
                    html += '</div> ';

                    html += '</div> ';
                }
            } else {
                html = '<span>暂无数据</span>';
            }

            $('.opportunity').html(html);
            toOpportunitys();
        })
    }

    //查询合资公司接口
    function apifindinfo() {
        let params = {
            customerid: getSession('customerMsg').id,
            userid: crmMsg.userId,
            timestamp: new Date().getTime(),
        };
        let data = {
            type: 'get',
            url: 'crmcustomercoentreprise/findinfo?customerid=' + params.customerid + '&userid=' + params.userid + '&timestamp=' + params.timestamp,
        };
        Ajax(data).then(function (data) {
            let html;
            if (data.coentreprisename) {
                html += '<div class="tabControl"> ';
                html += '<div> ';
                html += '<span class="spL">合资公司名称：</span>';
                html += '<span class="spR">'+data.coentreprisename + '</span>';
                html += '</div> ';

                html += '<div> ';
                html += '<div class="box3"> ';
                html += '<span class="spL">预计拿到执照时间：</span>';
                html += '<span class="spR">'+getDateByDay(data.expectgetlicensedate) + '</span>';
                html += '</div> ';
                html += '<div class="box3"> ';
                html += '<span class="spL">状态：</span>';
                html += '<span class="spR">'+data.coentreprisestatename + '</span>';
                html += '</div> ';
                html += '<div class="box3"> ';
                html += '<span class="spL">董事&监事人员：</span>';
                html += '<span class="spR">'+data.coentreprisemanger + '</span>';
                html += '</div> ';
                html += '</div> ';

                html += '</div> ';

            } else {
                html = '<span>暂无数据</span>';
            }

            $('.joint').html(html);
        })
    }

    //动态加载客户联系人信息
    function apifindcustomerlinkmanall() {
        let params = {
            customerid: getSession('customerMsg').id,
            id: getSession('crmMsg').userId,
            visitdatatype: 1,
        };
        let data = {
            type: 'get',
            url: 'crmcustomerlinkman/findcustomerlinkmanall?' + qs(params)
        };
        Ajax(data).then(function (data) {
            if (data.visitlogList.length == 0) {
                layer.alert('该客户没有跟进记录，请点击确定，跳转至新建跟进记录', function () {
                    pushSession('followMsg', {
                        flag: 1,
                        url: 12,
                    });
                    window.location.href = '../followRecords/followUpRecord.html';
                });
            } else {
                pushSession('opportunitiesMsg', {
                    upDate: 120,
                    url: 12,
                });
                window.location.href = '../opportunityManagement/newOpportunities.html';
            }
        })
    }

    //显示跟进的是客户、商机还是合资公司
    function isFollowHow(num) {
        switch (num) {
            case 1:
                return '客户';
                break;
            case 2:
                return '商机';
                break;
            case 3:
                return '合资公司';
                break;
        }
    }

    //选项卡变化1
    function tabControls() {
        $('.layui-tab-title li').click(function () {
            switch ($(this).attr('name')) {
                case '1':
                    $('.add').html('新建-跟进');
                    $('.add').css('display', 'block');
                    $('.add').attr('name', 1);
                    break;
                case '2':
                    $('.add').html('新建-商机');
                    $('.add').css('display', 'block');
                    $('.add').attr('name', 2);
                    break;
                case '3':
                    $('.add').html('新建-合资公司');
                    $('.add').css('display', 'block');
                    $('.add').attr('name', 3);
                    break;
                case '4':
                    $('.add').html('新建-联系人');
                    $('.add').css('display', 'block');
                    $('.add').attr('name', 4);
                    break;
                case '0':
                    $('.add').html('');
                    $('.add').css('display', 'none');
                    $('.add').attr('name', 0);
                    break;
            }
        });
    }


    //跳转商机详情
    function toOpportunitys() {
        $('.toOpportunity').click(function () {
            pushSession('opportunitiesMsg', {
                id: $(this).attr('name'),
                name: $(this).text(),
                tabFlag: 220,
            });
            pushSession('crmMsg', {
                left:3,
                top:1,
            });
            location.href = "../opportunityManagement/businessDetails.html"

        })
    }


});