
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface Document {
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

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('financial_documents')
        .select(`
          *,
          subscriptions (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedDocs = data.map((doc: any) => ({
        ...doc,
        subscription_name: doc.subscriptions?.name || null
      }));
      
      setDocuments(formattedDocs);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('financial_docs')
        .remove([filePath]);
      
      if (storageError) throw storageError;
      
      const { error: dbError } = await supabase
        .from('financial_documents')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('financial_docs')
        .download(filePath);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to download document',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  return {
    documents,
    isLoading,
    fetchDocuments,
    handleDelete,
    handleDownload
  };
}
