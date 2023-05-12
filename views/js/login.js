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
        const res = await axios.post('http://3.84.94.78:3000/user/loginUser',obj);
        id = res.data.token;
        localStorage.setItem('id',id.toString());
        window.location.href = "../html/expense-form.html";
    }
    catch(err){
        console.log(err);
    }
};