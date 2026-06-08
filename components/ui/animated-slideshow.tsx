"use client";

import * as React from "react";
import { HTMLMotionProps, MotionConfig, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TextStaggerHoverProps {
  text: string;
  index: number;
}
interface HoverSliderImageProps {
  index: number;
  imageUrl: string;
}
interface HoverSliderProps {}
interface HoverSliderContextValue {
  activeSlide: number;
  changeSlide: (index: number) => void;
}

function splitWords(text: string) {
  return text.split(" ").filter(Boolean);
}

const HoverSliderContext = React.createContext<
  HoverSliderContextValue | undefined
>(undefined);

function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext);
  if (context === undefined) {
    throw new Error(
      "useHoverSliderContext must be used within a HoverSliderProvider",
    );
  }
  return context;
}

export const HoverSlider = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & HoverSliderProps
>(({ children, className, ...props }, ref) => {
  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const changeSlide = React.useCallback(
    (index: number) => setActiveSlide(index),
    [],
  );
  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <div ref={ref as React.Ref<HTMLDivElement>} className={className} {...props}>
        {children}
      </div>
    </HoverSliderContext.Provider>
  );
});
HoverSlider.displayName = "HoverSlider";

function StaggerChar({
  char,
  charIndex,
  isActive,
}: {
  char: string;
  charIndex: number;
  isActive: boolean;
}) {
  return (
    <span className="relative inline-block overflow-hidden">
      <MotionConfig
        transition={{
          delay: charIndex * 0.025,
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <motion.span
          className="inline-block opacity-20"
          initial={{ y: "0%" }}
          animate={isActive ? { y: "-110%" } : { y: "0%" }}
        >
          {char}
        </motion.span>

        <motion.span
          className="absolute left-0 top-0 inline-block opacity-100"
          initial={{ y: "110%" }}
          animate={isActive ? { y: "0%" } : { y: "110%" }}
        >
          {char}
        </motion.span>
      </MotionConfig>
    </span>
  );
}

export const TextStaggerHover = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & TextStaggerHoverProps
>(({ text, index, className, ...props }, ref) => {
  const { activeSlide, changeSlide } = useHoverSliderContext();
  const words = splitWords(text);
  const isActive = activeSlide === index;
  const handleMouse = () => changeSlide(index);

  let charIndex = 0;

  return (
    <span
      className={cn("relative inline origin-bottom", className)}
      {...props}
      ref={ref}
      onMouseEnter={handleMouse}
      onFocus={handleMouse}
      tabIndex={0}
      role="button"
    >
      {words.map((word, wordIndex) => {
        const wordStartIndex = charIndex;
        charIndex += word.length;

        return (
          <React.Fragment key={`${word}-${wordIndex}`}>
            {wordIndex > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((char, letterIndex) => (
                <StaggerChar
                  key={`${char}-${letterIndex}`}
                  char={char}
                  charIndex={wordStartIndex + letterIndex}
                  isActive={isActive}
                />
              ))}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
});
TextStaggerHover.displayName = "TextStaggerHover";

export const clipPathVariants = {
  visible: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  hidden: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
  },
};

export const HoverSliderImageWrap = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
        className,
      )}
      {...props}
    />
  );
});
HoverSliderImageWrap.displayName = "HoverSliderImageWrap";

export const HoverSliderImage = React.forwardRef<
  HTMLImageElement,
  HTMLMotionProps<"img"> & HoverSliderImageProps
>(({ index, imageUrl, className, ...props }, ref) => {
  const { activeSlide } = useHoverSliderContext();
  return (
    <motion.img
      className={cn("inline-block align-middle", className)}
      transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
      variants={clipPathVariants}
      animate={activeSlide === index ? "visible" : "hidden"}
      src={imageUrl}
      ref={ref}
      {...props}
    />
  );
});
HoverSliderImage.displayName = "HoverSliderImage";
