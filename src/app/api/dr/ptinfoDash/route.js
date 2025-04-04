import { connectdb } from "@/dbconfig/dbConfig";
import PatientRecordModel from "@/models/patientRecordModel";
import { NextResponse } from "next/server";


connectdb()

// Post request for retriving all the users Record
export async function POST(req) {

    try {
        const UserID = await req.json()
    
        const User = await PatientRecordModel.find({
            patientID: UserID.UserID
        }).sort({ createdAt: -1 })
        
        if(User.length === 0){
            return NextResponse.json({
                "Message":"User Not Found"
            },{
                status:400
            })
        }
    
        console.log("User: ",User)
        
        return NextResponse.json({
            "Data":User
        })
        
    } catch (error) {
        console.log("Something went wrong while Retriving patient Records",error)
        return NextResponse.json({
            "Message":"Something went wrong while Retriving patient Records"
        },{
            status:500
        })
    }
}