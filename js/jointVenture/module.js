/**
 * Created by Limbo on 2017/10/13.
 */
$(function () {

    layui.use(['laydate'],function () {
        var laydate = layui.laydate;


        laydate.render({
            elem: '#expectgetlicensedate'
        })

    })


    var custmor;
    //用户查重
    let flag;

    //模糊查询已有客户
    function apiReferCustomer() {
        let data = {
            type: 'get',
            url: 'pc/customer/findCommonCustomer1?&commFlag=0&sortname=user_namecn&customerName=' + $('#customername').val() + '&puserid=' + crmMsg.userId + '&_time=' + new Date().getTime(),
        };
        Ajax(data).then(function (data) {
            flag = 0;

            $('.ul-customerName').html('');
            if (data.length > 0) {
                let html='';
                custmor = data;
                for (let i = 0; i < data.length; i++) {
                    html += '<li name="'+data[i].ID+'">'+data[i].CustomerName+'</li>';
                    if ($('#customername').val() != custmor[i].CustomerName) {
                        $('.repeat').text('该客户不存在！');
                        flag = 2;
                    } else {
                        $('.repeat').empty();
                        flag = 0;
                    }
                }
                liBlur();
                $('.ul-customerName').html(html);
                liClick();
            }
        });
    }

    //客户名称失去光标事件
    function liBlur(){
        $('#customername').blur(function(){
            for (let i = 0; i < custmor.length; i++) {
                if ($('#customername').val() != custmor[i].CustomerName) {
                    $('.repeat').text('该客户不存在！');
                    flag = 2;
                } else {
                    $('.repeat').empty();
                    flag = 0;
                }
            }
        })
    }

    //对ul-customerName下li绑定事件
    function liClick() {
        $('.ul-customerName li').click(function () {
            $('#customername').val(this.innerText);
            $('#customername').attr('name',$(this).attr('name'));
            apiReferCustomer();
        })
    }

    $('#customername').on('keyup', function () {
        $('.ul-customerName').html('');
        if ($('#customername').val() != '') {
            apiReferCustomer();
        }
    });

    //类型
    function apiCustomertype() {
        let data = {
            type: 'get',
            url: 'crmcustomerwordbook/find?flag=coentreprisestate'
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

    apiCustomertype();


    //校验必填项及非必填项格式
    function checkNull() {
        let regMail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if(flag==2){
            alert('该客户不存在');
            $('#customername').focus();
        } else if($('#customername').val() == '') {//客户名称
            alert('客户名称不能为空');
            $('#customername').focus();
        } else if ($('#coentreprisename').val() == '') {//合资公司名称
            alert('合资公司名称（拟）不能为空');
            $('#coentreprisename').focus();
        } else if ($('#coentreprisemanger').val() == '') {//董事&监理人员
            alert('董事&监理人员');
            $('#coentreprisemanger').focus();
        } else if ($('#customertype').val() == '请选择') {//类型
            alert('类型不能为空');
            $('#customertype').focus();
        } else if ($('#expectgetlicensedate').val() == '') {//预计拿到执照日期
            alert('请选择联系人类别');
            $('#expectgetlicensedate').focus();
        } else {//验证通过
            flag = 1;
        }


    }

    //新增合资公司接口
    function apiJoinVentureCreate() {
        let data = {
            type: 'post',
            url: 'crmcustomercoentreprise/create',
            data: {
                customerid: $('#customername').attr('name'),
                creatorid: crmMsg.userId,
                coentreprisename: $('#coentreprisename').val(),
                coentreprisemanger: $('#coentreprisemanger').val(),
                coentreprisestate: $('#customertype').val(),
                coentrepriseholders: $('#coentrepriseholders').val(),
                expectgetlicensedate: $('#expectgetlicensedate').val()

            }
        };
        Ajax(data).then(function (data) {
            console.log(data)
            if(data.backHttpResult.code=='000'){
                alert("新建成功！");
                window.location.href='./index.html';
            }else{
                alert(data.backHttpResult.result);
            }
        })
    }

    //保存
    $('.save').click(function () {
        checkNull();
        if (flag==1) {
            apiJoinVentureCreate();
        }
    })







});