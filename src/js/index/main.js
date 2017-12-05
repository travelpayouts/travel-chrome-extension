$(function(){
    // chrome.storage.sync.set({settings: {
    //     currency: '',
    //     origin: '',
    //     hideCities: {},
    //     showReviews: true,
    //     showTags: true
    // }});
    get_settings(apply_settings);
    var dd = new DropDown($('#choose_currency'));
    var sb = new SelectionBox($('#exclude_cities'));
    
    $(document).click(function() {
        // all dropdowns
        $('.wrapper-select-dropdown, .wrapper-input-dropdown').removeClass('active');
        $('.prices-calendar-container').addClass('prices-calendar-container--hidden');
    });

    var inputDd = $('.wrapper-input-dropdown');
    inputDd.each(function(){
        var $item = $(this);
        if($item.data('select-type') === 'external') {
            var dd = new InputDropdown($item, sb);
        } else {
            var dd = new InputDropdown($item);            
        }
    }) 
    
    var $btn_settings = $('#btn_settings').click(function(){
        var $obj = $(this);
        $obj.addClass('menu-opened');
        $obj.next().addClass('isOpened');
        return $obj;
    });

    $('#btn_close_settings').click(function(){
        $btn_settings.removeClass('menu-opened');
        $btn_settings.next().removeClass('isOpened');
    });

    var $place_container = $('#place_container');
    $('#btn-bottombar').click(function(){
        $place_container.toggleClass('slideUp');
    });

    var $comments_container = $('#comments_container');
    var $toggle_comments = $('#toggle_comments');
    $toggle_comments.on('change', function(){
        showComments(!this.checked);
        chrome.storage.sync.get('settings', function(res) {
            var result = res;
            result.settings.showReviews = !$toggle_comments[0].checked;
            chrome.storage.sync.set(result);
        });
    });

    var $tags_container = $('#tags_container');
    var $toggle_tags = $('#toggle_tags');
    $toggle_tags.on('change', function(){
        showTags(!this.checked);
        chrome.storage.sync.get('settings', function(res) {
            var result = res;
            result.settings.showTags = !$toggle_tags[0].checked;
            chrome.storage.sync.set(result);
        });
    });

    function get_settings(callback) {
        chrome.storage.sync.get('settings', function(res){
            if(res.settings) {
                callback(res.settings);
            }
        });
    }

    function apply_settings(settings) {
        showComments(settings.showReviews);
        $toggle_comments[0].checked = !settings.showReviews;
        showTags(settings.showTags);
        $toggle_tags[0].checked = !settings.showTags;
    }

    function showComments(state) {
        if(state) {
            $comments_container.removeClass('review-container--hidden');
        } else {
            $comments_container.addClass('review-container--hidden');
        }
    }

    function showTags(state) {
        if(state) {
            $tags_container.removeClass('tags-container--hidden');
        } else {
            $tags_container.addClass('tags-container--hidden');
        }
    }
});