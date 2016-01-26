$(document).ready(function(){

    setUpSquares();

    $('.square').mouseenter(function(){
        $(this).addClass('dark');
    });

    /*
    $('.square').mouseleave(function(){
        $(this).removeClass('dark');
    }); */
});

function setUpSquares(){
    var pX = 16;
    var pY = 16;
    for ( var i = 0; i < pY; i++) {
        for ( var j = 0; j < pX; j++) {
            $('.grid-container').append('<div class="square"></div>');
        }
    }
}

function reset(){
    $('.square').removeClass('dark');
    var input = prompt("How many pixels per side would you like?");
}
