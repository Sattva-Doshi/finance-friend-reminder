
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentUpload, DOCUMENT_CATEGORIES } from "@/components/documents/DocumentUpload";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentTabs } from "@/components/documents/DocumentTabs";
import { useDocuments } from "@/hooks/use-documents";

export default function Documents() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const { user } = useAuth(true);
  const { documents, isLoading, fetchDocuments, handleDelete, handleDownload } = useDocuments();

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

        <DocumentTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          categories={DOCUMENT_CATEGORIES}
        >
          <DocumentList 
            documents={filteredDocuments}
            isLoading={isLoading}
            handleDelete={handleDelete}
            handleDownload={handleDownload}
            onUploadClick={() => setShowUploadModal(true)}
          />
        </DocumentTabs>

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
