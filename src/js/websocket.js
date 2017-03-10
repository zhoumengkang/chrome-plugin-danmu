$(function(){
    var host = "203.195.188.207:10101";

    var socket;
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
        socket = new WebSocket("ws://"+ host +"/websocket/?request=" + createToken());
        socket.onmessage = function (event) {
            var msgObj = JSON.parse(event.data);
            addOne(msgObj.data.message);
        };
        socket.onopen = function (event) {
            addOne("websocket 打开了,试试看吧");
        };
        socket.onclose = function (event) {
            console.log("websocket 关闭了");
        };
    }

    //todo
    function createToken(){
        return "e2lkOjE7cmlkOjI2O3Rva2VuOiI0MzYwNjgxMWM3MzA1Y2NjNmFiYjJiZTExNjU3OWJmZCJ9";
    }

    function send(message) {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(message);
        } else {
            alert("The socket is not open.");
        }
    }

    var videoDom = $("video");

    videoDom.after('<div><input id="netty-websocket-danmu-input" type="text" name="msg" style="padding: 5px;font-size: 25px;height: 30px;" placeholder="回车发送"></div>');
    videoDom.after('<div id="netty-websocket-danmu"></div>');
    $("#netty-websocket-danmu-input").css({
        width: parseInt(videoDom.css("width")) - 14
    });

    var danmuSizeReset = false;

    var _danmu = $("#netty-websocket-danmu").danmu({
        left: videoDom.offset().left,
        top:videoDom.offset().top,
        height: videoDom.css("height"),
        width: videoDom.css("width"),
        speed: 15000,
        opacity: 1,
        font_size_small: 20,
        font_size_big: 60,
        danmuLoop: false,
        top_botton_danmu_time: 1000
    });
    _danmu.danmu('danmuStart');

    videoDom.get(0).oncanplaythrough = function() {

        if (danmuSizeReset == false) {
            $("#netty-websocket-danmu").css({
                left: videoDom.offset().left,
                top:videoDom.offset().top,
                height: videoDom.css("height"),
                width: videoDom.css("width")
            });
            $("#netty-websocket-danmu-input").css({
                width: parseInt(videoDom.css("width")) - 14
            });
            danmuSizeReset = true;
        }
    };


    function addOne(msg){
        var colors = ['red','#4561ff','green','cyan','yellow','orange','black'];
        var time = _danmu.data("nowTime");
        var size = Math.floor(Math.random() * 100);
        var position = Math.floor((Math.random() * 10)/3);
        var color = colors[Math.floor((Math.random() * colors.length))];
        danmu = { text: msg, color: color, size: size, position: position, 'time': time+1,'isnew':true };
        _danmu.danmu("addDanmu", danmu);
    }

    $("body").on("keydown","#netty-websocket-danmu-input",function(e){
        if(e.which == 13) {
            send($(this).val());
            $(this).val("");
        }
    });
});
