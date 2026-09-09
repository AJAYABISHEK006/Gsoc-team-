function f1(){
    console.log("First");
}
function f2(){
    console.log("Second");
}
function f3(){
    console.log("Third");
}

f1();
f2();
setTimeout(f2,2000);
f3();

//  Event Task Queue - Second
    //setTimeOut
    //setInterval

    