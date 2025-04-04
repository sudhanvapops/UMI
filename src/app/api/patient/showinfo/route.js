"use server"

import { connectdb } from "@/dbconfig/dbConfig";
import PatientRegModel from "@/models/patientRegModel";
import { NextResponse } from "next/server";


connectdb()


export  async function GET(req) {
   try {
     const UserNumber = req?.cookies?.get("User_Number")?.value
 
     if (!UserNumber){
         console.log("No User NUmber")
         return NextResponse.json({
             "Message":"No Cookie Found",
             "ErrMsg":"Please Login"
         },{
             status:400
         })
     }
 
     const User = await PatientRegModel.findOne({
         phone:UserNumber
     }).select("-createdAt -updatedAt -email -age -_id -__v");
 
 
     console.log("USer",User);
 
     return NextResponse.json({
         "Data": User
     },{
         status: 200
     })
   } catch (error) {
    return NextResponse.json({
        "Data": "Something Went Wrong While retriving User Info from DB"
    },{
        status: 500
    })
   }
}


export  async function DELETE(req) {
   try {
     const UserNumber = req?.cookies?.get("User_Number")?.value
 
     if (!UserNumber){
         console.log("No Cookie Exist")
         return NextResponse.json({
             "Message":"No Cookie Found",
             "ErrMsg":"Not Logged In"
         },{
             status:400
         })
     }
 
    // ! Temprory Logout Solution
     const User = await PatientRegModel.findOneAndDelete({
         phone:UserNumber
     })
 
     console.log("USer",User);
 
     const response =  NextResponse.json({
         "Data": User
     },{
         status: 200
     })

     response.cookies.delete('User_Number')

     return response

   } catch (error) {
    return NextResponse.json({
        "Data": "Something Went Wrong While retriving User Info from DB"
    },{
        status: 500
    })
   }
}