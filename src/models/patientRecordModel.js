import mongoose, { Schema } from 'mongoose';


const PatientRecordSchema = new Schema(
    {
        patientID: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        filepath: {
            type: String,
            required: true,
        },
        uploadedByHospital: {
            type: String,
            required: true,
        },
        uploadedByDr: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);


const PatientRecordModel =
    mongoose.models.PatientRecordModel ||
    mongoose.model('PatientRecordModel', PatientRecordSchema, "PatientRecord");

export default PatientRecordModel;
