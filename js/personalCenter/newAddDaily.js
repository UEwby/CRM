/**
 * Created by admin on 2017/10/17.
 */
$(function () {
    var flag,time;
    init();  //初始化加载页面
    //需要用带layui的日期和tab切换
    layui.use(['laydate', 'element'], function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#xybh',
            value: new Date(),
            max: 0,  //设置今天为最大日期
            done: function () {
                //日期改变之后的回掉
                //日报内容清空
                //$('.dailyContent').val('');
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

    /*// 监测所点击的tr增加到相应的表格里面去
     $('.busTable').on('click','.layui-form-checkbox',function () {
     //console.log($(this).parents('tr').attr('proId'));
     if($(this).attr('class').indexOf('layui-form-checked') != -1){
     var dom = $(this).parents('tr').clone(true)  //克隆元素
     //console.log(dom.children('td')[1].innerText);
     var arr = [];     //获取所有字节
     for(var i=1;i<dom.children('td').length;i++){
     arr.push(dom.children('td')[i].innerText)
     }
     //console.log(arr);
     $('.getBusT').css('display','table');  //显示table开始显示
     // $('.getCusT tbody')
     var html1 = '<tr getBusId="'+ $(this).parents('tr').attr('proId') +'">';  //显示的table填充数据
     for(var i=0;i<arr.length;i++){
     html1 += '<td>'+ arr[i] +'</td>';
     }
     html1 += '</tr>'
     $('.getBusT tbody').append(html1);
     }else{
     //选中了，变为没有选中
     if($('.getBusT tbody tr').length > 0){
     $('tr[getBusId="' + $(this).parents('tr').attr('proId') + '"]').remove();
     //console.log($('.getBusT tbody tr').length);
     if($('.getBusT tbody tr').length == 0){  //当删掉所有的tr时候，则隐藏table
     $('.getBusT').css('display','none');
     }
     }
     }


     })

     //点击全选
     $('#busT .all').click(function () {
     //console.log($('.cusTable').children('tr'));
     if($('#busT div').attr('class').indexOf('layui-form-checked') != -1){
     $('.getBusT tbody').children('tr').remove();  //开始默认删除里面的所有数据
     var erarr = [],
     trs= $('.busTable').children('tr');  //遍历tr的个数
     for(var i=0;i<trs.length;i++){
     var tds = trs[i];
     var arr =[];
     for(var j=1;j<$(tds).children('td').length;j++){
     arr.push($(tds).children('td')[j].innerText)
     }
     erarr.push(arr);
     }
     //console.log(erarr);
     $('.getBusT').css('display','table');  //显示table开始显示
     for(var i=0;i<erarr.length;i++){
     //console.log($($('.cusTable tr')[i]).attr('cusId'));
     var html = '<tr getBusId="'+ $($('.busTable tr')[i]).attr('proId') +'">';
     for(var j=0;j<erarr[i].length;j++){
     // console.log(erarr[i][j])
     html += '<td>'+ erarr[i][j] +'</td>';
     }
     html += '</tr>'
     $('.getBusT tbody').append(html);
     }
     }else {
     $('.getBusT tbody').children('tr').remove();
     $('.getBusT').css('display','none');
     }
     })

     // 监测所点击的tr增加到相应的表格里面去
     $('.cusTable').on('click','.layui-form-checkbox',function () {
     //alert(2)
     //console.log($(this).parents('tr').attr('cusId'));  //获取id
     if($(this).attr('class').indexOf('layui-form-checked') != -1){
     var dom = $(this).parents('tr').clone(true)  //克隆元素
     //console.log(dom.children('td')[1].innerText);
     var arr = [];     //获取所有字节
     for(var i=1;i<dom.children('td').length;i++){
     arr.push(dom.children('td')[i].innerText)
     }
     //console.log(arr);
     $('.getCusT').css('display','table');  //显示table开始显示
     // $('.getCusT tbody')
     var html1 = '<tr getCusId="'+ $(this).parents('tr').attr('cusId') +'">';  //显示的table填充数据
     for(var i=0;i<arr.length;i++){
     html1 += '<td>'+ arr[i] +'</td>';
     }
     html1 += '</tr>'
     $('.getCusT tbody').append(html1);
     }else{
     //选中了，变为没有选中
     if($('.getCusT tbody tr').length > 0){
     $('tr[getCusId="' + $(this).parents('tr').attr('cusId') + '"]').remove();
     //console.log($('.getCusT tbody tr').length);
     if($('.getCusT tbody tr').length == 0){  //当删掉所有的tr时候，则隐藏table
     $('.getCusT').css('display','none');
     }
     }
     }
     })

     //点击全选
     $('#cusT .all').click(function () {
     //console.log($('.cusTable').children('tr'));
     if($('#cusT div').attr('class').indexOf('layui-form-checked') != -1){
     $('.getCusT tbody').children('tr').remove();  //开始默认删除里面的所有数据
     var erarr = [],
     trs= $('.cusTable').children('tr');  //遍历tr的个数
     for(var i=0;i<trs.length;i++){
     var tds = trs[i];
     var arr =[];
     for(var j=1;j<$(tds).children('td').length;j++){
     arr.push($(tds).children('td')[j].innerText)
     }
     erarr.push(arr);
     }
     //console.log(erarr);
     $('.getCusT').css('display','table');  //显示table开始显示
     for(var i=0;i<erarr.length;i++){
     //console.log($($('.cusTable tr')[i]).attr('cusId'));
     var html = '<tr getCusId="'+ $($('.cusTable tr')[i]).attr('cusId') +'">';
     for(var j=0;j<erarr[i].length;j++){
     // console.log(erarr[i][j])
     html += '<td>'+ erarr[i][j] +'</td>';
     }
     html += '</tr>'
     $('.getCusT tbody').append(html);
     }
     }else {
     $('.getCusT tbody').children('tr').remove();
     $('.getCusT').css('display','none');
     }
     })

     // 监测所点击的tr增加到相应的表格里面去
     $('.hzTable').on('click','.layui-form-checkbox',function () {
     //console.log($(this).parents('tr').attr('hzId'));
     if($(this).attr('class').indexOf('layui-form-checked') != -1){
     var dom = $(this).parents('tr').clone(true)  //克隆元素
     //console.log(dom.children('td')[1].innerText);
     var arr = [];     //获取所有字节
     for(var i=1;i<dom.children('td').length;i++){
     arr.push(dom.children('td')[i].innerText)
     }
     //console.log(arr);
     $('.getHzT').css('display','table');  //显示table开始显示
     // $('.getHzT tbody')
     var html1 = '<tr getHzId="'+ $(this).parents('tr').attr('hzId') +'">';  //显示的table填充数据
     for(var i=0;i<arr.length;i++){
     html1 += '<td>'+ arr[i] +'</td>';
     }
     html1 += '</tr>'
     $('.getHzT tbody').append(html1);
     }else{
     //选中了，变为没有选中
     if($('.getHzT tbody tr').length > 0){
     $('tr[getHzId="' + $(this).parents('tr').attr('hzId') + '"]').remove();
     //console.log($('.getHzT tbody tr').length);
     if($('.getHzT tbody tr').length == 0){  //当删掉所有的tr时候，则隐藏table
     $('.getHzT').css('display','none');
     }
     }
     }
     })

     //点击全选
     $('#hzT .all').click(function () {
     //console.log($('.cusTable').children('tr'));
     if($('#hzT div').attr('class').indexOf('layui-form-checked') != -1){
     $('.getHzT tbody').children('tr').remove();  //开始默认删除里面的所有数据
     var erarr = [],
     trs= $('.hzTable').children('tr');  //遍历tr的个数
     for(var i=0;i<trs.length;i++){
     var tds = trs[i];
     var arr =[];
     for(var j=1;j<$(tds).children('td').length;j++){
     arr.push($(tds).children('td')[j].innerText)
     }
     erarr.push(arr);
     }
     //console.log(erarr);
     $('.getHzT').css('display','table');  //显示table开始显示
     for(var i=0;i<erarr.length;i++){
     //console.log($($('.cusTable tr')[i]).attr('cusId'));
     var html = '<tr getHzId="'+ $($('.hzTable tr')[i]).attr('hzId') +'">';
     for(var j=0;j<erarr[i].length;j++){
     // console.log(erarr[i][j])
     html += '<td>'+ erarr[i][j] +'</td>';
     }
     html += '</tr>'
     $('.getHzT tbody').append(html);
     }
     }else {
     $('.getHzT tbody').children('tr').remove();
     $('.getHzT').css('display','none');
     }
     })*/

    //保存  草稿
    $('.save').click(function () {
        $('.save').attr('disabled',true);
        clearTimeout(time);
        time=setTimeout(function () {
            $('.save').attr('disabled',false);
        },2500);
        getAllId();
        checkNull();
        console.log(flag);
        if (flag == 1) {
            var obj = 1;
            apinNewDailySave(obj);
            // console.log(res);
            // layer.msg('存为草稿',{time:1000},function () {
            //     window.location.href = './index.html'
            // })

        }
    })

    //提交  发布
    $('.present').click(function () {
        checkNull();
        if (flag == 1) {
            layer.confirm(
                '<em style="color:red; font-weight: 700">确认发布日报吗？</em>',
                function () {
                    var obj = 2;
                    apinNewDailyPresent(obj);
                },
                function () {
                    layer.closeAll();
                })
        }

    })

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
            var flagsEL = true;
            $.each($('.'+selector2+' .layui-form-checkbox'), function (i, item) {
                if (!$(item).hasClass('layui-form-checked')) {
                    flagsEL = false;  //有元素没有选上
                }
            });
            if (!flagsEL) {
                $('#'+selector1+' .all .layui-form-checkbox').removeClass('layui-form-checked')
            } else {
                $('#'+selector1+' .all .layui-form-checkbox').addClass('layui-form-checked')
            }
        });
    }

    //获取所有所有选择的id(旧版的)
    /*function getAllId() {
     var arrId = [];
     for(var i=0;i<$('.getBusT tbody').children('tr').length;i++){
     arrId.push({
     visitlogid: $($('.getBusT tbody').children('tr')[i]).attr('getbusid')
     })
     }
     for(var i=0;i<$('.getCusT tbody').children('tr').length;i++){
     arrId.push({
     visitlogid: $($('.getCusT tbody').children('tr')[i]).attr('getcusid')
     })
     }
     for(var i=0;i<$('.getHzT tbody').children('tr').length;i++){
     arrId.push({
     visitlogid: $($('.getHzT tbody').children('tr')[i]).attr('gethzid')
     })
     }
     return arrId;
     }*/

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

    //初始化一个渲染一个列表
    function init() {
        $('#zj').val(crmMsg.userNamecn);  //填写人
        $('#department').val(crmMsg.department)
        apiGetFollow();
        checkboxAll($('#busT').attr('id'),$('.busTable').attr('class'));
        checkboxAll($('#cusT').attr('id'),$('.cusTable').attr('class'));
        checkboxAll($('#hzT').attr('id'),$('.hzTable').attr('class'));
    }

    //初始化加载的参数
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
            console.log(res);
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

    //新增日报接口（发布）
    function apinNewDailyPresent(obj) {
        var data = {
            type: 'post',
            url: 'pc/daily/create',
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
    //新增日报接口（草稿）
    function apinNewDailySave(obj) {
        var data = {
            type: 'post',
            url: 'pc/daily/create',
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

    //新增日报需要的参数
    function params(obj) {
        var params = {
            inputdate: $('#xybh').val(),             //填写日期
            inputperson: crmMsg.userId,              //填写人的id
            department: $('.department').val(),      //部门
            dailycontent: $('.dailyContent').val(),  //日报内容
            createuser: crmMsg.userId,               //创建人的id
            dailystate: obj,
            dailydate: getDateByDay(new Date().getTime()), //当前时间

            visitloglist: getAllId()
        }
        return params;
    }
})




















