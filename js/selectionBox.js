export default function SelectionBox($el) {
    this.box = $el;
    this.boxItems = $el.children();
    this.boxItemClassName = 'hidden-cities__item';
    this.initEvents();
}

SelectionBox.prototype = {
    initEvents : function() {
        var obj = this;

        obj.box.on('click', '.'+obj.boxItemClassName, function(){
            var boxItem = $(this);
            boxItem.remove();

            chrome.storage.sync.get('settings', function(data){
                delete data.settings.hideCities[boxItem.data('iata')];
                chrome.storage.sync.set(data, function(){
                    var event = new Event('update_settings');
                    window.dispatchEvent(event);
                });
            });
        });
    },
}