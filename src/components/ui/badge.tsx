import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        // Category tag — sage-tinted field-note fill
        default: "bg-accent text-foreground [a]:hover:bg-accent/80",
        secondary:
          "bg-muted text-muted-foreground [a]:hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground [a]:hover:bg-destructive/90",
        outline:
          "border-lichen text-olive-press [a]:hover:bg-muted",
        ghost:
          "hover:bg-muted hover:text-muted-foreground",
        link: "text-tertiary-link underline-offset-4 hover:underline",
        // Field-note tag (DESIGN.md "Category Tag") — Fragment Mono, uppercase,
        // tracked. For short EN labels/IDs only; NOT for dynamic Telugu content.
        eyebrow:
          "bg-accent text-olive-press font-mono text-[11px] tracking-[0.04em] uppercase [a]:hover:bg-accent/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
