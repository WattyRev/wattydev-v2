import Ember from 'ember';

export default Ember.Route.extend({
    imagesService: Ember.inject.service('images'),

    postsService: Ember.inject.service('posts'),

    model() {
        return Ember.RSVP.hash({
            images: this.get('imagesService').getImages().then(images => {
                return images.sortBy('createdDate').slice(0,10);
            }),
            posts: this.get('postsService').getPosts().then(posts => {
                return posts.sortBy('createdDate').slice(0,10);
            })
        });
    }
});
