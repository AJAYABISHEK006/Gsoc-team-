function fetchProfile(sucessCallBack, errorCallBack)
{
    let dataReceived = true;
    // let dataReceived = false;

    if(dataReceived)
    {
        sucessCallBack("Data Received");
    }
    else{
        errorCallBack("Data Not Received");
    }
}

fetchProfile(
    (message)=>{
        console.log(message);

        fetchProfile(
            (nextMessage)=>{
                console.log(nextMessage);
            },
            (nextError)=>{
                console.log(nextError);
            }    
        )
    },
    (error) =>{
        console.log(error);
    }
)