let newPromise = new Promise( (resolve,reject)=>{
    let dataReceived = true;
    // let dataReceived = false;

    if(dataReceived){
        resolve("Data Received");
    }
    else{
        reject("Data Not Received")
    }
});

newPromise.then((message)=>{
    console.log("Success : " + message);
}).catch((error)=>{
    console.log("Failure : " + error);
    
})
.finally(()=>{
    console.log("End");
});