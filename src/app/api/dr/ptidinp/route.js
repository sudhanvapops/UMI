import { connectdb } from "@/dbconfig/dbConfig";
import PatientRecordModel from "@/models/patientRecordModel";
import { NextResponse } from "next/server";


connectdb()

export async function POST(req) {
   try {
     const Data = await req.json()
     console.log("Data",Data.id)

     const User = await PatientRecordModel.find({
        patientID: Data.id
     })

     if(User.length === 0){
         console.log("No User Found")
         return NextResponse.json({
             "Message": "No User Found"
            },{
                status: 400
            })
        }
        
    console.log("User",User)

     return NextResponse.json({
         "UserID": User.patientID
     })
   } catch (error) {
    return NextResponse.json({
        "Message": "Fetching Patient Record Error"
    },{
        status: 500
    })
   }
}