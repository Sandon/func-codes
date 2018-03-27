function Copy(){

}
Copy.prototype.deepCopy=function(arg){
    //"number","string","undefined","boolean","null"
    var artType=typeof arg;
    if(null===arg||"number"===artType||"string"===artType||"undefined"==artType||"boolean"===artType){
        return arg;
    }
    //"function"
    else if(typeof arg == "function"){
        return this.copyFunction2(arg);
    }
    //"array"
    else if(this.isArray(arg)){
        return this.copyArray(arg);
    }
    // "Date"
    else if(arg instanceof Date){
        return this.copyDate(arg);
    }
    // "RegExp"
    else if(arg instanceof RegExp){
        return this.copyRegExp(arg);
    }
    // "String"
    else if(arg instanceof String){
        return this.copyString(arg);
    }
    // "Number"
    else if(arg instanceof Number){
        return this.copyNumber(arg);
    }
    // "Boolean"
    else if(arg instanceof Boolean){
        return this.copyBoolean(arg);
    }
    //other "object"
    else{
        var retArr={};
        for(var i in arg){
            retArr[i]=this.deepCopy(arg[i]);
        }

        return retArr;
    }
};
/*

 */
Copy.prototype.isArray=function(arg){
    if(!Array.isArray) {
        Array.isArray = function (vArg) {
            return Object.prototype.toString.call(vArg) === "[object Array]";
        };
    }
    return Array.isArray(arg);
};
/*
    deep copy Array
 */
Copy.prototype.copyArray=function(originArr){
    var newArr=[];
    this.copyProsAndEles(originArr,newArr);

    return newArr;
};
/*
   deep copy function based on new Function
 */
Copy.prototype.copyFunction1=function(originFun){
    var copyFunHelper=new Function(originFun.toString()+" return "+originFun.name+";");// originFun.name not supported in IE
    var newFun=copyFunHelper();
    this.copyProsAndEles(originFun,newFun);
    return newFun;
};
/*
   deep copy function based on bind() instantiating the origin function
 */
Copy.prototype.copyFunction2=function(originFun){
    var newFun=originFun.bind();//ie9+
    this.copyProsAndEles(originFun,newFun);
    return newFun;
};
/*
    deep copy Date
 */
Copy.prototype.copyDate=function(originDate){
    var newDate=new Date(originDate.getTime());
    this.copyProsAndEles(originDate,newDate);
    return newDate;
};
/*
    deep copy RegExp
 */
Copy.prototype.copyRegExp=function(originRegExp){
    var newRegExp=new RegExp(originRegExp);
    this.copyProsAndEles(originRegExp,newRegExp);

    return newRegExp;
};
/*
    deep copy String
 */
Copy.prototype.copyString=function(originStr){
    var newString=new String(originStr);
    this.copyProsAndEles(originStr,newString);

    return newString;
};
/*
    deep copy Number
 */
Copy.prototype.copyNumber=function(originNumber){
    var newNumber=new Number(originNumber);
    this.copyProsAndEles(originNumber,newNumber);

    return newNumber;
};
/*
    deep copy Boolean
 */
Copy.prototype.copyBoolean=function(originBoolean){
    var newBoolean=new Boolean(originBoolean);
    this.copyProsAndEles(originBoolean,newBoolean);

    return newBoolean;
};
/*
    copy customised properties and elements of object
 */
Copy.prototype.copyProsAndEles=function(originOne,newOne){
    //elements and customised properties
    for(var key in originOne){
        newOne[key]=this.deepCopy(originOne[key]);
    }
};