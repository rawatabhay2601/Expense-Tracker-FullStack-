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
        await axios.post('http://3.82.35.137:3000/user/postUser',obj);
        window.location.href = "login.html";
    }
    catch(err){
        alert('Something went wrong !!');
    }
}