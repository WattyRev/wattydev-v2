import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let postsPromise = this.get('posts').getPosts();
        return Ember.RSVP.hash({
            posts: postsPromise
        });
    }
});
