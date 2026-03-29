document.addEventListener('DOMContentLoaded', function() {
    const btTopo = document.getElementById('bt-topo');
    const whats = document.getElementById('whats');
    const insta = document.getElementById('insta');
    const face = document.getElementById('face');

    const headerHeight = 120; 

    function checkScrollPosition() {
        
        if (window.scrollY > headerHeight) {
    
            btTopo.classList.add('show');
            whats.classList.add('show');
            insta.classList.add('show');
            face.classList.add('show');
        } else {

            btTopo.classList.remove('show');
            whats.classList.remove('show');
            insta.classList.remove('show');
            face.classList.remove('show');
        }
    }

    window.addEventListener('scroll', checkScrollPosition);

     checkScrollPosition();
});