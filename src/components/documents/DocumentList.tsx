
import React from "react";
import { DocumentCard } from "./DocumentCard";
import { FileIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  description: string;
  created_at: string;
  subscription_id: string | null;
  subscription_name?: string;
  category: string;
  title: string;
}

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  handleDelete: (id: string, filePath: string) => void;
  handleDownload: (filePath: string, fileName: string) => void;
  onUploadClick: () => void;
}

export function DocumentList({ 
  documents, 
  isLoading, 
  handleDelete, 
  handleDownload, 
  onUploadClick 
}: DocumentListProps) {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileTextIcon className="h-8 w-8 text-red-500" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) 
      return <FileTextIcon className="h-8 w-8 text-green-500" />;
    if (fileType.includes('document') || fileType.includes('word')) 
      return <FileTextIcon className="h-8 w-8 text-blue-500" />;
    return <FileIcon className="h-8 w-8 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <span>Loading documents...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
        <FileIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">No documents found in this category</p>
        <Button onClick={onUploadClick}>
          Upload Your First Document
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map(doc => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          onDelete={handleDelete}
          onDownload={handleDownload}
          fileIcon={getFileIcon(doc.file_type)}
        />
      ))}
    </div>
  );
}
