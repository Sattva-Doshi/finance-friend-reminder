
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { FileIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { DOCUMENT_CATEGORIES, DocumentCategory } from "./types";

interface DocumentUploadProps {
  subscriptionId?: string;
  onSuccess?: () => void;
}

export { DOCUMENT_CATEGORIES, type DocumentCategory };

export function DocumentUpload({ subscriptionId, onSuccess }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Other');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Set default title as file name without extension
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!file || !user || !title.trim()) return;
    
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${subscriptionId && subscriptionId !== "none" ? `subscriptions/${subscriptionId}/` : ''}${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('financial_docs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('financial_documents')
        .insert({
          title,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          description,
          category,
          subscription_id: subscriptionId && subscriptionId !== "none" ? subscriptionId : null,
          user_id: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });

      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('Other');
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      toast({
        title: 'Error uploading document',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {subscriptionId ? (
        <div className="flex flex-col space-y-4">
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
          />
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading || !user || !title.trim()}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
          />

          <Input
            placeholder="Document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <ScrollArea className="w-full" orientation="horizontal">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as DocumentCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document category" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ScrollArea>

          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          {file && (
            <div className="flex items-center gap-2 text-sm">
              <FileIcon className="h-4 w-4" />
              <span>{file.name}</span>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading || !user || !title.trim()}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
