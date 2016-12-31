$(document).ready(function(){

    var state = {
        drawing: false,
        gridSize: 16,
        paintRGBA: 'rgba(0,128,255,1)'
    };

    setUpSquares(state.gridSize);
    resize();
    updatePaintPreview();

    $(document).on('mousedown','.square', function(){
        $(this).css('background-color', state.paintRGBA);
        state.drawing = true;
    });

    $(document).on('mouseover','.square', function(){
        if (state.drawing) {
            $(this).css('background-color', state.paintRGBA);
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
            $('table, th, td ').css('border','1px solid black');
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

    $('#grid-size-input').change(function updateGridSizeInput(){
        var newSize = this.value;
        $('#grid-size-addon').text('x' + newSize);
    });

    $('#paint-color-input').change(updatePaintPreview);
    $('#paint-opacity-input').change(updatePaintPreview);

    // Updates the paint preview component when color or opacity changes
    function updatePaintPreview() {
        var paintColor = $('#paint-color-input').val();
        var paintOpacity = $('#paint-opacity-input').val();

        state.paintRGBA = 'rgba(' + hexToR(paintColor) +
            ',' + hexToG(paintColor) +
            ',' + hexToB(paintColor) +
            ',' + paintOpacity / 100 + ')';

        $('#paint-preview').css('background-color', state.paintRGBA);
    }

    $('#control-section-button').click(changeMenuState);

    // Animates the menu sidebar to open or close
    function changeMenuState(){
        console.log('toggle menu state');
        var controlSection = $('#control-section');
        var gridSection = $('#grid-section');
        controlSection.toggleClass('control-section-visible');
        gridSection.toggleClass('grid-section-visible');
        // // Resize map and pan back to center
        // setTimeout(function () {
        //     var content = infoWindow.getContent();
        //     google.maps.event.trigger(map, 'resize');
        //     map.panTo(position);
        //     infoWindow.setContent(content);
        // }, 500);
    }

    function resetGrid(){
        $('.square').css("background-color", "transparent");
        $('#grid-table').empty();
        var size = $('input[name=grid-size]').val();
        setUpSquares(size);
    }

    function downloadImage(link){
        // Setup an HTML canvas that isn't added to DOM but used to create a png
        // that the user downloads
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var pixels = state.gridSize;
        canvas.width = pixels;
        canvas.height = pixels;

        // Get canvas imageData so that we can loop through it
        var imgData = ctx.getImageData(0,0,pixels,pixels);
        var data = imgData.data;

        for( var i = 0; i < data.length; i += 4){
            // Get the background-color css attribute of each grid cell
            var rgba = [];
            var pixel_index = (i / 4);
            var backgroundColor = $('tr td:eq(' + pixel_index + ')').css('background-color');

            // Parse out RGB value from the background-color attribute
            if( backgroundColor.indexOf('rgba') === -1) {
                backgroundColor = backgroundColor.replace("rgb(", '');
                backgroundColor = backgroundColor.replace(")",'');
                backgroundColor = backgroundColor.replace(/,/g,'');
                rgba = backgroundColor.split(' ');
                rgba.push(1);
            } else {
                backgroundColor = backgroundColor.replace("rgba(", '');
                backgroundColor = backgroundColor.replace(")",'');
                backgroundColor = backgroundColor.replace(/,/g,'');
                rgba = backgroundColor.split(' ');
            }


            // Set the canvas pixel data to match the grid cell color
            data[i] = parseInt(rgba[0]); // red
            data[i+1] = parseInt(rgba[1]); // green
            data[i+2] = parseInt(rgba[2]); // blue
            data[i+3] = rgba[3] * 255; // opacity

        }
        imgData.data = data;
        ctx.putImageData(imgData,0,0);
        link.href= canvas.toDataURL();

        //Get file name to save image under
        var fileName = $('#file-name-input').val();
        link.download = fileName ? fileName : 'image.png';
    }

    // Taken from http://www.javascripter.net/faq/hextorgb.htm
    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}

});

function setUpSquares(px){
    for ( var i = 0; i < px; i++) {
        $('#grid-table').append('<tr></tr>');
        for ( var j = 0; j < px; j++) {
            $('tr:last-child').append("<td class='square'></td>");
        }
    }
}



function resize(){
    var width = $('#grid-panel').width();
    var height = $('#grid-panel').height();
    if( height < width) {
        $('#grid-container').height(height - (height * 0.05));
        $('#grid-container').width(height - (height * 0.05));
    } else {
        $('#grid-container').height(width - (width * 0.05));
        $('#grid-container').width(width - (width * 0.05));
    }
}
