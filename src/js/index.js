$(document).ready(function(){

    // Initialize state
    var state = {
        drawing: false,
        gridSize: 16,
        paintRGBA: 'rgba(0,128,255,0.5)',
        showFullMenu: false
    };

    // Initializing functions
    setupPixelGrid(state.gridSize);
    resizePixelGrid();
    updatePaintPreview();

    // Updates the paint/paint preview component when color or opacity changes
    function updatePaintPreview() {
        var paintColor = $('#paint-color-input').val();
        var paintOpacity = $('#paint-opacity-input').val();

        state.paintRGBA = 'rgba(' + hexToR(paintColor) +
            ',' + hexToG(paintColor) +
            ',' + hexToB(paintColor) +
            ',' + paintOpacity / 100 + ')';

        $('#paint-preview').css('background-color', state.paintRGBA);
    }

    // Animates the menu sidebar to open or close
    function changeMenuState () {
        var controlSection = $('#control-section');
        var gridSection = $('#grid-section');
        controlSection.toggleClass('control-section-visible');
        gridSection.toggleClass('grid-section-visible');
    }

    // Resets the pixel grid by changing remvong the pixels
    function resetPixelGrid(){
        $('#grid-table').empty();
        var gridSize = $('#grid-size-input').val();
        state.gridSize = gridSize;
        setupPixelGrid(gridSize);
    }

    // Setup all the pixels in the grid based on the grid size given
    function setupPixelGrid(gridSize){
        for ( var i = 0; i < gridSize; i++) {
            $('#grid-table').append('<tr></tr>');
            for ( var j = 0; j < gridSize; j++) {
                var pixelId = "x" + j + "y" + i;
                $('tr:last-child').append("<td id='" + pixelId + "' class='pixel'></td>");
            }
        }
    }

    // Gets the image that is drawn on the canvas
    function getCanvasImage(){

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

        // Set image data for the canvas image to be downloaded
        imgData.data = data;
        ctx.putImageData(imgData,0,0);
        var previewImage = canvas.toDataURL();
        $('#preview-image').attr('src', previewImage);

        return previewImage;
    }

    // Downloads the pixelpad image as a png file
    function downloadImage(link){

        var previewImage = getCanvasImage();
        link.href = previewImage;

        // Get file name to save image under
        var fileName = $('#file-name-input').val();
        link.download = fileName ? fileName : 'favicon.ico';
    }

    // Resizes the pixel grid to fit nicely inside of the #grid-section
    function resizePixelGrid(){
        var width = $('#grid-section').width();
        var height = $('#grid-section').height();
        if( height < width) {
            $('#grid-container').height(height - (height * 0.05));
            $('#grid-container').width(height - (height * 0.05));
        } else {
            $('#grid-container').height(width - (width * 0.05));
            $('#grid-container').width(width - (width * 0.05));
        }
    }

    // Toggle grid lines based on grid-toggle checkbox
    function toggleGridLines(){
        if( this === document || $('#grid-toggle').val() === "1") {
            $('table, th, td ').css('border','1px solid black');
        } else {
            $('table, th, td ').css('border','none');
        }
    }

    // Toggle
    function toggleFullToolMenu(){
        if( this === document || state.showFullMenu ) {
            state.showFullMenu = false;
            $('#secondary-tools').css('display', 'none');
            $('#mask-level').removeClass('visible');


        } else {
            state.showFullMenu = true;
            $('#secondary-tools').css('display','block');
            $('#mask-level').addClass('visible');
        }
    }

    // Updates the grid size input to reflect the value the user has given
    function updateGridSizeAddon() {
        var newSize = $(this).val();
        $('#grid-size-addon').text('x' + newSize);
    }

    // Taken from http://www.javascripter.net/faq/hextorgb.htm
    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}

    // Event listening function calls
    $(window).on('resize', resizePixelGrid);
    $('#control-section-button').on('click', changeMenuState);
    $('#paint-color-input').on('change', updatePaintPreview);
    $('#paint-opacity-input').on('change', updatePaintPreview);
    $('#grid-size-input').on('change', updateGridSizeAddon);
    $('#grid-toggle').on('change', toggleGridLines);
    $('#reset-grid-button').on('click', resetPixelGrid);
    $('#download-button').on('click', function(){downloadImage(this);});
    $('#full-menu-button').on('click', toggleFullToolMenu);
    $('#mask-level').on('click', toggleFullToolMenu);

    // Painting functions
    $(document).on('mousedown touchstart','.pixel', function(event){
        event.preventDefault();
        $(this).css('background-color', state.paintRGBA);
        state.drawing = true;
    });
    $(document).on('mouseover','.pixel', function(event){
        event.preventDefault();
        if (state.drawing) {
            $(this).css('background-color', state.paintRGBA);
        }
    });
    $(document).on('touchmove', '.pixel', function(event){
        event.preventDefault();
        var touchedlement = document.elementFromPoint(event.originalEvent.touches[0].clientX, event.originalEvent.touches[0].clientY);
        if($(touchedlement).hasClass('pixel')){
            $(touchedlement).css('background-color', state.paintRGBA);
        }
    });
    $(document).on('mouseup touchend', '.pixel', function(event){
        event.preventDefault();
        state.drawing = false;
        getCanvasImage();
    });

});
