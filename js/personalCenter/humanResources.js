/**
 * Created by admin on 2017/11/10.
 */
$(function () {








    function apiGetSelect() {
        Ajax({
            type: 'get',
            url: 'pc/weekly/common/editResponse?userid='+ crmMsg.userId
        }).then(function (res) {
            console.log(res);
        })
    }
    apiGetSelect();

})
