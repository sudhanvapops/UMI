'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TextFileEditor = ({ filePath }) => {

    const [content, setContent] = useState("Sudhanva")
    const [isSaving, setIssaving] = useState(false)
    const [filepath,setFilePath] = useState("")


    // ! Fetch the conentet
    useEffect(() => {
        try {
            const filepath = localStorage.getItem("EMFile")
            setFilePath(filepath)
            const fetchFileContent = async () => {
                const response = await axios.post("/api/dr/fetchfile", {
                    filepath: filepath,
                })
                setContent(response.data.Content)
            }
            fetchFileContent()
            toast.success("Emergency File Fetched")
        } catch (error) {
            console.log("Error Frontned While reading from E File", error)
        }
    }, [])

    const handleSave = async () => {
        try {
            setIssaving(true);
    
            const response = await axios.post("/api/dr/editfile", {
                content: content,
                filepath: filepath
            })
    
            console.log("Rewrite Response",response)
            setIssaving(false);
            toast.success("File Saved")
        } catch (error) {
            toast.error("Error Saving File")
        }
    }


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Edit File: {filePath}</h2>
            <textarea
                className="w-full p-2 border border-gray-300 rounded h-[70vh] mb-4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSave}
                disabled={isSaving}
            >
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default TextFileEditor;