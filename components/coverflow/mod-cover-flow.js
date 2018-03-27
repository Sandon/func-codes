lofty.config({
    resolve: function( id ) {
        if(/^cover\-flow/.test(id)){
            return 'http://demo.1688.com/work/other/components/coverflow/' + id + '.js'
        }
        return id;
    }
});
define(['jquery','cover-flow'],function($,CoverFlow){
    $(function(){
        var cf=new CoverFlow({
            tpl:".mod-cover-flow",
            item:".item",
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
            classes:["cls1","cls2","cls3","cls4","cls5","cls6","cls7","cls8","cls9"],
            groupEffect:"leftright",
            gap:10,
            groupSwitchSpeed:300,
            itemSwitchSpeed:300
        });

        $(".mod-cover-flow .group-switch").click(function(){
            cf.nextGroup();
        });
        cf.on("itemswitch",function(t){
            console.log(t);
        })
    });

});
