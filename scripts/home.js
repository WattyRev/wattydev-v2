WD.Home = {
    _maxPupilMovement: 0,

    _pupilMovementRatio: 0,

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
        this._calculatePupilMovement();
        this._watchMouse();
        this._watchResize();
        this._twitchEye();
    },

    _watchMouse: function () {
        $('body').mousemove(this, this._trackMouse);
    },

    _watchResize: function () {
        $(window).resize(this, this._calculatePupilMovement);
    },

    _calculatePupilMovement: function (e) {
        var self = e ? e.data : this;
        var eye = $('.left-eye');
        var pupil = $('.left-pupil');
        var eyeWidth = eye[0].getBoundingClientRect().width;
        var pupilWidth = pupil[0].getBoundingClientRect().width;
        this._maxPupilMovement = ($('.left-eye')[0].getBoundingClientRect().width / 3) - pupilWidth;
        this._pupilMovementRatio = eyeWidth / 300;

        var eyes = ['left', 'right'];
        eyes.forEach(function (direction) {
            var pupilPosition = $('.' + direction + '-pupil')[0].getBoundingClientRect();
            self._originalPupilPositions[direction] = [pupilPosition.top, pupilPosition.left];
        });
    },

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

    _twitchEye: function () {
        var self = this;
        $('.eye-lid').css({'transform': 'translateY(8px)'});
        setTimeout(function () {
            $('.eye-lid').css({'transform': ''});
        }, 100);

        var nextTwitch = Math.random() * (100 - 3000) + 3000;
        setTimeout(self._twitchEye.bind(self), nextTwitch);
    }
};
