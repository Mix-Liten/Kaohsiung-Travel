const areaSelect = document.querySelector("#areaSelect");
const hotArea = document.querySelector("#hotArea");
const noSelect = document.querySelector("#noSelect");
const areaTitle = document.querySelector("#areaTitle");
const areaCard = document.querySelector("#areaCard");
const setModal = document.querySelector("#setModal");

//取得資料
const getData = function () {
    const data = $.ajax({
        url: "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97",
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function () {
            //在資料讀入後增加地區選項
            addOption();
            console.log("Api資料載入成功～");
        },
        error: function () {
            alert("出現錯誤！！ 請嘗試重新載入頁面");
        }
    });
    return data;
}();

// 在Option選擇地區
$(areaSelect).change(function (e) {
    //讀取目標值
    let area = e.target.value;

    //防呆 避免選擇預設項目
    if (area == "re") {
        alert("請選擇想知道的旅遊區域");
        return;
    }

    //清空資料
    $(areaCard).empty();

    // 隱藏無選擇內容
    $(noSelect).hide();

    // 插入地區標題
    $(areaTitle).text(area);

    //選取符合的資料並插入資料卡
    selectOptionArea(e);
});

//點擊熱門地區
$(hotArea).click(function (e) {
    //讀取目標值
    let area = e.target.innerHTML;

    //防呆 避免點到ul
    if (e.target.nodeName == "UL") {
        return
    }

    //清空資料
    $(areaCard).empty();

    // 隱藏無選擇內容
    $(noSelect).hide();

    // 插入地區標題
    $(areaTitle).text(area);

    //選取符合的資料並插入資料卡
    selectOptionArea(e);
})

//增加地區選項
const addOption = function (e) {
    const records = getData.responseJSON.result.records;

    // 篩選地區
    let areaOption = [];
    for (let i = 0; i < records.length; i++) {
        areaOption[i] = '<option value="' + records[i].Zone + '">' + records[i].Zone + '</option>';
    };
    let finalareaOption = [...(new Set(areaOption))];
    $("#areaSelect").append(finalareaOption);
};

//根據地區選項篩選符合的資料 並插入資料卡
const selectOptionArea = function (e) {
    const records = getData.responseJSON.result.records;

    //讀取目標值 (如果取不到value值 就取innerHTML)
    let area = e.target.value || e.target.innerHTML;

    let card = "";
    let modal = "";
    for (let i = 0; i < records.length; i++) {
        if (area == records[i].Zone) {
            card += '<div class="col-sm-6"><div class="card mb-4"><div class="card-header" style="background-image: url({{Picture}})"></div><div class="card-body"><h3 class="card-title">{{Name}}</h3><ul class="list-group list-group-flush"><li class="list-group-item"><span><img src="images/icons_clock.png" alt="icons_clock"></span>{{Opentime}}</li><li class="list-group-item"><span><img src="images/icons_pin.png" alt="icons_pin"></span>{{Address}}&nbsp;&nbsp;<img src="images/icons_map.png" alt="icons_map" data-toggle="modal" data-target="#map-{{mapNum}}"></li><li class="list-group-item"><span><img src="images/icons_phone.png" alt="icons_phone"></span>{{Telphone}}<button data-toggle="modal" data-target="#detail-{{detailNum}}"><img src="images/icons_tag.png" alt="icons_tag">詳細資訊</button></li></ul></div></div></div>';

            card = card.replace("{{Picture}}", records[i].Picture1)
                .replace("{{Name}}", records[i].Name)
                .replace("{{Opentime}}", records[i].Opentime)
                .replace("{{Address}}", records[i].Add)
                .replace("{{Telphone}}", records[i].Tel)
                .replace("{{detailNum}}", i)
                .replace("{{mapNum}}", i);

            modal += '<div class="modal fade" id="detail-{{detailNum}}" tabindex="-1" role="dialog" aria-labelledby="Detailed information" aria-hidden="true"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title mx-auto h2 font-weight-bold">{{Name}}</h5><button type="button" class="close mx-0" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><img src="{{Picture}}" height="auto" width="85%"><ul class="list-group"><li class="list-group-item">開放時間： {{Opentime}}</li><li class="list-group-item">地址： {{Address}}</li><li class="list-group-item">電話： {{Telphone}}</li><li class="list-group-item text-justify">簡介： {{Description}}</li></ul></div><div class="modal-footer mx-auto"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div></div><div class="modal fade" id="map-{{mapNum}}" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div id="map-here" style="height: 50vh"><iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDwhC0-F6e82O3qhk4i9oKOTwR51tkxW6E&q={{where}}" allowfullscreen></iframe></div></div></div></div>';

            modal = modal.replace("{{detailNum}}", i)
                .replace("{{mapNum}}", i)
                .replace("{{Name}}", records[i].Name)
                .replace("{{Picture}}", records[i].Picture1)
                .replace("{{Opentime}}", records[i].Opentime)
                .replace("{{Address}}", records[i].Add)
                .replace("{{Telphone}}", records[i].Tel)
                .replace("{{Description}}", records[i].Description)
                .replace("{{where}}", records[i].Add)
        }
    };
    //插入資料卡
    $(areaCard).append(card);
    $(setModal).append(modal);
};

//goTop
$("#gotop").click(function () {
    $("html,body").animate({
        scrollTop: 0
    });
    return false;
});
$("#gotop").hide(); //預設隱藏
$(window).scroll(function () { //至指定高度時淡入淡出
    let windowHeight = $(window).scrollTop();
    // console.log(windowHeight)
    if (windowHeight >= 520) {
        $("#gotop").fadeIn();
    } else {
        $("#gotop").fadeOut();
    }
});