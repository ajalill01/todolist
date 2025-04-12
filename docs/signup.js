async function signup(event){
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    const response = await fetch('http://localhost:5000/api/users/signup',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    })

    const result = await response.json()

    if(result.success){
        window.location.href = 'index.html';
    }else{
        alert(result.message)
    }

}

document.getElementById("signup-form").addEventListener("submit", signup);
