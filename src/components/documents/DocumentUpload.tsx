
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { FileIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface DocumentUploadProps {
  subscriptionId?: string;
  onSuccess?: () => void;
}

export const DOCUMENT_CATEGORIES = [
  'Invoices',
  'Receipts',
  'Statements',
  'Tax Documents',
  'Other'
] as const;

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number];

export function DocumentUpload({ subscriptionId, onSuccess }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Other');
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
      const filePath = `${subscriptionId && subscriptionId !== "none" ? `subscriptions/${subscriptionId}/` : ''}${fileName}`;

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
      <Input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
      />
      
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
