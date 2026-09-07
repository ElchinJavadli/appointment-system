import { Hand, Scissors, Leaf, Dumbbell, Smile, Gem, Package } from "lucide-react";

const CATEGORY_ICON_MAP: any = {
  Massage: Hand,
  Hair: Scissors,
  Skincare: Leaf,
  Fitness: Dumbbell,
  Dental: Smile,
  Nails: Gem,
};

export function CategoryIcon({ category, className, style }: any) {
  const Icon = CATEGORY_ICON_MAP[category] || Package;
  return <Icon className={className} style={style} strokeWidth={1.75} />;
}