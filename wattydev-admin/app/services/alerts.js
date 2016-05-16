import Ember from 'ember';

export default Ember.Service.extend({
    /**
     * The duration that alerts are displayed for (ms).
     *
     * @property _duration
     * @type {5000}
     * @private
     */
    _duration: 5000,

    /**
     * Display a success message.
     *
     * @method success
     * @param {String} message The text to display in the alert
     * @return {Void}
     */
    success(message) {
        this._displayAlert('success', message);
    },

    /**
     * Display an alert.
     *
     * @method _displayAlert
     * @param {String} type The type of alert to display
     * @param {String} message The text to display in the alert
     * @return {Void}
     * @private
     */
    _displayAlert(type, message) {
        let unique = new Date().getTime();

        // Add the alert to the DOM
        Ember.$('.wd-alerts').append(`
            <div class="wd-alert ${type} alert-${unique}">
                ${message}
            </div>
        `);

        // Add the visible class to animate it into the page
        Ember.run.next(() => {
            Ember.$(`.alert-${unique}`).addClass('visible');
        });
        Ember.run.later(() => {
            // Remove the visible class to animate it out of the page
            Ember.$(`.alert-${unique}`).removeClass('visible');

            // Remove the alert from the DOM when the animation is complete
            Ember.run.later(() => {
                Ember.$(`.alert-${unique}`).remove();
            }, 300);
        }, this.get('_duration'));
    },

    /**
     * Prepare the dom for alerts.
     *
     * @method _pepareStage
     * @return {Void}
     * @private
     */
    _prepareStage: Ember.on('init', function () {
        Ember.$('body').append('<div class="wd-alerts"></div>');
    })
});
