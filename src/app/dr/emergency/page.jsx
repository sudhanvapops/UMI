import TextFileEditor from '@/components/DR/Editor/Editor';
import React from 'react'

const emergencyPage = () => {


    return (
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">Emergency Data </h1>
          <TextFileEditor />
        </div>
      );
}

export default emergencyPage
