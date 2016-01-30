
var drawing = false;

$(document).ready(function(){

    setUpSquares(16);

    $('.square').mousedown(function(){
        var color = $('input[name=paint-color]').val();
        $(this).css('background-color', color);
        drawing = true;
    });

    $('.square').mouseover(function(){
        if (drawing) {
            var color = $('input[name=paint-color]').val();
            $(this).css('background-color', color);
        }
    });

    $(document).mouseup(function(){
        drawing = false;
    });

});

function setUpSquares(px){
    var container_width = 720;
    var pixel_width = 720 / px;
    for ( var i = 0; i < px; i++) {
        for ( var j = 0; j < px; j++) {
            $('#grid-container').append('<div class="square"></div>');
        }
    }
    $('.square').css('width', pixel_width.toString() );
    $('.square').css('height', pixel_width.toString() );
}

function reset(){
    $('.square').css("background-color", "#ffffff");
    $('#grid-container').empty();
    var size = $('input[name=grid-size]').val();
    setUpSquares(size);
}
