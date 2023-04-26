const btn = document.getElementById('loginform');
btn.addEventListener('submit',loginSubmit);

async function loginSubmit(e){

    e.preventDefault();

    let id;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const obj = {
        email,
        password
    }

    try{
        const res = await axios.post('http://localhost:3000/user/loginUser',obj);
        id = res.data.message.id;
        console.log(res);
    }
    catch(err){
        console.log(err);
    }
};