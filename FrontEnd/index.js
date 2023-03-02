// ---------------- GALLERY ------------------ //

const gallery = document.querySelector('.gallery')
const galleryArray = []

function galleryWorks() { 
    galleryArray.forEach(element => {
        const newFigure = document.createElement("figure");
        const newImg = document.createElement("img")
        const newFigcaption = document.createElement("figcaption")

        newImg.src = element.imageUrl
        newImg.alt = "photo"
        newFigcaption.innerHTML = element.title

        newFigure.setAttribute("categoryId", element.categoryId)
        newFigure.appendChild(newImg)
        newFigure.appendChild(newFigcaption)

        gallery.appendChild(newFigure)
    });
}

try {
    
    fetch('http://localhost:5678/api/works', {
        method: 'GET',
        headers : { 'Accept': "application/json"}
    })

    .then(response => response.json() .then(data => {
        if(response.ok) {

            data.forEach(element => {
                galleryArray.push(element)
            })

            galleryWorks()
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
const categoriesArray = []

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

            data.forEach(element => {
                categoriesArray.push(element)
            });

            const categories = new Set()

            categories.add({"id": 0, "name": 'Tous'})
            categoriesArray.forEach(category => {
                categories.add(category)
            })

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


// ---------------- MODAL ------------------ //

const modal = document.querySelector('.modal-wrapper')
const modifyGallery = document.querySelector('#modify-gallery')
const modalContent = document.querySelector('.modal-content')
const modalMainWrapper = document.querySelector('.modal-main-wrapper')
const addPhotoForm = document.querySelector('.modal-switch-wrapper form')

function galleryModal() { 
    const photosWrapper = document.createElement('div')
    photosWrapper.classList.add('photos-wrapper')

    galleryArray.forEach(element => {
        const newPhotoWrapper = document.createElement("div")
        newPhotoWrapper.classList.add('modal-photo-wrapper')
        newPhotoWrapper.setAttribute('idPhoto', element.id)

        const iconsPhotoWrapper = document.createElement("div")
        iconsPhotoWrapper.classList.add('icons-photo-wrapper')

        const trash = document.createElement("i")
        trash.classList.add('fa-regular', 'fa-trash-can')
        trash.setAttribute("id", "trash")

        const extend = document.createElement("i")
        extend.classList.add('fa-solid', 'fa-up-down-left-right')
        extend.setAttribute("id", "extend")

        const photo = document.createElement('img')
        photo.src = element.imageUrl
        photo.alt = "photo"

        const editText = document.createElement('p')
        editText.innerHTML = "éditer"

        iconsPhotoWrapper.append(trash, extend)
        newPhotoWrapper.append(iconsPhotoWrapper, photo, editText)
        photosWrapper.appendChild(newPhotoWrapper)
    });

    modalMainWrapper.appendChild(photosWrapper)
}

const addPhoto = function() {
    const addPhotoWrapper = document.createElement('div')
    addPhotoWrapper.classList.add('add-photo-wrapper')

    /* ------ Photo preview ------ */

    const photoPreviewWrapper = document.createElement('div')
    photoPreviewWrapper.classList.add('photo-preview-wrapper')

    const imgPreview = document.createElement('img')
    imgPreview.alt = 'imgPreview'

    const iconImg = document.createElement('i')
    iconImg.classList.add('fa-regular', 'fa-image')

    const buttonAddPhoto = document.createElement('label')
    buttonAddPhoto.htmlFor = 'photo'
    buttonAddPhoto.innerHTML = '+ Ajouter photo'
    const fileAddPhoto = document.createElement('input')
    fileAddPhoto.type = 'file'
    fileAddPhoto.name = 'photo'
    fileAddPhoto.id = 'photo'
    fileAddPhoto.accept = "image/png, image/jpg"
    fileAddPhoto.size = "400"

    const maxImgSizeText = document.createElement('p')
    maxImgSizeText.innerHTML = 'jpg, png : 4mo max'
    maxImgSizeText.style.color = '#444444'
    maxImgSizeText.style.fontSize = '10px'
    maxImgSizeText.style.lineHeight = '11px'

    fileAddPhoto.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                const result = reader.result;
                imgPreview.src = result;
            }
            imgPreview.style.display = "flex"
            iconImg.style.display = "none"
            buttonAddPhoto.style.display = "none"
            maxImgSizeText.style.display = "none"
        }
    
        else {
            iconImg.style.display = "flex"
            buttonAddPhoto.style.display = "flex"
            maxImgSizeText.style.display = "flex"
            imgPreview.style.display = "none"
        }
    })

    photoPreviewWrapper.append(imgPreview, iconImg, buttonAddPhoto, fileAddPhoto, maxImgSizeText)
    /* ------ Photo infos ------ */

    const photoInfosWrapper = document.createElement('div')
    photoInfosWrapper.classList.add('add-photo-infos-wrapper')

    /* Title */

    const photoTitleWrapper = document.createElement('div')
    photoTitleWrapper.classList.add('add-photo-title-wrapper')

    const photoTitle = document.createElement('label')
    photoTitle.innerHTML = 'Titre'
    photoTitle.htmlFor = 'titre'

    const inputTitle = document.createElement('input')
    inputTitle.type = 'text'
    inputTitle.name = 'title'

    photoTitleWrapper.append(photoTitle, inputTitle)

    /* Category */

    const photoCategoryWrapper = document.createElement('div')
    photoCategoryWrapper.classList.add('add-photo-title-wrapper')

    const photoCategory = document.createElement('label')
    photoCategory.innerHTML = 'Catégorie'
    photoCategory.htmlFor = 'category'

    const inputCategory = document.createElement('select')
    inputCategory.name = 'category'

    categoriesArray.forEach(element => {
        const category = document.createElement('option')
        category.value = element.name
        category.innerHTML = element.name
        inputCategory.append(category)
    })

    photoCategoryWrapper.append(photoCategory, inputCategory)


    photoInfosWrapper.append(photoTitleWrapper, photoCategoryWrapper)

    addPhotoWrapper.append(photoPreviewWrapper, photoInfosWrapper)
    modalMainWrapper.appendChild(addPhotoWrapper)
}

const switchModal = function() {
    if(modalContent.getAttribute('modal-content') === 'gallery') {
        
        modal.querySelector('#back-modal').style.display = 'none'
        modalContent.querySelector('h3').innerHTML = 'Galerie photo'
        modalContent.querySelector('#button-add-photo').value = 'Ajouter une photo'
        modalContent.querySelector('#button-add-photo').disabled = false
        modalContent.querySelector('a').style.display = 'flex'
        document.querySelector('.photos-wrapper').style.display = 'flex'
        document.querySelector('.add-photo-wrapper').style.display = "none"
    }

    else if(modalContent.getAttribute('modal-content') === 'add-photo') {

        modal.querySelector('#back-modal').style.display = 'flex'
        modalContent.querySelector('h3').innerHTML = 'Ajouter une photo'
        modalContent.querySelector('#button-add-photo').value = 'Valider'
        modalContent.querySelector('#button-add-photo').disabled = true
        modalContent.querySelector('a').style.display = 'none'
        document.querySelector('.add-photo-wrapper').style.display = "flex"
        document.querySelector('.photos-wrapper').style.display = 'none'
    }
}

/* ------ OPEN ------ */

const openModal = function() {
    modal.style.display = 'flex'
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.querySelector('#close-modal').addEventListener('click', closeModal)
    modalContent.addEventListener('click', stopPropagation)
    modalContent.setAttribute('modal-content', 'gallery')

    modal.querySelector('#button-add-photo').addEventListener('click', function() {
        modalContent.setAttribute('modal-content', 'add-photo')
        switchModal() 
    })

    modal.querySelector('#back-modal').addEventListener('click', function() {
        modalContent.setAttribute('modal-content', 'gallery')
        switchModal()
    })

    if(!modal.querySelector('.photos-wrapper')) {
        galleryModal()
    }
    
    if(!modal.querySelector('.add-photo-wrapper')) {
        addPhoto()
    }
    
    switchModal()
}

const closeModal = function() {
    modal.style.display = 'none'
    modal.removeAttribute('aria-modal')
    modal.setAttribute('aria-hidden', 'true')
    document.querySelector('.photos-wrapper').style.display = "none"
    document.querySelector('.add-photo-wrapper').style.display = "none"
    addPhotoForm.reset()
}

const stopPropagation = function(e) {
    e.stopPropagation()
}

modifyGallery.addEventListener('click', openModal)
modal.addEventListener('click', closeModal)

window.addEventListener('keydown', function(e) {
    if(e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

