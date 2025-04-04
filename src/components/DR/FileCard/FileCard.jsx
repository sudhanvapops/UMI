import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, FileText, Image, File, ExternalLink } from "lucide-react";

// File icons for different file types
const FileIcon = ({ fileType }) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <Image className="h-5 w-5 text-blue-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

// Helper function to convert @/records/... to actual path
const convertFilePath = (path) => {
  // Handle paths with @/ prefix
  if (path.startsWith('@/')) {
    // Replace @/ with the appropriate base path for your application
    return path.replace('@/', '/');
  }
  return path;
};

// Thumbnail preview component
const ThumbnailPreview = ({ file }) => {
  const fileType = file.filepath.split('.').pop().toLowerCase();
  const actualPath = convertFilePath(file.filepath);
  
  if (['jpg', 'jpeg', 'png'].includes(fileType)) {
    return (
      <div className="h-24 w-full bg-gray-100 rounded-md overflow-hidden">
        <img 
          src={actualPath} 
          alt={file.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  } else if (fileType === 'pdf') {
    return (
      <div className="h-24 w-full bg-red-50 rounded-md flex items-center justify-center">
        <FileIcon fileType="pdf" />
        <span className="ml-2 text-sm text-gray-600">PDF Document</span>
      </div>
    );
  } else {
    return (
      <div className="h-24 w-full bg-gray-100 rounded-md flex items-center justify-center">
        <FileIcon fileType={fileType} />
        <span className="ml-2 text-sm text-gray-600">{fileType.toUpperCase()} File</span>
      </div>
    );
  }
};

// Individual file card component
const FileCard = ({ file, openFile }) => {
  const fileType = file.filepath.split('.').pop().toLowerCase();
  const fileDate = new Date(file.createdAt);
  const isRecent = (new Date() - fileDate) < (7 * 24 * 60 * 60 * 1000); // 7 days
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all cursor-pointer group"
      onClick={() => openFile(file)}
    >
      <CardContent className="p-0">
        <ThumbnailPreview file={file} />
        <div className="p-3">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium text-gray-800 truncate">{file.name}</h3>
            <div className="flex items-center gap-1 ml-2 shrink-0">
              <FileIcon fileType={fileType} />
              <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="mt-2 space-y-1">
            {isRecent && <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">Recent</Badge>}
            <p className="text-xs text-gray-500">{format(new Date(file.createdAt), "dd MMM yyyy, HH:mm")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Doctor section component (inner category)
const DoctorSection = ({ doctorName, files, openFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Collapsible 
      className="mb-2 border border-gray-200 rounded-md"
      open={isExpanded}
      onOpenChange={setIsExpanded}
    >
      <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-gray-50 text-left">
        {isExpanded ? 
          <ChevronDown className="h-4 w-4 text-gray-500 mr-2" /> : 
          <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
        }
        <div className="flex items-center">
          <span className="text-sm font-medium">{doctorName}</span>
          <Badge className="ml-2 text-xs" variant="outline">{files.length}</Badge>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-3">
          {files.map((file) => (
            <FileCard key={file._id || file.id} file={file} openFile={openFile} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Hospital section component (outer category)
const HospitalSection = ({ hospitalName, doctorFiles, openFile }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const totalFiles = Object.values(doctorFiles).reduce((sum, files) => sum + files.length, 0);

  return (
    <Collapsible 
      className="mb-6 bg-white rounded-lg border shadow-sm"
      open={isExpanded}
      onOpenChange={setIsExpanded}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-gray-50 rounded-t-lg">
        <div className="flex items-center">
          {isExpanded ? 
            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" /> : 
            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
          }
          <h2 className="text-lg font-semibold text-gray-700">{hospitalName}</h2>
          <Badge className="ml-3" variant="secondary">{totalFiles} files</Badge>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="p-4">
        {Object.entries(doctorFiles).map(([doctorName, files]) => (
          <DoctorSection 
            key={doctorName}
            doctorName={doctorName} 
            files={files} 
            openFile={openFile} 
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

// Main file manager component
const FileManager = ({ patientRecords }) => {
  const [categorizedFiles, setCategorizedFiles] = useState({});
  
  // Function to open file in new tab or viewer
  const openFile = (file) => {
    const actualPath = convertFilePath(file.filepath);
    window.open(actualPath, '_blank');
  };
  
  // Categorize files based on hospital and then by doctor
  useEffect(() => {
    if (!patientRecords || patientRecords.length === 0) return;
    
    const categorized = patientRecords.reduce((hospitals, record) => {
      const hospital = record.uploadedByHospital;
      const doctor = record.uploadedByDr;
      
      if (!hospitals[hospital]) {
        hospitals[hospital] = {};
      }
      
      if (!hospitals[hospital][doctor]) {
        hospitals[hospital][doctor] = [];
      }
      
      hospitals[hospital][doctor].push(record);
      return hospitals;
    }, {});
    
    setCategorizedFiles(categorized);
  }, [patientRecords]);
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
        <Badge variant="outline" className="text-sm">
          {patientRecords?.length || 0} Total Files
        </Badge>
      </div>
      
      {Object.entries(categorizedFiles).map(([hospital, doctorFiles]) => (
        <HospitalSection 
          key={hospital} 
          hospitalName={hospital} 
          doctorFiles={doctorFiles} 
          openFile={openFile}
        />
      ))}
      
      {patientRecords?.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border shadow-sm">
          <File className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-medium">No records found</p>
          <p className="text-sm">Upload patient records to see them here.</p>
        </div>
      )}
    </div>
  );
};

export default FileManager;