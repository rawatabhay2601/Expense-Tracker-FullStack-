document.getElementById('showleaders').onclick = async() => {

    let response;
    const leaderTable = document.getElementById('leadersboard');
    const leaderParentTag = document.getElementById('table-body-leader');
    leaderTable.style = "display : table ";

    try{
        response = await axios.get('http://localhost:3000/leaderboard/getLeaders');

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
        console.log(err);
    }
    
};

