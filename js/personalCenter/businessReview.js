/**
 * Created by admin on 2017/10/20.
 */
$(function () {
    var flag;
    //获取所有的select选项
    getSelectList();

    //首先判断是否为领导
    apiIsLeader(function (data) {
        //console.log(data)

        // //判断是否为王亚川
        if(crmMsg.userNameen == 'wangyachuan@ys'){
            $('.isLeader').css('display','block');

            //监听radio的变化，控制选择执行人的操作(总裁里面有)
            $('input[type=radio][name=choose]').change(function() {
                if (this.value == '1') {
                    $('.zxr').attr("disabled", false)
                }
                else if (this.value == '0') {
                    $('.zxr').val('');
                    $('.zxr').attr("disabled", true)
                }
            });

            $('.zxr').on('input',function () {
                $('.chooseZxr').css('display','block');
                $('.chooseZxr').html('');
                if ($('.zxr').val() != '') {
                    apiGetZxr();
                }
            })

            $('.isOk').click(function () {
                $(this).attr('disabled','true');
                checkAllCeo()
                if(flag == 1){
                    if($('input:radio[name="choose"]:checked').val() == '1'){
                        Ajax({
                            type: 'post',
                            url: 'crmcustomerproject/suggest',
                            data: {
                                projectid: JSON.parse(sessionStorage.getItem('auditId')).auditId,
                                decision: $("input[name='choose']:checked").val(),
                                suggestion: $('.auditContent').val(),
                                executor: JSON.parse(sessionStorage.getItem('zxrId')).zxrId,
                                projectLevel: $('.tcbuslevel').val()
                            }
                        }).then(function (res) {
                            //console.log(res);
                            if(res.backHttpResult.code == '000'){
                                layer.msg('完成审核',{time: 1000},function () {
                                    layer.closeAll();
                                    resetReview();
                                    getTable(null);
                                    //window.location.reload();
                                })
                            }else{
                                layer.msg('审核异常',{time: 1000})
                            }
                            setTimeout(function () {
                                $('.isOk').prop('disabled',false)
                            },2000)
                        })
                    }else{
                        Ajax({
                            type: 'post',
                            url: 'crmcustomerproject/suggest',
                            data: {
                                projectid: JSON.parse(sessionStorage.getItem('auditId')).auditId,
                                decision: $("input[name='choose']:checked").val(),
                                suggestion: $('.auditContent').val(),
                                executor: '',
                                projectLevel: $('.tcbuslevel').val()
                            }
                        }).then(function (res) {
                            //console.log(res);
                            if(res.backHttpResult.code == '000'){
                                layer.msg('完成审核',{time: 1000},function () {
                                    layer.closeAll();
                                    resetReview();
                                    getTable(null);

                                })
                            }else{
                                layer.msg('审核异常',{time: 1000})
                            }
                            setTimeout(function () {
                                $('.isOk').prop('disabled',false)
                            },2000)
                        })
                    }
                }
            })
        }else if (data){
            //alert('主管');
            //$('.isLeader').css('display','none');

            $('.isOk').click(function () {
                $(this).attr('disabled','true');
                //console.log($("input[name='choose']:checked").val());
                checkAllCharge()
                if(flag == 1){
                    Ajax({
                        type: 'post',
                        url: 'crmcustomerproject/suggest',
                        data: {
                            projectid: JSON.parse(sessionStorage.getItem('auditId')).auditId,
                            decision: $("input[name='choose']:checked").val(),
                            suggestion: $('.auditContent').val(),
                            executor: '',                          //执行人的id（主管不需要指定执行人）
                            projectLevel: $('.tcbuslevel').val()
                        }
                    }).then(function (res) {
                        //console.log(res);
                        if(res.backHttpResult.code == '000'){
                            layer.msg('完成审核',{time: 1000},function () {
                                resetReview();
                                layer.closeAll();
                                getTable(null);
                            })
                        }else{
                            layer.msg('审核异常',{time: 1000})
                        }
                        setTimeout(function () {
                            $('.isOk').prop('disabled',false)
                        },2000)
                    })
                }
            })
        }


    });

    var laypage;
    layui.use(['laypage','layer'],function () {
        laypage = layui.laypage;

        $('.advanced-filter').click(function () {
            layer.open({
                type: 1,
                title: '高级筛选',
                content: $('#filter'),
                area: ['900px','300px'],
            })
        })

        //加载默认页面的list表格
        getTable(null,{
            userid: crmMsg.userId,
            businesstype: '',         //商机类别
            projectlevel: '',         //商机等级
            projectstate: '',         //商机状态
            budgetstatus: '',         //预算状态
            beginbudgetmoney: '',     //签约金额（前）
            endbudgetmoney: '',       //签约金额（后）
            rows: 20,                //一页显示的条数
            page: 2,                //页码
            name: ''          //输入框输入的字段
        });
    })

    //高级筛选确认搜索表格
    $('.agr').click(function () {
        getTable();
        layer.closeAll('page'); //关闭所有页面层
        if($('.businesstype').val() == 0 && $('.projectlevel').val() == 0 && $('.projectstate').val() == 0 && $('.budgetstatus').val() == 0 && $('.beginbudgetmoney').val() == '' && $('.endbudgetmoney').val() == '') {
            // $('.advanced-filter').css('background','url(../../img/btn2-bg.png) no-repeat left bottom')
            $('.advanced-filter').removeClass('dot')
        }else {
            // $('.advanced-filter').css('background','url(../../img/btn1-bg.png) no-repeat left bottom')
            $('.advanced-filter').addClass('dot')
        }
    })

    //点击搜索框查询
    $('.input-search1').click(function () {
        // $('.advanced-filter').css('background','url(../../img/btn2-bg.png) no-repeat left bottom')
        $('.advanced-filter').removeClass('dot')
        //重置高级筛选条件
        reset();
        getTable();
    })

    //搜索点击重置高级筛选
    $('.act').click(function () {
        reset();
    })

    //点击弹出层的关闭按钮
    $('body').on('click','.layui-layer-setwin',function () {
        if($('.businesstype').val() == 0 && $('.projectlevel').val() == 0 && $('.projectstate').val() == 0 && $('.budgetstatus').val() == 0 && $('.beginbudgetmoney').val() == '' && $('.endbudgetmoney').val() == '') {

            $('.advanced-filter').removeClass('dot')
        }else {

            $('.advanced-filter').addClass('dot')
        }
        resetReview();
    })

    //审核弹出层
    $('tbody').on('click','.audit',function () {
        //弹出层
        layer.open({
            type: 1,
            title: '商机审核',
            content: $('#busReview'),
            area: ['550px','380px'],
        })
        var projectLevel = $(this).attr('busLevelVal');
        $('.tcbuslevel').val(projectLevel)

        // console.log($(this).attr('busId'));
        var auditId = {
            auditId: $(this).attr('busId')
        }
        sessionStorage.setItem('auditId',JSON.stringify(auditId));
    })

    //取消操作
    $('.cancel').click(function () {
        layer.closeAll();
        // $("input:radio[name='choose']").prop('checked',false)
        // $('.zxr').val('');
        // $('.auditContent').val('')
        resetReview();
    })


    $('.chooseZxr').on('click','.nobody',function () {
        $(this).parent().css('display','none');
        $('.zxr').val('');
    })

    //查看商机详情
    $('tbody').on('click','.busDetails',function () {
        var busid = $(this).attr('bid')

    })


    //获取改变条件所需要的参数
    function getParams() {
        var params = {
            userid: crmMsg.userId,
            businesstype: $('.businesstype').val() == '0'? '' : $('.businesstype').val(),         //商机类别
            projectlevel: $('.projectlevel').val() == '0'? '' : $('.projectlevel').val(),         //商机等级
            projectstate: $('.projectstate').val() == '0'? '' : $('.projectstate').val(),         //商机状态
            budgetstatus: $('.budgetstatus').val() == '0'? '' : $('.budgetstatus').val(),         //预算状态
            beginbudgetmoney: $('.beginbudgetmoney').val(),                                       //签约金额（前）
            endbudgetmoney: $('.endbudgetmoney').val(),                                           //签约金额（后）
            rows: 20,                                                                              //一页显示的条数
            page: 1,                                                                              //页码
            name: $('.nameSel').val()                                                             //输入框输入的字段
        }
        //console.log(params);
        return params;
    }

    //获取list表格
    function getTable(obj) {
        var data = getParams();
        if(!obj){
            var obj = {};
            obj.curr = data.page;
            obj.limit = data.rows
        }
        data.page = obj.curr;
        data.rows = obj.limit;
        Ajax({
            type: 'get',
            url: 'crmcustomerproject/findprojectsuggestionall?userid='+ data.userid +'&businesstype='+data.businesstype+ '&projectstate='+data.projectstate  + '&projectlevel='+data.projectlevel+'&budgetstatus='+data.budgetstatus+'&beginbudgetmoney='+data.beginbudgetmoney+'&endbudgetmoney='+data.endbudgetmoney+'&rows='+data.rows+'&page='+data.page+'&name='+data.name+'&v='+new Date().getTime()
        }).then(function (res) {
            console.log(res);
            var html = '';
            for(var i=0;i<res.rows.length;i++){
                html += '<tr>';
                // html += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                html += '<td bid='+ res.rows[i].id +' class="busDetails">'+ res.rows[i].projectname +'</td>';                       //商机名称
                html += '<td>'+ proState(res.rows[i].projectState) +'</td>';            //商机状态
                html += '<td>'+ res.rows[i].customername +'</td>';                      //客户名称
                html += '<td>'+ budState(res.rows[i].budgetStatus) +'</td>';            //预算状态
                html += '<td>'+ res.rows[i].SignMoney +'万元</td>';                     //合同金额（预计）
                html += '<td>'+ strSlice(res.rows[i].projectlevelname) +'</td>';        //商机等级
                html += '<td>'+ res.rows[i].srctype +'</td>';                           //来源类型
                html += '<td>'+ res.rows[i].projectmanagername +'</td>';                //商机负责人
                html += '<td>'+ getDateByDay(res.rows[i].signdate) +'</td>';            //签约时间
                html += '<td>'+ checkState(res.rows[i].decision) +'</td>';              //审核状态
                html += '<td><span busLevelVal='+ res.rows[i].projectlevel +' busId='+ res.rows[i].id +' class="audit">'+ '审核' +'</span></td>';
                html += '</tr>';
            }
            $('tbody').html(html)
            pager(obj,res.total,[10,20,50,100],getTable,$('.pager'))
        })
    }

    //商机状态
    function proState(data) {
        if(data == 1){
            data = '签署合同'
        }else if(data == 2){
            data = '已中标'
        }else if(data == 3){
            data = '招投标'
        }else if(data == 4){
            data = '招投标前期'
        }else if(data == 5){
            data = '编写解决方案'
        }else if(data == 6){
            data = '提供建设性方案'
        }else if(data == 7){
            data = '商机沟通'
        }
        return data;
    }

    //预算状态
    function budState(data) {
        if(data == 1){
            data = '待申请'
        }else if(data == 2){
            data = '申请中(主导)'
        }else if(data == 3){
            data = '申请中(非主导)'
        }else if(data == 4){
            data = '已批复'
        }
        return data;
    }

    //截取前两个字符串
    function strSlice(str) {
        // console.log(str);
        return str.slice(0,2)
    }

    //判断是几级审核
    function checkState(data) {
        if(data == 1){
            data = '待审核(主管)'
        }else if(data == 2){
            data = '审核通过(主管)'
        }else if(data == 3){
            data = '审核未通过(主管)'
        }else if(data == 4){
            data = '待审核(总裁)'
        }else if(data == 5){
            data = '审核通过(总裁)'
        }else if(data == 6){
            data = '审核未通过(总裁)'
        }
        return data
    }

    //获取筛选弹出框的所有下拉选项
    function getSelectList() {
        Ajax({
            type: 'get',
            url: 'crmcustomerwordbook/findwordbookall'
        }).then(function (res) {
            //console.log(res);
            //商机类别的option
            var bustypeOpHtml = '';
            for(var i=0;i<res.businessTypeAll.length;i++){
                bustypeOpHtml += '<option value='+ res.businessTypeAll[i].keystr +'>'+ res.businessTypeAll[i].valuestr +'</option>'
            }
            $('.businesstype').append(bustypeOpHtml);

            //商机状态的option
            var busstateOpHtml = '';
            for(var i=0;i<res.projectStateAll.length;i++){
                busstateOpHtml += '<option value='+ res.projectStateAll[i].keystr +'>'+ res.projectStateAll[i].valuestr +'</option>'
            }
            $('.projectstate').html(busstateOpHtml);

            //商机等级的option
            var buslevelOpHtml = '';
            for(var i=0;i<res.projectLevelAll.length;i++){
                buslevelOpHtml += '<option value='+ res.projectLevelAll[i].keystr +'>'+ res.projectLevelAll[i].valuestr +'</option>'
            }
            $('.projectlevel').html(buslevelOpHtml);

            //预算状态的option
            var budstateOpHtml = '';
            for(var i=0;i<res.budgetStatusAll.length;i++){
                budstateOpHtml += '<option value='+ res.budgetStatusAll[i].keystr +'>'+ res.budgetStatusAll[i].valuestr +'</option>'
            }
            $('.budgetstatus').html(budstateOpHtml);

            //弹出层里面的商机等级列表option
            var tcHtml = '';
            for(var i=0;i<res.projectLevelAll.length;i++){
                tcHtml += '<option value='+ res.projectLevelAll[i].keystr +'>'+ res.projectLevelAll[i].valuestr +'</option>'
            }
            $('.tcbuslevel').html(tcHtml)

        })
    }

    //重置筛选条件
    function reset() {
        $('.businesstype').val('0');
        $('.projectlevel').val('0');
        $('.projectstate').val('0');
        $('.budgetstatus').val('0');
        $('.beginbudgetmoney').val('');
        $('.endbudgetmoney').val('');
    }

    //判断是不是为领导
    function apiIsLeader(fn) {
        Ajax({
            type: 'get',
            url: 'pc/sys/finduserisleader?userid='+crmMsg.userId
        }).then(function (res) {
            //res为true或false
            fn(res);
            // console.log(res);
            var leader = {
                isLeader: res
            }
            sessionStorage.setItem('isLeader',JSON.stringify(leader));
        })
    }

    // 获取执行人列表
    function apiGetZxr() {
        var zxr = $.trim( $('.zxr').val());
        zxr && Ajax({
            type: 'get',
            url: 'pc/sys/findallsysuser?userNamecn='+ zxr
        }).then(function (res) {
            console.log(res);
            if(res.length > 0){
                var zxrList = '';
                for(var i=0;i<res.length;i++){
                    zxrList += '<li zxrId='+ res[i].userId +'>'+ res[i].userNamecn +'</li>';
                }
                $('.chooseZxr').html(zxrList);
                liClick();
            }else{
                $('.chooseZxr').html('<span class="nobody">暂无此人</span>');
            }
        })
    }

    //选择有一个执行人添加到input
    function liClick() {
        $('.chooseZxr').on('click','li',function () {
            var zxrId = {
                zxrId: $(this).attr('zxrId')
            }
            sessionStorage.setItem('zxrId',JSON.stringify(zxrId));
            $('.zxr').val($(this).text());
            $('.chooseZxr').css('display','none');
        })
    }

    //总裁审批需要的规则
    function checkAllCeo() {
        flag = 0
        var rads = $('input:radio[name="choose"]:checked').val();
        if(rads == undefined){
            layer.msg('请选择同意或拒绝',{time:1000});
        }else if(rads == '1'){
            if($('.zxr').val() == ''){
                layer.msg('请选择执行人',{time:1000});
                $('.zxr').focus();
            }else if($('.auditContent').val() == ''){
                layer.msg('审核内容不能为空',{time:1000});
                $('.auditContent').focus();
            }else if($('.auditContent').val().length > 200){
                layer.msg('审核内容不能超过两百字',{time:1000});
                $('.auditContent').focus();
            }else {
                flag = 1;
            }
        }else if(rads == '0'){
            if($('.auditContent').val() == ''){
                layer.msg('审核内容不能为空',{time:1000});
                $('.auditContent').focus();
            }else if($('.auditContent').val().length > 200){
                layer.msg('审核内容不能超过两百字',{time:1000});
                $('.auditContent').focus();
            }else {
                flag = 1;
            }
        }
        return flag;
    }

    //主管审批需要的规则
    function checkAllCharge() {
        flag = 0
        var rads = $('input:radio[name="choose"]:checked').val();
        if(rads == undefined){
            layer.msg('请选择同意或拒绝',{time:1000});
        }else if($('.auditContent').val() == '' ){
            layer.msg('审核内容不能为空',{time:1000});
            $('.auditContent').focus();
        }else if($('.auditContent').val().length > 200){
            layer.msg('审核内容不能超过两百字',{time:1000})
            $('.auditContent').focus();
        }else{
            flag = 1
        }
        return flag;
    }
    
    function resetReview() {
        $("input:radio[name='choose']").prop('checked',false)
        $('.zxr').val('');
        $('.zxr').prop('disabled',false)
        $('.auditContent').val('')
    }

    

})