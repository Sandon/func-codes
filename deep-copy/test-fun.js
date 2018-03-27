function fun(i){
    i++;
    return 9;
}
fun.f="f";

console.log(fun.apply==fun["apply"]);

for(var key in fun){
    console.log(key+":"+fun[key]);
}
/*
var getFun=new Function(fun.toString()+" return "+fun.name+";");
var fun1=getFun();
console.log(fun1.prototype);
*/


/*
var str=fun.toString();
var fun1=eval(str);
console.log(fun1.toString());
*/

console.log(fun.length);
var fun1=fun.bind(this);
console.log(fun1(1));
console.log(fun1.length);

//console.log(fun.prototype);
//console.log(fun1.prototype==fun.prototype);

//fun.call={"haha":"hehe"};
//console.log(fun.call);


/*
function fun1(){
    return 0;
}

var fun2=function(i){
    return i;
};

console.log(fun.call==fun1.call);
console.log(fun.call==fun2.call);
console.log(fun.apply==fun1.apply);
console.log(fun.apply==fun2.apply);
console.log(fun.bind==fun1.bind);
console.log(fun.bind==fun2.bind);
console.log(fun.valueOf==fun1.valueOf);
console.log(fun.valueOf==fun2.valueOf);
console.log(fun.toString==fun1.toString);
console.log(fun.toString==fun2.toString);
console.log(fun.toLocaleString==fun1.toLocaleString);
console.log(fun.toLocaleString==fun2.toLocaleString);
*/

console.log("end function");

var o={a:"a",b:"b"};
o.c="c";
for(var key in o){
    console.log(key+":"+o[key]);
}