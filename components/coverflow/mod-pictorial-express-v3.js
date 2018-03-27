
lofty.config({
    resolve: function( id ) {
        if(/^page\/chao\-album/.test(id)){
            return 'http://style.c.aliimg.com/app/tempo/js/' + id + '.js'
        }
        return id;
    }
});
define(['jquery','page/chao-album/CoverFlow','fui/tabs/2.0'],function(J,CoverFlow,Tabs){
    J(function(){
        //outer tab
        var outerTab=new Tabs({
            tpl:".mod-pictorial-express-201501081206 .pictorial-tabs",
            "titleSelector":".fx-tab-nav li",
            "boxSelector":".fx-tab-panel",
            "effect":"default",
            "event":"click",
            "currentCls":"selected"
        });

        //cover flow
        var cf=new CoverFlow({
            tpl:".mod-pictorial-express-201501081206 .bt-wrap",
            item:"li",
            //从左到右的顺序
            infoArray:[
                {top:94,left:1,height:360,width:274},
                {top:74,left:42,height:390,width:296},
                {top:55,left:120,height:419,width:318},
                {top:24,left:259,height:460,width:350},
                {top:0,left:400,height:500,width:380},
                {top:24,left:590,height:460,width:350},
                {top:55,left:752,height:419,width:318},
                {top:74,left:852,height:390,width:296},
                {top:94,left:915,height:360,width:274}
            ],
            classes:["cls1","cls2","cls3","cls4","cls5","cls4","cls3","cls2","cls1"],
            itemSwitchSpeed:200,
            gap:10,
            groupSwitchSpeed:100,
            groupEffect:"leftright",
            nextGroup:".next-group",
            prevGroup:".prev-group",
            groupSwitchDisableCls:"disabled"
        });

        /*J(".mod-pictorial-express-201501081206 .next-group").click(function(e){
         e.preventDefault();
         if(cf.items.length<=cf.endIndex)
         return;
         cf.nextGroup();
         });
         J(".mod-pictorial-express-201501081206 .prev-group").click(function(e){
         e.preventDefault();
         if(cf.startIndex<=0)
         return;
         cf.prevGroup();
         });*/
        var timer=null;
        var scrollTimer=null;
        var Jmod=J(".mod-tab-nav-201501071642");
        var Jbd=J("html,body");
        /*cf.on("itemswitch",function(coverflow){
         var Jthis=coverflow.items.eq(coverflow.nowSelected);
         coverflow.items.removeClass("active");
         clearTimeout(timer);
         timer=setTimeout(function(){
         //coverflow.items.removeClass("active");
         Jthis.addClass("active");
         },1000);
         });*/
        outerTab.on("switch",function(){
            var Jthis=cf.items.eq(this.getCurrentIndex());
            cf.items.removeClass("active");
            //clearTimeout(timer);
            clearTimeout(scrollTimer);
            //timer=setTimeout(function(){
            Jthis.addClass("active");
            if(null!=scrollTimer){
                scrollTimer=setTimeout(function(){
                    Jbd.animate({scrollTop:Jmod.offset().top},300);
                },1000);
            }else{
                scrollTimer="";
            }
            //},1000);
        });
        outerTab.switchTo(cf.nowSelected);
        timer=setTimeout(function(){
            cf.items.eq(cf.nowSelected).addClass("active");
        },1000);

        //inner tab
        function blink(Jobj){
            if(Jobj.data('can-blink')&&0!=Jobj.data('can-blink')){
                if(1==Jobj.data('can-blink')) {
                    Jobj.addClass("blink");
                    Jobj.data('can-blink',2);
                    setTimeout(function () {
                        blink(Jobj);
                    }, 500);
                }else if(2==Jobj.data('can-blink')){
                    Jobj.removeClass("blink");
                    Jobj.data('can-blink',1);
                    setTimeout(function () {
                        blink(Jobj);
                    }, 500);
                }
            }
        }
        var innerTabs=J(".mod-pictorial-express-201501081206 .top-wrap .fx-tab-panel");
        innerTabs.each(function(){
            var Jthis=J(this);
            var JcurNum=Jthis.find(".curnum");
            var Jtitle=Jthis.find(".dere");
            var JallItems=Jthis.find(".sd-item");
            var JctrlRight=Jthis.find(".control-right");
            var tab=new Tabs({
                tpl:Jthis.find(".slider"),
                overflowContainer:".overflowContainer",
                boxSelector:".sd-item",
                effect:"leftright",
                prev:".control-left",
                next:".control-right",
                isLazy:true,
                imgSrcName:"lazy-src"
            });
            tab.on("switch",function(){
                JcurNum.html(tab.getCurrentIndex()+1);
                var title=JallItems.eq(tab.getCurrentIndex()).data("title");
                if(title)
                    Jtitle.html(title);
            });

            //blink animation
            if(JallItems.length>0){
                var JfirstItem=JallItems.eq(0);
                JfirstItem.on("mouseenter",function(){
                    JctrlRight.data('can-blink',1);
                    blink(JctrlRight);
                });
                JfirstItem.on("mouseleave",function(){
                    JctrlRight.data('can-blink',0);
                    JctrlRight.removeClass("blink");
                });
            }

        });
    });

});
