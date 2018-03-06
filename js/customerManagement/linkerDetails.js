/**
 * Created by Limbo on 2017/10/20.
 */
$(function () {

    //联系人详情接口
    function apicrmcustomerlinkman() {
        let data = {
            type: 'get',
            url: 'crmcustomerlinkman/view?id=' + getSession('customerMsg').linkerId + '&_time=' + new Date().getTime(),
        };
        Ajax(data).then(function (data) {
            // console.log(data);
            if (data.crmcustomerlinkman.isedit == 0) {
                $('.edit').css('display', 'none');
            }
            $('#linkmanname').html(data.crmcustomerlinkman.linkmanname);
            $('#customername').html(data.crmcustomerlinkman.customername);
            $('#customername').attr('name', data.crmcustomerlinkman.customerid);
            $('#linkmandepartmnet').html(notNull(data.crmcustomerlinkman.linkmandepartmnet));
            $('#linkmanposition').html(data.crmcustomerlinkman.linkmanposition);
            $('#linkmanemail').html(notNull(data.crmcustomerlinkman.linkmanemail));
            $('#linkmanlevel').html(data.crmcustomerlinkman.linkmanlevel);
            $('#linkmanwx').html(notNull(data.crmcustomerlinkman.linkmanwx));
            $('#linkmanmobile').html(data.crmcustomerlinkman.linkmanmobile);
            $('#linkmanphone').html(notNull(data.crmcustomerlinkman.linkmanphone));
            $('#linkmanBqDesc').html(notNull(data.crmcustomerlinkman.linkmandesc));
            //其他信息
            $('#creatorname').html(data.crmcustomerlinkman.creatorname);
            $('#creatordate').html(getDateByDay(data.crmcustomerlinkman.creatordate));
            $('#updatedate').html(getDateByDay(data.crmcustomerlinkman.updatedate));

            toCustomer();
            toEdit();
        })
    }

    //跳转客户详情
    function toCustomer() {
        $('#customername').click(function () {
            pushSession('customerMsg', {
                id: $(this).attr('name'),
                name: $(this).text(),
                commFlag: '0',
                tabFlag: '0',
            });
            window.location.href = 'customerDetails.html';
        })
    }

    //跳转编辑
    function toEdit() {
        $('.edit').click(function () {
            pushSession('customerMsg', {
                linkerUrl: 14,//0.新建，1.客户，2.商机，3.合资公司
                linkerEdit: '11',
            });
            window.location.href = 'newLinker.html';
        })
    }

    apicrmcustomerlinkman()

});