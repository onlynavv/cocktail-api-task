const mainSection = document.createElement('section')
document.body.append(mainSection)

const mainDiv = document.createElement('div')
mainSection.append(mainDiv)
mainDiv.setAttribute('class','container-fluid')

const searchDiv = document.createElement('div')
searchDiv.setAttribute('class','row')
mainDiv.append(searchDiv)

const mainRow = document.createElement('div')
mainRow.setAttribute('class','row')
mainDiv.append(mainRow)

/**
 * it rendres the search div where it takes the user input to search for that particular cocktail / it gives the list 
 * of cocktails which gets matched
 */
searchDiv.innerHTML = `
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <form class="form-div">
                <div class="textField form-group row">
                    <label for="search" class="col-sm-4 col-form-label">Search Cocktail:</label>
                    <input type="text" placeholder="Enter Cocktail Name... ex: Margarita" id="search" name="search" class="col-sm-8 form-control">
                </div>
                <div class="form-group row search-btn">
                    <button onclick="searchCocktail(event)"><i class="fas fa-search"></i> Search</button>
                </div>
            </form>
        </div>
`
/**
 * 
 * @param {string} enteredValue gets attached to the api url to fetch the data
 * function takes default parameter, when no arguements is passed
 * it is a async function , where we are fetching the data from external api, so to handle with promises we have used
 * async function, and await will make the funciton to wait untill the promise gets resolved, await can be used only in
 * async function
 * function also used for search for a cocktail takes the user input as a parameter, where the default value will not affect
 */
const getCocktails = async(enteredValue = '') => {

    mainRow.innerHTML = ''

    const cocktailDiv = document.createElement('div')
    cocktailDiv.setAttribute('class','col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 cocktails')

    const cocktailRow = document.createElement('div')
    cocktailRow.setAttribute('class','row cocktail-row')

    const heading = document.createElement('h2')
    heading.innerText = 'Cocktails'
    heading.setAttribute('class','main-heading')
    cocktailRow.append(heading)

    mainRow.append(cocktailDiv)
    cocktailDiv.append(cocktailRow)

    /**
     * try catch block to handle the errors
     */

    try {
        
        const resp = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${enteredValue}`)
        if(!resp.ok){
            const errMsg = `An error occured '${resp.status}' '${resp.statusText}'`
            throw new Error(errMsg)
        }
        const cocktailInfo = await resp.json()

        const drinksData = cocktailInfo.drinks
        
        drinksData.map((item)=>{
            /**
             * object destructuring
             */
            const {idDrink, strAlcoholic, strCategory, strDrink, strDrinkThumb} = item

            cocktailRow.innerHTML += `
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                        <div class="card card-black-bg mb-5" id=${idDrink}>
                            <img src=${strDrinkThumb} alt=${strDrink}>
                            <div class="card-body card-body-ht">
                                <h5 class="card-title mb-3 cocktail-name">${strDrink}</h5>
                                <p class="card-text category">${strCategory}</p>
                                <p class="card-text alcoholic">${strAlcoholic}</p>
                                <button class="view-btn" onclick='getCocktailDetail(${idDrink})'>View Details</button>
                            </div>
                        </div>
                    </div>
            `
        })   
    } catch (error) {
        console.log(error)
        cocktailRow.innerHTML = `
            <h4 class="err-msg">Please enter valid cocktail, check for spellings</h4>
        `
    }
}

/**
 * function call to fetch the cocktails at the initial render
 */
getCocktails()

/**
 * 
 * @param {event} event 
 * fucntion is called when the search button is clicked its a callback function, to prevent the browser from submitting the value which leads to 
 * reload the page we have used preventDefault() method
 */

const searchCocktail = async(event) => {
    event.preventDefault()

    const enteredCocktail = document.getElementById('search').value

    /**
     * function call it takes the search input value as arguement
     */
    getCocktails(enteredCocktail)

    document.getElementById('search').value = ''
}

/**
 * 
 * @param {string} drinkId parameter which gets attached to the api url which is used to get the data
 * function to fetch details for a particular cocktail
 * its a callback function, gets called when the view details button is clicked
 */

const getCocktailDetail = async(drinkId) => {

    mainRow.innerHTML = ''

    const cocktailDiv = document.createElement('div')
    cocktailDiv.setAttribute('class','col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 cocktails')

    const cocktailRow = document.createElement('div')
    cocktailRow.setAttribute('class','row cocktail-row')

    mainRow.append(cocktailDiv)
    cocktailDiv.append(cocktailRow)

    const getCocktails = async() => {

        try {
            /**
             * fetch method takes another api url which looks for a particular cocktail, and provides the details for that
             * cocktail, detailed info
             */
            const resp = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
            if(!resp.ok){
                const errMsg = `An error occured '${resp.status}' '${resp.statusText}'`
                throw new Error(errMsg)
            }
            const cocktailInfo = await resp.json()

            const cocktailDetail = cocktailInfo.drinks

            const {idDrink, strAlcoholic, strCategory, strDrink, strDrinkThumb, strInstructions, strIngredient1, strIngredient2, strIngredient3, strIngredient4, strMeasure1, strMeasure2, strMeasure3, strGlass} = cocktailDetail[0]

            cocktailRow.innerHTML = `
                    <div class="container cocktail-info-div" id=${idDrink}>
                    
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div class="card card-black-bg mb-5 card-cocktail">
                                <img src=${strDrinkThumb} alt=${strDrink} class="image-card">
                                <div class="card-body card-body-ht cocktail-card-body">
                                    <h5 class="card-title mb-4"><span>Name: </span>${strDrink}</h5>
                                    <p class="card-text"><span>Category: </span>${strCategory}</p>
                                    <p class="card-text"><span>Info: </span>${strAlcoholic}</p>
                                    <p class="card-text"><span>Instructions: </span>${strInstructions}</p>
                                    <p class="card-text"><span>Ingredients: </span>${strIngredient1} ${strIngredient2} ${strIngredient3} ${strIngredient4}</p>
                                    <p class="card-text"><span>Measurements: </span>${strMeasure1} ${strMeasure2} ${strMeasure3}</p>
                                    <p class="card-text"><span>Glass Type: </span>${strGlass}</p>
                                    <button class="view-btn" onclick='getCocktails()'>Back to Home</button>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                `
        
        } catch (error) {
            console.log(error)
        }
    }

    getCocktails()
}


