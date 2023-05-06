const download = document.getElementById('premiumDownloadBtn');

// setting up the event listener
download.addEventListener('click', downloadExpense);

async function downloadExpense(){
    const token = localStorage.getItem('id');

    try{
        const response = await axios.get('http://localhost:3000/expense/downloadExpense', {headers : {'Authorization': token}});
        if(response.status === 201){

            const {data} = response;
            const {success} = data;
            
            // creating a tag to click on the URL
            const a = document.createElement('a');
            a.href = success;
            a.download = "myExpense.csv";
            a.click();
        }
        else{
            console.log(data.message);
            alert('Something Went Wrong !!');
        }
    }
    catch(err){
        console.log(err);
        alert("Someyhing went wrong !!");
    }
};