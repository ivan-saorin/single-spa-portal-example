
export function hasClass(el: Element, className: string) {
    if (!el) return;
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

export function addClass(el: Element, className: string) {
    if (!el) return;
    if (el.classList)
        el.classList.add(className);
    else if (!hasClass(el, className))
        el.className += " " + className;
}

export function removeClass(el: Element, className: string) {
    if (!el) return;
    if (el.classList)
        el.classList.remove(className);
    else if (hasClass(el, className))
    {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}

export function processElementsClass(document: HTMLDocument, selectorClass: string, classToRemove: string, classToAdd?: string) {
    let elements = document.querySelectorAll(selectorClass);
    Array.prototype.filter.call(elements, function(element: any){
        removeClass(element, classToRemove);
        if (classToAdd) {
            addClass(element, classToAdd);
        }
    });
}

export function processElementsClass2(document: HTMLDocument, selectorClass: string, classToRemove: string, classToAdd?: string) {
    let elements = document.getElementsByClassName(selectorClass);
    Array.prototype.filter.call(elements, function(element: any){
        removeClass(element, classToRemove);
        if (classToAdd) {
            addClass(element, classToAdd);
        }
    });
}

export function removeStart(string: string, stringToRemove: string): string {
    return string.substring(stringToRemove.length);
}

export function makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 export function upperCaseFirst(str: string): string {
    let s = str.substring(0,1).toUpperCase();
    return s + str.substring(1);
 }