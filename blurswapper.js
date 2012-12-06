(function() {

/**
 * Turn a list into a text-swapping animated machine
 * Options:
 *      direction:
 *          The direction the text moves in and out. One of 'up' 'down' 'left'
 *          or 'right'
 *      inMoveDist:
 *          How far the text will move when appearing
 *      outMoveDist:
 *          How far the text will move when disappearing
 *      duration:
 *          How long the switching animation lasts
 *      delay:
 *          How long to wait before showing the next item
 *      blurred:
 *          Whether or not to show motion blur on the text (boolean)
 *      windSpeed:
 *          How far each blurred element should be (pixels)
 */
var $makeSwapper = function($swapper, options) {
    options = options || {};

    // Figure out all our options
    var swappers = [],
        index = 0,
        windSpeed = options.windSpeed || 1,
        duration = options.duration || 500,

        height = $swapper.height(),
        direction = options.direction || 'down',
        tween = (direction === 'down' || direction === 'up') ? 'top' : 'left',
        stationary = tween === 'top' ? 'left' : 'top',
        wind = (direction === 'down' || direction === 'right') ? -1 : 1,
        inMoveDist = options.inMoveDist === undefined ?
            (tween === 'left' ? $swapper.width() : $swapper.height()) :
            options.inMoveDist,
        outMoveDist = options.outMoveDist === undefined ?
            (tween === 'left' ? $swapper.width() : $swapper.height()) :
            options.outMoveDist;

    // Create one entry in the swap list
    var makeSwapper = function($elem) {
        var html = $elem.html(),
            range = options.blurred ? options.blurSteps || 10 : 0,
            $blurs = [],
            $blur, $main, css;

        $elem.empty();

        // Create the blurred divs if we are blurring, otherwise defaults to
        // creating main swap div
        for(var x = range; x >= 0; x--) {
            css = {
                position: 'absolute',
                opacity: x ? 0.1 : 1,
                height: $swapper.height() + 'px',
                width: $swapper.width() + 'px',
                'z-index': x ? 1 : 2,
                display: x ? 'none' : 'block'
            };
            css[tween] = (windSpeed * wind * x) + 'px';
            css[stationary] = 0;

            $blur = $('<div></div>').css(css).html(html).appendTo($elem);

            if(x) {
                $blurs.push($blur);
            } else {
                $main = $blur;
            }
        }

        swappers.push({
            $elem: $elem.addClass('swap'),
            $blurs: $blurs,
            $main: $main
        });
    };

    // Turn all the children into swapers
    var elemSel = options.elementSelector;
    (elemSel ? $swapper.find(elemSel) : $swapper.children()).each(function(i, swap) {
        var $s = $(swap);
        i && $s.hide();
        makeSwapper($s);
    });

    // utility function to wrap the index of the swapper we are on
    var wrap = function(num) {
        if (num < 0) {
            return swappers.length + num;
        }
        return num % swappers.length;
    };

    // exectute swap transition
    var swap = function() {
        (function() {
            var showing = swappers[wrap(index + 1)],
                $blurs = showing.$blurs,
                l = $blurs.length - 1,
                lastHidden = -1,
                blurHideStart = options.blurHideStart || 0.75,
                sInc = 1 / (1 - blurHideStart);

            for(var x = 0; x <= l; x++) {
                $blurs[x].show();
            }
            showing.$main.show().css('opacity', 0.8);

            var css = {
                opacity: 0
            };

            // Just replace text, not move it from a direction, in IE8
            if(!($.browser.msie && $.browser.version < 9)) {
                css[tween] = (wind * inMoveDist) + 'px'
            }

            var anim = {
                opacity: 1
            };
            anim[tween] = 0;
                
            // Show each blur div after a short delay as the animation
            // progresses to create the illusion of slowing down
            var step = options.blurred ? function(now, fx) {
                if(now > blurHideStart && fx.prop === 'opacity') {
                    var hidden = Math.round((now - blurHideStart) * sInc * l);
                    $blurs[hidden].hide();
                    if(hidden > lastHidden + 1) {
                        $blurs[lastHidden + 1].hide();
                    }
                    lastHidden = hidden;
                }
            } : function() {};

            showing.$elem.show().css(css).animate(anim, {
                duration: duration,
                step: step
            }).promise().then(function() {
                showing.$main.css('opacity', 1);
            });
        }());

        (function() {
            var hiding = swappers[index],
                $blurs = hiding.$blurs,
                lastShown = $blurs.length,
                l = lastShown - 1,
                blurShowEnd = options.blurShowEnd || 0.25,
                inv = 1 - blurShowEnd,
                sInc = 1 / (1 - blurShowEnd);

            var anim = {
                opacity: 0
            };
            anim[tween] = (-wind * outMoveDist) + 'px';

            // IE8 doesn't do well with opacity animation
            if($.browser.msie && $.browser.version < 9) {
                hiding.$elem.hide();
            }

            var step = options.blurred ? function(now, fx) {
                if(now > blurShowEnd && fx.prop === 'opacity') {
                    var show = l - Math.round(((1 - now) / inv) * l);
                    $blurs[show].show();
                    if(show < lastShown - 1) {
                        $blurs[lastShown - 1].show();
                    }
                    lastShown = show;
                }
            } : function() {}
                
            hiding.$elem.animate(anim, {
                duration: duration,
                step: step
            });
        }());

        index = wrap(index + 1);
    };

    var si;
    var startSwapping = function() {
        si = setInterval(swap, options.delay || 2000);
        return $swapper;
    };

    var stopSwapping = function() {
        clearInterval(si);
        return $swapper;
    };

    $swapper.data('swapper', {
        startSwapping: startSwapping,
        stopSwapping: stopSwapping
    });

    return $swapper;
};

$.fn.blurSwap = function(options) {
    this.each(function(i, item) {
        $makeSwapper($(item), options);
    });
    return this;
};

$.fn.stopSwapping = function() {
    var data = this.data('swapper');
    data && this.data('swapper').stopSwapping();
    return this;
};

$.fn.startSwapping = function() {
    var data = this.data('swapper');
    data && this.data('swapper').startSwapping();
    return this;
};

}());
