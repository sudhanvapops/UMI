import { connectdb } from "@/dbconfig/dbConfig";
import { NextResponse } from "next/server";


connectdb()

export async function POST(req) {

   try {
     const Data = await req.json()
     if (Data) {
        console.log("Data",Data)
        return NextResponse.json({
            "Message":"recieved",
            "Data":Data
        })
     } else {
        return NextResponse.json({
            "Message":"User Not Registered",
        },{
            status:400
        })
     }
   } catch (error) {
        return NextResponse.json({
            "Message": "Qr Code Scanner Error"
        },{
            status:400
        })
   }
}