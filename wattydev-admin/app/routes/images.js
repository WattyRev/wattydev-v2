import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the images service.
     *
     * @property imagesService
     * @type {Ember.Service}
     */
    imagesService: Ember.inject.service('images'),

    model() {
        let imagesPromise = this.get('imagesService').getAll();
        return Ember.RSVP.hash({
            images: imagesPromise
        });
    }
});
