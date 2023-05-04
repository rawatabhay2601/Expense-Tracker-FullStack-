const form = document.getElementById("createExpenseForm");


form.addEventListener('submit', creatingExpense);
let rowCount = 0;

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



function increaseCount(){
    rowCount++;
};

function decreaseCount(){
    rowCount--;
};

function resetCount(){
    rowCount = 0;
};

window.addEventListener('DOMContentLoaded',async () => {

    const token = localStorage.getItem('id');
    const premiumBtn = document.getElementById('premiumUser').parentElement;
    const parentTagRow = document.getElementById('table-body-expense');
    const premiumParent = document.getElementById("premiumUserMsg");
    const downloadPremiumBtn = document.getElementById("premiumDownloadBtn");

    try{
        const response = await axios.get('http://localhost:3000/expense/getAllExpenses', { headers : {'Authorization' : token} });
        
        
        // ----------------------------------------------------------
        // Premium features

        const ispremium = response.data.ispremium;
        localStorage.setItem('isPremium',ispremium);
        if(ispremium == true){
            premiumParent.style = 'block'; 
            premiumBtn.remove();
            downloadPremiumBtn.style = 'button';
        }
        // ----------------------------------------------------------


        // resetting the row count to zero
        resetCount();

        for(let entry of response.data.success){

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