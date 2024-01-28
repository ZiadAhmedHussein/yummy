

$("a").click(function(e) {
  e.preventDefault();
});

$('.main-navbar').css('left' , -$('.navbar-content').innerWidth());
$('.main-links li').css('top' , 500)

let navbarWidth = $('.navbar-content').innerWidth()

function closeSidebar() {
  $('.main-navbar').animate({
    'left': - navbarWidth
  }, (500))
  $('.navbar-shower-icon i').toggleClass("d-none");
}

$('.navbar-shower-icon').click(() => {
  $('.navbar-shower-icon i').toggleClass("d-none");
    if($('.main-navbar').css('left') === '0px') {
      $('.main-navbar').animate({
        'left': - navbarWidth
      }, (500))
      $('.main-links li').animate({
        'top' : 500
      }, (1000))
    }else {
      $('.main-navbar').animate({
        'left': 0
      }, (500))

      $('.main-links li:first-child').animate({
          'top' : 0
        }, (450) , () => {

          $('.main-links li:nth(1)').animate({
            'top' : 0
          }, (150), () => {

            $('.main-links li:nth(2)').animate({
              'top' : 0
            }, (150) , () => {

              $('.main-links li:nth(3)').animate({
                'top' : 0
              }, (150), () => {

                $('.main-links li:nth(4)').animate({
                  'top' : 0
                }, (150))
              })
            })
          })
        })
    }
});




async function headerMeal () {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
  
  $(response).ready(() => {
    $('.lazy-load').remove();
  });
  let mealsArr = await response.json();
  if (mealsArr.meals.length >= 1) {
    for (let i = 0; i < mealsArr.meals.length; i++) {
      creatMealsCard(mealsArr.meals, i);
    }
    mealDetailsShower (mealsArr.meals)
  }
}
headerMeal ();

function creatMealsCard(arr, index) {
  document.querySelector('header .header-meals').innerHTML += `
    <div class="inner-mail-card mb-4 col-12 col-md-3 px-3">
      <div class="mail-card-content position-relative rounded-3 overflow-hidden">
        <div class="meal-img h-100">
          <img class="w-100" src="${arr[index].strMealThumb}" alt="${arr[index].strMeal} meal image">
        </div>
        <div class="mail-name d-flex align-items-center h-100 w-100 position-absolute start-0 text-black fs-3 px-2 fw-medium">
          <p class="m-0 p-0">${arr[index].strMeal}</p>
        </div>
      </div>
    </div>
  `
  
}

function mealDetailsShower (arr) {
  $('.mail-name').click((e) => {
    for (let i = 0; i < arr.length; i++) {
      if(e.target.innerText === arr[i].strMeal) {
        $('header').fadeOut(100)

        $('section.meal-details').css({'display' : 'block'})

        $('section.meal-details .row').html(`
          <div class="inner col-12 col-md-4 px-3 bg-black text-white">
            <div class="meal-imge-name">
              <div class="meal-img w-100 rounded-3 overflow-hidden">
                <img class="w-100" src="${arr[i].strMealThumb}" alt="${arr[i].strMeal} meal image">
              </div>
              <h2 class="fs-3 fw-bold">${arr[i].strMeal}</h2>
            </div>
          </div>
          <div class="inner col-12 col-md-8 px-3 bg-black">
            <div class="meal-details-content d-flex flex-column gap-2">
              <div class="meal-instructions text-white">
                <h3 class="fs-3 fw-bold">Instructions</h3>
                <p class="m-0">${arr[i].strInstructions}</p>
              </div>
              <div class="meal-area text-white d-flex align-items-center gap-2">
                <h3 class="fs-3 fw-bold">Area :</h3>
                <p class="m-0 fs-3 fw-medium">${arr[i].strArea}</p>
              </div>
              <div class="meal-category text-white d-flex align-items-center gap-2">
                <h3 class="fs-3 fw-bold">Category :</h3>
                <p class="m-0 fs-3 fw-medium">${arr[i].strCategory}</p>
              </div>
              <div class="meal-recipes d-flex flex-column gap-2">
                <h3 class="text-white fs-3 fw-bold">Recipes :</h3>
                <ul class="list-unstyled d-flex flex-wrap gap-3 ms-2">
                ${recipesShower(arr, i)}
                </ul>
              </div>
              <div class="meal-tags">
                <h3 class="text-white fs-3 fw-bold">Tags :</h3>
                ${tagsCheckerAndShower(arr, i)}
                
              </div>
              <div class="meal-links text-white">
                <button class="btn btn-success">
                  <a href="${arr[i].strSource}">Source</a>
                </button>
                <button class="btn btn-danger">
                  <a href="${arr[i].strYoutube}">
                    Youtube
                  </a>
                </button>
              </div>
            </div>
          </div>
        `)
      }
    }
  })
}



function recipesShower (arr, i) {
  let arrOfRecipes = ``;
  for (let index = 1; index < 21; index++) {
    if(arr[i][`strMeasure${index}`] != null && arr[i][`strIngredient${index}`] != null) {
      if (arr[i][`strMeasure${index}`].trim() !== ""  && arr[i][`strIngredient${index}`].trim() !== "") {
        arrOfRecipes += `<li class="bg-light rounded-2 p-2">${arr[i][`strMeasure${index}`]} ${arr[i][`strIngredient${index}`]}</li>`
      }
    }
  }
  return arrOfRecipes
}

function tagsCheckerAndShower(arr, i) {
  if (arr[i].strTags == null) {
    return "";
  } else {
    let tagsArr = arr[i].strTags.split(",");
    let tags = ``;
    for (let index = 0; index < tagsArr.length; index++) {
      tags += `<p class="ms-2 mt-2 bg-light rounded-2 p-2 d-inline-block">${tagsArr[index]}</p>`
    }
    return tags;
  }
}


// serch operation
$('nav a[href="#search"]').click(() => {
  closeSidebar();
  $('.search-meals').css('display', 'flex')
});
// search meal by name
let inputSearchMealByName = document.querySelector('.search-meals input.search-name');

async function searchMealByName (mealName) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
  let mealsArr = await response.json();
  if (mealsArr.meals) {
    for (let i = 0; i < mealsArr.meals.length; i++) {
      creatMealsCard(mealsArr.meals, i);
    }
    mealDetailsShower (mealsArr.meals)
  }
}

inputSearchMealByName.addEventListener('input' , (e) => {
  $('header .header-meals').html(' ')
  searchMealByName (e.target.value)
})
//####################
// search meal by first letter
let inputSearchMealByFrLetter = document.querySelector('.search-meals input.search-f-letter');

async function searchMealByFrLetter (mealFrLetter) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealFrLetter}`)
  let mealsArr = await response.json();
  if (mealsArr.meals) {
    for (let i = 0; i < mealsArr.meals.length; i++) {
      creatMealsCard(mealsArr.meals, i);
    }
    mealDetailsShower (mealsArr.meals)
  }
};

inputSearchMealByFrLetter.addEventListener('input' , (e) => {
  $('header .header-meals').html(' ')
  if(e.target.value.trim()) {
    searchMealByFrLetter(e.target.value);
  }
  
});
//#################


// meal categories
// meal categories operation
$('nav a[href="#categories"]').click(() => {
  closeSidebar();
  $('header').fadeOut(100);
  mealCategories();
});

async function mealCategories () {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  
  $(response).ready(() => {
    $('.lazy-load').remove();
    $('section.meal-categories').css('display', 'block')
  });
  let categoriesArr = await response.json();
  if (categoriesArr.categories.length >= 1) {
    for (let i = 0; i < categoriesArr.categories.length; i++) {
      creatMealsCategoriesCard(categoriesArr.categories, i);
    }
    // mealDetailsShower (categoriesArr.categories)
    
  }
}

// function mealsShowerByCat (arr) {
//   $('.category-name').click(() => {
//     console.log(arr[index].strCategory);
//   })
// }


function creatMealsCategoriesCard(arr, index) {
  document.querySelector('section .categories').innerHTML += `
    <div class="inner-mail-card mb-4 col-12 col-md-3 px-3">
      <div class="category-card-content position-relative rounded-3 overflow-hidden">
        <div class="meal-img h-100">
          <img class="w-100" src="${arr[index].strCategoryThumb}" alt="${arr[index].strCategory} meal image">
        </div>
        <div class="category-name text-center h-100 w-100 position-absolute start-0 text-black p-2">
          <h3 class="fw-medium">${arr[index].strCategory}</h3>
          <p class="m-0 p-2 overflow-hidden h-75">${arr[index].strCategoryDescription}</p>
        </div>
      </div>
    </div>
  `
  
}







// async function mealsInCategory (categoryName) {
//   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
  
//   $(response).ready(() => {
//     $('.lazy-load').remove();
//     $('section.meal-categories').css('display', 'block')
//   });
//   let categoriesArr = await response.json();
//   if (categoriesArr.categories.length >= 1) {
//     for (let i = 0; i < categoriesArr.categories.length; i++) {
//       creatMealsInCategoryCard(categoriesArr.categories, i);
//     }
//     // mealDetailsShower (categoriesArr.categories)
//   }
// }
// function creatMealsInCategoryCard(arr, index) {
//   document.querySelector('section .categories').innerHTML += `
//     <div class="inner-mail-card mb-4 col-12 col-md-3 px-3">
//       <div class="mail-card-content position-relative rounded-3 overflow-hidden">
//         <div class="meal-img h-100">
//           <img class="w-100" src="${arr[index].strMealThumb}" alt="${arr[index].strMeal} meal image">
//         </div>
//         <div class="mail-name d-flex align-items-center h-100 w-100 position-absolute start-0 text-black fs-3 px-2 fw-medium">
//           <p class="m-0 p-0">${arr[index].strMeal}</p>
//         </div>
//       </div>
//     </div>
//   `
  
// }











