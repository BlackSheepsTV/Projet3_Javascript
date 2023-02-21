// ---------------- GALLERY ------------------ //

const gallery = document.querySelector('.gallery')

try {
    
    fetch('http://localhost:5678/api/works', {
        method: 'GET',
        headers : { 'Accept': "application/json"}
    })

    .then(response => response.json() .then(data => {
        if(response.ok) {

            data.forEach(element => {
                const newFigure = document.createElement("figure");
                const newImg = document.createElement("img")
                const newFigcaption = document.createElement("figcaption")

                newImg.src = element.imageUrl
                newFigcaption.innerHTML = element.title

                newFigure.setAttribute("categoryId", element.categoryId)
                newFigure.appendChild(newImg)
                newFigure.appendChild(newFigcaption)
                
                gallery.appendChild(newFigure)
            });
            
        }

        else {
            console.log('An error has occured')
        }
    }))
}

catch(e) {
    console.log('Fetch error : ' + e.message);
}

// ---------------- CATEGORIES ------------------ //

const portfolio = document.getElementById('portfolio')

try {
    fetch('http://localhost:5678/api/categories', {
        method: 'GET',
        headers : { 'Accept': "application/json"}
    })

    .then(response => response.json() .then(data => {
        if(response.ok) {

            const filterCategoriesWrapper = document.createElement("div")

            filterCategoriesWrapper.classList.add("filter-categories-wrapper")
            filterCategoriesWrapper.style.display = "flex"
            filterCategoriesWrapper.style.justifyContent = "center"
            filterCategoriesWrapper.style.alignItems = "center"
            filterCategoriesWrapper.style.width = '100%'

            portfolio.insertBefore(filterCategoriesWrapper, gallery)

            const categories = new Set()
            categories.add({"id": 0, "name": 'Tous'})

            data.forEach(element => {
                categories.add(element)
            });

            categories.forEach(element => {
                const category = document.createElement('div')
                category.setAttribute('categoryId', element.id)
                category.classList.add("category")
                category.style.display = "flex"
                category.style.justifyContent = "center"
                category.style.alignItems = "center"
                category.style.borderRadius = "60px"
                category.style.border = "1px solid #1D6154"
                category.innerHTML = element.name
                filterCategoriesWrapper.appendChild(category)

                category.addEventListener('click', function(category) {
                    const galleryChildren = gallery.children
                    for(let i = 0; i < galleryChildren.length; i++) {
                        if(category.target.getAttribute('categoryId') == galleryChildren[i].getAttribute('categoryId') || category.target.getAttribute('categoryId') == 0) {
                            galleryChildren[i].style.display = "block"
                       }

                       else {
                            galleryChildren[i].style.display = "none"
                       }
                    }
                })
            })    
        }

        else {
            console.log('An error has occured')
        }
    }))
}

catch(e) {
    console.log('Fetch error : ' + e.message);
}

// ---------------- WHEN LOGGED ------------------ //

const getToken = localStorage.getItem('token')
const loginButton = document.querySelector('#login')
const loginLink = document.createElement('a')
const modifyWrapper = document.querySelectorAll('.modify-wrapper')
const editModeWrpaper = document.querySelector('.edit-mode-wrpaper')
const navWrapper = document.querySelector('.nav-wrapper')

try {
    if(getToken !== null) {
        loginLink.innerHTML = "Logout"
        loginLink.href = "./index.html"
        loginButton.appendChild(loginLink)

        loginLink.addEventListener('click', function() {
            localStorage.removeItem('token')
        })

        for(let i = 0; i < modifyWrapper.length; i++) {
            modifyWrapper[i].style.display = 'flex'
       }

       editModeWrpaper.style.display = 'flex'
       navWrapper.style.marginTop = '90px'
    }

    else {
        loginLink.innerHTML = "Login"
        loginLink.href = "./login.html"

        loginButton.appendChild(loginLink)

        for(let i=0; i < modifyWrapper.length; i++) {
            modifyWrapper[i].style.display = 'none'
        }

       
        
    }
}

catch(e) {
    console.log("Error :" + e.message)
}
