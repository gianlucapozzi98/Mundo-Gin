"use client";

import { useState } from "react";
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from "@/components/ui/animated-slideshow";
import { cn } from "@/lib/utils";
import { CLUB_EVENTS, type ClubEventImageLayout } from "./events";

const TARGET_RATIO = 4 / 5;
const RATIO_TOLERANCE = 0.04;

function getImageClasses(
  layout: ClubEventImageLayout,
  autoFit: "contain" | "cover",
) {
  if (layout === "fill") {
    return "size-full rounded-none object-cover object-center";
  }
  if (layout === "fill-bottom") {
    return "size-full rounded-none object-cover object-bottom";
  }
  return cn(
    "block rounded-2xl object-center",
    autoFit === "contain"
      ? "max-h-full max-w-full object-contain"
      : "size-full object-cover",
  );
}

function EventCoverImage({
  index,
  imageUrl,
  alt,
  imageLayout,
}: {
  index: number;
  imageUrl: string;
  alt: string;
  imageLayout: ClubEventImageLayout;
}) {
  const [autoFit, setAutoFit] = useState<"contain" | "cover">("cover");

  const wrapperClass =
    imageLayout === "fill-bottom"
      ? "flex size-full items-end justify-stretch overflow-hidden"
      : "flex size-full items-center justify-center overflow-hidden";

  return (
    <div className={wrapperClass}>
      <HoverSliderImage
        index={index}
        imageUrl={imageUrl}
        alt={alt}
        className={getImageClasses(imageLayout, autoFit)}
        loading="eager"
        decoding="async"
        onLoad={(event) => {
          if (imageLayout !== "fit") return;
          const img = event.currentTarget;
          const ratio = img.naturalWidth / img.naturalHeight;
          setAutoFit(
            Math.abs(ratio - TARGET_RATIO) <= RATIO_TOLERANCE
              ? "contain"
              : "cover",
          );
        }}
      />
    </div>
  );
}

export function MundoClubEvents() {
  return (
    <section
      className="bg-[#F2F2F2] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      aria-label="Eventi Mundo Club"
    >
      <div className="container mx-auto max-w-7xl">
        <HoverSlider className="min-h-[min(70vh,720px)] place-content-center">
          <p className="mb-8 font-futura-500 text-xs font-medium uppercase tracking-[0.2em] text-mundo-black/55">
            / Eventi
          </p>

          <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="flex w-full max-w-xl flex-col space-y-4 md:space-y-6">
              {CLUB_EVENTS.map((event, index) => (
                <div key={event.id} className="group">
                  <TextStaggerHover
                    index={index}
                    text={event.title}
                    className="cursor-pointer font-futura-500 text-3xl font-bold uppercase leading-[0.8] tracking-tighter text-mundo-black sm:text-4xl sm:leading-[0.85] lg:text-5xl lg:leading-[0.9]"
                  />
                  <p className="mt-1 font-futura-400 text-sm text-mundo-black/60 sm:text-base">
                    {event.date} · {event.location}
                  </p>
                </div>
              ))}
            </div>

            <HoverSliderImageWrap className="aspect-[4/5] w-full max-w-md place-items-center overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] ring-1 ring-mundo-black/10 lg:max-w-lg">
              {CLUB_EVENTS.map((event, index) => (
                <EventCoverImage
                  key={event.id}
                  index={index}
                  imageUrl={event.imageUrl}
                  alt={event.title}
                  imageLayout={event.imageLayout}
                />
              ))}
            </HoverSliderImageWrap>
          </div>
        </HoverSlider>
      </div>
    </section>
  );
}
