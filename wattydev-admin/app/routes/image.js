import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the images service.
     *
     * @property imagesService
     * @type {Ember.Service}
     */
    imagesService: Ember.inject.service('images'),

    /**
     * Instance of the alerts service.
     *
     * @property alertsService
     * @type {Ember.Service}
     */
    alertsService: Ember.inject.service('alerts'),

    model(params) {
        return Ember.RSVP.hash({
            image: this.get('imagesService').getOne(params.imageId)
        });
    },

    actions: {
        /**
         * The image has been saved.
         *
         * @method saved
         * @return {Void}
         */
        saved() {
            this.get('alertsService').success('Your image has been updated');
        },

        /**
         * The image has been deleted.
         *
         * @method deleted
         * @return {Void}
         */
        deleted() {
            this.get('alertsService').success('Your image has been deleted');
            this.transitionTo('images');
        }
    }
});
