import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let imagesPromise = this.get('images').getImages();
        return Ember.RSVP.hash({
            images: imagesPromise
        });
    }
});
