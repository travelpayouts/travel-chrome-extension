const ITEMS_PER_KEY = 10;

function _get_chunk_info(global_index) {
    var chunk_number = Math.floor(global_index / ITEMS_PER_KEY);
    return {
        number: chunk_number,
        index: global_index - chunk_number * ITEMS_PER_KEY
    }
}

function get_deal_by_index(global_index, callback) {
    var chunk_data = _get_chunk_info(global_index);
    var chunk_name = 'deals_' + chunk_data.number.toString();
    chrome.storage.local.get(chunk_name, function (s_data) {
        var deals = s_data[chunk_name];
        callback(deals[chunk_data.index]);
    });
}

export default {get_deal_by_index, ITEMS_PER_KEY};