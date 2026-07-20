import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.175,0.885,0.32,1.1)] outline-none select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary — Forest Ink pill + Linen content; hover lifts to Olive Press (DESIGN.md)
        default:
          "bg-primary text-primary-foreground hover:bg-olive-press",
        // Outlined Ghost — transparent surface + 1px Lichen border, Olive Press text;
        // hover swaps border to Forest Ink (DESIGN.md "Outlined Ghost Button")
        outline:
          "border-lichen bg-transparent text-olive-press hover:border-foreground hover:bg-muted aria-expanded:bg-muted",
        // Secondary — neutral Bone chip (cancel/back/media), tints to Eucalyptus on hover
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-accent aria-expanded:bg-accent",
        // Ghost — transparent, tints to Bone on hover
        ghost:
          "text-foreground hover:bg-muted aria-expanded:bg-muted",
        // Destructive — Crimson Specimen fill + Linen content; hover darkens 8% black
        destructive:
          "bg-destructive text-destructive-foreground hover:[background:color-mix(in_oklab,var(--destructive),#000_8%)]",
        // Link — Crimson emphasis accent
        link: "text-tertiary-link underline-offset-4 hover:underline",
      },
      size: {
        // Geist sizes: medium 40 / small 32 / large 48
        default: "h-10 gap-2 px-2.5 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-8 gap-1.5 px-2.5 text-sm has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-12 gap-2 px-3.5 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-10",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12",
        // Marketing pills (rounded-full ink) — hero + big CTAs
        pill: "h-10 gap-2 rounded-full px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        "pill-lg": "h-12 gap-2 rounded-full px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
