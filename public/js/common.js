_common = {
    isNotEmpty : function (_str) {
        obj = String(_str);
        if(obj == null || obj == undefined) {
            return false;
        } else if (typeof(obj) == "string") {
            obj = obj.replace(/ /gi, '');
            if(obj == 'null' || obj == 'undefined' || obj == '') {
                return false;
            }else{
                return true;
            }
        } else {
            return true;
        }
    }
    , isEmpty : function (_str) {
        return !_common.isNotEmpty(_str);
    }
    , nvl : function(_str, defaultVal) {
        defaultVal = defaultVal ? defaultVal : "";
        if(_str == null) {
            _str = defaultVal;
        }else if(_str == undefined) {
            _str = defaultVal;
        }else if(_str == NaN) {
            _str = defaultVal;
        }

        return _str;
    }
};
_common.checkLogin = function() {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    var isLogined = $.ajax({
        url : "/isLogined"
        , cache : false
        , type: "POST"
        , dataType : "json"
        , async: false
        , contentType : 'application/json'
        , beforeSend : function (xhr) {
            xhr.setRequestHeader(header, token);
        }
    });
    if(isLogined.status == 200){
        if(isLogined.responseJSON.success) {
            return true;
        } else {
            if( confirm("로그아웃되었습니다.\n지금 다시 로그인하시겠습니까?")){
                window.location = "/login";
            }
        }
    } else {
        alert("서버로부터 응답이 올바르지 않습니다. 다시 시도해주세요.");
        return false;
    }


}
_common.template = {
    parseObject : function (templateId, data) {
        var tmpl = $("#"+templateId).text();
        if(data != null) {
            try {
                Object.keys(data).forEach(function(k){
                    tmpl = tmpl.replace(new RegExp("#"+k+"#", "gi"), data[k]);
                });
            } catch (E) {
                log.error(E);
            }
        }
        return tmpl;
    }, parseList : function (templateId, list) {
        var r = [];
        if(list != null && list.length > 0) {
            list.forEach(function(o){
                r.push(_common.template.parseObject(templateId, o));
            });
        }
        return r;
    }
}

_common.ajax = {
    isCheckLogin : true
    , asyncJSON2 : function(param) {
        if(param && param != null && _common.isNotEmpty(param)) {
            param.isLoading = param.isLoading == false ? false : true;
            param.isCheckLogin = param.isCheckLogin == false ? false : true;
            param.contentType = _common.nvl(param.contentType, "application/x-www-form-urlencoded;charset=UTF-8");
            _common.ajax.asyncJSON(
                param.url
                , param.param
                , param.returnFunction
                , param.errorFunction
                , param.isLoading
                , param.contentType
                , param.isCheckLogin
            );
        }else{
            log.error("_common.ajax.asyncJSON2(), your parameter is wrong!");
        }
    }
    , asyncJSON : function(rurl, param, returnFunction, errorFunction, isLoading, contentType, isCheckLogin) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        if(isCheckLogin != true && isCheckLogin != false) {
            isCheckLogin = _common.ajax.isCheckLogin;
        }
        if(!isCheckLogin) {
            log.info("skip check logined");
        }else{
            if(_common.checkLogin() == false) {
                log.info("need login");
                return false;
            }else{
                log.info("logined");
            }
        }
        contentType = contentType == null ? "application/x-www-form-urlencoded;charset=UTF-8" : contentType;
        isLoading = isLoading == false ? false : true;
        $.ajax({
            url : rurl
            , async : true
            , cache : false
            , data : param
            , type: "POST"
            , dataType : "json"
            , contentType : contentType
            , success : function (retv) {
                if($.type(returnFunction) == "function") {
                    returnFunction(retv);
                }
            }, error : function (request,status,error) {
                if($("#div_loading").hasClass("on")) {
                    $("#div_loading").removeClass("on");
                }

                if($.type(errorFunction) == "function") {
                    errorFunction(param);
                }else{
                    try {
                        //_common.msg(JSON.stringify(err));
                        log.info("request.status : " + request.status);
                        log.info("request.responseText : " + request.responseText);
                        log.info("request.responseText : " + request.error);
                    } catch (e) {
                        log.error(e);
                    }
                }
            }, beforeSend : function (xhr) {
                xhr.setRequestHeader(header, token);
                // if(isLoading && typeof(loadingDiv) == "function"){
                //     loadingDiv(true);
                // }
            }, complete : function () {
                // if(isLoading && typeof(loadingDiv) == "function"){
                //     loadingDiv(false);
                // }
            }
        });
    }
    , send : function(option) {
        /******************************************************************************
         * var option = new Object();
         * option.url               :
         * option.data              : Object / Json Object / Query String
         * option.async             : boolean type(default:true)
         * option.contentType       : (default:application/x-www-form-urlencoded; charset=UTF-8)
         * option.successCallback   : function type
         * option.failCallback      : function type
         * option.callback          : function type
         * option.callbackParam     : Object(Json,Array,String...)
         * option.checkLogin        : boolean type(default:false)
         * option.showDimm          : boolean type(default:true)
         */
        if(_common.isEmpty(option)){
            console.error("option is null");
            return false;
        }
        if(_common.isEmpty(option.url)) {
            console.error("option is null or option.url is null");
            return false;
        }
        if(_common.isNotEmpty(option.async) && typeof option.async != "boolean"){
            console.error("option.async is not boolean");
            return false;
        }
        if(_common.isEmpty(option.async)){
            option.async = true;
        }
        if(_common.isNotEmpty(option.successCallback) && typeof option.successCallback != "function"){
            console.error("option.successCallback is not function");
        }
        if(_common.isNotEmpty(option.failCallback) && typeof option.failCallback != "function"){
            console.error("option.failCallback is not function");
        }
        if(_common.isNotEmpty(option.callback) && typeof option.callback != "function"){
            console.error("option.callback is not function");
        }
        let isShowDimm = (option.showDimm == false) ? false : true;

        let ajaxParam = new Object();
        ajaxParam.url = option.url;
        ajaxParam.data = option.data;
        ajaxParam.async = option.async;
        ajaxParam.method = "POST";
        ajaxParam.cache = false;
        ajaxParam.dataType = "json";

        if(_common.isNotEmpty(option.contentType)){
            ajaxParam.contentType = option.contentType;
        }

        ajaxParam.beforeSend = function(xhr) {
            if(ajaxParam.async && isShowDimm) {
                // loadingDiv(true);
            }

            let csrfHeader = $("meta[name='_csrf_header']").attr("content");
            let csrfToken = $("meta[name='_csrf']").attr("content");
            xhr.setRequestHeader(csrfHeader, csrfToken);
        };
        ajaxParam.success = function(data) {
            if(_common.isNotEmpty(option.successCallback)) {
                if(_common.isNotEmpty(option.callbackParam)) {
                    option.successCallback(data, option.callbackParam);
                } else {
                    option.successCallback(data);
                }
            }
        };
        ajaxParam.error = function(xhr) {
            if(_common.isNotEmpty(option.failCallback)) {
                if(_common.isNotEmpty(option.callbackParam)) {
                    option.failCallback(xhr, option.callbackParam);
                } else {
                    option.failCallback(xhr);
                }
            } else {
                let errorMsg = "처리중 오류가 발생하였습니다.";
                let errorCode;
                if (xhr) {
                    if (xhr.status === 400) {
                        errorCode = "400";
                    } else if (xhr.status === 401) {
                        errorCode = "401";
                    } else if (xhr.status === 403) {
                        errorCode = "403";
                    } else if (xhr.status === 404) {
                        errorCode = "404";
                    } else if (xhr.status === 500) {
                        errorCode = "500";
                    } else if (xhr.status === 503) {
                        errorCode = "503";
                    } else {
                        errorCode = "ETC";
                    }
                } else {
                    errorCode = "ETC";
                }
                alert(errorMsg +"["+errorCode+"]");
            }
        };
        ajaxParam.complete = function(xhr) {
            if(isShowDimm) {
                // loadingDiv(false);
            }

            if(_common.isNotEmpty(option.callback)) {
                if(_common.isNotEmpty(option.callbackParam)) {
                    option.callback(xhr, option.callbackParam);
                } else {
                    option.callback(xhr);
                }
            }
        };

        return $.ajax(ajaxParam);
    }
}
_common.page = {
    setListPaging : function (pageData) {
        if (pageData.pageDiv == null) {
            pageData.pageDiv = ".page-container";
        }
        let pageDiv = $(pageData.pageDiv);
        pageDiv.empty();
        if (pageData.totalCount > pageData.perPage) {
            if(pageData.nowPageGroup == 1) {
                pageDiv.append(`<a href="javascript:void(0);" class="page prev disabled"><i class="icon-prev"></i> Prev</a>`);
            } else {
                pageDiv.append(`<a href="javascript:paging(${pageData.startPage - 1});" class="page prev"><i class="icon-prev"></i> Prev</a>`);
            }
            let pageGroupSize = pageData.pageGroupSize;
            if ( pageData.pageGroupCount == pageData.nowPageGroup) {
                pageGroupSize = pageData.lastPageIndex - ((pageData.pageGroupCount -1)* pageData.pageGroupSize);
            }
            for (let i=0; i < pageGroupSize; i++) {
                let num = i + ((pageData.nowPageGroup-1) * pageData.pageGroupSize)+1;
                pageDiv.append('<a href="javascript:paging('+num+');">'+num+'</a>');
                if (num == pageData.pageIndex) {
                    let currentPage = pageDiv.children()[i + 1];
                    $(currentPage).addClass("on");
                }
            }
            if(pageData.nowPageGroup >= pageData.pageGroupCount) {
                pageDiv.append(`<a href="javascript:void(0);" class="page next disabled" style="cursor:default">Next <i class="icon-next"></i></a>`);
            } else {
                pageDiv.append(`<a href="javascript:paging('${pageData.endPage + 1}');" class="page-next">Next <i class="icon-next"></i></a>`);
            }
        }
    }
    , setPaging : function (pageData) {
        if (pageData.pageDiv == null) {
            pageData.pageDiv = ".page-container";
        }

        let pageDiv = $(pageData.pageDiv);

        pageDiv.empty();
        if (pageData.totalCount > pageData.perPage) {
            // if(pageData.nowPageGroup == 1) {
            //     pageDiv.append(`<button type="button" class="btn-prevPage prev" style="cursor:default"><span class="blind">이전페이지</span></button>`);
            // } else {
            //     pageDiv.append(`<button onclick="javascript:paging(${pageData.startPage - 1});" class="btn-prevPage"><span class="blind">이전페이지</span></button>`);
            // }
            if(pageData.pageIndex == 1) {
                pageDiv.append(`<button type="button" onclick="javascript:void(0);" class="prev btn-prev" style="cursor:default"><span class="blind">이전</span></button>`);
            } else {
                pageDiv.append(`<button onclick="javascript:paging(${pageData.pageIndex - 1});" class="prev btn-prev"><span class="blind">이전</span></button>`);
            }
            let pageGroupSize = pageData.pageGroupSize;
            if ( pageData.pageGroupCount == pageData.nowPageGroup) {
                pageGroupSize = pageData.lastPageIndex - ((pageData.pageGroupCount -1)* pageData.pageGroupSize);
            }
            for (let i=0; i < pageGroupSize; i++) {
                let num = i + ((pageData.nowPageGroup-1) * pageData.pageGroupSize)+1;
                pageDiv.append('<button type="button" class="paging-btn" onclick="javascript:paging('+num+');">'+num+'</button>');
                if (num == pageData.pageIndex) {
                    let currentPage = pageDiv.children()[i + 1];
                    // let currentPage = pageDiv.children()[i + 2];
                    $(currentPage).addClass("on");
                }
            }
            if(pageData.pageIndex >= pageData.lastPageIndex) {
                pageDiv.append(`<button type="button" class="next btn-next" style="cursor:default"><span class="blind">다음</span></button>`);
            } else {
                pageDiv.append(`<button type="button" onclick="javascript:paging('${pageData.pageIndex + 1}');" class="next btn-next"><span class="blind">다음</span></button>`);
            }
            // if (pageData.nowPageGroup >= pageData.pageGroupCount) {
            //     pageDiv.append(`<button class="next btn-nextPage" style="cursor:default"><span class="blind">다음페이지</span></button>`);
            // } else {
            //     pageDiv.append(`<button onclick="javascript:paging(${pageData.endPage + 1});" class="next btn-nextPage"><span class="blind">다음페이지</span></button>`);
            // }
        }
    }
}
HashMap = function(){
    this.map = new Array();
};
HashMap.prototype = {
    getAllDataToList : function() {
        let list = [];
        for(i in this.map){
            list.push(this.map[i]);
        }
        return list;
    },
    length : function() {
        return this.keySet().length;
    },
    createKey : function() {
        return moment().format('YYYYMMDDHHmmssSSS');
    },
    getLastKey : function() {
        let keys = this.keySet();
        return keys[keys.length - 1];
    },
    getLastData : function() {
        let keys = this.keySet();
        return this.get(keys[keys.length - 1]);
    },
    put : function(key, value){
        key = key == null ? this.createKey() : key;
        key += "";
        this.map[key] = value;
    },
    get : function(key){
        key += "";
        return this.map[key];
    },
    getAll : function(){
        return this.map;
    },
    clear : function(){
        this.map = new Array();
    },
    isEmpty : function(){
        return (this.map.size() == 0);
    },
    remove : function(key){
        key += "";
        delete this.map[key];
    },
    toString : function(){
        var temp = '';
        for(i in this.map){
            temp = temp + ',' + i + ':' +  this.map[i];
        }
        temp = temp.replace(',','');
        return temp;
    },
    keySet : function(){
        var keys = new Array();
        for(i in this.map){
            keys.push(i);
        }
        return keys;
    }
};
_common.cookie = {
    get : function (key, defaultValue) {
        let nameEQ = key + "=";
        let ca = document.cookie.split(';');
        let val = null;
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) val = c.substring(nameEQ.length,c.length);
        }
        if(val == null || val == "null" || val == "") {
            val = defaultValue;
        }
        return val;
    }, set : function (key, value) {
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + (365*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = key + "=" + value + expires + "; path=/";
    }
    , getNumber : function (key, value) {
        let val = _common.cookie.get(key);
        if(val == null) {
            return value;
        }else {
            return Number.parseFloat(val);
        }
    }
    , remove : function(key) {
        document.cookie = key + "=; expires=0; path=/";
    }
};