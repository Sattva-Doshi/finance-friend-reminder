
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { PlusIcon, FileIcon, Trash2Icon, DownloadIcon, FileTextIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { DocumentUpload, DOCUMENT_CATEGORIES, type DocumentCategory } from "@/components/documents/DocumentUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  description: string;
  created_at: string;
  subscription_id: string | null;
  subscription_name?: string;
  category: DocumentCategory;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | DocumentCategory>('all');
  const { user } = useAuth(true);
  const { toast } = useToast();

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

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileTextIcon className="h-8 w-8 text-red-500" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) 
      return <FileTextIcon className="h-8 w-8 text-green-500" />;
    if (fileType.includes('document') || fileType.includes('word')) 
      return <FileTextIcon className="h-8 w-8 text-blue-500" />;
    return <FileIcon className="h-8 w-8 text-gray-500" />;
  };

  const filteredDocuments = documents.filter(doc => 
    activeTab === 'all' || doc.category === activeTab
  );

  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Financial Documents</h1>
            <p className="text-muted-foreground">Store and manage your important financial documents</p>
          </div>
          
          <Button className="space-x-2" onClick={() => setShowUploadModal(true)}>
            <PlusIcon className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            {DOCUMENT_CATEGORIES.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <span>Loading documents...</span>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
                <FileIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No documents found in this category</p>
                <Button onClick={() => setShowUploadModal(true)}>
                  Upload Your First Document
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <DocumentCard 
                    key={doc.id} 
                    document={doc} 
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    fileIcon={getFileIcon(doc.file_type)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <DocumentUpload 
              onSuccess={() => {
                setShowUploadModal(false);
                fetchDocuments();
              }}
            />
          </DialogContent>
        </Dialog>
      </main>
    </PageTransition>
  );
}

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string, filePath: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  fileIcon: React.ReactNode;
}

const DocumentCard = ({ document, onDelete, onDownload, fileIcon }: DocumentCardProps) => {
  const date = new Date(document.created_at).toLocaleDateString();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          {fileIcon}
          <div className="flex-1 overflow-hidden">
            <h3 className="font-medium truncate" title={document.file_name}>
              {document.file_name}
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
