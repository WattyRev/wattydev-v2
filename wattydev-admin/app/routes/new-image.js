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

    model() {
        return {
            image: this.get('imagesService').createNew()
        };
    },

    actions: {
        /**
         * View specified image page.
         *
         * @method viewImage
         * @return {Void}
         */
        viewImage(id) {
            this.get('alertsService').success('Your image has been saved');
            this.transitionTo('image', id);
        }
    }
});
