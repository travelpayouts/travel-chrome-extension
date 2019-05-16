var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-70090146-8']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); 
    ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('logo').addEventListener('click', function() {
        _gaq.push(['_trackEvent', 'click', 'logo']);
    });
    document.getElementById('bg_img').addEventListener('click', function() {
        _gaq.push(['_trackEvent', 'click', 'image']);
    });
    // document.getElementById('bottombar').addEventListener('click', function(e) {
    //     var target = e.target;
    //     while(target.id !== 'bottombar') {
    //         if(target.classList.contains('bottombar__item')) {
    //             _gaq.push(['_trackEvent', 'more_destinations', 'another_dest_click']);
    //             return;
    //         }
    //         target = target.parentNode;
    //     }
    //     // _gaq.push(['_trackEvent', 'click', 'image']);
    // });
});