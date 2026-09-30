fetch("https://fakestoreapi.com/Users")
.then( (response) => {
    return response.json();
})
.then((data) => {
    console.log(data);   
})
.catch((error) => {
    console.log(error.message);
})