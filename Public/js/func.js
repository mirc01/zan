$(function(){
    //展开右侧导航
    /*$('#right_nav').simpleSidebar({
        settings: {
            opener: '#open-right-nav',
            wrapper: '#body',
            animation: {
                duration: 500,
                easing: 'easeOutQuint'
            }
        },
        sidebar: {
            align: 'right',
            width: 500,
            closingLinks: 'a'
        }
    });*/

    $('.menu .link').click(function(){
        $(this).next('.sub_link').toggle().siblings('.sub_link').hide();
        var class_name = $(this).attr('class');
        if( class_name.indexOf('active') == -1 ) {
            $('.menu .link').removeClass('active');
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });

    //返回上一页
    $('.go-back').click(function(){
        if( $(this).attr('data-confirm') != '' && $(this).attr('data-confirm') != undefined ) {
            var zh = $(this).attr('data-confirm');
            if(!confirm(zh)){
                return false;
            }
        }
        if( $(this).attr('data-url') != '' && $(this).attr('data-url') != undefined ) {
            window.location.href = $(this).attr('data-url');
        } else {
            var history_go = -1;
            if( $(this).attr('data-go') != '' && $(this).attr('data-go') != undefined ){
                history_go = $(this).attr('data-go');
            }
            //返回刷新上一页
            if( $(this).attr('data-referrer') == 'true' ){
                location.replace(document.referrer);
            } else {
                window.history.go(history_go);
            }
        }
    })

    /**
     * ajax提交
     */
    $('.submit-ajax').submit(function(){
        var SITE_URL  =  localStorage.getItem("SITE_URL");
        var url = $(this).attr('action');
        var data = $(this).serialize();
        var refresh = $(this).attr('data-refresh');
        var is_callback = $(this).attr('data-callback');

        var _userinfo = localStorage.getItem("userinfo");
        if(_userinfo){
            _userinfo = JSON.parse(_userinfo);
            data+="&userid="+_userinfo.id;
            data+="&appkey="+_userinfo.appkey;
        }
        console.log("_userinfo=",_userinfo);
        $.ajax({
            type: "post",
            url:SITE_URL+ url,
            data:data,
            dataType:"json",
            success:function(data){
                if( is_callback != '' && is_callback != undefined ) {
                    submit_callback(data);
                    return false;
                }
                if( data.status == 1 ) {
                    sp_tip(data.msg);
                    if(data.data.save){
                        for(var i in   data.data.save){
                            localStorage.setItem(i,JSON.stringify(data.data.save[i]));
                        }
                    }


                    if(data.data.url) {
                        setTimeout(function(){
                             window.location.href = data.data.url;
                        },2000);
                    } else {
                        //默认刷新 refresh 为0不刷新
                        if( refresh != 0 ) {
                            setTimeout(function(){
                                window.location.reload();
                            },2000);
                        }
                    }
                } else {
                    sp_tip(data.msg);
                }
            },
            error:function(data){
                alert(data);
            }
        });
        return false;
    });
});

//弹出alert，自动关掉
function sp_tip(tip){
    var time = arguments[1] ? arguments[1] : 2;
    layer.open({
        content: tip,
        time: time,
        skin: 'msg'
    });
}
function ShowNews(ty) {
    var _data= localStorage.getItem("news");
    if(!_data) return ;
    _data=JSON.parse(_data);
    var _d = [];
    for(var  i in _data){

        if(_data[i].types==ty){
            _d.push(_data[i]);
        }
    }

    list.list= _d;
}

function GetNews(id) {
    var _data= localStorage.getItem("news");
    if(!_data) return ;
    _data=JSON.parse(_data);
    for(var  i in _data){
        if(_data[i].id==id){
           return _data[i] ;
        }
    }

    return false ;
}


/**
 * 时间戳格式化函数
 * @param  {string} format    格式
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间
 * @return {string}           格式化的时间字符串
 */


/**************************************时间格式化处理************************************/
function DateFormat( date,fmt)
{ //author: meizz
    date = date * 1000;
    date = parseInt(date);
    date = new Date(date-0);
    if(fmt==undefined){
        fmt ="yyyy-MM-dd hh:mm:ss";
    }
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
/**
 * 弹出对话窗  不会自动关掉
 * @param msg
 */
function sp_alert(msg){
    var btn_text = arguments[1] ? arguments[1] : '我知道了';
    var title = arguments[2];
    var bgcolor = arguments[3]==1 ? 'background-color: #5FB878; color:#fff;' : 'background-color: #e77f28; color:#fff;';
    if( title ) {
        layer.open({
            title: [
                title,
                bgcolor
            ],
            content: msg,
            btn: btn_text,
            yes: function(index){
                //location.reload();
                layer.close(index);
            }
        });
    } else {
        layer.open({
            content: msg,
            btn: btn_text,
            yes: function(index){
                //location.reload();
                layer.close(index);
            }
        });
    }

}

function sp_alert_reload(msg){
    var btn_text = arguments[1] ? arguments[1] : '我知道了';
    layer.open({
        content: msg,
        btn: btn_text,
        yes: function(index){
            //location.reload();
             layer.close(index);
        }
    });
    setTimeout(function () {
        layer.closeAll();
    },1500);
}
/**
 * LetterAvatar
 *
 * Artur Heinze
 * Create Letter avatar based on Initials
 * based on https://gist.github.com/leecrossley/6027780
 */
(function(w, d){
    function LetterAvatar (name, size, color) {
        name  = name || '';
        size  = size || 60;
        var colours = [
                "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
                "#f1c40f", "#e67e22", "#e74c3c", "#00bcd4", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
            ],
            nameSplit = String(name).split(' '),
            initials, charIndex, colourIndex, canvas, context, dataURI;
        if (nameSplit.length == 1) {
            initials = nameSplit[0] ? nameSplit[0].charAt(0):'?';
        } else {
            initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
        }
        if (w.devicePixelRatio) {
            size = (size * w.devicePixelRatio);
        }

        charIndex     = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
        colourIndex   = charIndex % 20;
        canvas        = d.createElement('canvas');
        canvas.width  = size;
        canvas.height = size;
        context       = canvas.getContext("2d");

        context.fillStyle = color ? color : colours[colourIndex - 1];
        context.fillRect (0, 0, canvas.width, canvas.height);
        context.font = Math.round(canvas.width/2)+"px 'Microsoft Yahei'";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText(initials, size / 2, size / 1.5);
        dataURI = canvas.toDataURL();
        canvas  = null;
        return dataURI;
    }
    LetterAvatar.transform = function() {
        Array.prototype.forEach.call(d.querySelectorAll('img[avatar]'), function(img, name, color) {
            name = img.getAttribute('avatar');
            color = img.getAttribute('color');
            img.src = LetterAvatar(name, img.getAttribute('width'), color);
            img.removeAttribute('avatar');
            img.setAttribute('alt', name);
        });
    };
    // AMD support
    if (typeof define === 'function' && define.amd) {

        define(function () { return LetterAvatar; });

        // CommonJS and Node.js module support.
    } else if (typeof exports !== 'undefined') {

        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module != 'undefined' && module.exports) {
            exports = module.exports = LetterAvatar;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.LetterAvatar = LetterAvatar;
    } else {

        window.LetterAvatar = LetterAvatar;
        d.addEventListener('DOMContentLoaded', function(event) {
            LetterAvatar.transform();
        });
    }
})(window, document);
/**
 * 点击确定后跳转URL
 * @param msg
 * @param btn_text
 * @param btn_url
 */
function sp_alert_gourl(msg,btn_text,btn_url){
    layer.open({
        content: msg,
        btn: btn_text,
        yes: function(){
            window.location.href = btn_url;
        }
    });
}
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
            //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
            break;
        default:
            return 0;
            break;
    }
}

//将任务全部存储下来
function AddToTask(data) {
    if(!data) return ;
    var _data = localStorage.getItem("_tasklist");
    if(!_data)_data = [];else _data = JSON.parse(_data );
    var _newdata=_data;
    for (var i=0;i<data.length;i++){
        //检查有没有这个值
        var _add = true ;var _j = 0;
        for(var j=0;j<_data.length;j++){
            if(_data[j].id==data[i].id){
                _newdata[j]=data[i]
                _add = false ;
                break;
            }
        }
        if(_add)_newdata.push(data[i]);
    }
    localStorage.setItem("_tasklist",JSON.stringify(_newdata));
}

function GetTask(id) {
    var _data = localStorage.getItem("_tasklist");
    if(!_data)_data = [];else _data = JSON.parse(_data );
    for(var j=0;j<_data.length;j++){
        if(_data[j].id==id)return _data[j];
    }
    return false ;
}

function  GetAllTask() {
    var _data = localStorage.getItem("_tasklist");
    if(!_data)_data = [];else _data = JSON.parse(_data );
    return _data;
}

function Post(url,data,fnt) {
    DoAjax(url,data,fnt,"post")
}
function Get(url,data,fnt) {
    DoAjax(url,data,fnt,"get")
}
function DoAjax(url,data,fnt,type) {
    var _userinfo = localStorage.getItem("userinfo");
    if(_userinfo){
        _userinfo = JSON.parse(_userinfo);
        data.userid =_userinfo.id;
        data.appkey=_userinfo.appkey;
    }

    $.ajax({
        type:type,
        url: SITE_URL +url,
        data: data,
        dataType: "json",
        success: function (data) {
            fnt(data);
        },error:function () {
            fnt({msg:"请登陆!",status:0,data:false});
        }
    });
}