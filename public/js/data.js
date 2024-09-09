let config = {}

config.apiData = [
    {
        action: "로그인"
        , url: "http://15.165.166.179:8082/login "
        , uri: "/login"
        , type: "POST"
        , authorization:false
        , requestData : [
                            {
                                key: "id"
                            ,   type: "string"
                            ,   require: true}, 
                            {
                                key: "password"
                            ,   type: "string"
                            ,   require: true}
    
        ]
    }, 
    {
        action: "장비조회"
        , url: "http://15.165.166.179:8082/getDeviceList "
        , uri: "/getDeviceList"
        , type: "POST"
        , authorization:true
        , requestData : [
                            {
                                key: "buildingId"
                            ,   type: "string"
                            ,   require: true}, 
                            {
                                key: "floorId"
                            ,   type: "string"
                            ,   require: true}, 
                            {
                                key: "zoneId"
                            ,   type: "string"
                            ,   require: true},
                            {
                                key: "deviceType"
                            ,   type: "string"
                            ,   require: true}
    
        ]
    },
    {
        action: "개별장비제어"
        , url: "http://15.165.166.179:8082/controlDevice "
        , uri: "/controlDevice"
        , type: "POST"
        , authorization:true
        , requestData : [
                            {
                                key: "buildingId"
                            ,   type: "string"
                            ,   require: true}, 
                            {
                                key: "floorId"
                            ,   type: "string"
                            ,   require: true}, 
                            {
                                key: "zoneId"
                            ,   type: "string"
                            ,   require: true}, 
                            {
                                key: "deviceStatus"
                            ,   type: "object"
                            ,   require: true
                            ,   parameter: [
                                {
                                    key: "power"
                                ,   type: "string"
                                ,   require: true}, 
                                {
                                    key: "mode"
                                ,   type: "string"
                                ,   require: true}, 
                                {
                                    key: "fanMode"
                                ,   type: "string"
                                ,   require: true}, 
                                {
                                    key: "setCoolingPoint"
                                ,   type: "string"
                                ,   require: true}, 
                            ]
                            }
    
        ]
    }
]
module.exports = config;