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
        let imagesPromise = this.get('imagesService').getAll().then(images => {
            return images.sort(function (a,b) {
                return b.get('createdDate').getTime() - a.get('createdDate').getTime();
            });
        });
        return Ember.RSVP.hash({
            images: imagesPromise
        });
    }
});
