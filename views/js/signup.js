const btn = document.getElementById('signupform');
btn.addEventListener('submit',signupSubmit);

async function signupSubmit(e){
    
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    
    const obj = {
        email,
        name,
        password
    }

    try{
        const res = await axios.post('http://localhost:3000/user/postUser',obj);
        console.log(res);
        window.location.href = "../html/login.html";
    }
    catch(err){
        console.log(err);
    }
}