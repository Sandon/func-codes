function deepCopy(arg){
    if(!Array.isArray) {
        Array.isArray = function (vArg) {
            return Object.prototype.toString.call(vArg) === "[object Array]";
        };
    }

    //copy customised properties and elements of object
    function copyPropsAndEles(originOne,newOne){
        for(var key in originOne){
            //console.log(arguments.callee.caller);
            newOne[key]=arguments.callee.caller(originOne[key]);
        }
    }

    var newOne=null;

    var artType=typeof arg;
    if(null===arg||"number"===artType||"string"===artType||"undefined"==artType||"boolean"===artType){
        return arg;
    }
    else if(typeof arg == "function"){
        newOne=arg.bind();
    }
    else if(Array.isArray(arg)){
        newOne=[];
    }
    else if(arg instanceof Date){
        newOne=new Date(arg.getTime());
    }
    else if(arg instanceof RegExp){
        newOne=new RegExp(arg);
    }
    else if(arg instanceof String){
        newOne=new String(arg);
    }
    else if(arg instanceof Number){
        newOne=new Number(arg);
    }
    else if(arg instanceof Boolean){
        newOne=new Boolean(arg);
    }
    //other "object"
    else{
        newOne={};
    }

    copyPropsAndEles(arg,newOne);
    return newOne;
}