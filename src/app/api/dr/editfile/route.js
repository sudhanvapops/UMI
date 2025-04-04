import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST(req) {

   try {
     const {filepath,content} = await req.json()
     const fullPath = path.join(process.cwd(), 'public', filepath);
 
     fs.writeFileSync(fullPath, content, (err) => {
         if (err) {
           console.error("Error writing file:", err);
         } else {
           console.log("File successfully overwritten!");
         }
       });
 
     return NextResponse.json({
         "Message": "File Rewritten"
     })
   } catch (error) {
        return NextResponse.json({
            "Message": "Error Rewriting File"
        },{
            status: 400
        })
   }
}