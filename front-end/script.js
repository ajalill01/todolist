async function login(event){
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/api/users/login',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    const result = await response.json()

    if(result.success){
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('username',username)
        window.location.href = "welcome.html";
    }
    else{
        alert(result.message)
    }
}

document.querySelector('form').addEventListener('submit', login);
