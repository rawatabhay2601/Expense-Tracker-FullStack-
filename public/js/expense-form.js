const form = document.getElementById("createExpenseForm");

form.addEventListener('submit', creatingExpense);
let rowCount = 0;

// creating expense when we add one
async function creatingExpense(e) {
    e.preventDefault();

    let expenseId;
    const token = localStorage.getItem('id');
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const type = document.getElementById('type').value;
    const parentTagRow = document.getElementById('table-body-expense');

    const obj ={
        amount,description,type
    };
    
    try{
        const response = await axios.post("http://54.90.161.155:3000/expense/addExpense",obj, {headers : {'Authorization' : token}});
        expenseId = response.data.success.id;

        increaseCount();    //INCREASE COUNT FOR ROW NUMBER
        
        if( rowCount <= parseInt(localStorage.getItem('expense-per-page')) ){

            // creating tags
            const th = document.createElement('th');
            const tdAmount= document.createElement('td');
            const tdDescription = document.createElement('td');
            const tdCategory = document.createElement('td');
            const tdButton = document.createElement('td');
            
            // adding data to the rows
            th.scope = "row";
            th.textContent = rowCount;
            tdAmount.textContent = amount;
            tdDescription.textContent = description;
            tdCategory.textContent = type;
            
            // creating parent tag
            const tr = document.createElement('tr');
            tr.appendChild(th);
            tr.appendChild(tdAmount);
            tr.appendChild(tdCategory);
            tr.appendChild(tdDescription);
            
            // DELETE BUTTON
            const del = document.createElement("btn");
            const delData = document.createTextNode("X");
            del.className = "btn btn-outline-danger";
            del.appendChild(delData);
            
            // adding button to parent tag
            tdButton.appendChild(del);
            tr.appendChild(tdButton);
            
            // adding to the whole row to the table
            parentTagRow.appendChild(tr);
            
            // deleting li tag
            del.onclick = async (e) => {
            
                try {
                    // using axios to push data to CrudCrud
                    const response = await axios.get(`http://54.90.161.155:3000/expense/deleteExpense/${expenseId}`, { headers : {'Authorization' : token} });
                    // decreasing count
                    decreaseCount();
                    // removing from the UI
                    e.target.parentElement.parentElement.remove();
                }
                catch(err){
                    alert('Something went wrong : delete button')
                }
            }
        }
    }

    catch(err){
        alert('Something went wrong while creating !!');
    }
};

// ON RELOADING THE PAGE
window.addEventListener('DOMContentLoaded',async(e) => {

    // when we reload we look for the page number on which we were on 'page' parameter
    const objUrlParams = new URLSearchParams(window.location.search);
    const page = parseInt(objUrlParams.get("page")) || 1;

    // PARENT TAG FOR EXPENSE TABLE
    const parentTagRow = document.getElementById('table-body-expense');
    // TOKEN FOR USER ID
    const token = localStorage.getItem('id');
    
    // PREMIUM FEATURES
    const premiumBtn = document.getElementById('premiumUser').parentElement;
    const downloadPremiumBtn = document.getElementById("premiumDownloadBtn");
    const leaderboard = document.getElementById('leaderboard');
    const downloadHistory = document.getElementById('downloads-history');
    const expensePerPage = localStorage.getItem('expense-per-page') || 5;   //get 5 expenses if nothing mentioned
    // STORING PAGE NUMBER IN THE LOCAL STORAGE(DEFAULT VALUE)
    localStorage.setItem("expense-per-page",expensePerPage);

    // PAGINATION
    const pagination = document.getElementById("pagination");

    try{
        const response = await axios.get(`http://54.90.161.155:3000/expense/getExpenses?page=${page}&perPage=${expensePerPage}`, { headers : {'Authorization' : token} });

        // -----------------------------------------------------------------------------------------------------------
        // PREMIUM FEATURES
        const ispremium = response.data.ispremium;
        localStorage.setItem('isPremium',ispremium);

        if(ispremium == true){

            // removing premium buy button
            premiumBtn.remove();

            // displaying all the buttons in the navbar
            leaderboard.style = 'display:block';
            downloadPremiumBtn.style = 'display:block';
            downloadHistory.style = 'display:block';
        }
        // ------------------------------------------------------------------------------------------------------------

        // resetting the row count to zero
        resetCount();

        // creating entries for the table
        const expense = response.data.success;
        creatingRowsForTable(expense,parentTagRow);
        // creating pagination
        showPagination(response.data)
    }
    catch(err){
        alert('Something went wrong !!');
    }
});

// FOR ORDERS RAZORPAY
document.getElementById('premiumUser').onclick = async(e) => {

    const leaderboard = document.getElementById('leaderboard');
    const downloadHistory = document.getElementById('downloads-history');
    const premiumBtn = document.getElementById('premiumBtn');
    const token = localStorage.getItem('id');
    const downloadBtn = document.getElementById("premiumDownloadBtn");

    const response = await axios.get('http://54.90.161.155:3000/purchase/premiumMembership', {
        headers : {'Authorization': token}
    });

    var options = {
        'key' : response.data.key_id,
        'order_id': response.data.order.id,
        'handler' : async (response) => {

            await axios.post('http://54.90.161.155:3000/purchase/updateTranscationStatus', {
                order_id:options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {headers : {'Authorization' : token} })

                // removing premium button
                premiumBtn.parentElement.remove();
                
                //displaying the download button
                downloadBtn.style = "display:block";
                //displaying the download button
                leaderboard.style = "display:block";
                //displaying the downloads history button
                downloadHistory.style = "display:block";

                localStorage.setItem('isPremium','true'); // adding message to the local Storage
                
                // setting up an alert
                alert('You are a Premium User Now !!');
        }
    }

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault(); //why is this used

    rzp1.on('payment.failed', async (response) => {
        
        await axios.post('http://54.90.161.155:3000/purchase/failedTransaction', {

            order_id:response.error.metadata.order_id,
            payment_id: response.error.metadata.payment_id

        }, { headers : {'Authorization' : token} });

        alert('Something went wrong while payment!!');
        rzp1.close();
    });
};

// creating Rows for the frontend
function creatingRowsForTable(expense,parentTagRow){
    // clearing the old data
    parentTagRow.innerHTML = "";
    resetCount();
    for(let entry of expense){

        // increasing count for the row
        increaseCount();

        // creating tags
        const th = document.createElement('th');
        const tdAmount= document.createElement('td');
        const tdDescription = document.createElement('td');
        const tdCategory = document.createElement('td');
        const tdButton = document.createElement('td');

        // adding data to the rows
        th.scope = "row";
        th.textContent = rowCount;
        tdAmount.textContent = entry.amount;
        tdDescription.textContent = entry.description;
        tdCategory.textContent = entry.type;

        // creating parent tag
        const tr = document.createElement('tr');
        tr.appendChild(th);
        tr.appendChild(tdAmount);
        tr.appendChild(tdCategory);
        tr.appendChild(tdDescription);

        // DELETE BUTTON
        const del = document.createElement("btn");
        const delData = document.createTextNode("X");
        del.className = "btn btn-outline-danger";
        del.appendChild(delData);

        // adding button to parent tag
        tdButton.appendChild(del);
        tr.appendChild(tdButton);

        // adding to the whole row to the table
        parentTagRow.appendChild(tr);

        // deleting li tag
        del.onclick = async (e) => {

            try{
                const token = localStorage.getItem('id');
                // using axios to push data to backend
                await axios.get(`http://54.90.161.155:3000/expense/deleteExpense/${entry.id}`,{ headers : {'Authorization' : token} });
            }
            catch(err){
                alert('Something went wrong !!');
            }

            e.target.parentElement.parentElement.remove();

            // decrease count
            decreaseCount();
        }
    }
};

// increase the row count
function increaseCount(){
    rowCount++;
};

// decrease the row count
function decreaseCount(){
    rowCount--;
};

// reset the row count
function resetCount(){
    rowCount = 0;
};

// used in creating pagination
async function showPagination({
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
}){
    // clearing pagination buttons
    pagination.innerHTML = "";

    // creating previous page button
    if(hasPreviousPage){
        
        const btn1 = document.createElement('button');
        btn1.innerHTML = previousPage;
        btn1.addEventListener('click',() => getExpensePage(previousPage));
        btn1.type = 'button';
        btn1.className = 'btn btn-light';
        pagination.appendChild(btn1);
    }

    // creating current button
    const btn2 = document.createElement('button');
    btn2.innerHTML = currentPage;
    btn2.addEventListener('click',() => getExpensePage(currentPage));
    btn2.type = 'button';
    btn2.className = 'btn btn-light active';
    pagination.appendChild(btn2);

    // creating next button
    if(hasNextPage){
        
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click',() => getExpensePage(nextPage));
        btn3.type = 'button';
        btn3.className = 'btn btn-light';
        pagination.appendChild(btn3);
    }
};

// used in assisting pagination process
async function getExpensePage(page){

    const token = localStorage.getItem('id');
    const expensePerPage = localStorage.getItem('expense-per-page') || 5;

    try{
        const response = await axios.get(`http://54.90.161.155:3000/expense/getExpenses?page=${page}&perPage=${expensePerPage}`,{ headers : {'Authorization' : token} });
        const parentTagRow = document.getElementById('table-body-expense');
        
        // creating rows
        creatingRowsForTable(response.data.success, parentTagRow);
        // creating pagination
        showPagination(response.data);
    }
    catch(err){
        alert('Somehing went wrong in getting the data !!')
    }
};

// assisting Expenses Per Page
document.getElementById('set').onclick = () => {
    const objUrlParams = new URLSearchParams(window.location.search);
    const page = parseInt(objUrlParams.get("page")) || 1;
    const expensePerPage = parseInt(document.getElementById('expense-per-page').value);
    
    localStorage.setItem('expense-per-page',expensePerPage);

    getExpensePage(page);
};