const btn = document.getElementById('signupform');
btn.addEventListener('submit',signupSubmit);

async function signupSubmit(e){
    
    e.preventDefault();
    
    let id; 
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    
    const obj = {
        email,
        name,
        password
    }

    try{
        const res = await axios.post('http://localhost:3000/addUserSignup',obj);
        console.log(res);
    }
    catch(err){
        console.log(err);
    }
}