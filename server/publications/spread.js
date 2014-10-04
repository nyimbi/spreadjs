Meteor.publish("spreadjs", function(/*taskId*/) {
	return _spreadjs.find(
		{
/*
			userId: this.userId,
			taskId: taskId
*/
		}, {
			fields: {
				index: 1,
				input: 1,
				status: 1,
				cc: 1,
				p_no: 1,
				kc: 1,
				pri_date: 1,
				app_date: 1,
				p_date: 1,
				ipc: 1,
				us_class: 1,
				concept: 1,
				keyword: 1,
				pat_title: 1,
				assignee: 1,
				inventor: 1
			},
			sort: {
				index: 1/*, time: 1*/
			}
		}
	);
});
