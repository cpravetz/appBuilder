import { Mongo } from 'meteor/mongo';
import { BaseModel } from 'meteor/socialize:base-model';
import SimpleSchema from 'simpl-schema';
import './uiDef.js';
import './buildDef.js';


// Components that are assembled into the UI of an application are defined using the schemas
// here in this file.  Builder uses these component definitions, an actions definition and the
// application definition itself to generate the code/files of the desired application.
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
    childComponentName : String,
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

Schemas.componentSchema = new SimpleSchema({
    name : String,
    ancestor : String,
    children : Array,
    "children.$" : childRelationSchema,
    properties : Array,
    "properties.$" : Schemas.propertySchema,
    steps : Array,
    "steps.$" : SimpleSchema.oneOf([Schemas.createSchema, Schemas.executeSchema,
                                    Schemas.setSchema, Schemas.appendSchema,
                                    Schemas,replaceSchema, Schemas.ifSchema, Schemas.eachSchema]);
});
