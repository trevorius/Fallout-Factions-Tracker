"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

type Item = {
  id: string;
  name: string;
};

type TemplateSectionProps = {
  title: string;
  items: Item[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
};

export function TemplateSection({
  title,
  items,
  selectedIds,
  onSelectedIdsChange,
}: TemplateSectionProps) {
  const handleSelectAll = () => {
    onSelectedIdsChange(items.map((item) => item.id));
  };

  const handleDeselectAll = () => {
    onSelectedIdsChange([]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeselectAll}>
            Deselect All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${item.id}`}
              checked={selectedIds.includes(item.id)}
              onCheckedChange={(checked) => {
                const newSelectedIds = checked
                  ? [...selectedIds, item.id]
                  : selectedIds.filter((id) => id !== item.id);
                onSelectedIdsChange(newSelectedIds);
              }}
            />
            <label
              htmlFor={`${title}-${item.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.name}
            </label>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground">No items to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
