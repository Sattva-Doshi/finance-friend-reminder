
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileIcon, Trash2Icon, DownloadIcon, FileTextIcon } from "lucide-react";

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

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string, filePath: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  fileIcon: React.ReactNode;
}

export const DocumentCard = ({ document, onDelete, onDownload, fileIcon }: DocumentCardProps) => {
  const date = new Date(document.created_at).toLocaleDateString();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          {fileIcon}
          <div className="flex-1 overflow-hidden">
            <h3 className="font-medium truncate" title={document.title || document.file_name}>
              {document.title || document.file_name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Uploaded on {date}
            </p>
            {document.subscription_name && (
              <div className="mt-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {document.subscription_name}
                </span>
              </div>
            )}
            {document.description && (
              <p className="text-sm mt-2 line-clamp-2">{document.description}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={() => onDownload(document.file_path, document.file_name)}
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(document.id, document.file_path)}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
