// event listener to display fileUrl
window.addEventListener('DOMContentLoaded',showFilesDownloaded);

// showing fileURL data tp UI
async function showFilesDownloaded(){

    const parentTagBody = document.getElementById('table-body-files');
    const token = localStorage.getItem('id');
    try{
        const response = await axios.get('http://184.73.146.55:3000/download/ListOfFiles', {headers : {'Authorization': token}});
        console.log(response);
        creatingRowsForTable(response.data.success, parentTagBody);
    }
    catch(err){
        alert('Something went wrong !!');
    }
};

function creatingRowsForTable(expense,parentTag){
    // clearing the old data
    parentTag.innerHTML = "";

    // PREMIUM FEATURES
    const ispremium = localStorage.getItem('isPremium');
    const downloadPremiumBtn = document.getElementById("premiumDownloadBtn");
    const leaderboard = document.getElementById('leaderboard');
    const downloadHistory = document.getElementById('downloads-history');

    if(ispremium == 'true'){

        // displaying all the buttons in the navbar
        leaderboard.style = 'display:block';
        downloadPremiumBtn.style = 'display:block';
        downloadHistory.style = 'display:block';
    }

    for(let i of expense){

        // creating tags
        const tdUrl = document.createElement('td');
        const tdDate = document.createElement('td');

        // adding data to the rows
        tdUrl.textContent = i.url;
        tdDate.textContent = i.createdAt;

        // creating parent tag
        const tr = document.createElement('tr');
        tr.appendChild(tdUrl);
        tr.appendChild(tdDate);

        // adding to the whole row to the table
        parentTag.appendChild(tr);
    }
};