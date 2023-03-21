const portfolio = document.getElementById('portfolio')
const getToken = localStorage.getItem('token')
const loginButton = document.querySelector('#login')
const loginLink = document.createElement('a')
const modifyWrapper = document.querySelectorAll('.modify-wrapper')
const editModeWrpaper = document.querySelector('.edit-mode-wrpaper')
const navWrapper = document.querySelector('.nav-wrapper')
const modal = document.querySelector('.modal-wrapper')
const modifyGallery = document.querySelector('#modify-gallery')
const modalContent = document.querySelector('.modal-content')
const modalMainWrapper = document.querySelector('.modal-main-wrapper')
const addPhotoForm = document.querySelector('.modal-switch-wrapper form')
const gallery = document.querySelector('.gallery')
const galleryChildren = gallery.children

// ---------------- GALLERY ------------------ //

async function getGalleryArray() {
    const res = await fetch('http://localhost:5678/api/works', {
        method: 'GET',
        headers : { 'Accept': "application/json"}
    })
    .then(res => res.json())
    .then(json => {
        if (json) {
            return json
        } else {
            return []
        }
    })
    return res
}

function createNewFigure(element) {
        const newFigure = document.createElement("figure");
        const newImg = document.createElement("img")
        const newFigcaption = document.createElement("figcaption")

        newImg.src = element.imageUrl
        newImg.alt = "photo"
        newFigcaption.innerHTML = element.title

        newFigure.setAttribute("categoryId", element.categoryId)
        newFigure.setAttribute("id", element.id)
        newFigure.appendChild(newImg)
        newFigure.appendChild(newFigcaption)

        gallery.appendChild(newFigure)
}

function createGalleryWorks(array) { 
    array.forEach(element => {
        createNewFigure(element)
    });
}

// ---------------- CATEGORIES ------------------ //

async function getCategoriesArray() {
    const res = await fetch('http://localhost:5678/api/categories', {
        method: 'GET',
        headers : { 'Accept': "application/json"}
    })
    .then(res => res.json())
    .then(json => {
        if (json) {
            return json
        } else {
            return []
        }
    })
    return res
}

async function createFiltered(array) { 
   
    const filterCategoriesWrapper = document.createElement("div")

    filterCategoriesWrapper.classList.add("filter-categories-wrapper")
    filterCategoriesWrapper.style.display = "flex"
    filterCategoriesWrapper.style.justifyContent = "center"
    filterCategoriesWrapper.style.alignItems = "center"
    filterCategoriesWrapper.style.width = '100%'

    portfolio.insertBefore(filterCategoriesWrapper, gallery)

    const categories = new Set()

    categories.add({"id": 0, "name": 'Tous'})
    array.forEach(category => {
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

async function fillPage() {
    try {
        createGalleryWorks(await getGalleryArray())
        createFiltered(await getCategoriesArray())  
    }
    
    catch(e) {
        console.log('Fetch error : ' + e.message);
    }
}

// ---------------- DELETE ------------------ //

async function deletePhoto(id, modalPhotowrapper) {
    try {

        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:5678/api/works/' + id, {
            method: 'DELETE',
            headers : { 'Accept': 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        })
        
        if(response.ok) {
            createApiMessageSuccess("Photo supprimé")
            modalPhotowrapper.remove()
            for(let i = 0; i < galleryChildren.length; i++) {
                if(id == galleryChildren[i].getAttribute('id')) {
                    galleryChildren[i].remove()
                }
            }
        }

        else if(response.status === 404) {
            errorMessageDelete.classList.add("error-message")
            errorMessageDelete.style.display = "flex"
            errorMessageDelete.innerHTML = "Une erreur s'est produite"
        }
    }

    catch(e) {
        console.log('Fetch error : ' + e.message);
    }
}

// ---------------- WHEN LOGGED ------------------ //

async function checkIfLogged() {
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
}

// ---------------- MODAL ------------------ //

function stopPropagation(e) {
    e.stopPropagation()
}

async function openModal() {
    modal.style.display = 'flex'
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.querySelector('#close-modal').addEventListener('click', closeModal)
    modalContent.addEventListener('click', stopPropagation)
    modalContent.setAttribute('modal-content', 'gallery')

    if(!modal.querySelector('.photos-wrapper')) {
        galleryModal(await getGalleryArray())
    }
    
    if(!modal.querySelector('.add-photo-wrapper')) {
        await addPhoto()
    }
    
    switchModal()
}

function closeModal() {
    modal.style.display = 'none'
    modal.removeAttribute('aria-modal')
    modal.setAttribute('aria-hidden', 'true')
    document.querySelector('.photos-wrapper').style.display = "none"
    document.querySelector('.add-photo-wrapper').style.display = "none"
    deleteApiMessage()
    addPhotoForm.reset()
}

function switchModal() {
    deleteApiMessage()
    document.querySelector('.photo-preview-wrapper img').style.display = "none"
    document.querySelector('.photo-preview-wrapper img').src = ""
    if(modalContent.getAttribute('modal-content') === 'gallery') {
        
        modal.querySelector('#back-modal').style.display = 'none'
        modalContent.querySelector('h3').innerHTML = 'Galerie photo'
        modalContent.querySelector('#button-add-photo').style.display = 'none'
        modalContent.querySelector('.modal-button-wrapper button').style.display = 'flex'
        modalContent.querySelector('a').style.display = 'flex'
        document.querySelector('.photos-wrapper').style.display = 'flex'
        document.querySelector('.add-photo-wrapper').style.display = "none"
    }

    else if(modalContent.getAttribute('modal-content') === 'add-photo') {

        modal.querySelector('#back-modal').style.display = 'flex'
        modalContent.querySelector('h3').innerHTML = 'Ajouter une photo'
        modalContent.querySelector('#button-add-photo').value = 'Valider'
        modalContent.querySelector('#button-add-photo').disabled = true
        modalContent.querySelector('#button-add-photo').style.display = 'block'
        modalContent.querySelector('.modal-button-wrapper button').style.display = 'none'
        modalContent.querySelector('a').style.display = 'none'
        document.querySelector('.add-photo-wrapper').style.display = "flex"
        document.querySelector('.preview-add-photo-wrapper').style.display = "flex"
        document.querySelector('.photos-wrapper').style.display = 'none'  
    }
}

// ---------------- CREATE MODAL GALLERY ------------------ //

function createModalPhotoWrapper(element) {
        const modalPhotosWrapper = document.querySelector('.photos-wrapper')
        const newPhotoWrapper = document.createElement("div")
        newPhotoWrapper.classList.add('modal-photo-wrapper')
        newPhotoWrapper.setAttribute('idPhoto', element.id)

        const iconsPhotoWrapper = document.createElement("div")
        iconsPhotoWrapper.classList.add('icons-photo-wrapper')

        const trash = document.createElement("i")
        trash.classList.add('fa-regular', 'fa-trash-can')
        trash.setAttribute("id", "trash")

        trash.addEventListener('click', function() {
            deletePhoto(element.id,newPhotoWrapper)
            
        })

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
        modalPhotosWrapper.append(newPhotoWrapper)
}

function galleryModal(array) { 
    const photosWrapper = document.createElement('div')
    photosWrapper.classList.add('photos-wrapper')
    modalMainWrapper.appendChild(photosWrapper)

    array.forEach(element => {
        createModalPhotoWrapper(element) 
    });
}

async function addPhoto() {
    const addPhotoWrapper = document.createElement('div')
    addPhotoWrapper.classList.add('add-photo-wrapper')

    /* ------ Photo preview ------ */

    const photoPreviewWrapper = document.createElement('div')
    photoPreviewWrapper.classList.add('photo-preview-wrapper')

    const previewAddPhotoWrapper = document.createElement('div')
    previewAddPhotoWrapper.classList.add('preview-add-photo-wrapper')

    const imgPreview = document.createElement('img')
    imgPreview.alt = 'imgPreview'

    const iconImg = document.createElement('i')
    iconImg.classList.add('fa-regular', 'fa-image')

    const buttonAddPhoto = document.createElement('label')
    buttonAddPhoto.htmlFor = 'image'
    buttonAddPhoto.innerHTML = '+ Ajouter photo'
    const fileAddPhoto = document.createElement('input')
    fileAddPhoto.type = 'file'
    fileAddPhoto.name = 'image'
    fileAddPhoto.id = 'image'
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
            previewAddPhotoWrapper.style.display = "none"
            modalContent.querySelector('#button-add-photo').disabled = false
        }
    
        else {
            iconImg.style.display = "flex"
            buttonAddPhoto.style.display = "flex"
            maxImgSizeText.style.display = "flex"
            imgPreview.style.display = "none"
        }
    })
    previewAddPhotoWrapper.append(iconImg, buttonAddPhoto, fileAddPhoto, maxImgSizeText)
    photoPreviewWrapper.append(imgPreview, previewAddPhotoWrapper)

    /* ------ Photo infos ------ */

    const photoInfosWrapper = document.createElement('div')
    photoInfosWrapper.classList.add('add-photo-infos-wrapper')

    /* Title */

    const photoTitleWrapper = document.createElement('div')
    photoTitleWrapper.classList.add('add-photo-title-wrapper')

    const photoTitle = document.createElement('label')
    photoTitle.innerHTML = 'Titre'
    photoTitle.htmlFor = 'title'

    const inputTitle = document.createElement('input')
    inputTitle.type = 'text'
    inputTitle.name = 'title'
    inputTitle.id = "title"

    photoTitleWrapper.append(photoTitle, inputTitle)

    /* Category */

    const photoCategoryWrapper = document.createElement('div')
    photoCategoryWrapper.classList.add('add-photo-title-wrapper')

    const photoCategory = document.createElement('label')
    photoCategory.innerHTML = 'Catégorie'
    photoCategory.htmlFor = 'category'

    const inputCategory = document.createElement('select')
    inputCategory.name = 'category'
    inputCategory.id = 'category'

    const array = await getCategoriesArray()
    array.forEach(element => {
        const category = document.createElement('option')
        category.value = element.id
        category.innerHTML = element.name
        inputCategory.append(category)
    })

    photoCategoryWrapper.append(photoCategory, inputCategory)


    photoInfosWrapper.append(photoTitleWrapper, photoCategoryWrapper)

    addPhotoWrapper.append(photoPreviewWrapper, photoInfosWrapper)
    modalMainWrapper.appendChild(addPhotoWrapper)
}

// ---------------- ADD WORK ------------------ //

function createApiMessageSuccess(text) {
    const modalH3 = document.querySelector('.modal-switch-wrapper h3')
    const message = document.createElement('p')
    message.classList.add("success-message")
    message.style.display = "flex"
    message.style.position = "absolute"
    message.style.top = "95px"
    message.innerHTML = text

    modalH3.after(message)
}

function createApiMessageError(text) {
    const modalH3 = document.querySelector('.modal-switch-wrapper h3')
    const message = document.createElement('p')
    message.classList.add("error-message")
    message.style.display = "flex"
    message.style.position = "absolute"
    message.style.top = "95px"
    message.innerHTML = text

    modalH3.after(message)
}

function deleteApiMessage() {
    if(document.querySelector('.modal-switch-wrapper .error-message')) {
        document.querySelector('.modal-switch-wrapper .error-message').remove()
    }
    else if(document.querySelector('.modal-switch-wrapper .success-message')) {
        document.querySelector('.modal-switch-wrapper .success-message').remove()
    }
}

async function sendFormPhoto(event) {
    event.preventDefault()
    deleteApiMessage()
        try {
            const formData = new FormData(addPhotoForm)
           
            const token = localStorage.getItem('token')

            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers : { 'Accept': "application/json", Authorization: `Bearer ${token}`},
                body: formData,
            })

            const resData = await response.json()
    
            if(response.ok) {
                createApiMessageSuccess("Photo ajouté")
                createNewFigure(resData)
                createModalPhotoWrapper(resData)
                addPhotoForm.reset()
                document.querySelector('.photo-preview-wrapper img').style.display = "none"
                document.querySelector('.photo-preview-wrapper img').src = ""
                document.querySelector('.preview-add-photo-wrapper').style.display = "flex"
            }

            else if(response.status === 400 || 500) {
                const message = "Veuillez remplir tous les champs !"
                createApiMessageError(message)
                
            }
        }

        catch(e) {
            console.log(e.message)
        }
}

// ---------------- Listeners ------------------ //

function startListeners() {
    modifyGallery.addEventListener('click', openModal)
    modal.addEventListener('click', closeModal)

    window.addEventListener('keydown', function(e) {
        if(e.key === "Escape" || e.key === "Esc") {
            closeModal(e)
        }
    })

    modal.querySelector('.modal-button-wrapper button').addEventListener('click', function(e) {
        e.preventDefault()
        modalContent.setAttribute('modal-content', 'add-photo')
        switchModal() 
    })

    modal.querySelector('#back-modal').addEventListener('click', function() {
        modalContent.setAttribute('modal-content', 'gallery')
        switchModal()
        addPhotoForm.reset()
    })

    modalContent.querySelector('#button-add-photo').addEventListener('click', function(e) {
        sendFormPhoto(e)
    })
}

// ---------------- Execute fonction ------------------ //

checkIfLogged()
fillPage()
startListeners()
