import React from 'react';

const ALL_DAMASCUS_RADIUS = 999;

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedRadius: number;
  onSelectRadius: (rad: number) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedRadius,
  onSelectRadius,
}) => {
  return (
    <section className="flex flex-col gap-stack-sm">
      {/* Radius Control */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap ml-2">النطاق:</span>
        {[1, 2, 4, 10].map((rad) => (
          <button
            key={rad}
            onClick={() => onSelectRadius(rad)}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${
              selectedRadius === rad
                ? 'bg-primary-container text-on-primary-container'
                : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {rad} كم
          </button>
        ))}
        <button
          onClick={() => onSelectRadius(ALL_DAMASCUS_RADIUS)}
          className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${
            selectedRadius === ALL_DAMASCUS_RADIUS
              ? 'bg-primary-container text-on-primary-container'
              : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          كل دمشق
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};
