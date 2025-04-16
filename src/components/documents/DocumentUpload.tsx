
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { FileIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface DocumentUploadProps {
  subscriptionId?: string;
}

export function DocumentUpload({ subscriptionId }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${subscriptionId ? `subscriptions/${subscriptionId}/` : ''}${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('financial_docs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('financial_documents')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          description,
          subscription_id: subscriptionId || null,
          user_id: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });

      // Reset form
      setFile(null);
      setDescription('');
      
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
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      {file && (
        <div className="flex items-center gap-2 text-sm">
          <FileIcon className="h-4 w-4" />
          <span>{file.name}</span>
        </div>
      )}

      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading || !user}
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
  );
}
