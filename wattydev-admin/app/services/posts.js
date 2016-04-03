import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service('store'),
    getPosts() {
        return this.get('store').find('post').then(function (data) {
            return data;
        });
    }
});
