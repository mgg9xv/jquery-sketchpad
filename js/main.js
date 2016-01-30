
var drawing = false;

$(document).ready(function(){

    setUpSquares(16);
    resize();

    $(document).on('mousedown','.square', function(){
        var color = $('input[name=paint-color]').val();
        $(this).css('background-color', color);
        drawing = true;
        console.log('drawing...');
    });

    $(document).on('mouseover','.square', function(){
        if (drawing) {
            var color = $('input[name=paint-color]').val();
            $(this).css('background-color', color);
        }
    });

    $(document).mouseup(function(){
        drawing = false;
    });

    $(window).resize(function(){
        resize();
    });

    $('input[name=paint-color]').val('#' + Math.floor(Math.random()*16777215).toString(16));

    $('input[name=my-checkbox]').bootstrapSwitch();
    $('input[name=my-checkbox]').bootstrapSwitch('state', true);
    $('input[name=my-checkbox]').on('switchChange.bootstrapSwitch', function (event, state) {
        if(state) {
            $('table td').css('border','1px solid lightblue');
        } else {
            $('table td').css('border','0');
        }
    });

});

function setUpSquares(px){
    for ( var i = 0; i < px; i++) {
        $('#grid-container').append('<tr></tr>');
        for ( var j = 0; j < px; j++) {
            $('tr:last-child').append("<td class='square'></td>");
        }
    }
    $('input[name=paint-color]').val('#' + Math.floor(Math.random()*16777215).toString(16));
}

function reset(){
    $('.square').css("background-color", "#ffffff");
    $('#grid-container').empty();
    var size = $('input[name=grid-size]').val();
    setUpSquares(size);
}

function resize(){
    var width = $('#grid-panel').width();
    console.log("Width: " + width);
    var height = $('#grid-panel').height();
    console.log("Height: " + height);
    if( height < width) {
        $('#grid-container').height(height - 100);
        $('#grid-container').width(height - 100);
    } else {
        $('#grid-container').height(width - 100);
        $('#grid-container').width(width - 100);
    }

}
