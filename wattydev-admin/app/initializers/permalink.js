export function initialize(container, application) {
    application.inject('route', 'permalink', 'service:permalink');
    application.inject('component', 'permalink', 'service:permalink');
    application.inject('controller', 'permalink', 'service:permalink');
}

export default {
    name: 'permalink',
    initialize: initialize
};
