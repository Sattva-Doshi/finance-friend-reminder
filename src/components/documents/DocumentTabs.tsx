
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentCategory } from "./DocumentUpload";

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

interface DocumentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  categories: readonly string[];
  children: React.ReactNode;
}

export function DocumentTabs({ 
  activeTab, 
  setActiveTab, 
  categories, 
  children 
}: DocumentTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <ScrollArea className="w-full" orientation="horizontal">
        <TabsList className="mb-4 inline-flex w-max">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
      
      <TabsContent value={activeTab} className="space-y-4">
        {children}
      </TabsContent>
    </Tabs>
  );
}
