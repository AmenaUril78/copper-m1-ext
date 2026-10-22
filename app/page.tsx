import Image from "next/image";
import { SiteFooter } from "@/components/copper/site-footer";
import { SiteHeader } from "@/components/copper/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatMemory,
  formatNotesHours,
  formatUsd,
  getPlans,
  getPrivacySummary,
  getProducts,
  type Plan,
} from "@/lib/copper/catalog";

// Alt text, captions and sizes for the lifestyle photos, keyed by image path.
// Which photos appear, and for which product, comes from the catalog.
const LIFESTYLE: Record<
  string,
  { alt: string; caption: string; width: number; height: number }
> = {
  "/assets/lifestyle/copper-home-desert-light.png": {
    alt: "Copper Home speaker on a stone counter beside a window with a desert sunset",
    caption: "Copper Home keeps the house in sync, from sunrise to sunset.",
    width: 1672,
    height: 941,
  },
  "/assets/lifestyle/copper-notes-stone-desk.png": {
    alt: "Copper Notes recorder and its charging disc on a stone desk in warm light",
    caption: "Copper Notes sits on your desk, ready when ideas arrive.",
    width: 1672,
    height: 941,
  },
  "/assets/lifestyle/copper-notes-golden-hour.png": {
    alt: "Person in a cream shirt writing in a notebook with Copper Notes clipped to the pocket",
    caption: "Clip Copper Notes on and capture every idea hands-free.",
    width: 1536,
    height: 1024,
  },
};

// What paying yearly saves over twelve monthly payments, worked out from the
// catalog so it follows any price change.
function yearlySavings(plan: Plan): number {
  return Math.round((plan.monthlyUsd * 12 - plan.annualUsd) * 100) / 100;
}

export default function Home() {
  const products = getProducts();
  const plans = getPlans();
  const privacy = getPrivacySummary();
  const showcasePhotos = products
    .flatMap((product) => product.lifestyle)
    .filter((src) => src in LIFESTYLE)
    .map((src) => ({ src, ...LIFESTYLE[src] }));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section
          id="top"
          data-testid="hero"
          className="bg-secondary text-secondary-foreground"
        >
          <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
            <div className="flex flex-col items-start gap-5">
              <h1 className="text-4xl font-bold md:text-5xl">
                AI-first devices, made in Arizona
              </h1>
              <p className="text-lg">From raw ideas to refined answers.</p>
              <Button asChild size="lg">
                <a href="#products">See products</a>
              </Button>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              {products.map((product) => (
                <Image
                  key={product.id}
                  src={product.cutout}
                  alt={`${product.name} ${product.type}`}
                  width={1254}
                  height={1254}
                  priority
                  className="h-auto w-full"
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="products"
          data-testid="products"
          className="scroll-mt-16 py-12 md:py-20"
        >
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-bold">Meet the products</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {products.map((product) => (
                <Card
                  key={product.id}
                  data-testid="product-card"
                  data-product={product.id}
                >
                  <CardContent className="flex flex-col gap-4">
                    <Image
                      src={product.cutout}
                      alt={`${product.name} ${product.type}`}
                      width={1254}
                      height={1254}
                      className="mx-auto h-auto w-full max-w-xs"
                    />
                    <div className="flex flex-col gap-3">
                      <h3 className="text-2xl font-semibold">{product.name}</h3>
                      <div className="bg-secondary flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg px-4 py-3">
                        <p className="text-primary text-4xl font-bold tracking-tight">
                          {formatUsd(product.priceUsd)}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {product.type}
                        </p>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {product.features.map((feature) => (
                        <li key={feature.name}>
                          <span className="font-medium">{feature.name}.</span>{" "}
                          <span className="text-muted-foreground">
                            {feature.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm">
                      <span className="font-medium">Colors:</span>{" "}
                      {product.colors.join(", ")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="showcase"
          data-testid="showcase"
          className="scroll-mt-16 pb-12 md:pb-20"
        >
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-bold">Made for Arizona living</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {showcasePhotos.map((photo) => (
                <figure key={photo.src} className="flex flex-col gap-3">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="h-auto w-full rounded-lg"
                  />
                  <figcaption className="text-muted-foreground">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section
          id="plus"
          data-testid="plus-pricing"
          className="bg-secondary text-secondary-foreground scroll-mt-16 py-12 md:py-20"
        >
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-bold">Free or Copper Plus</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {plans.map((plan) => {
                const isPlus = plan.id === "copper-plus";
                return (
                  <Card
                    key={plan.id}
                    className={isPlus ? "border-primary border-2" : undefined}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        {plan.name}
                        {isPlus && <Badge>Best value</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <p
                          className={`text-5xl font-bold tracking-tight ${isPlus ? "text-primary" : ""}`}
                        >
                          {formatUsd(plan.monthlyUsd)}
                          <span className="text-muted-foreground text-base font-normal">
                            /month
                          </span>
                        </p>
                        {isPlus && (
                          <>
                            <p className="text-muted-foreground">
                              or {formatUsd(plan.annualUsd)}/year
                            </p>
                            {yearlySavings(plan) > 0 && (
                              <Badge variant="secondary" className="mt-1 w-fit">
                                Save {formatUsd(yearlySavings(plan))} a year
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      <ul className="flex flex-col gap-2">
                        <li>Memory kept: {formatMemory(plan.memoryDays)}</li>
                        <li>
                          Notes recording:{" "}
                          {formatNotesHours(plan.notesHoursPerMonth)}
                        </li>
                        <li>
                          Refined answers: {plan.refinedAnswers ? "Yes" : "No"}
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="privacy"
          data-testid="privacy-summary"
          className="scroll-mt-16 py-12 md:py-20"
        >
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-bold">How Copper handles your data</h2>
            <p className="text-muted-foreground mt-2">
              Our {privacy.policy} privacy policy, in plain words.
            </p>
            <ul className="mt-6 flex flex-col gap-4">
              {privacy.points.map((point) => (
                <li key={point} className="border-l-4 pl-4">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
