$(document).ready(function(){

    var state = {
        drawing: false,
        gridSize: 16
    };

    setUpSquares(state.gridSize);
    resize();

    $(document).on('mousedown','.square', function(){
        var color = $('input[name=paint-color]').val();
        $(this).css('background-color', color);
        state.drawing = true;
    });

    $(document).on('mouseover','.square', function(){
        if (state.drawing) {
            var color = $('input[name=paint-color]').val();
            $(this).css('background-color', color);
        }
    });

    $(document).mouseup(function(){
        state.drawing = false;
    });

    $(window).resize(function(){
        resize();
    });

    // Toggle grid lines based on grid-toggle checkbox
    $('#grid-toggle').change(function (event) {
        if(this.checked) {
            $('table, th, td ').css('border','1px solid steelblue');
        } else {
            $('table, th, td ').css('border','0');
        }
    });

    document.getElementById('download-button').addEventListener('click', function() {
        downloadImage(this);
    }, false);

    $('#reset-grid-button').on('click', function(){
        resetGrid();
    });

    function resetGrid(){
        $('.square').css("background-color", "transparent");
        $('#grid-container').empty();
        var size = $('input[name=grid-size]').val();
        setUpSquares(size);
    }

});

function setUpSquares(px){
    for ( var i = 0; i < px; i++) {
        $('#grid-container').append('<tr></tr>');
        for ( var j = 0; j < px; j++) {
            $('tr:last-child').append("<td class='square'></td>");
        }
    }
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

function downloadImage(link){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var pixels = state.gridSize;
    canvas.width = pixels;
    canvas.height = pixels;
    var imgData=ctx.getImageData(0,0,pixels,pixels);
    var data=imgData.data;
    for(var i=0;i<data.length;i+=4){
        var pixel_index = (i / 4);
        var colors = $('tr td:eq(' + pixel_index + ')').css('background-color');
        colors = colors.replace("rgb(", '');
        colors = colors.replace(")",'');
        colors = colors.replace(/,/g,'');
        var rgb = colors.split(' ');
        data[i]= rgb[0];
        data[i+1]= rgb[1];
        data[i+2]= rgb[2];
        data[i+3]= 255;
    }
    ctx.putImageData(imgData,0,0);
    link.href= canvas.toDataURL();

    //Get file name to save image under
    var fileName = $('#file-name-input').val();
    link.download = fileName ? fileName : 'image.png';
}
