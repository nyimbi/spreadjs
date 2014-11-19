Router.configure({
    layoutTemplate: "layoutTemplate",
    loadingTemplate: "loadingTemplate",
    notFoundTemplate: "notFoundTemplate",

    progressSpinner: false
});

Router.onBeforeAction("loading");
