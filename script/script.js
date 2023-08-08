//svg fallback for ie
svg4everybody();

(function initiateSlides() {
    var jumboSlider = document.querySelector('#slider');
    var smallSlider = document.querySelector('#slider-small');
    var jumboWallop;
    var smallWallop;
    var anchors = document.querySelector('#anchors');

    var options = {
        buttonPreviousClass: 'slider__buttonPrevious',
        buttonNextClass: 'slider__buttonNext',
        itemClass: 'slider__item',
        currentItemClass: 'slider__item--current',
        showPreviousClass: 'slider__item--showPrevious',
        showNextClass: 'slider__item--showNext',
        hidePreviousClass: 'slider__item--hidePrevious',
        hideNextClass: 'slider__item--hideNext',
        carousel: true
    };

    if (jumboSlider !== null && smallSlider) {
        jumboWallop = new Wallop(jumboSlider, options);
        jumboWallop.speed = 8000;
        autoplay(jumboWallop.speed, jumboWallop);

        smallWallop = new Wallop(smallSlider, options);
        smallWallop.speed = 8000;
        autoplay(smallWallop.speed, smallWallop);
       
    }

    if (anchors !== null && jumboWallop){
        setAnchors(jumboWallop, anchors);
        anchors.addEventListener('click', function(event) {
            clickItem(jumboWallop, event);
        });
    }

    function autoplay(interval, wallop) {
        var lastTime = 0;
        
       requestAnimationFrame(frame);

        function frame(timestamp) {
            var update = timestamp - lastTime >= interval;
            if (update) {
                wallop.next();

                lastTime = timestamp;
            }
           wallop.animationID = requestAnimationFrame(frame);
           wallop.lastTime = timestamp - lastTime;
        }

    }

    if(jumboWallop){
        jumboWallop.on('change', function(event) {
            setActive(anchors, event);
        });
    }

    function clickItem(wallop, e) {
        if (e.target !== e.currentTarget) {
            var j = getElementIndex(e.target, e.target.parentElement);
            wallop.goTo(j);
            cancelAnimationFrame(wallop.animationID);
            clearTimeout(wallop.timer);
            wallop.timer = setTimeout(function () {                 
                autoplay(wallop.speed, wallop);
            }, wallop.speed);
        }
    }

    function setActive(element, event) {
        var j = event.detail.currentItemIndex;
        var active = element.querySelector('.anchors__item--active');
        removeClass(active, 'anchors__item--active');
        addClass(element.children[j], 'anchors__item--active');
    }

    function setAnchors(wallop, anchor){
        var anchorCount = wallop.lastItemIndex;
        var width = 100/(anchorCount+1);
        var i, anchorItem;

        for (i = 0; i <= anchorCount; i++){
            anchorItem = document.createElement('div');
            anchorItem.style.width = width + "%";
            addClass(anchorItem, "anchors__item");
            anchor.appendChild(anchorItem);
        }
    }

    

})();

// (function priceRangeSlider() {
//     if(document.querySelector('#price-range-slider') || 'not-set' !== 'not-set'){
//         var slider = document.querySelector('#price-range-slider') || 'not-set';
//         var range = document.querySelector('.filter__price-range');
//         var leftValue;
//         var rightValue;

//         noUiSlider.create(slider, {
//             start: [ 0, 10000 ],
//             connect: true,
//             range: {
//                 'min': [  0 ],
//                 'max': [ 10000 ]
//             },
//             format: {
//               to: function ( value ) {
//                 return Math.round(value);
//               },
//               // noUIslider requires both to and from to be defined
//               from: function ( value ) {
//                 return value;
//               }
//             }
//         });

//         slider.noUiSlider.on('update', function(){
//             leftValue = slider.noUiSlider.get()[0];
//             rightValue = slider.noUiSlider.get()[1];

//             range.innerHTML = "od " + leftValue + " do " + rightValue + " Kč";
//         });
//     }
// })();

(function setEvenArticlePreview() {
     
    var descriptionArray = document.querySelectorAll('#articlePreview .article-preview__description');
    var tilesArray = document.querySelectorAll('#articlePreview .tiles__description');

    setSameHeight(tilesArray);
    setSameHeight(descriptionArray);    

    window.addEventListener('resize', debounce(function(){
        setSameHeight(descriptionArray);
    }, 250));

})();

//Give tiles the same height in case of longer text

(function setEvenCategoryTiles(){
                
    var categoryArray = document.querySelectorAll('#categoryTiles .tiles__description');
    setSameHeight(categoryArray);   
})();

(function setEvenProductTiles(){

    var productArray = document.querySelectorAll('#productTiles .tiles__description');
    setSameHeight(productArray); 
})();

(function switchProductsView() {
    var tilesSwitcher = document.querySelector('#showTiles');
    var tableSwitcher = document.querySelector('#showList');
    var tiles = document.querySelector('#productTiles');
    var table = document.querySelector('#productList');


    if(tilesSwitcher && tableSwitcher){
        tilesSwitcher.addEventListener('click', function() {
            tiles.style.display = 'block';
            table.style.display = 'none';
        });

        tableSwitcher.addEventListener('click', function() {
            tiles.style.display = 'none';
            table.style.display = 'table';
        });
    }
})();
////////

(function searchBar() {

    var searchIcon = document.querySelector('.userbar__item .svg-search');
    var searchBar = document.querySelector('#searchBar');

    if (searchIcon && searchBar) {
        searchBar.addEventListener('click', function(event) {
            addClass(searchIcon, 'search--active');
        })

        window.addEventListener('click', function(event){
            if(!(hasClass(event.target, 'search-bar__input')) ){
                removeClass(searchIcon, 'search--active');
                // $(searchBar).fadeOut(200, "swing");
            }
        })
        // searchIcon.addEventListener('mouseenter', function (event) {
        //     if(hasClass(searchIcon, 'search--active')){
        //         return;
        //     }
        //     addClass(searchIcon, 'search--active');
        //     $(searchBar).fadeIn(200, "swing");
        //     event.stopPropagation();
        // });
        
        // window.addEventListener('click', function(event){
        //     if(getStyle(searchBar, 'display') !== 'none' && !(hasClass(event.target, 'search-bar__input')) ){
        //         removeClass(searchIcon, 'search--active');
        //         $(searchBar).fadeOut(200, "swing");
        //     }
        // });       
    }
    
})();

(function bookmarkSwitcher() {
    var bookmarksItems = document.querySelectorAll('.productBookmark');
    var bookmarks = document.querySelector('#bookmarks');

    var tabs = document.querySelectorAll('.product__item');
    var index, i, active;

    if(bookmarks){
        bookmarks.addEventListener('click', function(event){
            index = clickItem(event);
            active = document.querySelector('.product__item--active');
            removeClass(active,'product__item--active');
            addClass(tabs[index],'product__item--active');
            toggleView(bookmarksItems, index);
        }); 
    }

    function clickItem(e) {
        if (e.target !== e.currentTarget) {
            var j = getElementIndex(e.target, e.target.parentElement);
            return j;
        }
    }
        
})();

(function mobileMenu(){
    var menuOpen = document.querySelector('#menuMobileOpen');
    var menuClose = document.querySelector('#menuMobileClose');
    var menu = document.querySelector('.menu');

    menuOpen.addEventListener("click", function(){
        $(menu).fadeIn(200, "swing");
    });

     menuClose.addEventListener("click", function(){
        $(menu).fadeOut(200, "swing");
    });

    //handle submenu
    var isMobile =  window.innerWidth < 1090;
    if (isMobile) {
        menu.addEventListener('click', menuClick);
    }


    window.addEventListener('resize', handleWindowResize );

    function menuClick(e){
        if(e.target !== e.currentTarget){
            var clickedItem = e.target;          
            var submenu = clickedItem.querySelector('.menu__sub');
            var plusSign = clickedItem.querySelector('.svg-plus-menu');
            if ( submenu !== null) {
                
                if(hasClass(clickedItem,'menu__item--clicked')) {
                    removeClass(clickedItem,'menu__item--clicked');
                    removeClass(plusSign,'svg-plus-menu--active');
                }else{
                    addClass(clickedItem,'menu__item--clicked');
                    addClass(plusSign,'svg-plus-menu--active');
                }

                $(submenu).slideToggle(function() {
                    if ($(this).is(':visible'))
                        $(this).css('display','flex');
                });
            }
        }
        e.stopPropagation();
    }

    function handleWindowResize(){
            var isMobile =  window.innerWidth < 1090;
            if(isMobile){
                menu.addEventListener('click',menuClick);
            } else {
                //reset mobile menu state
                menu.removeEventListener('click',menuClick);
                
                var menuItemArray = Array.prototype.slice.call(document.querySelectorAll('.menu__item--clicked'));
                menuItemArray.forEach(function(menuItemClicked) {
                    removeClass(menuItemClicked, 'menu__item--clicked');
                }, this);
                
                var subMenuArray = document.querySelectorAll('.menu__sub');
                subMenuArray.forEach(function(subMenuClicked) {                    
                    subMenuClicked.style = "";
                }, this);

                var svgPlusArray = document.querySelectorAll('.svg-plus-menu--active');
                svgPlusArray.forEach(function(svgPlusClicked) {
                    removeClass(svgPlusClicked, 'svg-plus-menu--active');                    
                }, this);

            }
    }


})();

(function mobileFooter(){
    var footerLinks = document.querySelector('.footer__links');
    var isMobile =  window.innerWidth < 992;
    var svg = document.querySelector('.svg-plus-footer');

    if (isMobile) {
        footerLinks.addEventListener('click',toggleFooterLinks);
    }

    window.addEventListener('resize', debounce(resetFooterDisplay,100) );

    function toggleFooterLinks(e) {
        if(e.target !== e.currentTarget){
            var clickedItem = e.target;   

            // To avoid opening first column when the whole footer div is clicked
            if(clickedItem.tagName !== 'DIV' && clickedItem.getAttribute('id') !== 'copyright'){
                // If plus sign (deeper in DOM) is clicked, crawl up
                while(clickedItem.tagName !== 'H3'){
                    clickedItem = clickedItem.parentNode;
                }

                var links = clickedItem.parentElement.querySelector('.footer__collapsible');
                var plusSign = clickedItem.parentElement.querySelector('.svg-plus-footer');
                if ( links !== null) {
                    
                    if(hasClass(plusSign,'svg-plus-footer--active')) {
                        removeClass(plusSign,'svg-plus-footer--active');
                    }else{
                        addClass(plusSign,'svg-plus-footer--active');
                    }
                    //submenu.style.display = 'block';
                    $(links).slideToggle();
                }
            }
            
        }
        e.stopPropagation();
    }

    function resetFooterDisplay() {
        var isMobile = window.innerWidth < 992;
        if (isMobile){
            footerLinks.addEventListener('click',toggleFooterLinks);
        } else {
            footerLinks.removeEventListener('click',toggleFooterLinks);
            
            var columnsLists = Array.prototype.slice.call(document.querySelectorAll('.footer__collapsible'));
            columnsLists.forEach(function(list) {
                list.style.display="";
            }, this);
            
            var plusSigns = Array.prototype.slice.call(document.querySelectorAll('.svg-plus-footer--active'));
            plusSigns.forEach(function(sign){
                removeClass(sign, 'svg-plus-footer--active');
            },this);
        }
    }

})();

// Adjust display of products category based on number of listed categories
// Reduce image size from certain count of categories
(function productsCategoryViewController() {
    var categoryArray = document.getElementById('categoryTiles');
    var productArray = document.getElementById('productTiles');

    if(categoryArray && productArray){

        var categoryArrayLength = categoryArray.children.length;

        if(categoryArrayLength >= 6){
            var category;
            var categoryImage;
            var categoryName;
            Object.keys(categoryArray.children).map(function(index){
                category = categoryArray.children[index];
                categoryImage = category.querySelector(".tiles__image");
                categoryName = category.querySelector(".tiles__name");

                removeClass(category, "col-md-6");
                removeClass(category, "col-lg-4");
                addClass(category, "col-md-4 col-lg-3");
                addClass(categoryImage, "tiles__image--smaller");
                addClass(categoryName, "tiles__name--smaller");
            });

            var product;
            var productImage;
            var productName;
            Object.keys(productArray.children).map(function(index){
                product = productArray.children[index];
                productImage = product.querySelector(".product-preview__image");

                removeClass(category, "col-md-6");
                removeClass(category, "col-lg-4");
                addClass(product, "col-md-4 col-lg-3");
                addClass(productImage, "product-preview__image--smaller");
            });
        }
    }
})();

(function validateForm() {
    var formExistence = document.querySelector('#form') || null;

    if (formExistence !== null){

        var email = document.querySelector('#email');
        var zip = document.querySelector('#zip');
        var phone = document.querySelector('#phone');
        var street = document.querySelector('#street');
        var city = document.querySelector('#city');
        var country = document.querySelector('#country');
        var firstName = document.querySelector('#firstName');
        var secondName = document.querySelector('#secondName');


        validityListener(firstName, "Pouze česká písmena bez mer povolena");
        validityListener(secondName, "Pouze česká písmena bez mer povolena");
        validityListener(street, "Pouze česká písmena a číslice povolena");
        validityListener(city, "Pouze česká písmena povolena");
        validityListener(country, "Pouze česká písmena povolena");
        validityListener(email, "Zadejte Vaši emailovou adresu ve správném formátu");
        validityListener(zip, "Zadejte poštovní směrovací číslo ve správném formátu");
        validityListener(phone, "Pouze číslice povoleny");

    }
    

    function validityListener(element, message){

        element.addEventListener("keyup", function (event) {
            validityCheck(element, message);
        });

        function validityCheck(element, message){
            if (element.validity.patternMismatch) {
                element.setCustomValidity(message);

            } else if (element.validity.typeMismatch){
                element.setCustomValidity(message);

            } else {
                element.setCustomValidity("");
            }
        }
    }

    

})();

(function productQuantity(){
    var plus = document.querySelector('.pieces__plus');
    var minus = document.querySelector('.pieces__minus');

    if (plus !== null && minus !== null){
        var quantity = document.getElementById('quantity');
        plus.addEventListener('click', function(){
            quantity.value++;
        });
        
        minus.addEventListener('click', function(){
            if(quantity.value<2){
                return;
            }
            quantity.value--;
        });
    }

})();

(function contactForm(){
    var contactButton = document.querySelector('.contact-button');
    var contactForm = document.querySelector('.contact-form');
    
    if(contactButton !== null && contactForm !== null){
        contactButton.addEventListener('click',function(e){
            contactForm.style.display === 'block'? closeForm() : openForm();            
            e.stopPropagation();
            window.addEventListener('click',closeForm);
            contactForm.addEventListener('click', function(e){
                e.stopPropagation();
            });
        });
    }

    function closeForm(e){        
        $(contactForm).fadeOut(200);        
    }
    
    function openForm(e){
        $(contactForm).fadeIn(200);
    }
})();

(function wrapArticles(){
    var articleContent = document.querySelector('.article__content');
    if(articleContent !== null){
        var tables = articleContent.querySelectorAll('table');
        var tables = Array.prototype.slice.call(tables);
        
        for(var i = 0; i < tables.length; i++){
            var wrapper = document.createElement('div');
            wrapper.setAttribute('class','article__table');
            wrapElement(tables[i],wrapper);
        }

    }
})();

function wrapElement(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}


function getMaxHeight(items){

    var maxHeight = 0;
    var height = 0;
    var i;

    for(i = 0; i < items.length; i++){

        height = items[i].clientHeight;

        if(height > maxHeight){
            maxHeight = height;
        }

        height = 0;

    }
    return maxHeight;
}
    
function setSameHeight(tilesArray){
    var i;
    
    for (i = 0; i < tilesArray.length; i++){
        tilesArray[i].style.height = "";
    }

    var maxHeight = getMaxHeight(tilesArray);
    
    for (i = 0; i < tilesArray.length; i++){
        tilesArray[i].style.height = maxHeight + "px";
    }

}

// toggle between invisibility and required display style (block is default)
// index is optional
function toggleView(element, index, display){

    display = display || 'block';

    // if element is part of NodeList (querySelectolAll) or of array
    // loop through all elements and hide them first.
    // Then set display style to a single element based on index of clicked item within parrent node
    if(isNodeList(element) || isArray(element)) {
        if(element && index < element.length){
            for (i = 0; i < element.length; i++){
            element[i].style.display = 'none';
            }

            element[index].style.display = display;
        }
    // if element is a single item, get its current style and toggle between displays
    } else if (element){
        if (getStyle(element, 'display') === 'none'){
            element.style.display = display;
        } else {
            element.style.display = 'none';
        }
    // fallback if no element or unexpected format was given
    } else {
        return;
    }
}

//debounce multiple events
//if immediate is passed, trigger the function on the leading edge instead of trailer
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}