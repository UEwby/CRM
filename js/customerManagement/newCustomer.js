/**
 * Created by Limbo on 2017/10/12.
 */
$(function () {
    var time;
    $("#city").citySelect({prov: '省份', city: '地级市', dist: '市、县级市'});
    if (getSession('customerMsg').isedit == 1 || getSession('customerMsg').isedit == 2) {
        $('.linkMan').css('display', 'none');
        $('.footerSave1').css('display', 'none');
        $('.content_w h2').html('修改客户信息');
        apicustomerview();
        execute2();
    } else {
        $('.footerSave2').css('display', 'none');
        execute1();
    }

    let checkFlag;

    //模糊查询已有客户
    function apiReferCustomer() {
        let params = {
            commFlag: '1',
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
            checkFlag = 0;
            $('.ul-customerName').html('');
            if (data.length > 0) {
                let docfrag = document.createDocumentFragment();
                for (let i = 0; i < data.length; i++) {
                    let lis = document.createElement('li');
                    lis.innerHTML = data[i].CustomerName;
                    docfrag.appendChild(lis);

                    if (neglectSpace('#customername') == lis.innerHTML) {
                        checkFlag = 2;
                        layer.msg('客户名称重复', {time: 1000});
                        // checkUsername();
                    }
                }
                $('.ul-customerName').append(docfrag);
                liClick();
            }
        });
    }

    //客户类型接口
    function apiCustomertype() {
        let data = {
            type: 'get',
            url: 'crmcustomerwordbook/find?flag=CustomerType',
        };
        Ajax(data).then(function (data) {
            $('#customertype').html('<option>请选择</option>');

            let docfrag = document.createDocumentFragment();
            for (let i = 0; i < data.length; i++) {
                let ops = document.createElement('option');
                ops.innerHTML = data[i].name;
                $(ops).val(data[i].id);
                docfrag.appendChild(ops);
            }
            $('#customertype').append(docfrag);
        })
    }

    //新增客户接口
    function apiCrmcustomercreate() {
        let data = {
            type: 'post',
            url: 'crmcustomer/create',
            data: {
                customername: neglectSpace('#customername'),
                customertype: $('#customertype').val(),
                customertelphone: neglectSpace('#customertelphone'),
                customerprovincename: $('#s_province').val(),
                customercityname: $('#s_city').val(),
                customerdistrictname: $('#s_county').val(),
                customeraddress: neglectSpace('#customeraddress'),

                creatorname: crmMsg.userNamecn,
                creatorid: crmMsg.userId,

                crmcustomerlinkmanlist: [{
                    linkmanname: neglectSpace('#linkmanname'),
                    linkmanposition: neglectSpace('#linkmanposition'),
                    linkmanmobile: neglectSpace('#linkmanmobile'),
                    linkmanlevel: neglectSpace('#linkmanlevel'),
                    // linkmantype: $('#linkmantype').val(),
                    linkmanphone: neglectSpace('#linkmanphone'),
                    linkmanemail: neglectSpace('#linkmanemail'),
                    creatorid: crmMsg.userId,
                }]
            }
        };
        Ajax(data).then(function (data) {
            if (data.backHttpResult.code != '000') {
                layer.msg('客户信息保存失败');
                return
            }
            $('.save').attr('disabled',true);
            layer.msg('客户信息保存成功', {time: 1000}, function () {
                if(getSession('customerMsg').url==21){
                    window.location.href = 'index.html'
                }else if(getSession('customerMsg').url==22){
                    window.location.href = 'customerPool.html'
                }
            });

        })

    }

    //获取客户详情接口
    function apicustomerview() {
        let data = {
            type: 'get',
            url: 'crmcustomer/customerview?id=' + getSession('customerMsg').id + '&userid=' + crmMsg.userId + '&_time=' + new Date().getTime(),
        };
        Ajax(data).then(function (data) {
            $('#customername').val(data.customername);
            $('#customertype').val(data.customertype);
            $('#customertelphone').val(data.customertelphone);

            $("#city").citySelect({
                prov: data.customerprovincename, city: data.customercityname, dist: data.customerdistrictname
            });
            // $('#s_province').val(data.customerprovincename);
            // $('#s_city').val(data.customercityname);
            // $('#s_county').val(data.customerdistrictname);

            $('#customeraddress').val(data.customeraddress);

        })
    }

    //修改客户接口
    function apiCrmcustomerupdate() {
        let data = {
            type: 'post',
            url: 'crmcustomer/update',
            data: {
                id: getSession('customerMsg').id,
                customername: neglectSpace('#customername'),
                customertype: $('#customertype').val(),
                customertelphone: neglectSpace('#customertelphone'),
                customerprovincename: $('#s_province').val(),
                customercityname: $('#s_city').val(),
                customerdistrictname: $('#s_county').val(),
                customeraddress: neglectSpace('#customeraddress'),

                creatorname: crmMsg.userNamecn,
                creatorid: crmMsg.userId,

            }
        };
        Ajax(data).then(function (data) {
            if (data.backHttpResult.code != '000') {
                layer.msg('客户信息保存失败');
                return
            }
            $('.save').attr('disabled',true);
            layer.msg('客户信息保存成功', {time: 1000}, function () {
                if (getSession('customerMsg').isedit == 1) {
                    if(getSession('customerMsg').url==21){
                        window.location.href = 'index.html'
                    }else if(getSession('customerMsg').url==22){
                        window.location.href = 'customerPool.html'
                    }
                } else if (getSession('customerMsg').isedit == 2) {
                    location.href = "./customerDetails.html"
                }
            });

        })

    }

    //对ul-customerName下li绑定事件
    function liClick() {
        $('.ul-customerName li').click(function () {
            $('#customername').val(this.innerText);
            apiReferCustomer();
            $('.ul-customerName').css('display', 'none');
        });

    }

    //校验必填项及非必填项格式--新建
    function checkNull1() {
        if (checkFlag == 2) {
            layer.msg('客户名称重复', {time: 1000});
            $('#customername').focus();
        }
        else if (ruleInp('#customername', 30, '', {//客户名称
                msg1: '客户名称不能为空',
                msg2: '客户名称长度最多30个字符',
                msg3: '',
            })) {}
        else if (ruleSel('#customertype', '请选择', '请选择客户类型')) {}//客户类型
        else if (ruleInp('#customertelphone', 20, '', {//客户总机
                msg1: '',
                msg2: '客户总机长度最多20个数字',
                msg3: '',
            })) {}
        else if (ruleSel('#s_county', '市、县级市', '请选择地址')) {}//客户地址
        else if (ruleInp('#customeraddress', 100, '', {//客户详细地址
                msg1: '',
                msg2: '客户详细地址最多100个字符',
                msg3: '',
            })) {}
        else if (ruleInp('#linkmanname', 30, '', {//联系人姓名
                msg1: '联系人姓名不能为空',
                msg2: '联系人姓名长度最多30个字符',
                msg3: '',
            })) {}
        else if (ruleInp('#linkmanmobile', 11, 1, {//联系人手机
                msg1: '联系人手机不能为空',
                msg2: '联系人手机号码长度输入有误',
                msg3: '联系人手机号码输入有误',
            })) {}
        else if (ruleInp('#linkmanphone', 20, 2, {//联系人电话
                msg1: '',
                msg2: '联系人电话号码最多20个数字',
                msg3: '联系人电话号码输入有误',
            })) {}
        else if (ruleInp('#linkmanemail', 30, 3, {//联系人邮箱
                msg1: '',
                msg2: '邮箱长度最多30个字符',
                msg3: '邮箱格式输入有误',
            })) {}
        else if (ruleInp('#linkmanposition', 20, 3, {//联系人职位
                msg1: '联系人职位不能为空',
                msg2: '联系人职位最多20个字符',
                msg3: '',
            })) {}
        else if (ruleInp('#linkmanlevel', 20, 3, {//联系人级别
                msg1: '联系人级别不能为空',
                msg2: '联系人级别最多20个字符',
                msg3: '',
            })) {}
        /*else if (ruleSel('#linkmantype', '请选择', '请选择联系人类别')) {}//联系人类别*/
        else {//验证通过
            apiCrmcustomercreate();
        }
    }

    //校验必填项及非必填项格式--修改
    function checkNull2() {
        if (checkFlag == 2) {
            layer.msg('客户名称重复', {time: 1000});
            $('#customername').focus();
        }
        else if (ruleInp('#customername', 30, '', {//客户名称
                msg1: '客户名称不能为空',
                msg2: '客户名称长度最多30个字符',
                msg3: '',
            })) {}
        else if (ruleSel('#customertype', '请选择', '请选择客户类型')) {}//客户类型
        else if (ruleInp('#customertelphone', 20, '', {//客户总机
                msg1: '',
                msg2: '客户总机长度最多20个数字',
                msg3: '',
            })) {}
        else if (ruleSel('#s_county', '市、县级市', '请选择地址')) {}//客户地址
        else if (ruleInp('#customeraddress', 100, '', {//客户详细地址
                msg1: '',
                msg2: '客户详细地址最多100个字符',
                msg3: '',
            })) {}
        else {//验证通过
            apiCrmcustomerupdate();
        }
    }

    //新建保存、取消
    function execute1() {
        $('.save1').click(function () {
            $('.save').attr('disabled',true);
            clearTimeout(time);
            time=setTimeout(function () {
                $('.save').attr('disabled',false);
            },2500);
            checkNull1();
        });
        $('.cancel1').click(function () {
            if(getSession('customerMsg').url==21){
                window.location.href = 'index.html'
            }else if(getSession('customerMsg').url==22){
                window.location.href = 'customerPool.html'
            }
        });
    }

    //修改保存、取消
    function execute2() {
        $('.save2').click(function () {
            $('.save').attr('disabled',true);
            clearTimeout(time);
            time=setTimeout(function () {
                $('.save').attr('disabled',false);
            },2500);
            checkNull2();
        });
        if (getSession('customerMsg').isedit == 1) {
            $('.cancel2').click(function () {
                if(getSession('customerMsg').url==21){
                    window.location.href = 'index.html'
                }else if(getSession('customerMsg').url==22){
                    window.location.href = 'customerPool.html'
                }

            });
        } else if (getSession('customerMsg').isedit == 2) {
            $('.cancel2').click(function () {
                window.location.href = 'customerDetails.html'
            });
        }

    }

    //加载客户类型
    apiCustomertype();
    //移除空格操作
    // delSpace('.content_w input');

    $('#customername').on('input', function () {
        $('.ul-customerName').css('display', 'block');
        $('.ul-customerName').html('');
        if ($('#customername').val() != '') {
            apiReferCustomer();
        }
    });
    $(document).on('click', function (e) {
        var target = e.target;
        if ($(target).parent()[0] != $('.ul-customerName')[0]) {
            $('.ul-customerName').css('display', 'none');
        }

    });


    //客户电话
    $('#customertelphone').on('keyup', function () {
        this.value = this.value.replace(/\D/g, '');
    });
    //联系人手机
    $('#linkmanmobile').on('keyup', function () {
        this.value = this.value.replace(/\D/g, '');
    });
    //联系人电话
    $('#linkmanphone').on('keyup', function () {
        this.value = this.value.replace(/\D/g, '');
    });
    //邮箱
    // $('#linkmanemail').on('keyup',function () {
    //     this.value = this.value.replace(/[\u4e00-\u9fa5]/g, '');
    // })


});