import MasonryGallery from "@/components/masonry-gallery"
import { fetchGalleryImages } from "@/lib/fetch-gallery-images"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
import { siteConfig } from "@/content/site"
import { PlainBubbles } from "@/components/loader/PlainBubbles"
import { TintedDeco } from "@/components/tinted-deco"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import { Camera } from "lucide-react"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const theSeasons = localFont({
  src: "../../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const aboveTheBeyond = localFont({
  src: "../../Font/above-the-beyond-script.otf",
  display: "swap",
  variable: "--font-above-beyond",
})

// Motif colors (app/globals.css)
const BLUE = "var(--color-welcome-heading)"
const NAVY = "var(--color-welcome-navy)"
const SCRIPT = "var(--color-welcome-heading)"
const BODY = "var(--color-welcome-text)"
const SUN = "var(--color-motif-accent)"

// Soft white edge so text stays crisp over the circle pattern
const onBgGlow = "0 1px 0 rgb(255 255 255 / 85%), 0 0 12px rgb(255 255 255 / 70%)"

// Sage hairlines
const sageDividerStyle = {
  background: "linear-gradient(to right, transparent, var(--color-motif-yellow))",
} as const

const sageDividerStyleLeft = {
  background: "linear-gradient(to left, transparent, var(--color-motif-yellow))",
} as const

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[120px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[380px] select-none"

export const dynamic = "force-static"

function OutsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-10 sm:w-16" style={sageDividerStyle} />
      <span className="h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5" style={{ background: SUN }} aria-hidden />
      <span className="h-px w-10 sm:w-16" style={sageDividerStyleLeft} />
    </div>
  )
}

function GalleryTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <h1
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
        } as React.CSSProperties
      }
    >
      <span className="sr-only">{title} — {subtitle}</span>
      <span
        aria-hidden
        className={`${theSeasons.className} block uppercase leading-[0.9] tracking-[0.04em] min-[400px]:tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: NAVY,
          textShadow: onBgGlow,
        }}
      >
        {title}
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-1.5 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2 sm:leading-[0.9]`}
        style={{
          fontSize: "var(--script-size)",
          color: SCRIPT,
          textShadow: onBgGlow,
        }}
      >
        {subtitle}
      </span>
    </h1>
  )
}

export default async function GalleryPage() {
  const gallery = siteConfig.gallery
  const decos = gallery.decos
  const { desktop, mobile } = await fetchGalleryImages()
  // Only public/desktop-background (landscape) + public/mobile-background-new (portrait),
  // interleaved so the masonry columns mix wide and tall shots evenly
  const tag = (category: "desktop" | "mobile") => (image: (typeof desktop)[number]) => ({
    ...image,
    category,
    orientation: (image.width >= image.height ? "landscape" : "portrait") as "portrait" | "landscape",
  })
  const wide = desktop.map(tag("desktop"))
  const tall = mobile.map(tag("mobile"))
  const images = Array.from({ length: Math.max(wide.length, tall.length) }, (_, i) => [wide[i], tall[i]])
    .flat()
    .filter((image): image is (typeof wide)[number] => Boolean(image))

  return (
    <main
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative min-h-screen overflow-x-hidden`}
      style={{ background: "var(--color-bg-pattern-base)" }}
    >
      {/* Same circle pattern as the invitation sections */}
      <PlainBubbles />
      {(
        [
          { src: decos.topLeft, pos: "left-0 top-0" },
          { src: decos.topRight, pos: "right-0 top-0" },
          { src: decos.bottomLeft, pos: "bottom-0 left-0" },
          { src: decos.bottomRight, pos: "bottom-0 right-0" },
        ] as const
      )
        .filter(({ src }) => src)
        .map(({ src, pos }) => (
          <div key={pos} className={`pointer-events-none absolute z-10 ${pos}`}>
            <TintedDeco src={src} className={CORNER_DECO_CLASS} />
          </div>
        ))}

      <section className="relative z-20 mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="relative z-20 mb-8 px-3 text-center sm:mb-10 sm:px-4 md:mb-12">
          {/* Soft white glow so the heading reads cleanly over the circles */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[min(40rem,110%)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: "radial-gradient(ellipse at center, rgb(255 255 255 / 75%) 0%, rgb(255 255 255 / 30%) 50%, transparent 72%)" }}
          />
          {decos.headerOrnament ? (
            <TintedDeco src={decos.headerOrnament} className="mx-auto mb-3 block h-auto w-24 select-none sm:mb-4 sm:w-32 md:w-40" />
          ) : null}
          <div className="mx-auto mb-4 sm:mb-5 md:mb-6">
            <OutsideDivider />
          </div>
          <p
            className={`${cinzel.className} mx-auto mt-4 max-w-[20rem] px-2 text-[0.6875rem] font-semibold uppercase leading-snug tracking-[0.12em] min-[400px]:max-w-none min-[400px]:text-[0.75rem] min-[400px]:tracking-[0.16em] sm:mt-6 sm:text-[0.9375rem] sm:tracking-[0.2em] md:text-base md:tracking-[0.22em]`}
            style={{ color: BLUE, textShadow: onBgGlow }}
          >
            {gallery.eyebrow}
          </p>
          <div className="mx-auto mt-3 sm:mt-4 md:mt-5">
            <GalleryTitle title={gallery.title} subtitle={gallery.subtitle} />
          </div>
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-xl px-2 sm:mt-5 md:mt-6 ${sectionType.textRelaxed}`}
            style={{ color: BODY, textShadow: onBgGlow, fontWeight: 600 }}
          >
            {gallery.description}
          </p>

          <div className="mt-4 flex items-center justify-center gap-1.5 sm:mt-5">
            <span className="h-px w-8 sm:w-12 md:w-16" style={sageDividerStyle} />
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8"
              style={{ background: "#FFFFFF", boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-motif-yellow) 70%, transparent)" }}
              aria-hidden
            >
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: BLUE }} />
            </span>
            <span className="h-px w-8 sm:w-12 md:w-16" style={sageDividerStyleLeft} />
          </div>
        </div>

        {images.length > 0 ? (
          <MasonryGallery images={images} />
        ) : (
          <p
            className={`text-center font-goudy-italic ${sectionType.text}`}
            style={{ color: BODY }}
          >
            No images to display.
          </p>
        )}
      </section>
    </main>
  )
}
