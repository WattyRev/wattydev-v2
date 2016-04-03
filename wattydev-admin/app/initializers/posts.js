export function initialize(container, application) {
    application.inject('route', 'posts', 'service:posts');
    application.inject('component', 'posts', 'service:posts');
}

export default {
  name: 'posts',
  initialize: initialize
};
