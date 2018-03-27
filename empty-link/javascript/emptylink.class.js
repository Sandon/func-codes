function EmptyLink(){
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
    if(start>-1){
        var myOpener=window.opener;
        if(myOpener&&(this.urlWithoutHash(myOpener.location.href))==(this.urlWithoutHash(window.location.href))){

            var end=allHashs.indexOf("#",start+1);

            var targetHash;
            if(end!=-1)
                targetHash=allHashs.substring(start,end);
            else
                targetHash=allHashs.substring(start);
            myOpener.postMessage(targetHash,this.urlOrigin(myOpener.location.href));
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
    window.addEventListener("message",eldMessageReciever,false);
};
EmptyLink.prototype.urlWithoutHash=function(url){
    return url.substring(0,url.indexOf("#"));
};
EmptyLink.prototype.urlOrigin=function(url){
    var index=url.indexOf("/");
    index=url.indexOf("/",index+1);
    index=url.indexOf("/",index+1);
    return url.substring(0,index);
};




