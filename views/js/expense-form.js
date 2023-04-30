const form = document.getElementById("createExpenseForm");
form.addEventListener('submit', creatingExpense);

async function creatingExpense(e) {
    e.preventDefault();

    let expenseId;
    const token = localStorage.getItem('id');
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const type = document.getElementById('type').value;
    const parentTag = document.getElementById('expenseParentTag');

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
    
    const liTag = document.createElement('li');
    const data = document.createTextNode(amount + " : " + description + " : " + type);

    liTag.className = "card-body";
    liTag.style = "background-color: rgb(203, 214, 214);";
    liTag.appendChild(data);

    // creating parent tag
    const div = document.createElement('div');
    div.id = 'addExpense';
    div.className = 'card';

    // DELETE BUTTON
    const del = document.createElement("btn");
    const delData = document.createTextNode("X");
    del.className = "btn btn-danger  float-end";
    del.appendChild(delData);

    liTag.appendChild(del);

    div.appendChild(liTag);

    // adding to parent tag
    parentTag.appendChild(div);

    // deleting li tag
    del.onclick = async (e) => {

        try {
            // using axios to push data to CrudCrud
            const response = await axios.get(`http://localhost:3000/expense/deleteExpense/${expenseId}`);
            console.log(response);
        }
        catch(err){
            document.body.innerHTML = "<h2 style='color:red; text-align:center'>Something went wrong</h2>";
            console.error(err);
        }

        // removing from the UI
        parentTag.removeChild(e.target.parentElement.parentElement);
    }
};

window.addEventListener('DOMContentLoaded',async () => {

    const parentTag = document.getElementById('expenseParentTag');
    const token = localStorage.getItem('id');
    const premiumBtn = document.getElementById('premiumUser').parentElement;
    const premiumMsg = document.getElementById('isPremium');
    
    try{
        const response = await axios.get('http://localhost:3000/expense/getAllExpenses', { headers : {'Authorization' : token} });
        const ispremium = response.data.ispremium;

        if(ispremium == true){
            premiumBtn.remove();
            premiumMsg.textContent = 'Premium User';
        }

        for(let entry of response.data.success){
            
            // creating tags
            const liTag = document.createElement('li');
            const data = document.createTextNode(entry.amount + " : " + entry.description + " : " + entry.type);

            liTag.className = "card-body";
            liTag.style = "background-color: rgb(203, 214, 214);";
            liTag.appendChild(data);

            // creating parent tag
            const div = document.createElement('div');
            div.id = 'addExpense';
            div.className = 'card';

            // DELETE BUTTON
            const del = document.createElement("btn");
            const delData = document.createTextNode("X");
            del.className = "btn btn-danger  float-end";
            del.appendChild(delData);

            liTag.appendChild(del);

            div.appendChild(liTag);

            // adding to parent tag
            parentTag.appendChild(div);

            // deleting li tag
            del.onclick = async (e) => {

                try {
                    // using axios to push data to CrudCrud
                    const response = await axios.get(`http://localhost:3000/expense/deleteExpense/${entry.id}`);
                    console.log(response);
                    
                }
                catch(err){
                    document.body.innerHTML = "<h2 style='color:red; text-align:center'>Something went wrong</h2>";
                    console.error(err);
                }

                parentTag.removeChild(e.target.parentElement.parentElement);
            }
        }
    }
    catch(err){
        console.log(err);
    }
});


// FOR ORDERS
document.getElementById('premiumUser').onclick = async(e) => {

    const premiumBtn = document.getElementById('premiumUser');
    const premiumMsg = document.getElementById('isPremium');
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
            premiumMsg.textContent = 'Premium User'; 

            alert('You are a Premium User Now !!');
        }
    }

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault(); //why is this used

    rzp1.on('payment.failed', async (response) => {
        console.log('Payment failed : ',response.error.metadata.order_id);
        // console.log('Payment failed : ',response.metadata.payment_id);
        await axios.post('http://localhost:3000/purchase/failedTransaction', {

            order_id:response.error.metadata.order_id,
            payment_id: response.error.metadata.payment_id

        }, { headers : {'Authorization' : token} });

        alert('Something went wrong !!');
        rzp1.close();
    });
};