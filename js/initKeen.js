var client = new Keen({
    projectId: '5a67219bc9e77c000104c9ab',
    writeKey: '5C1F6C1000014F3BD0A793982A054C339A84FC1AC066E9E7915EA75C8F195C9020C3985A7B58731146589D177210522A23CA806AFB1E6B89874752F94A928C7FDC5158975C752A09978888A6511BF3C4D39E2D43F75823F241090CD784667F2D'
});
function sendKeenEvent(dest_iata, img_url) {
    var dummy = {
        destination: dest_iata,
        image_url: img_url
    };
    client.recordEvent('dummies', dummy, function (err, res) {
        if (err) console.log('Keen error');
        else console.log('Keen ok')
    });
}

export default sendKeenEvent;