const btn = document.getElementById('loginform');
btn.addEventListener('submit',loginSubmit);

async function loginSubmit(e){

    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const obj = {
        email,
        password
    }

    try{
        const res = await axios.post('http://localhost:3000/LogInUser',obj);
        console.log(res);
    }

    catch(err){
        console.log(err);
    }

};