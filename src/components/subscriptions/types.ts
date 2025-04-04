
// Common subscription card interface properties
export interface BaseSubscriptionCardProps {
  name: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: Date;
  inactive?: boolean;
}

// Main subscription card props
export interface SubscriptionCardProps extends BaseSubscriptionCardProps {
  id: string;
  category: string;
  website?: string;
  onCancel?: (id: string) => void;
  compact?: boolean;
}

// Props for the compact card variation
export interface CompactCardProps extends BaseSubscriptionCardProps {}

// Props for card details component
export interface CardDetailsProps {
  billingCycle: string;
  category: string;
  amount: number;
  nextBillingDate: Date;
  inactive?: boolean;
}

// Props for card amount component
export interface CardAmountProps {
  amount: number;
  billingCycle: string;
  compact?: boolean;
}

// Props for card footer component
export interface CardFooterProps {
  website?: string;
  inactive?: boolean;
  onOpenWebsite?: () => void;
}

// Props for card menu component
export interface CardMenuProps {
  onCancel: () => void;
  onEdit?: () => void;
}
