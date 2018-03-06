/**
 * Created by Limbo on 2017/10/13.
 */
$(function () {
    //调用时间控件
    layui.use('laydate',function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#beginvisitdate'
        });
        laydate.render({
            elem: '#endvisitdate'
        })
    });

    function ds() {
        let params={
            userId:crmMsg.userId,
            Isall:'',
            rows:2,
            page:1,
            searchname:'',
            searchtype:'',
            srctype:'',
            sortname:'',
            sortway:'',
            customertype:'',
            customerprovincename:'',
            customercityname:'',
            customerdistrictname:'',
            beginvisitdate:'',
            endvisitdate:'',
            _time:new Date().getTime(),
        };
        return params;
    }

    //获取合资公司信息接口
    function apiPCfindJoinVentureListByUserid(obj) {

        var params=ds();
        if(!obj){
            obj={};
            obj.limit=params.rows;
            obj.curr=params.page;
        }
        params.rows=obj.limit;
        params.page=obj.curr;
        let data={
            type:'get',
            url:'crmcustomer/PCfindCrmcustomerListByUserid?userId='+params.userId+'&Isall'+params.Isall+'&rows='+params.rows+'&page='+params.page+'&searchname='+params.searchname
            +'&searchtype='+params.searchtype+'&srctype='+params.srctype+'&sortname='+params.sortname+'&sortway='+params.sortway+'&customertype='+params.customertype+'&customerprovincename='+params.customerprovincename
            +'&customercityname='+params.customercityname+'&customerdistrictname='+params.customerdistrictname+'&beginvisitdate='+params.beginvisitdate+'&endvisitdate='+params.endvisitdate+'&_time='+params._time,
        };
        Ajax(data).then(function (data) {
            // console.log(data);
            $('.tab-customer tbody').html('');

            let docfrag = document.createDocumentFragment();
            for (let i = 0; i < data.rows.length; i++) {
                let trs = document.createElement('tr');
                let html='';
                html += '<td><div class="layui-form-checkbox layui-unselect" lay-skin="primary"><i class="layui-icon"></i></div></td>';
                html += '<td>'+data.rows[i].customername+'</td>';
                html += '<td>'+data.rows[i].namelist+'</td>';
                html += '<td>'+data.rows[i].srctypename+'</td>';
                html += '<td>'+data.rows[i].customerprovincename+data.rows[i].customercityname+data.rows[i].customerdistrictname+'</td>';
                html += '<td>'+data.rows[i].customertypename+'</td>';
                html += '<td>'+getDate(data.rows[i].createdate)+'</td>';
                html += '<td>'+(data.rows[i].lastvisitdate?data.rows[i].lastvisitdate:'暂无')+'</td>';
                html += '<td>'+'跟进'+'</td>';
                trs.innerHTML=html;
                docfrag.appendChild(trs);
            }
            $('.tab-customer tbody').append(docfrag);
            pager(obj,data.total,[1,2,3,4,5],apiPCfindCrmcustomerListByUserid,$('.pager'));

        })
    }

    apiPCfindCrmcustomerListByUserid();
    select();




    //弹层
    //禁用弹窗
    $("#btn").click(function () {
        layer.open({
            type:1,
            title: '禁用',
            content: $("#div"),
            area:['470px',"210px"]
        });
    });
    //合并客户弹窗
    $("#btn1").click(function () {
        layer.open({
            type:1,
            title: '合并客户',
            content: $("#div1"),
            area:['775px',"405px"]
        });
    });
    //转移客户弹窗
    $("#btn2").click(function () {
        layer.open({
            type:1,
            title: '转移客户',
            content: $("#div2"),
            area:['388px',"456px"]
        });
    });
    //转移客户2弹窗
    $("#btn3").click(function () {
        layer.open({
            type:1,
            title: '转移客户',
            content: $("#div3"),
            area:['388px',"444px"]
        });
    });
    //转移客户弹窗的下拉
    var a=1;
    $(".cliz .xiala").click(function(){
        var display = $(this).parent().siblings().css("display")
        if(display=="block"){
            $(this).find("img").css({"transform":"rotate(90deg)","transition":"all .3s"})
            display = "none";
        }
        else if(display=="none"){
            $(this).find("img").css({"transform":"rotate(0deg)","transition":"all .3s"});
            display = "block";
        }
        console.log(display)
        $(this).parent().siblings().slideToggle();
    });
    //筛选弹窗
    $('.advanced-filter').click(function () {
        apiCustomertype();
        layer.open({
            type:1,
            title:'高级筛选',
            content: $('#advanced-filter1'),
            area:['900px','320px'],
        })
    })
});