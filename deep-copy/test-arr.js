var a1=["a","b"];
a1.c="c";
a1.push={h:"h"};
for(var key in a1){
    console.log(key+":"+a1[key]);
}
console.log(a1);
console.log(a1.length);

var a2=["f"];

console.log(a1.push==a2.push);
console.log(a1.pop==a2.pop);

console.log("break");

var d=new Date();
d.getTime="h";
d.lipeng="man";
for(var key in d){
    console.log(key+":"+d[key]);
}

console.log("--------------");

var ao=new Array(1,2);
ao.push="haha";
console.log(ao);
console.log(ao.length);

for(var i in ao){
    console.log(i+":"+ao[i]);
}

console.log("--------------");