window.addEventListener('DOMContentLoaded', async() => {

    let response;
    const leaderParentTag = document.getElementById('table-body-leader');
    const ispremium = localStorage.getItem('isPremium');
    const downloadPremiumBtn = document.getElementById("premiumDownloadBtn");
    const leaderboard = document.getElementById('leaderboard');
    const downloadHistory = document.getElementById('downloads-history');
    // displaying the leadersboard table

    if(ispremium == 'true'){
        // displaying all the buttons in the navbar
        leaderboard.style = 'display:block';
        downloadPremiumBtn.style = 'display:block';
        downloadHistory.style = 'display:block';
    }

    try{
        response = await axios.get('http://54.90.161.155:3000/leaderboard/getLeaders');
        
        // clearing the leaders table
        leaderParentTag.innerHTML = "";
        for(let data of response.data.success){
            
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            const tdAmount = document.createElement('td');

            // adding data to the rows
            tdName.textContent = data.name;
            tdAmount.textContent = data.totalExpense;

            tr.appendChild(tdName);
            tr.appendChild(tdAmount);

            leaderParentTag.appendChild(tr);
        }
    }
    catch(err){
        alert('Something went wrong !!');
    }
}); 