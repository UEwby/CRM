/**
 * Created by admin on 2017/10/18.
 */
$(function () {
    init();
    //console.log(JSON.parse(sessionStorage.getItem('personalCenter')).id);
    var flag;
    layui.use('laydate',function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#xybh',
            max: 0,
            done: function () {
                //商机清空
                $('.getBusT tbody').children('tr').remove();
                $('.getBusT').css('display','none');
                //客户清空
                $('.getCusT tbody').children('tr').remove();
                $('.getCusT').css('display','none');
                //合资公司清空
                $('.getHzT tbody').children('tr').remove();
                $('.getHzT').css('display','none');
                //$('.all > div').removeClass('layui-form-checked');  //layui问题，因为判断是反着的
                apiGetFollow();
            }
        })
    })

    function init() {
        Ajax({
            type: 'get',
            url: 'pc/daily/finddetail?dailyid='+JSON.parse(sessionStorage.getItem('personalCenter')).id+'&timestamp='+new Date().getTime(),
        }).then(function (res) {
            console.log(res);
            //$('.all > div').addClass('layui-form-checked');
            $('#xybh').val(getDateByDay(res.inputdate))  //返回的是填报日报的时间
            $('#zj').val(crmMsg.userNamecn);  //填写人
            $('#department').val(res.department);  //所属部门
            $('.dailyContent').val(res.dailycontent);
            checkboxAll($('#busT').attr('id'),$('.busTable').attr('class'));
            checkboxAll($('#cusT').attr('id'),$('.cusTable').attr('class'));
            checkboxAll($('#hzT').attr('id'),$('.hzTable').attr('class'));
            // 客户列表
            if(res.crmcustomerVisitLogList.visitCustomer.length > 0){
                var cusHtml = '',cusnum = 0;
                for(var i=0;i<res.crmcustomerVisitLogList.visitCustomer.length;i++){
                    cusHtml += '<tr cusId="'+res.crmcustomerVisitLogList.visitCustomer[i].ID+'">';
                    //console.log(res.crmcustomerVisitLogList.visitCustomer[i].isChecked == 0);
                    if(res.crmcustomerVisitLogList.visitCustomer[i].isChecked == 1){
                        cusHtml += '<td><div class="layui-form-checkbox layui-unselect layui-form-checked" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                        cusnum++;
                    }else {
                        cusHtml += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    }
                    cusHtml += '<td>' + res.crmcustomerVisitLogList.visitCustomer[i].CustomerName + '</td>';  //客户名称
                    cusHtml += '<td>' + res.crmcustomerVisitLogList.visitCustomer[i].VisitTypeName + '</td>'; //拜访方式
                    cusHtml += '<td>' + getDateByDay(res.crmcustomerVisitLogList.visitCustomer[i].VisitDate) + '</td>';     //拜访时间
                    cusHtml += '<td>' + res.crmcustomerVisitLogList.visitCustomer[i].visitTarget + '</td>';   //拜访目的
                    cusHtml += '<td>' + res.crmcustomerVisitLogList.visitCustomer[i].VisitContent + '</td>';  //拜访效果
                    cusHtml += '<td>' + res.crmcustomerVisitLogList.visitCustomer[i].nextvisitplan + '</td>'; //下一步计划
                    cusHtml += '</tr>';
                }
                if(res.crmcustomerVisitLogList.visitCustomer.length == cusnum){
                    $('#cusT .all > div').addClass('layui-form-checked');
                }else{
                    $('#cusT .all > div').removeClass('layui-form-checked');
                }
                $('.cusTable').html(cusHtml);
            }else {
                $('.cusTable').html('<tr><td colspan="7">暂无数据</td></tr>');
                $('#cusT .all').unbind('click');
            }


            //商机
            if(res.crmcustomerVisitLogList.visitProject.length > 0){
                var busHtml = '',busnum = 0;
                for(var i=0;i< res.crmcustomerVisitLogList.visitProject.length;i++){
                    busHtml += '<tr proId="'+res.crmcustomerVisitLogList.visitProject[i].ID+'">';
                    if(res.crmcustomerVisitLogList.visitProject[i].isChecked == 1){
                        busHtml += '<td><div class="layui-form-checkbox layui-unselect layui-form-checked" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                        busnum++;
                    }else {
                        busHtml += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    }
                    busHtml += '<td>' + res.crmcustomerVisitLogList.visitProject[i].ProjectName + '</td>';     //商机名称
                    busHtml += '<td>' + res.crmcustomerVisitLogList.visitProject[i].LinkManName + '</td>';     //联系人
                    busHtml += '<td>' + res.crmcustomerVisitLogList.visitProject[i].VisitTypeName + '</td>';   //拜访方式
                    busHtml += '<td>' + res.crmcustomerVisitLogList.visitProject[i].visitTarget + '</td>';     //拜访目的
                    busHtml += '<td>' + res.crmcustomerVisitLogList.visitProject[i].VisitContent + '</td>';    //拜访效果
                    busHtml += '<td>' + res.crmcustomerVisitLogList.visitProject[i].nextvisitplan + '</td>';   //下次拜访计划
                    busHtml += '</tr>';
                }
                $('.busTable').html(busHtml);
                if(res.crmcustomerVisitLogList.visitProject.length == busnum){
                    $('#busT .all > div').addClass('layui-form-checked');
                }else{
                    $('#busT .all > div').removeClass('layui-form-checked');
                }
            }else {
                $('.busTable').html('<tr><td colspan="7">暂无数据</td></tr>');
                $('#busT .all').unbind('click');
            }

            //合资公司
            if (res.crmcustomerVisitLogList.visitHeziCom.length > 0) {
                var hzHtml = '',hznum = 0;
                for (var i = 0; i < res.crmcustomerVisitLogList.visitHeziCom.length; i++) {
                    hzHtml += '<tr hzId="'+res.crmcustomerVisitLogList.visitHeziCom[i].ID+'">';
                    if(res.crmcustomerVisitLogList.visitHeziCom[i].isChecked == 1){
                        hzHtml += '<td><div class="layui-form-checkbox layui-unselect layui-form-checked" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                        hznum++;
                    }else {
                        hzHtml += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    }
                    hzHtml += '<td>' + res.crmcustomerVisitLogList.visitHeziCom[i].CoentrepriseName + '</td>';  //合资公司名称
                    hzHtml += '<td>' + res.crmcustomerVisitLogList.visitHeziCom[i].LinkManName + '</td>';  //联系人
                    hzHtml += '<td>' + res.crmcustomerVisitLogList.visitHeziCom[i].VisitTypeName + '</td>';  //拜访方式
                    hzHtml += '<td>' + res.crmcustomerVisitLogList.visitHeziCom[i].visitTarget + '</td>';  //拜访目的
                    hzHtml += '<td>' + res.crmcustomerVisitLogList.visitHeziCom[i].VisitContent + '</td>';  //拜访效果
                    hzHtml += '<td>' + res.crmcustomerVisitLogList.visitHeziCom[i].nextvisitplan + '</td>';  //下一步计划
                    hzHtml += '</tr>';
                }
                if(res.crmcustomerVisitLogList.visitHeziCom.length == hznum){
                    $('#hzT .all > div').addClass('layui-form-checked');
                }else{
                    $('#hzT .all > div').removeClass('layui-form-checked');
                }
                $('.hzTable').html(hzHtml)

            } else {
                $('.hzTable').html('<tr><td colspan="7">暂无数据</td></tr>')
                $('#hzT .all').unbind('click');
            }

        })
    }

    //获取所有选中的tr的id（改版过后的）
    function getAllId() {
        var arrId = [];
        var busT = $('#busT tbody'),
            cusT = $('#cusT tbody'),
            hzT = $('#hzT tbody');
        //console.log($(busT.children('tr')[0]).find('div').hasClass('layui-form-checked'))
        for(var i=0;i<busT.children('tr').length;i++){
            if($(busT.children('tr')[i]).find('div').hasClass('layui-form-checked')){
                arrId.push({
                    visitlogid: $(busT.children('tr')[i]).attr('proid')
                })
            }
        }
        for(var i=0;i<cusT.children('tr').length;i++){
            if($(cusT.children('tr')[i]).find('div').hasClass('layui-form-checked')){
                arrId.push({
                    visitlogid: $(cusT.children('tr')[i]).attr('cusid')
                })
            }
        }
        for(var i=0;i<hzT.children('tr').length;i++){
            if($(hzT.children('tr')[i]).find('div').hasClass('layui-form-checked')){
                arrId.push({
                    visitlogid: $(hzT.children('tr')[i]).attr('hzid')
                })
            }
        }
        return arrId;
    }

    //selector1是table标签的选择器(id选择器)，selector2是tbody标签的选择器（类选择器）
    function checkboxAll(selector1,selector2) {
        $('#'+selector1+' .layui-form-checkbox').removeClass('layui-form-checked');
        $('#'+selector1+' .all .layui-form-checkbox').on('click', function () {
            if ($(this).hasClass('layui-form-checked')) {
                $('#'+selector1+' .layui-form-checkbox').removeClass('layui-form-checked')
            } else {
                $('#'+selector1+' .layui-form-checkbox').addClass('layui-form-checked')
            }
        });
        $('.'+selector2+'').on('click', '.layui-form-checkbox', function () {
            $(this).toggleClass('layui-form-checked');
            var flag = true;
            $.each($('.'+selector2+' .layui-form-checkbox'), function (i, item) {
                if (!$(item).hasClass('layui-form-checked')) {
                    flag = false;  //有元素没有选上
                }
            });
            if (!flag) {
                $('#'+selector1+' .all .layui-form-checkbox').removeClass('layui-form-checked')
            } else {
                $('#'+selector1+' .all .layui-form-checkbox').addClass('layui-form-checked')
            }
        });
    }


    //获取改变日期时，获取list的参数
    function params1() {
        var params = {
            userId: crmMsg.userId,  //用户id
            inputDate: $('#xybh').val() || getDateByDay(new Date().getTime()),
            page: 1,   //默认显示第一页
            rows: 1000  //因为不分页，所以取一个大值
        }
        return params;
    }

    //获取用户的所有跟进记录
    function apiGetFollow() {
        var data = params1();
        //console.log(data)
        Ajax({
            type: 'get',
            url: 'pc/weekly/findTodayzdproject?userid=' + data.userId + '&inputDate=' + data.inputDate + '&page=' + data.page + '&rows=' + data.rows
        }).then(function (res) {
            //console.log(res);
            $('.all > div').addClass('layui-form-checked');
            //商机的
            if (res.visitProject.length > 0) {
                var busHtml = '';
                for (var i = 0; i < res.visitProject.length; i++) {
                    busHtml += '<tr proId="'+res.visitProject[i].ID+'">';
                    busHtml += '<td><div class="layui-form-checkbox layui-unselect layui-form-checked" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    busHtml += '<td>' + res.visitProject[i].ProjectName + '</td>';     //商机名称
                    busHtml += '<td>' + res.visitProject[i].LinkManName + '</td>';     //联系人
                    busHtml += '<td>' + res.visitProject[i].VisitTypeName + '</td>';   //拜访方式
                    busHtml += '<td>' + res.visitProject[i].visitTarget + '</td>';     //拜访目的
                    busHtml += '<td>' + res.visitProject[i].VisitContent + '</td>';    //拜访效果
                    busHtml += '<td>' + res.visitProject[i].nextvisitplan + '</td>';   //下次拜访计划
                    busHtml += '</tr>';
                }
                $('.busTable').html(busHtml);

            } else {
                $('.busTable').html('<tr><td colspan="7">暂无数据</td></tr>');
                $('#busT .all').unbind('click');
            }
            //客户的
            if (res.visitCustomer.length > 0) {
                var cusHtml = '';
                for (var i = 0; i < res.visitCustomer.length; i++) {
                    cusHtml += '<tr cusId="'+res.visitCustomer[i].ID+'">';
                    cusHtml += '<td><div class="layui-form-checkbox layui-unselect layui-form-checked" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    cusHtml += '<td>' + res.visitCustomer[i].CustomerName + '</td>';  //客户名称
                    cusHtml += '<td>' + res.visitCustomer[i].VisitTypeName + '</td>'; //拜访方式
                    cusHtml += '<td>' + getDateByDay(res.visitCustomer[i].VisitDate) + '</td>';     //拜访时间
                    cusHtml += '<td>' + res.visitCustomer[i].visitTarget + '</td>';   //拜访目的
                    cusHtml += '<td>' + res.visitCustomer[i].VisitContent + '</td>';  //拜访效果
                    cusHtml += '<td>' + res.visitCustomer[i].nextvisitplan + '</td>'; //下一步计划
                    cusHtml += '</tr>';
                }
                $('.cusTable').html(cusHtml);

            } else {
                $('.cusTable').html('<tr><td colspan="7">暂无数据</td></tr>');
                $('#cusT .all').unbind('click');
            }
            //合资公司的
            if (res.visitHeziCom.length > 0) {
                var hzHtml = '';
                for (var i = 0; i < res.visitHeziCom.length; i++) {
                    hzHtml += '<tr hzId="'+res.visitHeziCom[i].ID+'">';
                    hzHtml += '<td><div class="layui-form-checkbox layui-unselect layui-form-checked" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                    hzHtml += '<td>' + res.visitHeziCom[i].CoentrepriseName + '</td>';  //合资公司名称
                    hzHtml += '<td>' + res.visitHeziCom[i].LinkManName + '</td>';  //联系人
                    hzHtml += '<td>' + res.visitHeziCom[i].VisitTypeName + '</td>';  //拜访方式
                    hzHtml += '<td>' + res.visitHeziCom[i].visitTarget + '</td>';  //拜访目的
                    hzHtml += '<td>' + res.visitHeziCom[i].VisitContent + '</td>';  //拜访效果
                    hzHtml += '<td>' + res.visitHeziCom[i].nextvisitplan + '</td>';  //下一步计划
                    hzHtml += '</tr>';
                }
                $('.hzTable').html(hzHtml)

            } else {
                $('.hzTable').html('<tr><td colspan="7">暂无数据</td></tr>')
                $('#hzT .all').unbind('click');
            }

            getAllId();
        })
    }

    //校验必填项的格式
    function checkNull() {
        if($('#xybh').val() == ''){
            layer.msg('请选择一个日期',{time:1000});
            flag = 0;
            return;
        }else if($('.dailyContent').val() == '') {
            layer.msg('日报内容不能为空',{time:1000});
            flag = 0;
            $('.dailyContent').focus();
            return;
        }else {  //验证通过
            flag = 1
        }
    }

    //修改日报接口(保存草稿)
    function apiEditDailySave(obj) {
        //console.log(JSON.stringify(params(obj)));
        var data = {
            type: 'post',
            url: 'pc/daily/update',
            data: params(obj)
        }
        Ajax(data).then(function (res) {
            var res = JSON.parse(res);
            if(res.backHttpResult.code == '000'){
                layer.msg('草稿保存成功',{time:1000},function () {
                    window.location.href = './index.html'
                })
            }
        })
    }

    //修改日报接口(提交发布)
    function apiEditDailyPresent(obj) {
        //console.log(JSON.stringify(params(obj)));
        var data = {
            type: 'post',
            url: 'pc/daily/update',
            data: params(obj)
        }
        Ajax(data).then(function (res) {
            //console.log(res);
            var res = JSON.parse(res);
            if(res.backHttpResult.code == '000'){
                layer.msg('发布成功',{time:1000},function () {
                    window.location.href = './index.html'
                })
            }else if(res.backHttpResult.code == '001'){
                layer.msg('此日期的日报已经发布了，请勿重复提交！',{time:1000})
            }
        })
    }


    //所需要的参数
    function params(obj) {
        var params = {
            dailyid: JSON.parse(sessionStorage.getItem('personalCenter')).id,
            inputdate: $('#xybh').val(),             //填写日期
            inputperson: crmMsg.userId,              //填写人的id
            department: $('.department').val(),      //部门
            dailycontent: $('.dailyContent').val(),  //日报内容
            createuser: crmMsg.userId,               //创建人的id
            dailystate: obj,
            dailydate: getDateByDay(new Date().getTime()), //当前时间

            visitloglist: getAllId()
        }
        console.log(params)
        return params;
    }

    //保存  草稿
    $('.act').click(function () {
        checkNull();
        if(flag == 1){
            var obj = 1;
            apiEditDailySave(obj);
        }
    })

    //提交  发布
    $('.present').click(function () {
        checkNull();
        if(flag == 1){
            layer.confirm(
                '<em style="color:red; font-weight: 700">确认发布日报吗？</em>',
                function () {
                    var obj = 2;
                    apiEditDailyPresent(obj);
                },
                function () {
                    layer.closeAll();
                },
            )
        }
    })

})