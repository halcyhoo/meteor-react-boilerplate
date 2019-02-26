import '/lib/collections';
import './methods';
import './publications';

Accounts.urls.resetPassword = function(token) {
  return Meteor.absoluteUrl('resetPassword/' + token);
}
