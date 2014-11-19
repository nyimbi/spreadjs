currentUser = function(userId, doc) {
	return true; // (!! userId) && doc && doc.(userId === userId);
}

_spreadjs = new Meteor.Collection("spreadjs");

_spreadjs.allow({
	insert: currentUser,
	remove: currentUser,
	update: currentUser
});
