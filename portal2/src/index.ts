import './styles/style.scss';
import * as utils from "./Utils";

console.log('hello, world');

const testMessage: string = 'TypeScript works';

function getLoadingEl() {
    return document.getElementsByTagName('LOADING')[0];
}

function getContentEl() {
    return document.getElementsByTagName('CONTENT')[0];
}

function start() {
    let loadingEl = getLoadingEl();    
    utils.removeClass(loadingEl, 'show');
    utils.addClass(loadingEl, 'hide');

    let contentEl = getContentEl();
    utils.removeClass(contentEl, 'show');
    utils.addClass(contentEl, 'hide');
}

function load() {
    let loadingEl = getLoadingEl();    
    utils.removeClass(loadingEl, 'hide');
    utils.addClass(loadingEl, 'show');
    let contentEl = getContentEl();
    utils.removeClass(contentEl, 'show');
    utils.addClass(contentEl, 'hide');
}

function loaded() {
    let loadingEl = getLoadingEl();    
    utils.removeClass(loadingEl, 'show');
    utils.addClass(loadingEl, 'hide');
    let contentEl = getContentEl();
    utils.removeClass(contentEl, 'hide');
    utils.addClass(contentEl, 'show');
}

function handleClick(event: any) {

    // Don't follow the link
    event.preventDefault();

    // Log the clicked element in the console
    console.log(event.target);

    load();    
    loaded();
}

function init() {
    // Attach handleClicks to all A elements in the navigation
    let links = document.getElementsByClassName('navLinks');
    console.log('links', links);
    Array.prototype.filter.call(links, function(ul: any){
        console.log(ul.nodeName);
        let lis = ul.getElementsByTagName('LI');
        Array.prototype.filter.call(lis, function(li: any){
            console.log(li.nodeName);
            let as = li.getElementsByTagName('A');
            Array.prototype.filter.call(as, function(a: any){
                console.log(a.nodeName);
                // Ensure to register click event lietner only once
                a.removeEventListener("click", handleClick, false);
                a.addEventListener('click', handleClick, false);  
            });    
        });
    });

    // Attach handleClicks to Contact A element
    let ctaLinks = document.getElementsByClassName('cta');
    Array.prototype.filter.call(ctaLinks, function(cta: any){
        console.log(cta.nodeName);
        // Ensure to register click event lietner only once
        cta.removeEventListener("click", handleClick, false);
        cta.addEventListener('click', handleClick, false);  
    });    

    // Hide loading and content element
    start();
}

init();

/*
links.each(element => {
    document.addEventListener('click', function (event) {

        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('.click-me')) return;
    
        // Don't follow the link
        event.preventDefault();
    
        // Log the clicked element in the console
        console.log(event.target);
    
    }, false);        
});
*/

console.log(testMessage);