"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import FileManager from "@/components/DR/FileCard/FileCard";
import toast from 'react-hot-toast';

const ptinfoDash = () => {

    const [UserID, setUserID] = useState(null);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        // Retrieve from localStorage
        const storedData = localStorage.getItem("UserID");
        setUserID(storedData);

        async function fetchData() {
            try {
                const res = await axios.post("/api/dr/ptinfoDash", { UserID: storedData })
                console.log("Response: ", res)
                setRecords(res.data.Data)
                toast.success("User Records Found")
            } catch (error) {
                console.log("Error While Retriving Patient Record", error.response.data.Message)
                toast.error(error.response.data.Message)
            }

        }

        fetchData()

    }, []);

    return (
        <div>
            {records ? (

                <div className="container mx-auto">
                    <FileManager patientRecords={records} />
                </div>

            ) : "Search The Patient First"}
        </div>
    )
}

export default ptinfoDash
