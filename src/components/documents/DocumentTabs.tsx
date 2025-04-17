
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentCategory, DOCUMENT_CATEGORIES } from "./types";

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
      <div className="relative w-full">
        <ScrollArea className="w-full pb-4" orientation="horizontal">
          <TabsList className="mb-4 inline-flex w-max">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>
      
      <TabsContent value={activeTab} className="space-y-4">
        {children}
      </TabsContent>
    </Tabs>
  );
}
