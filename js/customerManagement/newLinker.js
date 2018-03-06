/**
 * Created by Limbo on 2017/10/20.
 */
$(function () {
    var customerName = getSession("customerMsg").name;
    var customerId = getSession("customerMsg").id;
    var linkerUrl = getSession("customerMsg").linkerUrl;
    var linkerEdit = getSession("customerMsg").linkerEdit;
    var id = getSession("customerMsg").linkerId;
    var goBack, Urls, checkFlag,time;
    if (linkerEdit == '00' || linkerEdit == '01' || linkerEdit == '02' || linkerEdit == '03') {
        Urls = 'crmcustomerlinkman/create';
        if (linkerEdit != '00') {
            $('#customername').attr('disabled', true);
            create();
        }

    } else if (linkerEdit == '11' || linkerEdit == '12' || linkerEdit == '13') {
        Urls = 'crmcustomerlinkman/update';
        $('#customername').attr('disabled', true);
        $('.content_w h2').html('编辑联系人');
        edit();
    }
    goBacks();
    //移除空格操作
    // delSpace('.content_w input');

    //查询客户
    $('#customername').on('input', function () {
        $('#customerid').val('');
        $('.ul-customerName').css('display', 'block');
        $('.ul-customerName').html('');
        if ($('#customername').val() != '') {
            apiReferCustomer();
        }
    });

    $('.save').on('click', function () {
        $('.save').attr('disabled',true);
        clearTimeout(time);
        time=setTimeout(function () {
            $('.save').attr('disabled',false);
        },2500);
        checkFlags();
        if(checkFlag ==1){
            apiLinkManCreateOrUpdate(function (data) {
                if (data.backHttpResult.code != '000') {
                    layer.msg('联系人信息保存失败');
                    return;
                }
                $('.save').attr('disabled',true);
                layer.msg('联系人信息保存成功', {time: 1000}, function () {
                    location.href = goBack;
                })
            })
        }

    });
    $('.cancel').on('click', function () {
        location.href = goBack;
    });

    //联系人新建&编辑接口
    function apiLinkManCreateOrUpdate(fn) {
        let data = {
            url: Urls,
            type: 'post',
            data: getValue(),
        };
        Ajax(data).then(function (res) {
            // console.log(data)
            fn(res)
        })
    }

    //获取联系人信息接口
    function apiLinkManEdit(fn) {
        let params = {
            id: id,
            _time: +new Date()
        };
        let data = {
            url: 'crmcustomerlinkman/view?' + qs(params),
            type: 'get',
        };
        Ajax(data).then(function (res) {
            fn(res)
        })
    }

    //设置返回路径
    function goBacks() {
        switch (linkerUrl) {
            case 0://完全新建
                goBack = 'linker.html';
                break;
            case 12://客户详情
                goBack = 'customerDetails.html';
                break;
            case 13://联系人首页
                goBack = 'linker.html';
                break;
            case 14://联系人详情
                goBack = 'linkerDetails.html';
                break;
            case 22://商机详情
                goBack = '../opportunityManagement/businessDetails.html';
                break;
            case 3://合资公司
                goBack = '';
                break;
        }
    }

    function getValue() {
        var data = {};
        $('input:first-child').each(function (i, item) {
            var key = $(item).attr('id');
            var obj = {};
            obj[key] = neglectSpace(item);
            $.extend(data, obj)
        });
        var val = $('select').val();
        if (val == "请选择") {
            val = '';
        }
        // data.linkmantype = val;
        data.creatorid = crmMsg.userId;
        if (linkerEdit == '11' || linkerEdit == '12' || linkerEdit == '13') {
            data.id = id;
        }
        if (linkerEdit == '02' || linkerEdit == '12') {
            data.projectid = getSession('opportunitiesMsg').id
        }
        return data;
    }

    function setValue(data) {
        $('input').each(function (i, item) {
            var key = $(item).attr('id');
            for (var k in data) {
                if (key === k) {
                    $(this).val(data[k]);
                }
            }
        })

    }

    //创建
    function create() {
        $('#customername').val(customerName);
        $('#customerid').val(customerId);
    }

    //编辑
    function edit() {
        apiLinkManEdit(function (data) {
            setValue(data.crmcustomerlinkman);
            //$('select').val(data.crmcustomerlinkman.linkmantype || '请选择')
        })
    }

    //模糊查询已有客户
    function apiReferCustomer() {
        let params = {
            commFlag: '0',
            sortname: 'user_namecn',
            customerName: neglectSpace('#customername'),
            puserid: crmMsg.userId,
            _time: new Date().getTime(),

        };
        let data = {
            type: 'get',
            url: 'pc/customer/findCommonCustomer1?' + qs(params),
        };
        Ajax(data).then(function (data) {

            $('.ul-customerName').html('');
            if (data.length > 0) {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    html += '<li name="' + data[i].ID + '">' + data[i].CustomerName + '</li>';

                }
                $('.ul-customerName').html(html);
                liClick();
            }
        });
    }

    //对ul-customerName下li绑定事件
    function liClick() {
        $('.ul-customerName li').click(function () {
            $('#customername').val(this.innerText);
            $('#customerid').val($(this).attr('name'));
            apiReferCustomer();
            $('.ul-customerName').css('display', 'none');
        });

    }

    //效验规则
    function checkFlags() {
        if ($('#customerid').val()=='') {
            layer.msg('请选择客户',{time:1000});
            $('#customername').focus();
            checkFlag = 0;
        }
        else if(ruleInp('#linkmanname',40,'',{
                msg1:'联系人姓名不能为空',
                msg2:'联系人姓名最多只能输入40个字符',
                msg3:'',
            })){
            checkFlag = 0;
        }
        else if(ruleInp('#linkmandepartmnet',50,'',{
                msg1:'',
                msg2:'联系人部门最多只能输入50个字符',
                msg3:'',
            })){
            checkFlag = 0;
        }
        else if(ruleInp('#linkmanposition',50,'',{
                msg1:'职位不能为空',
                msg2:'职位最多只能输入50个字符',
                msg3:'',
            })){
            checkFlag = 0;
        }
        // 、、
        else if(ruleInp('#linkmanlevel',50,'',{
                msg1:'级别不能为空',
                msg2:'级别最多只能输入50个字符',
                msg3:'',
            })){
            checkFlag = 0;
        }
        else if(ruleInp('#linkmanmobile',11,1,{
                msg1:'手机号码不能为空',
                msg2:'手机号码位数输入错误',
                msg3:'手机号码格式错误',
            })){
            checkFlag = 0;
        }
        else if(ruleInp('#linkmanphone',20,2,{
                msg1:'',
                msg2:'电话号码最多只能输入20个字符',
                msg3:'电话号码只能是纯数字',
            })){
            checkFlag = 0;
        }
        else if(ruleInp('#linkmanemail',30,3,{
                msg1:'',
                msg2:'邮箱最多只能输入30个字符',
                msg3:'邮箱格式错误',
            })){
            checkFlag = 0;
        }
        else if(ruleInp('#linkmanwx',20,'',{
                msg1:'',
                msg2:'微信最多只能输入20个字符',
                msg3:'',
            })){
            checkFlag = 0;
        }
        else if(ruleInp('#linkmandesc',50,'',{
                msg1:'',
                msg2:'备注最多只能输入50个字符',
                msg3:'',
            })){
            checkFlag = 0;
        }else{
            checkFlag = 1;
        }
    }

});
