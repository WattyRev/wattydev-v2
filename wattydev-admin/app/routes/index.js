import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let postsPromise = this.get('posts').getPosts();
        let imagesPromise = this.get('images').getImages();
        return Ember.RSVP.hash({
            posts: postsPromise,
            images: imagesPromise
        });
    }
});
