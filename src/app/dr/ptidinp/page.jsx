"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import QrScannerButton from "@/components/Qrscanner/Qrscanner";

export default function PatientInfoPage() {

  const [id, setId] = useState("");
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id.length === 10) {
        console.log("Submitting ID:", id);
        const res = await axios.post("/api/dr/ptidinp", { id })
        console.log("Response", res);
        setId("")
        toast.success("User Records Found")
        localStorage.setItem("UserID", id);
        router.push("/dr/ptinfoDash")
      } else {
        console.log("ID must be 10 digits");
      }
    } catch (error) {
      console.log("Error Fetching Data", error);
      toast.error(error.response.data.Message)
    }
  };


  const handleScanData = async (data) => {

    if (typeof data === 'object') {
      try {
        const response = await axios.post("/api/dr/qrdecode", data);
        console.log("QR Response", response);
        setId(`${response.data.Data.uniqueID}`)
        toast.success("User Found")
      } catch (error) {
        console.error("API error:", error?.response.data.Message);
        toast.error(error?.response.data.Message)
      }
    }
  };


  const handleEmergency = async (e) => {
    e.preventDefault();
    try {
      if (id.length === 10) {
        console.log("Submitting ID:", id);
        const res = await axios.post("/api/dr/emergency2", { id })
        console.log("Response", res);
        setId("")
        localStorage.setItem("UserID", id);
        localStorage.setItem("EMFile",res.data.FilePath)
        toast.success("User Emergency Records Found")
        router.push("/dr/emergency")
      } else {
        console.log("ID must be 10 digits");
      }
    } catch (error) {
      console.log("Error Fetching Data", error);
      toast.error(error.response.data.Message)
    }
  }


  return (

    <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Patient Information</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="patientId" className="block text-md font-medium text-gray-700 mb-1">
              Enter 10-digit ID
            </label>

            <Input
              id="patientId"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              maxLength={10}
              placeholder="Enter your ID"
              suppressHydrationWarning
            />
            {id.length > 0 && id.length < 10 && (
              <p className="text-sm text-red-500 mt-1">ID must be 10 digits</p>
            )}
          </div>

          <div className="flex justify-between gap-4 pt-2">

            <QrScannerButton onScanData={handleScanData} />

            <Button
              type="submit"
              className="flex-1"
              disabled={id.length !== 10}
              suppressHydrationWarning
            >
              Submit
            </Button>

          </div>
          <Button
            onClick={handleEmergency}
            className="flex-1 w-full bg-red-500 hover:bg-red-700 font-bold"
            disabled={id.length !== 10}
            suppressHydrationWarning
          >
            Emergency
          </Button>
        </div>
      </form>
    </div>
  );
}