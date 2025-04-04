
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/common/Card";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import React from "react";

interface CardFooterProps {
  website?: string;
  inactive?: boolean;
  onOpenWebsite?: () => void;
}

export const SubscriptionCardFooter = ({ 
  website, 
  inactive = false,
  onOpenWebsite
}: CardFooterProps) => {
  if (!website && !inactive) return null;
  
  if (inactive) {
    return (
      <CardFooter className="pt-2 pb-4">
        <div className="w-full flex items-center justify-center text-sm text-muted-foreground">
          <XIcon className="h-3.5 w-3.5 mr-1.5" />
          <span>Subscription canceled</span>
        </div>
      </CardFooter>
    );
  }
  
  if (website) {
    return (
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onOpenWebsite}
        >
          <ExternalLinkIcon className="h-3.5 w-3.5 mr-2" />
          Visit Website
        </Button>
      </CardFooter>
    );
  }
  
  return null;
};
