import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('posts');
  this.route('post', { path: 'posts/:postId' });
  this.route('new-post', { path: 'posts/new' });
  this.route('images');
  this.route('image', { path: 'images/:imageId' });
  this.route('new-image', { path: 'images/new' });
  this.route('login');
  this.route('tags');
  this.route('tag', { path: 'tags/:tagId' });
  this.route('types');
  this.route('type', { path: 'types/:typeId' });
});

export default Router;
