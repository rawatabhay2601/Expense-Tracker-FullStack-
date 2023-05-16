const forgotPassword = document.getElementById('forgotPasswordform');
forgotPassword.addEventListener('submit', passwordReset);

async function passwordReset(e){
    
    e.preventDefault();
    
    try{
        const email = document.getElementById('email').value;
        const response = await axios.post('http://3.82.35.137:3000/password/forgotpassword',{email});
    
        alert('E-Mail has been sent to reset password !!');
    }
    catch(err){
        alert('Something went wrong !!');
    }
};