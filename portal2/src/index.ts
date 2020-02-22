import './styles/style.scss';

console.log('hello, world');

const testMessage: string = 'TypeScript works';

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
            a.addEventListener('click', function (event: any) {

                // Don't follow the link
                event.preventDefault();
            
                // Log the clicked element in the console
                console.log(event.target);
            
            }, false);  
        });    
    });
});

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