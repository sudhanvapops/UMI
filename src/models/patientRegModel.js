import mongoose, { Schema } from 'mongoose';

const PatientRegSchema = new Schema(
    {

        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true, 
        },
        email: {
            type: String,
            required: true,
            unique: true, 
        },
        bloodGroup: {
            type: String,
            required: true,
        },
        // patientRecord: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     // ! Need work
        //     ref: 'User'            
        // },
        uniqueID: {
            type: Number,
            required: true,
            unique: true, 
        },
        EmergencyFilePath:{
            type:String,
            default: "",
        }
    }, {
    timestamps: true, 
})

const PatientRegModel = mongoose.models.PatientRegModel || mongoose.model('PatientRegModel', PatientRegSchema,"patientReg")

export default PatientRegModel