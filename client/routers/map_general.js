Router.map(function () {
	this.route("noAccessTemplate", {
		path: "/",
	});
});

Router.map(function () {
	this.route("spreadjs", {
		onBeforeAction: function() {
            // if (typeof(this.params.taskId) != "undefined" && this.params.taskId != null) Session.set("taskId", this.params.taskId);
            // else Router.go("signout");

			this.next();
		},
		path: "/spreadjs",
		waitOn: function() {
			return Meteor.subscribe("spreadjs"/*, this.params.taskId*/);
		}
	});
});
