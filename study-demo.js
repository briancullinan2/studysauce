
function setupRequest(cb) {
    var request = new XMLHttpRequest();
    request.responseType = 'text';
    request.addEventListener('readystatechange', function (e) {
        if (request.readyState == 2 && request.status == 200) {
            // Download is being started
        }
        else if (request.readyState == 3) {
            // Download is under progress
        }
        else if (request.readyState == 4) {
            // Downloaing has finished
            if (request.status === 200) {
                cb(request.response);
            } else {
                cb();
            }
            // request.response holds the file data
        }
    });
    return request;
}

function createStudyPack(input) {
    var email = input.value;
    var request = setupRequest(r => {});
    request.open('POST', 'https://us-central1-sheet-to-web.cloudfunctions.net/createStudyPack?email=' + email, true);
    request.send();
    return false;
}

function createCards(input) {
    var text = input.value;
    var request = setupRequest(r => document.getElementsByTagName('iframe')[0].setAttribute('src', 'https://studysauce.sheet-to-web.com' + r));
    request.open('POST', 'https://us-central1-sheet-to-web.cloudfunctions.net/createCards?cards=' + text, true);
    request.send();
    return false;

}
