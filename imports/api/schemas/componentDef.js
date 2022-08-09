import { Mongo } from 'meteor/mongo';
import { BaseModel } from 'meteor/socialize:base-model';
import SimpleSchema from 'simpl-schema';
import './uiDef.js';


// Components that are assembled into the UI of an application are defined using the schemas
// here in this file.  Builder uses these component definitions, an actions definition and the
// application definition itself to generate the code/files of the desired application.
//

Schemas.propertySchema = new SimpleSchema({
    name : String,
    type : String,  //data type of the property
    required : {
        type: Boolean,
        defaultValue : true
    },
    label : {
        type : String,
        optional : true
    }
});

Schemas.childRelationSchema = new SimpleSchema({
    child : String,
    required : {
        type: Boolean,
        defaultValue : true
    },
    limitToOne : {
        type: Boolean,
        defaultValue : false,
    },
    order : Number
});

Schemas.componentSchema = new SImpleSchema({
    name : String,
    ancestor : String,
    children : Array,
    "children.$" : childRelationSchema,
    properties : Array,
    "properties.$" : childRelationSchema,
    //TODO Add the logic for rendering this component at design time and for pushing it into the code
    // rules : Array,
    // "rules.$" : ruleSchema,
});

Schemas.ruleSchema = new SimpleSchema({
    command  : {
        type: String,
        allowedValues : ['create','execute','set','get','append','replace', 'if', 'each']
    },
    parameters : Array,
    "parameter.$" : Object,
    "parameter.$.name" : String,
    "parameter.$.object" : String,
    children : {
        type : Array,
        optional : true
    },
    "children.$" : {
        type : Schemas.ruleSchema,
    }
});


Schemas.appDefSchema = new SimpleSchema({
    name : String,
    version : Number,
    steps : Array,
    "steps.$" : Schemas.ruleSchema
});


// Rules...
/*
Create - folder
       - file (from a template)
Replace in file
        in string (template field with property/variable)
Set variable
Get variable
Append to file  - top
                - bottom
Execute command
*/