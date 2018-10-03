function createD3RangeSlider (rangeMin, rangeMax, containerSelector) {
    "use strict";

    var minWidth = 10;
    var sliderRange = {begin: rangeMin, end: rangeMin};
    var changeListeners = [];
    var container = d3.select(containerSelector);
    var playing = false;
    var resumePlaying = false; 
     var playingRate = 100;
    var containerHeight = container.node().offsetHeight;

    // Set up play button if requested
             var sliderBox = container.append("div")
            .style("position", "relative")
            .style("height", containerHeight + "px")
            .style("min-width", (minWidth*2) + "px")
            .classed("slider-container", true);
    

    //Create elements in container
    var slider = sliderBox
        .append("div")
        .attr("class", "slider");
    var handleW = slider.append("div").attr("class", "handle WW");
    var handleE = slider.append("div").attr("class", "handle EE");

    /** Update the `left` and `width` attributes of `slider` based on `sliderRange` */
    function updateUIFromRange () {
        var conW = sliderBox.node().clientWidth;
        var rangeW = sliderRange.end - sliderRange.begin;
        var slope = (conW - minWidth) / (rangeMax - rangeMin);
        var uirangeW = minWidth + rangeW * slope;
        var ratio = sliderRange.begin / (rangeMax - rangeMin - rangeW);
        if (isNaN(ratio)) {
            ratio = 0;
        }
        var uirangeL = ratio * (conW - uirangeW);

        slider
            .style("left", uirangeL + "px")
            .style("width", uirangeW + "px");
    }

    /** Update the `sliderRange` based on the `left` and `width` attributes of `slider` */
    function updateRangeFromUI () {
        var uirangeL = parseFloat(slider.style("left"));
        var uirangeW = parseFloat(slider.style("width"));
        var conW = sliderBox.node().clientWidth; //parseFloat(container.style("width"));
        var slope = (conW - minWidth) / (rangeMax - rangeMin);
        var rangeW = (uirangeW - minWidth) / slope;
        if (conW == uirangeW) {
            var uislope = 0;
        } else {
            var uislope = (rangeMax - rangeMin - rangeW) / (conW - uirangeW);
        }
        var rangeL = rangeMin + uislope * uirangeL;
        sliderRange.begin = Math.round(rangeL);
        sliderRange.end = Math.round(rangeL + rangeW);

        //Fire change listeners
        changeListeners.forEach(function (callback) {
            callback({begin: sliderRange.begin, end: sliderRange.end});
        });
    }

    // configure drag behavior for handles and slider
    var dragResizeE = d3.behavior.drag()
        .on("dragstart", function () {
            d3.event.sourceEvent.stopPropagation();
            resumePlaying = playing;
            playing = false;
        })
        .on("dragend", function () {
            if (resumePlaying) {
                startPlaying();
            }
        })
        .on("drag", function () {
            var dx = d3.event.dx;
            if (dx == 0) return;
            var conWidth = sliderBox.node().clientWidth; //parseFloat(container.style("width"));
            var newLeft = parseInt(slider.style("left"));
            var newWidth = parseFloat(slider.style("width")) + dx;
            newWidth = Math.max(newWidth, minWidth);
            newWidth = Math.min(newWidth, conWidth - newLeft);
            slider.style("width", newWidth + "px");
            updateRangeFromUI();
        });

    var dragResizeW = d3.behavior.drag()
        .on("dragstart", function () {
            this.startX = d3.mouse(this)[0];
            d3.event.sourceEvent.stopPropagation();
            resumePlaying = playing;
            playing = false;
        })
        .on("dragend", function () {
            if (resumePlaying) {
                startPlaying();
            }
        })
        .on("drag", function () {
            var dx = d3.mouse(this)[0] - this.startX;
            if (dx==0) return;
            var newLeft = parseFloat(slider.style("left")) + dx;
            var newWidth = parseFloat(slider.style("width")) - dx;

            if (newLeft < 0) {
                newWidth += newLeft;
                newLeft = 0;
            }
            if (newWidth < minWidth) {
                newLeft -= minWidth - newWidth;
                newWidth = minWidth;
            }

            slider.style("left", newLeft + "px");
            slider.style("width", newWidth + "px");

            updateRangeFromUI();
        });

    var dragMove = d3.behavior.drag()
        .on("dragstart", function () {
            d3.event.sourceEvent.stopPropagation();
            resumePlaying = playing;
            playing = false;
        })
        .on("dragend", function () {
            if (resumePlaying) {
                startPlaying();
            }
        })
        .on("drag", function () {
            var dx = d3.event.dx;
            var conWidth = sliderBox.node().clientWidth; //parseInt(container.style("width"));
            var newLeft = parseInt(slider.style("left")) + dx;
            var newWidth = parseInt(slider.style("width"));

            newLeft = Math.max(newLeft, 0);
            newLeft = Math.min(newLeft, conWidth - newWidth);
            slider.style("left", newLeft + "px");

            updateRangeFromUI();
        });

    handleE.call(dragResizeE);
    handleW.call(dragResizeW);
    slider.call(dragMove);

    //Click on bar
    sliderBox.on("mousedown", function (ev) {
        var x = d3.mouse(sliderBox.node())[0];
        var props = {};
        var sliderWidth = parseFloat(slider.style("width"));
        var conWidth = sliderBox.node().clientWidth; //parseFloat(container.style("width"));
        props.left = Math.min(conWidth - sliderWidth, Math.max(x - sliderWidth / 2, 0));
        props.left = Math.round(props.left);
        props.width = Math.round(props.width);
        slider.style("left", props.left + "px")
            .style("width", props.width + "px");
        updateRangeFromUI();
    });

    //Reposition slider on window resize
    window.addEventListener("resize", function () {
        updateUIFromRange();
    });

    function onChange(callback){
        changeListeners.push(callback);
        return this;
    }

    function setRange (b, e) {
        sliderRange.begin = b;
        sliderRange.end = e;

        updateUIFromRange();

        //Fire change listeners
        changeListeners.forEach(function (callback) {
            callback({begin: sliderRange.begin, end: sliderRange.end});
        });
    }

    function range(b, e) {
        var rLower;
        var rUpper;

        if (typeof b === "number" && typeof e === "number") {

            rLower = Math.min(b, e);
            rUpper = Math.max(b, e);

            //Check that lower and upper range are within their bounds
            if (rLower < rangeMin || rUpper > rangeMax) {
                  rLower = Math.max(rLower, rangeMin);
                rUpper = Math.min(rUpper, rangeMax);
            }

            //Set the range
            setRange(rLower, rUpper);
        } else if (typeof b === "number") {

            rLower = b;
            var dif = sliderRange.end - sliderRange.begin;
            rUpper = rLower + dif;

            if (rLower < rangeMin) {
                rLower = rangeMin;
            }
            if(rUpper > rangeMax){
                rLower = rangeMax - dif;
                rUpper = rangeMax;
            }

            setRange(rLower, rUpper);
        }

        return {begin: sliderRange.begin, end: sliderRange.end};
    }

       function frameTick() {
        if (!playing) {
            return;
        }

        var limitWidth = rangeMax - rangeMin + 1;
        var rangeWidth = sliderRange.end - sliderRange.begin + 1;
        var delta = Math.min(Math.ceil(rangeWidth / 10), Math.ceil(limitWidth / 100));

        // Check if playback has reached the end
        if (sliderRange.end + delta > rangeMax) {
            delta = rangeMax - sliderRange.end;
            stopPlaying();
        }

        setRange(sliderRange.begin + delta, sliderRange.end + delta);

        setTimeout(frameTick, playingRate);
    }

    function startPlaying(rate) {
        if (rate !== undefined) {
            playingRate = rate;
        }

        if (playing) {
            return;
        }

        playing = true;
        if (playButton) {
            playSymbol.style("visibility", "hidden");
            stopSymbol.style("visibility", "visible");
        }
        frameTick();
    }

    function stopPlaying() {
        playing = false;
        if (playButton) {
            playSymbol.style("visibility", "visible");
            stopSymbol.style("visibility", "hidden");
        }
    }

    setRange(sliderRange.begin, sliderRange.end);

    return {
        range: range,
        startPlaying: startPlaying,
        stopPlaying: stopPlaying,
        onChange: onChange
    };
}
