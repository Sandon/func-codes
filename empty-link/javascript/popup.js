var startpopup = function ($) {
    // setChildTextNode("resultsRequest", "running...");
    //告诉页面js可以开始运行
    chrome.tabs.query({active: true,currentWindow: true}, function(tabs) {
        // 1. 死链单页面检查
        var tab = tabs[0];
        $("div.single-button").click(function(){
          chrome.tabs.sendMessage(tab.id, {status: "startsingle"}, function handler(response) {});
        });
        // 2. 死链多页面检查
        //先查看缓存里是否存在列表
        var linklist = localStorage["linklist"];
        if( linklist ) {
            $("textarea").val($.trim(linklist))
        }
        var multClickEvent = function(){
            var $explain = $("span.explain b");
            var $textarea = $("textarea");
            var reg = /[a-zA-z]+:\/\/[^\s]*/;

            if( $.trim($textarea.val()) == "" ) {
                $explain.text("(没有输入内容)");
                  return;
            } else {
                var linklist = $textarea.val().split("|");
                var flag = true;
                $.each(linklist,function(i){
                    if( !reg.test(linklist[i]) ) {
                        flag = false;
                        $explain.text("(" + linklist[i] + "不符合URL规范" + ")");
                    }
                });

                if( flag ) {
                    $explain.text("已发送请求，耐心等待通知");
                    chrome.runtime.sendMessage({"type":"mult","linklist":linklist});
                    $("div.mult-button").unbind("click");
                    localStorage["linklist"] = $textarea.val();
                    setTimeout(function(){
                        $("div.mult-button").click(multClickEvent)
                    },20000);
                }
            }
        };
        $("div.mult-button").click(multClickEvent);

        // 3. 空链检查
        $("div.empty-link-btn").click(function(){
            chrome.tabs.sendMessage(tab.id, {status: "empty-link-check"}, function handler(response) {});
        });

        // 4. tab切换
        var $content=$(".content");
        var $triggers=$content.find(".trigger-li");
        var $tabs=$content.find(".tab-content")
        $content.on("click",".trigger-li",function(){
            var $this=$(this);
            var index=$triggers.index($this);

            $triggers.removeClass("current");
            $this.addClass("current");
            $tabs.hide();
            $tabs.eq(index).show();
        });
    });
};

startpopup(jQuery);