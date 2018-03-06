/**
 * Created by Limbo on 2017/10/19.
 */
$(function () {
    var backUrl;
    var visitdatatype;
    var flag=0;

    //调用时间控件
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#visitdate'
        });
    });

    switch (getSession('followMsg').url){
        case 11:
            inCustomer();
            backUrl='../customerManagement/index.html';
            break;
        case 12:
            inCustomer();
            backUrl='../customerManagement/customerDetails.html';
            break;
        case 21:
            inOpportunity();
            backUrl='../opportunityManagement/index.html';
            break;
        case 22:
            inOpportunity();
            backUrl='../opportunityManagement/businessDetails.html';
            break;
    }

    //从客户中带过来信息
    function inCustomer() {
        $('.opportunity').css('display','none');
        $('.content_w h2').html('新建客户跟进');

        $('#customerid').val(getSession('customerMsg').name);
        $('#customerid').attr('name',getSession('customerMsg').id);

        visitdatatype=1;
    }

    //从商机中带过来信息
    function inOpportunity() {
        $('.content_w h2').html('新建商机跟进');

        $('#customerid').val(getSession('customerMsg').name);
        $('#customerid').attr('name',getSession('customerMsg').id);
        $('#projectid').val(getSession('opportunitiesMsg').name);
        $('#projectid').attr('name',getSession('opportunitiesMsg').id);

        visitdatatype=2;
    }

    //查看联系人
    function apicrmcustomerlinkman() {
        let data={
            type:'get',
            url:'crmcustomer/customerview?id='+getSession('customerMsg').id+'&userid='+getSession('crmMsg').userId+'&_time='+new Date().getTime(),
        };
        Ajax(data).then(function (data) {
            let html='<option value="0">请选择</option>';
            for(let i=0;i<data.crmcustomerlinkmanlist.length;i++){
                html +='<option value="'+data.crmcustomerlinkmanlist[i].id+'">'+ data.crmcustomerlinkmanlist[i].linkmanname+'</option>'
            }
            $('#crmcustomerlinkmanlist').html(html);
        })
    }
    //新建客户跟进记录
    function apicrmcustomervisitlog() {
        let data = {
            type: 'post',
            url:'crmcustomervisitlog/create',
            data:{
                customerid:$('#customerid').attr('name'),
                projectid:$('#projectid').attr('name'),
                visitdate:$('#visitdate').val(),
                visittype:$('#visittype').val()==0?'':$('#visittype').val(),
                coentrepriseid:'',//合资公司id
                visitcontent:$('#visitcontent').val(),
                nextvisitplan:$('#nextvisitplan').val(),
                // visitsort:$('#visitsort').val()==0?'':$('#visitsort').val(),
                creatorid:getSession('crmMsg').userId,
                customermanagerids:$('#customermanagerids').val(),
                crmcustomerlinkmanlist:[{
                    id:$('#crmcustomerlinkmanlist').val()==0?'':$('#crmcustomerlinkmanlist').val()
                }],
                visitdatatype:visitdatatype,//1:客户，2：商机，3：合资公司
                coentreprisestate:'',//119:初步沟通，120:签订出资协议，121:核名，122:注册
                visittarget:$('#visittarget').val(),

            }
        };
        Ajax(data).then(function (data) {
            if(data.backHttpResult.code!='000'){
                layer.msg('新建跟进记录失败');
                return
            }
            layer.msg('保存成功',{time:1000},function () {
                window.location.href=backUrl;
            })
        })
    }
    
    function checkNull() {
        // if(ruleSel('#visitsort', '0', '请选择拜访类别')){}
        if(ruleSel('#crmcustomerlinkmanlist', '0', '请选择联系人')){}
        else if(ruleSel('#visittype', '0', '请选择拜访方式')){}
        else if(ruleInp('#customermanagerids', 60, '', {
                msg1: '',
                msg2: '随访人员最多输入60个字符',
                msg3: '',
            })){}
        else if(ruleInp('#visitdate', 20, '', {
                msg1: '请选择拜访时间',
                msg2: '',
                msg3: '',
            })){}
        else if(ruleInp('#visittarget', 300, '', {
                msg1: '请填写拜访目的',
                msg2: '拜访目的最多输入300个字符',
                msg3: '',
            })){}
        else if(ruleInp('#visitcontent', 300, '', {
                msg1: '请填写拜访效果',
                msg2: '拜访效果最多输入300个字符',
                msg3: '',
            })){}
        else if(ruleInp('#nextvisitplan', 300, '', {
                msg1: '请填写下一步计划',
                msg2: '下一步计划最多输入300个字符',
                msg3: '',
            })){}
        else {
            apicrmcustomervisitlog();
        }
    }

    //跳转回之前页面
    function toback() {
        $('.cancel1').click(function () {
            window.location.href=backUrl;
        });
        $('.save1').click(function () {
            checkNull()
        })
    }

    apicrmcustomerlinkman();
    toback();

});