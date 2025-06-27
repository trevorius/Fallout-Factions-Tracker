"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

function MultiSelect({
  options,
  selected,
  onChange,
  className,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              selected
                .map((s) => options.find((o) => o.value === s)?.label)
                .filter(Boolean)
                .map((l) => (
                  <span
                    key={l}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                  >
                    {l}
                  </span>
                ))
            ) : (
              <span className="text-muted-foreground">
                {props.placeholder ?? "Select options"}
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    );
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
