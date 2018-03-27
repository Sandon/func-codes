var xdutil = require('lofty/util/xdutil/1.0/xdutil');

var oldLocalStorage = window.localStorage,
    proxyPage = '/proxy/localstorage.html';
var newLocalStorage = module.exports = {
    getItem:function(key,opt){
        if(opt === undefined){
            return oldLocalStorage.getItem(key);
        } else if(opt.domain === window.document.domain){
            if(opt.success && typeof opt.success ==='function'){
                opt.success(oldLocalStorage.getItem(key));
                return oldLocalStorage.getItem(key);
            }
        } else {
            xdutil.handle({
                page:'http://' + opt.domain + proxyPage,
                origin:'http://' + opt.domain,
                param:{
                    '_type':'read',
                    '_key':key
                },
                success:opt.success
            });
        }
    },
    setItem:function(key,val,opt){
        if(opt === undefined || opt.domain === window.document.domain){
            oldLocalStorage.setItem(key,val);
        } else{
            xdutil.handle({
                page:'http://' + opt.domain + proxyPage,
                origin:'http://' + opt.domain,
                param:{
                    '_type':'write',
                    '_key':key,
                    '_value':val
                },
                success:opt.success
            });
        }
    },
    clear:function(opt){
        if(opt === undefined || opt.domain === window.document.domain){
            oldLocalStorage.clear();
        } else{
            xdutil.handle({
                page:'http://' + opt.domain + proxyPage,
                origin:'http://' + opt.domain,
                param:{
                    '_type':'clear'
                },
                success:opt.success
            });
        }
    },
    key:function(idx,opt){
        if(opt === undefined || opt.domain === window.document.domain){
            return oldLocalStorage.key(idx);
        } else{
            xdutil.handle({
                page:'http://' + opt.domain + proxyPage,
                origin:'http://' + opt.domain,
                param:{
                    '_type':'key',
                    '_index':idx
                },
                success:opt.success
            });
        }
    },
    length:function(opt){
        if(opt === undefined || opt.domain === window.document.domain){
            return oldLocalStorage.length;
        } else{
            xdutil.handle({
                page:'http://' + opt.domain + proxyPage,
                origin:'http://' + opt.domain,
                param:{
                    '_type':'length'
                },
                success:opt.success
            });
        }
    },
    removeItem:function(key,opt){
        if(opt === undefined || opt.domain === window.document.domain){
            return oldLocalStorage.removeItem(key);
        } else{
            xdutil.handle({
                page:'http://' + opt.domain + proxyPage,
                origin:'http://' + opt.domain,
                param:{
                    '_type':'remove',
                    '_key':key
                },
                success:opt.success
            });
        }
    }
}

