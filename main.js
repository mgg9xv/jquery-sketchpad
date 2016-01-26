$(document).ready(function(){
    var pX = 16;
    var pY = 16;
    for ( var i = 0; i < pY; i++) {
        for ( var j = 0; j < pX; j++) {
            $('.container').append('<div class="square"></div>');
        }
    }
});
