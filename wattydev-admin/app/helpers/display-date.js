import Ember from "ember";

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

export default Ember.Helper.helper(function(params) {
    let value = params[0];
    let month = MONTHS[value.getMonth()];
    let date = value.getDate();
    let year = value.getFullYear();
    let hour = value.getHours() > 13 ? value.getHours() - 12 : value.getHours();
    if (!hour) {
        hour = 12;
    }
    let minutes = value.getMinutes();
    let ampm = value.getHours() > 11 ? 'PM' : 'AM';

    return `${month} ${date}, ${year} ${hour}:${minutes} ${ampm}`;
});
