const forgotPassword = document.getElementById('forgotPasswordform');
forgotPassword.addEventListener('submit', passwordReset);

async function passwordReset(e){
    
    e.preventDefault();
    
    try{
        const email = document.getElementById('email').value;
        const response = await axios.post('http://54.90.161.155:3000/password/forgotpassword',{email});
    
        alert('E-Mail has been sent to reset password !!');
    }
    catch(err){
        alert('Something went wrong !!');
    }
};