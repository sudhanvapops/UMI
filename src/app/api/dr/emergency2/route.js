import { connectdb } from "@/dbconfig/dbConfig";
import PatientRegModel from "@/models/patientRegModel";
import { NextResponse } from "next/server";

connectdb()

// Querying Database for emergency Report
export async function POST(req) {

    try {
        const { id } = await req.json()
        console.log("ID: ",id)

        const User = await PatientRegModel.findOne({
            uniqueID: id
        })


        if (User.length === 0 ) {
            return NextResponse.json({
                "Message": "No User Found"
            },{
                status:400
            })
        }
        console.log("User",User)

        let filePath = User.EmergencyFilePath

        filePath = filePath.replace(/^@/, '')

        console.log("Emergency Path",filePath)


        return NextResponse.json(
            {
                "FilePath":filePath
            }
        )

    } catch (error) {
        return NextResponse.json({
            "Message": "Error In Emergency",
            "Error": error
        },{
            status:400
        })
    }
}