
// Utility functions related to billing cycles and calculations

// Function to format billing cycle for display
export const formatBillingCycle = (cycle: string) => {
  switch (cycle) {
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "Quarterly";
    case "biannually":
      return "Bi-annually";
    case "yearly":
      return "Yearly";
    default:
      return cycle;
  }
};

// Calculate normalized monthly cost
export const getMonthlyEquivalent = (amount: number, cycle: string) => {
  switch (cycle) {
    case "weekly":
      return amount * 4.33; // Average weeks in a month
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "biannually":
      return amount / 6;
    case "yearly":
      return amount / 12;
    default:
      return amount;
  }
};

// Calculate time remaining until next billing
export const getTimeRemaining = (nextBillingDate: Date) => {
  const today = new Date();
  const diff = Math.ceil((nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return `In ${diff} days`;
  if (diff < 14) return "Next week";
  return `In ${diff} days`;
};
