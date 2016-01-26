$(document).ready(function(){

    setUpSquares(16);

    $(document).on('mouseenter', '.square', function(){
        $(this).addClass('dark');
    });

    /*
    $('.square').mouseleave(function(){
        $(this).removeClass('dark');
    }); */
});

function setUpSquares(px){
    var container_width = 720;
    var pixel_width = 720 / px;
    for ( var i = 0; i < px; i++) {
        for ( var j = 0; j < px; j++) {
            $('.grid-container').append('<div class="square"></div>');
        }
    }
    $('.square').css('width', pixel_width.toString() );
    $('.square').css('height', pixel_width.toString() );
}

function reset(){
    $('.square').removeClass('dark');
    var input = prompt("How many pixels per side would you like?");
    $('.grid-container').empty();
    setUpSquares(input);
}
