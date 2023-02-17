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

                newFigure.appendChild(newImg);
                newFigure.appendChild(newFigcaption);
                
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

            const categories = new Set();
            categories.add('Tous')

            data.forEach(element => {
                console.log(element)
                categories.add(element.name)
            });

            categories.forEach(element => {
                const category = document.createElement('div')
                category.classList.add("category")
                category.style.display = "flex"
                category.style.justifyContent = "center"
                category.style.alignItems = "center"
                category.style.borderRadius = "60px"
                category.style.border = "1px solid #1D6154"
                category.innerHTML = element
                console.log(element)
                filterCategoriesWrapper.appendChild(category)
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






