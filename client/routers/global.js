Router.configure({
	layoutTemplate: "layoutTemplate",
	loadingTemplate: "loadingTemplate",
	notFoundTemplate: "notFoundTemplate"
});

Router.onBeforeAction("loading");
