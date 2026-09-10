let newPromise = new Promise( (fullfilled, failure)=>{
    let dataReceived = true;
    // let dataReceived = false;

    if(dataReceived){
        fullfilled("Data Fetched Successfully");
    }
    else{
        // failure("Data not Found");
        throw new Error("Search Proper Data");
    }
} )

async function executePromise(){
    try{
        let message = await newPromise;
        console.log(message);
    }
    catch(error){
        console.log(error.message);
        
    }
    finally{
        console.log("End");
    }
}
executePromise();