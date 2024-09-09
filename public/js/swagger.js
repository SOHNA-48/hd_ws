// const { url } = require("inspector");
// const { type } = require("os");

let page = {};
page.fn = {};
page.dom = {};
page.data = {};

page.data.areaJson = '';
page.data.deviceListJson = "";
page.data.controlDeviceJson = "";
page.data.controlDeviceTypeJson = "";
page.data.setLongTermJson = "";


page.data.deviceListJson = {
    "buildingId": "0502b5e8-07e9-43f0-8606-54182e72c18a"
    , "floorId": "63fc0fbf-b197-4320-92e2-a18657fd565a"
    , "zoneId": "c6a22e60-cec8-490f-ae8d-2b6f5bdd38fb"
    , "deviceType": "aircon"
    , "deviceStatus": {
        "power": "on"
        , "mode": null
        , "fanMode": null
        , "setCoolingPoint": null
    }
}

page.data.controlDeviceJson = {
    "buildingId": "0502b5e8-07e9-43f0-8606-54182e72c18a"
    , "floorId": "63fc0fbf-b197-4320-92e2-a18657fd565a"
    , "zoneId": "c6a22e60-cec8-490f-ae8d-2b6f5bdd38fb"
    , "deviceId": "ao3019sj3920s92029_aircon01"
    , "deviceStatus": {
        "power": "on"
        , "mode": "cooling"
        , "fanMode": "auto"
        , "setCoolingPoint": "17"
    }
}


page.data.controlDeviceTypeJson = {
    "buildingId": "0502b5e8-07e9-43f0-8606-54182e72c18a"
    , "floorId": "63fc0fbf-b197-4320-92e2-a18657fd565a"
    , "zoneId": "c6a22e60-cec8-490f-ae8d-2b6f5bdd38fb"
    , "deviceType": "aircon"
    , "deviceStatus": {
        "power": "on"
        , "mode": null
        , "fanMode": null
        , "setCoolingPoint": null
    }
}

page.data.setLongTermJson = {
    "buildingId": "0502b5e8-07e9-43f0-8606-54182e72c18a"
    , "floorId": "63fc0fbf-b197-4320-92e2-a18657fd565a"
    , "zoneId": "c6a22e60-cec8-490f-ae8d-2b6f5bdd38fb"
    , "meetId": "a7951f20-e45d-41ba-96c6-edb258fa732c"
    , "longTerm": "2"
}
page.fn.tryItOut = function (t) {
    console.log(t);
    let idx = $(t).attr("data-idx");
    let isRaw = $(t).attr("data-isRaw");
    let api = page.data.api.get(idx);
    console.log(idx, page.data.api.get(idx));

    let param = {};
    console.log(typeof(isRaw));
    if (isRaw == true) {
        param = $("#paramRaw_"+ idx).val();
        console.log("ddd")
    } else {
        console.log("TTTTT");
        api.requestData.forEach(function(reqData, i) {
            let key = reqData.key
            let value = $("#apiData_" + idx +"_"+ key).val();
            param[key] = value;
            
        })
    }
    
    data = {
        url : api.url
        , uri : api.uri
        , type : api.type
        , param : param
        , idx : idx
    }
    page.fn.sendApi(data);
}
page.fn.sendApi = function(data) {
    let contentType = _common.isEmpty(data.contentType) ? "application/json" : contentType;
    console.log(data.param)
    $.ajax({
        url: "/api"+ data.uri,  
        type: data.type,   
        contentType: 'application/json',  
        data: JSON.stringify(data.param), 
        success: function(response) {
            console.log('요청 성공:', response);
            $("#responseData_" + data.idx).text(JSON.stringify(response, null, 2))
        },
        error: function(xhr, status, error) {
            console.error('요청 실패:', error);
        }
    });
} 
page.fn.toggleAPIRequest = function(t) {
    let idx = $(t).attr("data-idx");
    if ($(t).text() == 'raw') {
        $("#btnTry_"+ idx).attr("data-isRaw",true);
        $(".parameters-raw[data-idx="+ idx + "]").show();
        $(".parameters-input[data-idx="+ idx + "]").hide();
    } else {
        console.log($("#btnTry_"+ idx));
        $("#btnTry_"+ idx).attr("data-isRaw",false);
        $(".parameters-raw[data-idx="+ idx + "]").hide();
        $(".parameters-input[data-idx="+ idx + "]").show();
    }
}

page.fn.test = function(data) {
    $.ajax({
        url: '/api/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          id: 'cleanware',
          password: 'cleanware!'
        }),
        success: function(response) {
          console.log('로그인 성공:', response);
        },
        error: function(xhr, status, error) {
          console.error('로그인 실패:', error);
        }
      });
};