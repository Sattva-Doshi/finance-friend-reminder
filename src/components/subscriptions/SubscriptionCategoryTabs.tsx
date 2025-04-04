
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export const categories = [
  { id: "entertainment", name: "Entertainment", color: "bg-purple-500" },
  { id: "productivity", name: "Productivity", color: "bg-blue-500" },
  { id: "utilities", name: "Utilities", color: "bg-yellow-500" },
  { id: "food", name: "Food & Dining", color: "bg-orange-500" },
  { id: "health", name: "Health & Fitness", color: "bg-green-500" },
  { id: "music", name: "Music", color: "bg-green-500" },
  { id: "streaming", name: "Streaming", color: "bg-purple-500" },
  { id: "other", name: "Other", color: "bg-gray-500" },
];

interface SubscriptionCategoryTabsProps {
  activeCategory: string;
  onChange: (value: string) => void;
}

export function SubscriptionCategoryTabs({ activeCategory, onChange }: SubscriptionCategoryTabsProps) {
  return (
    <div className="w-full overflow-hidden">
      <ScrollArea className="w-full pb-4" orientation="horizontal">
        <TabsList className="mb-4 inline-flex w-max">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </ScrollArea>
    </div>
  );
}
