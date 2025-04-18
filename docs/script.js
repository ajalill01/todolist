async function login(event){
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://todolist-6qfg.onrender.com/api/users/login',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    const result = await response.json()

    if(result.success){
        localStorage.setItem('authToken',result.token);
        localStorage.setItem('username',username)
        window.location.href = "todo.html";
    }
    else{
        alert(result.message)
    }
}

document.querySelector('form').addEventListener('submit', login);
