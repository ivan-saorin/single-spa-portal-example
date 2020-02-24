

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

export function removeStart(string: string, stringToRemove: string): string {
    return string.substring(stringToRemove.length);
}