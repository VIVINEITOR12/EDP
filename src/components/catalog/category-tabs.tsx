import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  subcategories: Array<{ key: string; name: string }>;
  activeSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
}

export function CategoryTabs({ 
  subcategories, 
  activeSubcategory, 
  onSubcategoryChange 
}: CategoryTabsProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSubcategoryChange("all")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm",
            activeSubcategory === "all"
              ? "bg-gradient-to-r from-gold to-gold-light text-white shadow-md"
              : "bg-card text-muted-foreground hover:bg-gold/10 hover:text-gold border border-border/50"
          )}
        >
          Todos
        </button>
        
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.key}
            onClick={() => onSubcategoryChange(subcategory.key)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm",
              activeSubcategory === subcategory.key
                ? "bg-gradient-to-r from-gold to-gold-light text-white shadow-md"
                : "bg-card text-muted-foreground hover:bg-gold/10 hover:text-gold border border-border/50"
            )}
          >
            {subcategory.name}
          </button>
        ))}
      </div>
    </div>
  );
}