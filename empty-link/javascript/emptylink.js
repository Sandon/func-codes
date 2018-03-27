function getCheckEmptyLink(){
    /*
     * utils
     * */
    var urlWithoutHash=function(url){
        var index=url.indexOf("#");
        if(index>-1)
            return url.substring(0,index);
        else
            return url.substring(0);
    }
    var urlOrigin=function(url){
        var index=url.indexOf("/");
        if(index>-1)
            index=url.indexOf("/",index+1);
        if(index>-1)
            index=url.indexOf("/",index+1);
        if(index>-1)
            return url.substring(0,index);
        else
            return url.substring(0);
    }

    /*
     * parameters
     * */
    var hashPrefix="#reserve_for_empty_link_id_";
    var emptyLinks=new Array();
    var trueEmptyLinkIndexs=[];

    /*
     * trigger checking click on tested page when testing is undergoing
     * */

    var trigger=function (){
        var allLinks=document.getElementsByTagName("a");
        var pattern=/^\s*#\s*$/;
        for(var index=0;index!=allLinks.length;index++){
            var thisLink=allLinks[index];
            if(pattern.test(thisLink.getAttribute("href"))&&thisLink.getAttribute("target")!="_self"){
                emptyLinks.push(thisLink);
            }
        }
        allLinks=null;
        for(var index=0; index!=emptyLinks.length;index++){
            var thisLink=emptyLinks[index];
            var originHref=thisLink.getAttribute("href");
            thisLink.setAttribute("href","#reserve_for_empty_link_id_"+index);
            thisLink.setAttribute("data-empty-link-id",index);
            var event=document.createEvent("MouseEvents");
            event.initEvent("click");
            thisLink.dispatchEvent(event);
            thisLink.setAttribute("href",originHref);
        }
    }

    /*
     * run on pages that is opened by empty links when the testing is undergoing
     * */
    var allHashs=window.location.hash;
    var start=allHashs.indexOf(hashPrefix);
    console.log("here");
    if(start>-1){
        var myOpener=window.opener;
        console.log(myOpener);
        console.log(myOpener.location.href);
        console.log(urlWithoutHash(myOpener.location.href)+","+urlWithoutHash(window.location.href));
        if(myOpener&&(urlWithoutHash(myOpener.location.href))==(urlWithoutHash(window.location.href))){

            var end=allHashs.indexOf("#",start+1);

            var targetHash;
            if(end!=-1)
                targetHash=allHashs.substring(start,end);
            else
                targetHash=allHashs.substring(start);
            console.log(targetHash);
            myOpener.postMessage(targetHash,urlOrigin(myOpener.location.href));
            window.close();
        }
    }

    /*
     * collect feedback information on tested page when the testing is undergoing
     * */
    var eldMessageReciever=function(e){
        var index= e.data.substring(hashPrefix.length);
        emptyLinks[index].style.backgroundColor="red";
        trueEmptyLinkIndexs.push(index);
        console.log(emptyLinks[index]);
    }

    return{
        startChecking:function(){
            window.addEventListener("message",eldMessageReciever,false);
            trigger();
        }
    }
}

