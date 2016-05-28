WD.Home = {
    /**
     * The max distance that the pupil can move.
     *
     * @property _maxPupilMovement
     * @type {Number}
     * @default 0
     * @private
     */
    _maxPupilMovement: 0,

    /**
     * The ratio of pupil movement to mouse movement.
     *
     * @property _pupilMovementRatio
     * @type {Number}
     * @default 0
     * @private
     */
    _pupilMovementRatio: 0,

    /**
     * The original position of the pupils.
     *
     * @property _originalPupilPositions
     * @type {Object}
     * @private
     */
    _originalPupilPositions: {
        left: [0,0],
        right: [0,0]
    },

    /**
     * Initialization.
     *
     * @method init
     * @return {Void}
     */
    init: function () {
        if (!$('.home').length) {
            return;
        }
        this._calculatePupilMovement();
        this._watchMouse();
        this._watchResize();
        this._twitchEye();
        this._initializeTooltip();
        this._followMouseWithTooltip();
    },

    /**
     * Watch for mouse movement.
     *
     * @method _watchMouse
     * @return {Void}
     * @private
     */
    _watchMouse: function () {
        $('body').mousemove(this, this._trackMouse);
    },

    /**
     * Watch for window resizing.
     *
     * @method _watchResize
     * @return {Void}
     * @private
     */
    _watchResize: function () {
        $(window).resize(this, this._calculatePupilMovement);
    },

    /**
     * Calculate some constants for pupil movement.
     *
     * @method _calculatePupilMovement
     * @return {Void}
     * @private
     */
    _calculatePupilMovement: function (e) {
        var self = e ? e.data : this;
        var eye = $('.left-eye');
        var pupil = $('.left-pupil');
        var eyeWidth = eye[0].getBoundingClientRect().width;
        var pupilWidth = pupil[0].getBoundingClientRect().width;
        this._maxPupilMovement = ($('.left-eye')[0].getBoundingClientRect().width / 3) - pupilWidth;
        this._pupilMovementRatio = eyeWidth / 1200;

        var eyes = ['left', 'right'];
        eyes.forEach(function (direction) {
            var pupil = $('.' + direction + '-pupil');

            pupil.css('transform', '');
            var pupilPosition = pupil[0].getBoundingClientRect();
            self._originalPupilPositions[direction] = [pupilPosition.top, pupilPosition.left];
        });
    },

    /**
     * Track mouse movement and follow with eyes.
     *
     * @method _trackMouse
     * @param {Object} e
     * @return {Void}
     * @private
     */
    _trackMouse: function (e) {
        var eyes = ['left', 'right'];
        var mouseLeft = e.pageX;
        var mouseTop = e.pageY;
        var self = e.data;

        eyes.forEach(function (direction) {
            var pupil = $('.' + direction + '-pupil');
            var translateY = (mouseTop - self._originalPupilPositions[direction][0]) * self._pupilMovementRatio;
            if (translateY > self._maxPupilMovement) {
                translateY = self._maxPupilMovement;
            }
            if (translateY * -1 > self._maxPupilMovement) {
                translateY = -1 * self._maxPupilMovement;
            }
            var translateX = (mouseLeft - self._originalPupilPositions[direction][1]) * self._pupilMovementRatio;
            if (translateX > self._maxPupilMovement) {
                translateX = self._maxPupilMovement;
            }
            if (translateX * -1 > self._maxPupilMovement) {
                translateX = -1 * self._maxPupilMovement;
            }
            pupil.css({'transform':'translate(' + translateX + 'px,' + translateY + 'px)'});
        });
    },

    /**
     * Twitch the eye.
     * NOTE loops randomly every .1 - 3 seconds.
     *
     * @method _twitchEye
     * @return {Void}
     * @private
     */
    _twitchEye: function () {
        var self = this;
        $('.eye-lid').css({'transform': 'translateY(8px)'});
        setTimeout(function () {
            $('.eye-lid').css({'transform': ''});
        }, 100);

        var nextTwitch = Math.random() * (100 - 3000) + 3000;
        setTimeout(self._twitchEye.bind(self), nextTwitch);
    },

    _initializeTooltip: function () {
        $('[data-tooltip]').mouseover(this, this._showTooltip);
        $('[data-tooltip]').mouseout(this, this._hideTooltip);
    },

    _showTooltip: function (e) {
        var target = $(e.target);
        var text = target.attr('data-tooltip');
        var self = e.data;

        // Add tooltip to dom
        var tooltip = $('<div class="tooltip">' + text + '</div>');
        $('body').append(tooltip);
        tooltip.css({'transform': this._tooltipPosition});
        tooltip.fadeIn();
    },

    _hideTooltip: function (e) {
        $('.tooltip').stop().fadeOut(function () {
            $(this).remove();
        });
    },

    _tooltipPosition: '',

    _calculateTooltipPosition: function (e) {
        var self = e.data;
        self._tooltipPosition = 'translate(' + (e.clientX + 10) + 'px,' + (e.clientY - 15) + 'px)';
        $('.tooltip').css({'transform': self._tooltipPosition});
    },

    _followMouseWithTooltip: function () {
        $('body').on('mousemove', this, this._calculateTooltipPosition);
    }
};
