import Vue from 'vue';

appBuilder = new AppBuilder({
    
});

appBuilder.load({async:true}).then(app => {
    window.app = app;
})


