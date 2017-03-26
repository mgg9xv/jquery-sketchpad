/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, exports) {

$(document).ready(function(){

    // Initialize state
    var state = {
        drawing: false,
        gridSize: 16,
        paintRGBA: 'rgba(0,128,255,1)',
        // pixelXBoundary:
        // pixelYBoundary:
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

    // Downloads the pixelpad image as a png file
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

        // Set image data for the canvas image to be downloaded
        imgData.data = data;
        ctx.putImageData(imgData,0,0);
        link.href= canvas.toDataURL();

        // Get file name to save image under
        var fileName = $('#file-name-input').val();
        link.download = fileName ? fileName : 'image.png';
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
        if( this === document || this.checked) {
            $('table, th, td ').css('border','1px solid black');
        } else {
            $('table, th, td ').css('border','0');
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
    });

});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map