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
        const response = await axios.post("http://localhost:3000/expense/addExpense",obj, {headers : {'Authorization' : token}});
        expenseId = response.data.success.id;
        // console.log(response);
    }
    catch(err){
        console.log(err);
    }
    
    increaseCount();    //INCREASE COUNT FOR ROW NUMBER

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
            const response = await axios.get(`http://localhost:3000/expense/deleteExpense/${expenseId}`, { headers : {'Authorization' : token} });
            console.log(response);
        }
        catch(err){
            alert('Something went wrong : delete button')
            console.log(err);
        }
        // decreasing count
        decreaseCount();

        // removing from the UI
        e.target.parentElement.parentElement.remove();
    }
};

// ON RELOADING THE PAGE
window.addEventListener('DOMContentLoaded',async () => {

    // when we reload we look for the page number on which we were on 'page' parameter
    const objUrlParams = new URLSearchParams(window.location.search);
    const page = parseInt(objUrlParams.get("page")) || 1;

    // PARENT TAG FOR EXPENSE TABLE
    const parentTagRow = document.getElementById('table-body-expense');
    // TOKEN FOR USER ID
    const token = localStorage.getItem('id');
    
    // PREMIUM FEATURES
    const premiumBtn = document.getElementById('premiumUser').parentElement;
    const premiumParent = document.getElementById("premiumUserMsg");
    const downloadPremiumBtn = document.getElementById("premiumDownloadBtn");
    const expensePerPage = document.getElementById('expense-per-page').value;

    // PAGINATION
    const pagination = document.getElementById("pagination");

    try{
        const response = await axios.get(`http://localhost:3000/expense/getExpenses?page=${page}&perPage=${expensePerPage}`, { headers : {'Authorization' : token} });

        // -----------------------------------------------------------------------------------------------------------
        // PREMIUM FEATURES
        const ispremium = response.data.ispremium;
        localStorage.setItem('isPremium',ispremium);

        if(ispremium == true){
            premiumParent.style = 'block';
            premiumBtn.remove();
            downloadPremiumBtn.style = 'button';
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
        console.log(err);
    }
});

// FOR ORDERS RAZORPAY
document.getElementById('premiumUser').onclick = async(e) => {

    const premiumBtn = document.getElementById('premiumUser');
    const premiumMsg= document.getElementById('premiumUserMsg');
    const token = localStorage.getItem('id');
    const downloadPremiumBtn = document.getElementById("premiumDownloadBtn");

    const response = await axios.get('http://localhost:3000/purchase/premiumMembership', {
        headers : {'Authorization': token}
    });

    console.log('Response from 1st request : ',response);
    var options = {
        'key' : response.data.key_id,
        'order_id': response.data.order.id,
        'handler' : async function(response){

            await axios.post('http://localhost:3000/purchase/updateTranscationStatus', {
                order_id:options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {headers : {'Authorization' : token} });

            premiumBtn.parentElement.remove();    // removing premium button
            premiumMsg.style = "display:block";   // making message and button visible
            localStorage.setItem('isPremium','true'); // adding message to the local Storage
            downloadPremiumBtn.display = "button";  //displaying the download button

            alert('You are a Premium User Now !!');
        }
    }

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault(); //why is this used

    rzp1.on('payment.failed', async (response) => {
        
        await axios.post('http://localhost:3000/purchase/failedTransaction', {

            order_id:response.error.metadata.order_id,
            payment_id: response.error.metadata.payment_id

        }, { headers : {'Authorization' : token} });

        alert('Something went wrong !!');
        rzp1.close();
    });
};

// creating Rows for the frontend
async function creatingRowsForTable(expense,parentTagRow){
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

            try {
                const token = localStorage.getItem('id');
                // using axios to push data to backend
                const response = await axios.get(`http://localhost:3000/expense/deleteExpense/${entry.id}`, { headers : {'Authorization' : token} });
                console.log(response);
            }
            catch(err){
                alert('Something went wrong !!')
                console.log(err);
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
    const expensePerPage = parseInt(document.getElementById('expense-per-page').value);

    try{
        const response = await axios.get(`http://localhost:3000/expense/getExpenses?page=${page}&perPage=${expensePerPage}`,{ headers : {'Authorization' : token} });
        const parentTagRow = document.getElementById('table-body-expense');
        
        // creating rows
        creatingRowsForTable(response.data.success, parentTagRow);
        // creating pagination
        showPagination(response.data);
    }
    catch(err){
        console.log(err);
    }
};

// assisting Expenses Per Page
document.getElementById('set').onclick = () => {
    const objUrlParams = new URLSearchParams(window.location.search);
    const page = parseInt(objUrlParams.get("page")) || 1;

    getExpensePage(page);
};