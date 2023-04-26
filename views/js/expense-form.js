const form = document.getElementById("createExpenseForm");

form.addEventListener('submit', creatingExpense);

async function creatingExpense(e){
    e.preventDefault();

    let id; 
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const type = document.getElementById('type').value;
    const parentTag = document.getElementById('expenseParentTag');

    const obj ={
        amount,description,type
    }
    
    try{
        const response =await axios.post("http://localhost:3000/expense/addExpense",obj);
        id = response.data.message.id;
        console.log(response);

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

    // EDIT BUTTON
    const edit = document.createElement("btn");
    const editData = document.createTextNode("Edit");
    edit.className = "btn btn-success  float-end";
    edit.appendChild(editData);
    
    liTag.appendChild(edit);
    liTag.appendChild(del);

    div.appendChild(liTag);

    // adding to parent tag
    parentTag.appendChild(div);

    // deleting li tag
    del.onclick = async (e) => {

        try {
            // using axios to push data to CrudCrud
            const response = await axios.get(`http://localhost:3000/expense/deleteExpense/${id}`);
            console.log(response);
            
        }
        catch(err){
            document.body.innerHTML = "<h2 style='color:red; text-align:center'>Something went wrong</h2>";
            console.error(err);
        }

        parentTag.removeChild(e.target.parentElement.parentElement);
    }
};

window.addEventListener('DOMContentLoaded',async () => {

    const parentTag = document.getElementById('expenseParentTag');

    try{
        const response = await axios.get('http://localhost:3000/expense/getAllExpenses');

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

            // EDIT BUTTON
            const edit = document.createElement("btn");
            const editData = document.createTextNode("Edit");
            edit.className = "btn btn-success  float-end";
            edit.appendChild(editData);
            
            liTag.appendChild(edit);
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