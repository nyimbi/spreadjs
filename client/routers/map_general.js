Router.map(function () {
	this.route("noAccessTemplate", {
		path: "/",
	});
});

Router.map(function () {
	this.route("spreadjs", {
		onBeforeAction: function() {
			// Session.set('taskId', this.params.taskId);
		},
		path: "/spreadjs",
		waitOn: function() {
			return Meteor.subscribe("spreadjs"/*, this.params.taskId*/);
		}
	});
});
