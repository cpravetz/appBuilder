import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import './appDef.js';


Schemas.stepSchema = new SimpleSchema({
    command : {
        type : String
        optional : false
    },
    then : {
        // In any command -> forces sequencing
        type: Array,
        optional : true,
    }
});


Schemas.createSchema = new SimpleSchema({
    command : {
        type : String,
        allowedValues: ['create'],
    },
    type : {
        type : String,
        allowedValues : ['file', 'folder'],
        optional : true
    },
    name : {
        type : String,
        optional : false
    },
    binary : {
        type : boolean,
        optional : true
    },
    content : {
        type : String,
        optional : true
    },
    // subItems are created inside this folder
    subItems : {
        type: Array,
        optional : true,
    },
    "subItems.$" : stepSchema
});
Schemas.createSchema.extend(stepSchema);

Schemas.executeSchema = new SimpleSchema({
    command : {
        type : String,
        allowedValues: ['execute'],
    },
    program : {
        type : String,
        optional : false
    },
    params : {
        type : String,
        optional : true
    },
    wait : {
        type : boolean,
        optional : true
    }
});
Schemas.executeSchema.extend(stepSchema);

Schemas.setSchema = new SimpleSchema({
    command : {
        type : String,
        allowedValues: ['set'],
    },
    variable : {
        type : String,
        optional : false
    },
    value : {
        type : String,
        optional : true
    }
});
Schemas.setSchema.extend(stepSchema);


Schemas.appendSchema({
    command : {
        type : String,
        allowedValues: ['append'],
    },
    files : SimpleSchema.oneOf(String,[String]),
    position : {
        type : String,
        allowedValues: ['Start','End','Anchor'],
    },
    anchor : {
        type : String,
        optional : true
    },
    content : {
        type : String,
    }
});
Schemas.appendSchema.extend(stepSchema);

Schemas.replaceSchema = new SimpleSchema({
    command : {
        type : String,
        allowedValues: ['replace'],
    },
    files : SimpleSchema.oneOf(String,[String]),
    find : {
        type : String,
        optional : true
    },
    newValue : {
        type : String,
        optional : true
    }
});
Schemas.replaceSchema.extend(stepSchema);

Schemas.ifSchema = new SimpleSchema({
    command : {
        type : String,
        allowedValues: ['if'],
    },
    condition : {
        type : String,
        optional : true
    },
    true : {
        type: Array, // of step defs
        optional : true,
    },
    false : {
        type: Array,
        optional : true,
    },
});
Schemas.ifSchema.extend(stepSchema);


Schemas.eachSchema = new SimpleSchema({
    command : {
        type : String,
        allowedValues: ['each'],
    }
    array : {
        type : String,
        optional : true
    },
    do : {
        type: Array,
        optional : true,
    },
});
Schemas.eachSchema.extend(stepSchema);


Schemas.buildDef = new SimpleSchema({
    appDefOverrides : {
        // Any configuration changes needed for this build Defintion
        // Some examples including hiding platforms options, setting
        // default values, or forcing a framework
        type: Object,
        optional : true,
        blackbox : true
    },
    steps : Array,
    "steps.$" : SimpleSchema.oneOf([Schemas.createSchema, Schemas.executeSchema,
                                    Schemas.setSchema, Schemas.appendSchema,
                                    Schemas,replaceSchema, Schemas.ifSchema, Schemas.eachSchema]);
});