export function initialize(container, application) {
    application.inject('route', 'images', 'service:images');
    application.inject('component', 'posts', 'service:posts');
}

export default {
  name: 'images',
  initialize: initialize
};
