function addClass (element, newClass){

    // Check if elemnt exists, exit if not
    if (!element){
        return;
    } 

    // if the element has no class, just add a new class
    else if (element.getAttribute('class') == null){
        element.setAttribute('class', newClass);
    } 

    // if the class already exists, exit
    else if (hasClass(element, newClass)){
        return;
    } 

    // If the element already has a class, add the new one to the list
    else {
        element.setAttribute('class', element.getAttribute('class') + ' ' + newClass);
    }
}

function removeClass (element, className){
    // Check if element exists, exit if not
    if (!element) {
        return;
    }

    // first get the current class list, get rid of the desired class and return new state
    var newState = element.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');

    //set the new class list
    element.setAttribute('class', newState);
}

function hasClass (element, className){

    // test if the element has contains given class
    // return TRUE if yes
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.getAttribute('class'));
}

function getElementIndex(element, parentElement) {
    // determine numerical position (index) of the element within the parrent
    var index = Array.prototype.indexOf.call(parentElement.children, element);
    return index;
}

function toggleClass(element, className) {
    // Determine whether the element contains given class
    var visible = element.classList.contains(className);

    // if yes, remove it
    if (visible) {
        removeClass(element, className);
    } 

    // if not, add it to the list
    else {
        addClass(element, className);
    }
}

// get current property of given element
function getStyle(el, prop) {
    // get the actual displayed style (may differ from css initial setting)
    var getComputedStyle = window.getComputedStyle;

    // currentStyle is for IE
    return ( getComputedStyle ? getComputedStyle(el) : el.currentStyle )[
            // transforms css property into camel sized javascript version
            prop.replace(/-(\w)/gi, function (word, letter) {
                return letter.toUpperCase();   
            })
        ];
}

// check if element belongs to a node list (querySelectorAll for instance)
function isNodeList(element){
    return NodeList.prototype.isPrototypeOf(element)
}


function isArray(element){
    // older browsers don't support isArray method
    if (!Array.isArray) {
        return Object.prototype.toString.call(element) === '[object Array]';
    } else {
        return Array.isArray(element);
    }
}


function makeRequest(url, callback) {

    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            callback(httpRequest.responseText);
        }
    };

    httpRequest.open('GET', url);
    httpRequest.send();
}

function parseSafeJSON(data) {
    var jsonString = data.replace(")]}',", "");
    return JSON.parse(jsonString);
}

//safely registers event listener
function addEvent(object, event, callback) {

    if (object == null || typeof(object) == 'undefined') return;

    if (object.addEventListener) {
        object.addEventListener(event, callback, false);

    } else if (object.attachEvent) {
        object.attachEvent("on" + event, callback);

    } else {
        object["on" + event] = callback;
    }
}