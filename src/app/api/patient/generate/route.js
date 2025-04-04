'use server'

import { NextResponse } from "next/server";
import crypto from 'crypto';
import { connectdb } from "@/dbconfig/dbConfig";
import PatientRegModel from "@/models/patientRegModel"

connectdb()

// Function for generating unique ID
async function generateUniqueId(fourDigit, phoneNumber) {

    const inputString = `${fourDigit}${phoneNumber}`;

    const hash = crypto.createHash("sha256").update(inputString).digest("hex");

    const numericHash = hash.replace(/\D/g, "");

    const uniqueId = numericHash.slice(-10);

    return uniqueId.padStart(10, "0");
}



export async function POST(req) {

    try {

        let Data = await req.json()
        console.log(Data)

        const User = await PatientRegModel.findOne({phone:Data.phone})
        console.log(`User: ${User}`)
        if (User!==null){
            console.log("User already exist")
            return NextResponse.json({
                "Message": "User Alredy Exist",  
            },{
                status: 400
            })
        }

        const uniqueID = await generateUniqueId(Data.adhar, Data.phone)
        console.log("Generated Unique ID:", uniqueID);

        await PatientRegModel.create({
            name: Data.name,
            age: Data.age,
            adhar: Data.adhar,
            phone: Data.phone,
            email: Data.email,
            bloodGroup: Data.bloodGroup,
            uniqueID: uniqueID,
        })

        const response =  NextResponse.json({
            "Status": "Recieved",
            "ID": `ID: ${uniqueID}`,
            "Data": Data
        },{
            status:200
        })

        // !There is no Expiry Handle it
        response.cookies.set('User_Number', Data.phone, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            path: '/',
        });

        return response

    } catch (error) {
        console.error("Error while Generating Unique ID:", error);
        return NextResponse.json({
            "Message": "Something went wrong while Generating Unique ID",
            "Error": error || "Unkown Error"
        }, { status: 500 })
    }
}