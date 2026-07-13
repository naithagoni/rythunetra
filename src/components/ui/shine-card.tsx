import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Vercel "resource card": an interactive bordered surface whose ring brightens
 * on hover while a diagonal specular shine sweeps across (CSS `.card-shine`,
 * reduced-motion aware). Optional patterned illustration zone at the top.
 *
 * Use `asChild` to render as a link:
 *   <ShineCard asChild><Link to="…">…</Link></ShineCard>
 * With `asChild`, the illustration + shine are slotted inside the child element
 * via <Slot.Slottable>, so the whole card stays a single interactive element.
 */
function ShineCard({
  className,
  children,
  asChild = false,
  illustration,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
  /** Optional top zone content (rendered over a faint dot pattern). */
  illustration?: React.ReactNode
}) {
  const Comp = asChild ? Slot.Root : "div"

  const decor = illustration != null && (
    <div className="bg-dots relative flex h-32 items-center justify-center overflow-hidden border-b border-border/60 bg-muted/30">
      {illustration}
    </div>
  )
  const shine = <span aria-hidden className="card-shine" />

  return (
    <Comp
      data-slot="shine-card"
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-card text-card-foreground shadow-card ring-1 ring-gray-alpha-300 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover hover:ring-foreground/25",
        className
      )}
      {...props}
    >
      {asChild ? (
        <>
          {decor}
          <Slot.Slottable>{children}</Slot.Slottable>
          {shine}
        </>
      ) : (
        <>
          {decor}
          {children}
          {shine}
        </>
      )}
    </Comp>
  )
}

export { ShineCard }
