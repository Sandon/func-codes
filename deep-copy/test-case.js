console.log('-----Array-----');
//var copy=new Copy();

var a=["1","2"];
var a1=deepCopy(a);
a[0]=9;
console.log(a1);//["1","2"]
console.log(a1[0]==a[0]);

console.log('----------');
console.log('-----Function-----');
var f=function(){alert("haha");};
//function f(){alert("haha");}
console.log(f);
f.haha="hehe";
for(var i in f){
    console.log(i+":"+f[i]);
}
var f1=deepCopy(f);
f.haha="another hehe";
console.log(f1.haha);//
console.log(f.haha==f1.haha);
for(var i in f1){
    console.log(i+":"+f1[i]);
}
console.log(f1);

console.log('----------');
console.log('-----Date-----');
var d=new Date();
d.hehe="hehe";
var d1=deepCopy(d);
d.hehe="another hehe";
console.log(d.hehe==d1.hehe);
for(var i in d1){
    console.log(i+":"+d1[i]);
}

console.log('----------');
console.log('-----RegExp-----');
var r=new RegExp("good","i");
r.good={"name":"xxx"};
var r1=deepCopy(r);
r.good={"name":"yyy"};
console.log(r1.good== r.good);
console.log(r1.good);
for(var i in r1){
    console.log(i+":"+r1[i]);
}

console.log('----------');
console.log('-----String-----');

console.log('----------');