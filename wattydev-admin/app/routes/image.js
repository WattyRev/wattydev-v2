import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        let id = params.imageId;
        let imagePromise = this.get('images').getImage(id);
        return Ember.RSVP.hash({
            image: imagePromise
        });
    }
});
