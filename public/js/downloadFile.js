const download = document.getElementById('premiumDownloadBtn');

// setting up the event listener
download.addEventListener('click', downloadExpense);

async function downloadExpense(){
    const token = localStorage.getItem('id');

    try{
        const response = await axios.get('http://3.84.94.78:3000/expense/downloadExpense', {headers : {'Authorization': token}});
        if(response.status === 201){
            console.log('Download file');
            // creating a tag to click on the URL
            const a = document.createElement('a');
            a.href = response.data.success;
            a.download = "myExpense.csv";
            a.click();
        }
        else{
            alert('Something Went Wrong !!');
        }
    }
    catch(err){
        alert("Someyhing went wrong !!");
    }
};