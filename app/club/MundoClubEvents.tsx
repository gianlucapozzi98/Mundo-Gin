"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
  useHoverSliderContext,
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

function MobileInlineCover({
  imageUrl,
  alt,
  imageLayout,
}: {
  imageUrl: string;
  alt: string;
  imageLayout: ClubEventImageLayout;
}) {
  const [autoFit, setAutoFit] = useState<"contain" | "cover">("cover");

  return (
    <div className="mt-4 aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] ring-1 ring-mundo-black/10">
      <div
        className={
          imageLayout === "fill-bottom"
            ? "flex size-full items-end justify-stretch overflow-hidden"
            : "flex size-full items-center justify-center overflow-hidden"
        }
      >
        <img
          src={imageUrl}
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
    </div>
  );
}

function MobileEventsList() {
  const { activeSlide, changeSlide } = useHoverSliderContext();

  return (
    <div className="flex w-full flex-col space-y-8 lg:hidden">
      {CLUB_EVENTS.map((event, index) => {
        const isActive = activeSlide === index;
        return (
          <div key={event.id} className="group">
            <div
              role="presentation"
              onClick={() => changeSlide(index)}
              className="w-full text-left"
            >
              <TextStaggerHover
                index={index}
                text={event.title}
                className="cursor-pointer font-futura-500 text-3xl font-bold uppercase leading-[0.8] tracking-tighter text-mundo-black sm:text-4xl sm:leading-[0.85]"
                aria-expanded={isActive}
              />
            </div>

            {isActive ? (
              <MobileInlineCover
                imageUrl={event.imageUrl}
                alt={event.title}
                imageLayout={event.imageLayout}
              />
            ) : null}

            <p className="mt-2 font-futura-400 text-sm text-mundo-black/60 sm:text-base">
              {event.date} · {event.location}
            </p>
            {event.href ? (
              <Link
                href={event.href}
                className="mt-2 inline-block font-futura-500 text-xs uppercase tracking-[0.14em] text-mundo-black/70 underline-offset-4 hover:text-mundo-black hover:underline"
              >
                Registrati →
              </Link>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DesktopEventsLayout() {
  return (
    <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-16">
      <div className="flex w-full max-w-xl flex-col space-y-6">
        {CLUB_EVENTS.map((event, index) => {
          return (
            <div key={event.id} className="group">
              <TextStaggerHover
                index={index}
                text={event.title}
                className="cursor-pointer font-futura-500 text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-mundo-black"
              />
              <p className="mt-1 font-futura-400 text-base text-mundo-black/60">
                {event.date} · {event.location}
              </p>
              {event.href ? (
                <Link
                  href={event.href}
                  className="mt-2 inline-block font-futura-500 text-xs uppercase tracking-[0.14em] text-mundo-black/70 underline-offset-4 hover:text-mundo-black hover:underline"
                >
                  Registrati →
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>

      <HoverSliderImageWrap className="aspect-[4/5] w-full max-w-lg place-items-center overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] ring-1 ring-mundo-black/10">
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

          <MobileEventsList />
          <DesktopEventsLayout />
        </HoverSlider>
      </div>
    </section>
  );
}
