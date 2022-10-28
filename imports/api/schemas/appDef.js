import { Mongo } from 'meteor/mongo';
import { BaseModel } from 'meteor/socialize:base-model';
import SimpleSchema from 'simpl-schema';
import './uiDef.js';

// AppDefs is the collection housing application definitions.  These are defined by the schema structures
// below.  Each application is made up mainly of four parts - configuration, data/collections, UI/templates, and
// files.

export const AppDefs = new Mongo.Collection("cktApps");

AppDefs.allow({
    insert: function(userId, doc) {
            return Meteor.user({fields: {'_id':1}}) != null;
    },
    update: function(userId, doc) {
        return (Roles.userIsInRole(userId,['admin']) || (userId = doc.userId));
    },
    remove: function(userId, doc) {
        return (Roles.userIsInRole(userId,['admin']) || (userId = doc.userId));
    }
});

SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      not_a_role: "Default role is not in list of roles",
    },
  },
});

// The configuration should be defined in the buildSchema and not as a fixed schema itself.
Schemas.configurationSchema = new SimpleSchema({
    name : {
        // Used as folder name by the app constructor
        type: String,
        label: "Application Name",
        optional : false,
    },
    title : {
        type: String,
        label: "Application Title",
        optional : false,
    },
    buildConfigDef : {
        // URL to the definition file for this type of Application
        type : String,
        optional : false,
        autoform : {
            type: 'hidden'
        }
    },
    // Is this definition shared?  If so, it can be published in a
    // library of application definitions.
    public : Boolean,
    rendering : {
        type: String,
        label: "Application Front-end",
        optional : false,
        // TODO Add Angular, Vue, and others as appropriate
        // For some application builders, this may be a forced value
        allowedValues: ["React", "Blaze"]
    },
    framework : {
        type: String,
        label: "Application Styling Framework",
        optional : false,
        allowedValues: ["Tailwind", "Material","Bootstrap 4"]
    },
    platforms : Object,
    "platforms.web" : {
        type: Boolean,
        defaultValue : true,
        label: 'Web'
    },
    "platforms.ios" : {
        type: Boolean,
        defaultValue : false,
        label: 'iOS'
    },
    "platforms.android" : {
        type: Boolean,
        defaultValue : false,
        label: 'Android'
    },
    "platforms.windows" : {
        type: Boolean,
        defaultValue : false,
        label: 'Android'
    },
    "platforms.linux" : {
        type: Boolean,
        defaultValue : false,
        label: 'Android'
    },
    roles : {
        type : Array,
        defaultValue : function() { return ["admin", "user"]}
    },
    "roles.$" : String,
    defaultRole : {
        type : String,
        label : "Default role on registration",
        custom : function() {
            if (this.value !== null && !(this.value in this.field('roles').value)) {
                return "Default role is not in list of roles";
            }
        }
    },
    packages : Object,
    "packages.meteor" : Array,
    "packages.meteor.$" :
        { type: String, optional : true},
    "packages.npm" : Array,
    "packages.npm.$" :
        { type: String, optional : true},
    "packages.composer" : Array,
    "packages.composer.$" :
        { type: String, optional : true},
    "packages.git" : Array,
    "packages.git.$" :
        { type: String, optional : true},
    clientStartUpCode : {
        type: String,
        label: "Client start-up code",
        optional : true,
        autoform : {
            type: 'code',
            rows : 6
        }
    },
    serverStartUpCode : {
        type: String,
        label: "Server start-up code",
        optional : true,
        autoform : {
            type: 'code',
            rows : 6
        }
    },
    globalOnRendered : {
        type: String,
        label : "Global onRendered function",
        optional : true
    },
    icons : {
        type: Array,
        optional : true
    },
    "icons.$" : Object,
    "icons.$.key" : {
        type : String,
        allowedValues : ['app_store','iphone_2x','iphone_3x','ipad_2x','ipad_pro','ios_settings_2x','ios_settings_3x','ios_spotlight_2x',
                         'ios_spotlight_3x','ios_notification_2x','ios_notification_3x','android_mdpi','android_hdpi','android_xhdpi',
                         'android_xxhdpi','android_xxxhdpi'],
        autoform : {
            type : 'select'
        }
    },
    "icons.$.file" : String,
    launchScreens : {
        type : Array,
        optional : true
    },
    "launchScreens.$" : Object,
    "launchScreens.$.key": {
        type : String,
        allowedValues : ['ios_universal','ios_universal_3x','Default@2x~universal~comany',
                        'Default@2x~universal~comcom','Default@3x~universal~anycom','Default@3x~universal~comany',
                        'Default@2x~iphone~anyany','Default@2x~iphone~comany','Default@2x~iphone~comcom',
                        'Default@3x~iphone~anyany','Default@3x~iphone~anycom (2208x1242)','Default@3x~iphone~comany',
                        'Default@2x~ipad~anyany','Default@2x~ipad~comany','android_mdpi_portrait',
                        'android_mdpi_landscape','android_hdpi_portrait','android_hdpi_landscape',
                        'android_xhdpi_portrait','android_xhdpi_landscape','android_xxhdpi_portrait',
                        'android_xxhdpi_landscape','android_xxxhdpi_portrait','android_xxxhdpi_landscape'],
        autoform : {
            type : 'select'
        }
    },
    "launchScreens.$.file" : String
});


Schemas.actionHookSchema = new SimpleSchema({
    before : {
        type: String,
        optional : true,
        autoform : {
            type: 'code',
            rows : 6
        }
    },
    after : {
        type : String,
        optional : true,
        autoform : {
            type: 'code',
            rows : 6
        }
    }
});

Schemas.formFieldBuilder = new SimpleSchema({
    type : {
        type: String,
        allowedValues: ["file", "calendar", "clock", "select", "multi_select", "radio", "checkbox", "text", "textbox", "richtext"]
    },
    format: {
        type: String,
        optional : true,
        label: 'Display format'
    },
    group : String,
    afFieldInput: Object,
    'afFieldInput.data': Object,
    'afFieldInput.type' : String,
    'afFieldInput.rows' : SimpleSchema.Integer,
    'afFieldInput.class' : String,
    options : SimpleSchema.oneOf(Array, String), //function
    "options.$" : {type : String, optional : true},
    lookupQueryName : {type : String, optional : true},
    lookupQueryKey : {type : String, optional : true},
    lookupQueryLabel : {type : String, optional : true},
});

Schema.fieldSchema = new SimpleSchema({
    optional : SimpleSchema.oneOf(Boolean, String), //function
    regEx : SimpleSchema.oneOf(String, Array, String), //function
    "regEx.$" : { type : String, optional : true, label: 'RegEx'},
    min : {
        type: SimpleSchema.oneOf(Number, Date, String), //function
        label: 'Minimum Value',
        autoform:{
            type: function() {
                if (this.field('type').value in ['Number','SimpleSchema.Integer','Date','Time']) {
                    return 'hidden'
                } else {
                    return null
                }
            }
            }
        },
    max : {
        type: SimpleSchema.oneOf(Number, Date, String), //function
        label: 'Maximum Value'
    },
    exclusiveMin : SimpleSchema.oneOf(Boolean, String), //function
    exclusiveMax : SimpleSchema.oneOf(Boolean, String), //function
    minCount : SimpleSchema.oneOf(SimpleSchema.Integer, String), //function
    maxCount : SimpleSchema.oneOf(SimpleSchema.Integer, String), //function
    allowedValues : SimpleSchema.oneOf(Array, String), //function
    "allowedValues.$": {type : String, optional : true},
    skipRegExCheckForEmptyStrings : SimpleSchema.oneOf(Boolean, String), //function
    blackBox : Boolean,
    trim : Boolean,
    defaultValue : {type : String, optional : true},
    autoValue : {type : String, optional : true},
    customValidator: {
        type : String,
        optional : true,
        autoform : {
            type : 'code',
            rows : 6,
        }
    },
    formFieldBuilder : Schemas.formFieldBuilder,
    visibleIn : Array,
    "visibleIn.$" : {
        type: String,
        allowedValues: ['card','table','input','update','readOnly']
    },
    searchable: Boolean,
    sortable: Boolean,
    joinCollection : {
        type: String,
        optional: true
        //allowedValues: function() { return "collection names"}
    }
});
Schemas.fieldSchema.extend(Schemas.propertySchema);

Schemas.schemaSchema = new SimpleSchema({
    fields: {type: Array, optional: true},
    "fields.$": Schemas.fieldSchema,
    useTracker: Boolean
});


Schemas.collectionSchema =new SimpleSchema({
    name : {
        type: String,
        label : "Collection Name"
    },
    type : {
        type: String,
        defaultValue: "collection",
        autoform: {
            type: "hidden"
        }
    },
    hooks : {type: Object, optional: true},
    "hooks.insert" : {type: Schemas.actionHookSchema, optional : true, label: 'Insert Hooks'},
    "hooks.update" : {type: Schemas.actionHookSchema, optional : true, label: 'Update Hooks'},
    "hooks.remove" : {type: Schemas.actionHookSchema, optional : true, label: 'Remove Hooks'},
    clean: Object,
    "clean.autoConvert": {type: Boolean, defaultValue: false},
    "clean.filter": {type: Boolean, defaultValue: false},
    "clean.getAutoValues": {type: Boolean, defaultValue: false},
    "clean.removeEmptyStrings": {type: Boolean, defaultValue: false},
    "clean.removeNullsFromArray": {type: Boolean, defaultValue: false},
    "clean.trimStrings": {type: Boolean, defaultValue: false},
    schema : Schemas.schemaSchema,
    allow: {type: Object, optional: true},
    "allow.read": Array,
    "allow.read.$": {
        type: String,
        allowedValues: function() {
            //return roles
        }
    },
    "allow.insert": Array,
    "allow.insert.$": {
        type: String,
        allowedValues: function() {
            //return roles
        }
    },
    "allow.update": Array,
    "allow.update.$": {
        type: String,
        allowedValues: function() {
            //return roles
        }
    }
});

Schemas.publicationSchema = new SimpleSchema({
    name : String,
    parameters : Array,
    "parameters.$" : String,
    run : {
        type: String,
        autoform: {
            type: 'code',
            rows : 6
        }
    },
    collections : Array,
    "collections.$" : Object,
    "collections.$.name" : String,
    "collections.$.joinKey" : String,
    tests: { type: Array, optional : true},
    "tests.$" : {
        type: String,
        autoform: {
            type: 'code',
            rows : 6
        }
    },
    options : String
});

Schemas.codeSchema = new SimpleSchema({
    name : String,
    code : {
        type: String,
        autoform: {
            type: 'code',
            rows : 6
        }
    }
});

Schemas.querySchema = new SimpleSchema({
    name : String,
    source : {type: String, label: 'Publication'},
    parameters : Array,
    "parameters.$" : Schemas.keyPairSchema
});

Schemas.methodSchema = new SimpleSchema({
    name : String,
    serverOnly : {type: Boolean, label: 'Run on server only' },
    params: Array,
    "params.$" : Object,
    "params.$.name": String,
    runCode: {
        type: String,
        autoform: {
            type: 'code',
            rows : 6
        },
        label: 'Run function'
    },
    tests: { type: Array, optional : true},
    "tests.$" : {
        type: String,
        autoform: {
            type: 'code',
            rows : 6
        }
    },
});

Schemas.fileSchema = new SimpleSchema({
    name : String,
    type : {
        type : String,
        autoValue : 'file'
    },
    content : String,
    binary : Boolean
});

Schemas.folderSchema = new SimpleSchema({
    name : String,
    type : {
        type : String,
        autoValue : 'folder'
    },
    children : Array,
    "children.$" : Object, //{type : SimpleSchema.oneOf(Schemas.folderSchema, Schemas.fileSchema)},
});


Schemas.auditTrail = new SimpleSchema({
		userId: {//user to created it
		    type: String,
		    optional: false,
		    autoValue: function() {
                if (this.isInsert) {
		            return Meteor.userId()
		        }
		    },
		    autoform: {
		        type: "hidden"
		    }
		},
		createdAt: { //new Date() of place insert
		    type: Date,
		    optional: false,
		    autoValue: function() {
                if (this.isInsert) {
           		    return new Date()
           		}
            },
		    autoform: {
		        type: "hidden"
		    }
		},
		modifiedAt: { //new Date() of place insert
		    type: Date,
		    optional: false,
		    autoValue: function() {
                if (this.isInsert || this.isUpdate) {
           		    return new Date()
           		}
            },
		    autoform: {
		        type: "hidden"
		    }
		},
		modifiedBy: {
		    type: String,
		    optional: false,
		    autoValue: function() {
                if (this.isInsert || this.isUpdate) {
		            return Meteor.userId()
		        }
		    },
		    autoform: {
		        type: "hidden"
		    }
		}
});

Schemas.pubSubSchema = new SimpleSchema({
    collections : Array,
    "collections.$" : Schemas.collectionSchema,
    publications : Array,
    "publications.$" : Schemas.publicationSchema,
});

Schemas.appSchema = new SimpleSchema({
    version : {
        type: Number,
        optional: false,
        autoValue : function() { return Meteor.settings.version || 0},
        label: 'Builder version',
        autoform: {
            type: 'hidden'
        }
    },
    configuration : {
        type: object,
        blackbox : true
    },
    data : SimpleSchema.oneOf(Schemas.pubSubSchema),
    layouts : Array,
    "layouts.$" : Schemas.layoutSchema,
    folders: Array,
    "folders.$" : Schemas.folderSchema,
});
Schemas.appSchema.extend(Schemas.auditTrail);


export class AppDef extends BaseModel {

}


AppDef.attachCollection(AppDefs);
AppDef.appendSchema(Schemas.appSchema);

AppDefs.attachSchema(Schemas.appSchema);
