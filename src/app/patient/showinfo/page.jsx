"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import QRCode from "react-qr-code";

const showinfoPage = () => {

    const [QrData, setQrData] = useState()
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("/api/patient/showinfo")
                console.log("Response", res.data.Data)
                setQrData(res.data.Data)
                toast.success("QR Generated")
            } catch (error) {
                console.error("Something went wrong in fetcing Qr", error)
                toast.error(error.response.data.ErrMsg)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 space-y-5">
            {QrData ? (
                <>

                    <div className="p-4 bg-white rounded-lg shadow-lg">
                        <QRCode
                            value={JSON.stringify(QrData)}
                            size={250} // Increased size for better visibility
                            className="rounded-lg shadow-xl"
                        />
                    </div>


                    <div className="px-6 py-3 bg-green-400 font-bold text-2xl rounded-xl shadow-md flex flex-col justify-center items-center">
                        <span>Name: {QrData.name}</span>
                        <span>User ID: {QrData.uniqueID}</span>
                    </div>

                    <div>

                     {/* Temprory logout by deleting User DB */}
                        <button
                        onClick={async ()=>{
                            const res = await axios.delete("/api/patient/showinfo")
                            console.log("REspose Deleting",res)
                            toast.success("Logout Succesfully")
                            router.push("/patient/generate")
                        }} 
                        className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-2xl font-bold cursor-pointer">
                            Logout
                        </button>
                    </div>
                </>
            ) : (
                <h1 className="text-gray-800 font-bold text-3xl animate-pulse">
                    Loading QR Code...
                </h1>
            )}
        </div>
    )
}

export default showinfoPage
