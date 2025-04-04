
import { InfoIcon, LaptopIcon, MusicIcon, PanelTopIcon, ShoppingBagIcon, TvIcon, ZapIcon } from "lucide-react";
import React from "react";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "entertainment":
      return <TvIcon className="h-4 w-4" />;
    case "productivity":
      return <LaptopIcon className="h-4 w-4" />;
    case "utilities":
      return <ZapIcon className="h-4 w-4" />;
    case "food":
      return <ShoppingBagIcon className="h-4 w-4" />;
    case "music":
      return <MusicIcon className="h-4 w-4" />;
    case "streaming":
      return <PanelTopIcon className="h-4 w-4" />;
    default:
      return <InfoIcon className="h-4 w-4" />;
  }
};
