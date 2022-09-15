window.addEventListener('load', showCard, false);

function showCard() {
    if(!document.body.classList.contains('cards')) {
        return;
    }
    // TODO: get list of cards from url?
    // show the first card
    var card = document.getElementsByClassName('preview')[0];
    card.classList.add('show');
}

function flipCard(input) {
    var preview = input.closest('.preview');
    if(preview.classList.contains('flip')) {
        if(preview.nextElementSibling) {
            preview.classList.remove('show');
            preview.nextElementSibling.classList.add('show');
        }
    } else {
        preview.classList.add('flip');
    }
    return false;
}


