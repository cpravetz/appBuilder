import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);
SimpleSchema.debug = true;

Schemas = {};
customFields = [];

Schemas.eventSchema = new SimpleSchema({
    trigger : { type: String, label : 'Event trigger' },
    code : {
        type: String,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    }
});

Schemas.helperSchema = new SimpleSchema({
    trigger : { type: String, label : 'Variable' },
    code : {
        type: String,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    }
});

Schemas.keyPairSchema = new SimpleSchema({
    key : String,
    value : {
        type: SimpleSchema.oneOf(String, String), //function
        autoform: {
            type: 'markdown',
            rows : 6
        }
    }
});

Schemas.parameterSchema = new SimpleSchema({
    parameters: Array,
    "parameters.$" : Schemas.keyPairSchema
});

Schemas.componentCoreSchema = new SimpleSchema({
    name : String,
    title : String,
    containerClass : String,
    cssClass : String,
    titleIconClass : String,
    backgroundImage : String,
    backgroundClass : String,
    bodyText : String,
    scrollSpySelector : String,
    onCreated : {
        type: String,
        label : 'on Created Code',
        optional: true,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    },
    onRendered : {
        type: String,
        label : 'on Rendered Code',
        optional: true,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    },
    onDestroyed : {
        type: String,
        label : 'on Destroyed Code',
        optional: true,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    },
    showCondition : {
        type: String,
        label : 'Visibiity logic',
        optional: true,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    },
    helpers : Array,
    "helpers.$" : Schemas.helperSchema,
    events : Array,
    "events.$" : Schemas.eventSchema,
},
{ tracker: Tracker }
);

Schemas.subscriptionSchema = new SimpleSchema({
    publication : String
});
Schemas.subscriptionSchema.extend(Schemas.parameterSchema);

Schemas.paragraphSchema = new SimpleSchema({
});
Schemas.paragraphSchema.extend(Schemas.componentCoreSchema);
Schemas.paragraphSchema.extend({type : { type: String, autoValue: "paragraph"}});


Schemas.coreDataAwareComponentSchema = new SimpleSchema({
    customDataCode : {
        type: String,
        label : 'Custom Data Code',
        optional: true,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    },
    beforeSubscriptionCode : {
        type: String,
        label : 'Before Subscription Code',
        optional: true,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    },
    emptyCollectionText : String,
    notFoundText : String,
});
Schemas.coreDataAwareComponentSchema.extend(Schemas.subscriptionSchema);
Schemas.coreDataAwareComponentSchema.extend(Schemas.componentCoreSchema);
Schemas.coreDataAwareComponentSchema.extend({type : { type: String, autoValue: "dataAwareComponent"}});

Schemas.childrenSchema = new SimpleSchema({
    pages : Array,
    "pages.$" : { type: Object, blackbox : true },
    components : Array,
    "components.$" : { type: Object, blackbox : true },
});

Schemas.accessSchema = new SimpleSchema({
    access: Array,
    "access.$": {type : Object, optional : true},
    "access.$.role": String,
    "access.$.allowed": SimpleSchema.oneOf(Boolean, String), //function
});

Schemas.formSchema = new SimpleSchema({
    submitRoute: String,
    cancelRoute: String,
    closeRoute: String,
    backRoute: String,
    deleteConfirmMessage : String,
    submitCode: {
        type: String,
        label : 'On Submit Code ',
        optional: true,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    },
    cancelCode: {
        type: String,
        label : 'On Cancel Code ',
        optional: true,
        autoform: {
            type: 'markdown',
            rows : 6
        }
    },
    insertButtonTitle: String,
    detailsButtonTitle: String,
    updateButtonTitle: String,
    submitButtonTitle: String,
    cancelButtonTitle: String,
    closeButtonTitle: String,
});
Schemas.formSchema.extend(Schemas.coreDataAwareComponentSchema);
Schemas.formSchema.extend(Schemas.accessSchema);
Schemas.formSchema.extend({type : { type: String, autoValue: "form"}});

Schemas.divSchema = new SimpleSchema({});
Schemas.divSchema.extend(Schemas.componentCoreSchema);
Schemas.divSchema.extend(Schemas.childrenSchema);
Schemas.divSchema.extend({type : { type: String, autoValue: "div"}});

Schemas.chartSchema = new SimpleSchema({
    //TODO Get D3 stuff in here
});
Schemas.chartSchema.extend(Schemas.componentCoreSchema);
Schemas.chartSchema.extend(Schemas.childrenSchema);
Schemas.chartSchema.extend({type : { type: String, autoValue: "chart"}});


Schemas.layoutSchema = new SimpleSchema({
    appName : String,
    homeRoute : String,
    navBarClass : String,
    metaDescription : String,
    metaTitle : String,
    footer : Schemas.childrenSchema,
    children : Schemas.childrenSchema
});
Schemas.layoutSchema.extend(Schemas.coreDataAwareComponentSchema);
Schemas.layoutSchema.extend(Schemas.accessSchema);
Schemas.layoutSchema.extend({type : { type: String, autoValue: "layout"}});

Schemas.pageSchema = new SimpleSchema({
    template : String,
});
Schemas.pageSchema.extend(Schemas.coreDataAwareComponentSchema);
Schemas.pageSchema.extend(Schemas.accessSchema);
Schemas.pageSchema.extend(Schemas.childrenSchema);
Schemas.pageSchema.extend({type : { type: String, autoValue: "page"}});

Schemas.menuItemSchema = new SimpleSchema({
    route: String,
    url: String,
    target: String,
    routeParams: Array,
    "routeParams.$" : Schemas.keyPairSchema,
});
Schemas.menuItemSchema.extend(Schemas.componentCoreSchema);
Schemas.menuItemSchema.extend({type : { type: String, autoValue: "menuItem"}});

Schemas.menuSchema = new SimpleSchema({
    menuItems : Array,
    "menuItems.$" : Schemas.menuItemSchema,
});
Schemas.menuSchema.extend(Schemas.componentCoreSchema);
Schemas.menuSchema.extend({type : { type: String, autoValue: "menu"}});

Schemas.listViewSchema = new SimpleSchema({
    mode : String,
    views : Array,
    "views.$" : String,
    searchEngineStyle : Boolean,
    pageSize : SimpleSchema.Integer,
});
Schemas.listViewSchema.extend(Schemas.formSchema);
Schemas.listViewSchema.extend(Schemas.childrenSchema);
Schemas.listViewSchema.extend({type : { type: String, autoValue: "listView"}});

Schemas.fieldSchema = new SimpleSchema({
    baseSchema : String,
    fieldName : String,
    defOverride : {type : Object, blackbox : true}
});

