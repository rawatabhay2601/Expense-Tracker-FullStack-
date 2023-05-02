const forgotPassword = document.getElementById('forgotPasswordform');
forgotPassword.addEventListener('submit', passwordReset);

async function passwordReset(e){
    e.preventDefault();

    const email = document.getElementById('email').value;
    const response = await axios.post('http://localhost:3000/password/forgotpassword',{email});

    console.log(response);
};