/**
 * Created by admin on 2017/10/15.
 */
$(function () {
    var dailyid = JSON.parse(sessionStorage.getItem('personalCenter')).id;
    Ajax({
        type: 'get',
        url: 'pc/daily/finddetail?dailyid='+dailyid+'&timestamp='+ new Date().getTime()
    }).then(function (res) {
        console.log(res);
        $('.count-title').html(res.department);  //部门
        $('.dailyContent').html(res.dailycontent);  //日报内容
        $('.dailyDate').html(getDateByDay(res.inputdate))  //日报填写日期
        //客户信息
        if(res.visitloglistCustomer == null && res.visitloglistProject == null && res.visitloglistHezi == null){
            $('.bottom').css('display','none')
        }else {
            if(res.visitloglistCustomer != null){
                if(res.visitloglistCustomer.length > 0){
                    $('.cHead').css('display','block');
                    var cusHtml = '', cusl = res.visitloglistCustomer.length;
                    for(var i=0;i < cusl;i++){
                        cusHtml += '<tr>';
                        cusHtml += '<td>'+ res.visitloglistCustomer[i].customername +'</td>';
                        cusHtml += '<td>'+ res.visitloglistCustomer[i].followup +'</td>';
                        cusHtml += '<td>'+ getDateByDay(res.visitloglistCustomer[i].visitdate) +'</td>';
                        cusHtml += '<td>'+ res.visitloglistCustomer[i].visittarget +'</td>';
                        cusHtml += '<td>'+ res.visitloglistCustomer[i].visitcontent +'</td>';
                        cusHtml += '<td>'+ res.visitloglistCustomer[i].nextvisitplan +'</td>';
                        cusHtml += '</tr>';
                    }
                    $('.cusT tbody').html(cusHtml)
                }
            }
            //商机信息
            if(res.visitloglistProject != null){
                if(res.visitloglistProject.length > 0){
                    $('.bHead').css('display','block');
                    var busHtml = '', busl = res.visitloglistProject.length;
                    for(var i=0;i < busl;i++){
                        busHtml += '<tr>';
                        busHtml += '<td>'+ res.visitloglistProject[i].projectname +'</td>';
                        busHtml += '<td>'+ res.visitloglistProject[i].linkmanname +'</td>';
                        busHtml += '<td>'+ res.visitloglistProject[i].followup +'</td>';
                        busHtml += '<td>'+ res.visitloglistProject[i].visittarget +'</td>';
                        busHtml += '<td>'+ res.visitloglistProject[i].visitcontent +'</td>';
                        busHtml += '<td>'+ res.visitloglistProject[i].nextvisitplan +'</td>';
                        busHtml += '</tr>';
                    }
                    $('.busT tbody').html(busHtml)
                }
            }
            //合资公司信息
            if(res.visitloglistHezi != null){
                if(res.visitloglistHezi.length > 0){
                    $('.hHead').css('display','block');
                    var hzHtml = '', hzl = res.visitloglistHezi.length;
                    for(var i=0;i < hzl;i++){
                        hzHtml += '<tr>';
                        hzHtml += '<td>'+ res.visitloglistHezi[i].coentreprisename +'</td>';
                        hzHtml += '<td>'+ res.visitloglistHezi[i].linkmanname +'</td>';
                        hzHtml += '<td>'+ res.visitloglistHezi[i].followup +'</td>';
                        hzHtml += '<td>'+ res.visitloglistHezi[i].visittarget +'</td>';
                        hzHtml += '<td>'+ res.visitloglistHezi[i].visitcontent +'</td>';
                        hzHtml += '<td>'+ res.visitloglistHezi[i].nextvisitplan +'</td>';
                        hzHtml += '</tr>';
                    }
                    $('.hzT tbody').html(hzHtml)
                }
            }
        }
    })
})