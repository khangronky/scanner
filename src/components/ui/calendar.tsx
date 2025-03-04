"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "bg-transparent",
        months: "flex flex-col relative",
        month: "space-y-4 min-w-[276px] text-center p-2 font-semibold shrink-0",
        caption: "hidden",
        nav: "flex justify-between absolute top-0 left-0 right-0",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 gap-1",
        weekday:
          "text-muted-foreground rounded-md font-normal text-[0.8rem] text-center",
        row: "grid grid-cols-7 gap-1 mt-2",
        day: "text-center text-sm p-0 relative w-9",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-full rounded-md p-0 font-normal transition-colors duration-300",
          "aria-selected:bg-foreground aria-selected:text-background",
          "hover:bg-accent/50 hover:text-accent-foreground",
          "hover:aria-selected:bg-foreground hover:aria-selected:text-background"
        ),
        selected: "!bg-foreground !text-background rounded-md",
        today: "bg-accent text-accent-foreground rounded-md font-medium",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        range_start: "!bg-foreground !text-background rounded-l-md",
        range_end: "!bg-foreground !text-background rounded-r-md",
        range_middle: "aria-selected:bg-foreground/20",
        hidden: "invisible",
        month_grid: "w-full",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
