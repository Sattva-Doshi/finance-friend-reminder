
export interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  description: string;
  created_at: string;
  subscription_id: string | null;
  subscription_name?: string;
  category: DocumentCategory;
  title: string;
}

export const DOCUMENT_CATEGORIES = [
  'Invoices',
  'Receipts',
  'Statements',
  'Tax Documents',
  'Other'
] as const;

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number];
