const formLogin = document.querySelector('.login-wrapper form')
const loginTitle = document.querySelector('.login-wrapper h2')
const loginSubmit = document.querySelector('#login-submit')

async function login(event) {
    event.preventDefault()
    if(document.querySelector('.error-login-message')) {
        document.querySelector('.error-login-message').remove()
    }
        try {
            const formData = new FormData(formLogin)
            const data = Object.fromEntries(formData)
        
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers : { 'Accept': "application/json",'Content-Type': 'application/json;charset=utf-8'},
                body: JSON.stringify(data),
            })

            const resData = await response.json()
    
            if(response.ok) {
               localStorage.setItem('token', resData.token);
               document.location.href="index.html"
            }

            else if(response.status === 404 || response.status === 401) {
                    const errorLogin = document.createElement('p')
                    errorLogin.classList.add('error-login-message', 'error-message')
                    errorLogin.style.display = "flex"
                    errorLogin.innerHTML = "Erreur dans l'identifiant ou le mot de passe"
    
                    loginTitle.after(errorLogin)
            }
        }

        catch(e) {
            console.log(e.message)
            
        }
}

loginSubmit.addEventListener('click', function(e) {
    login(e)
})