"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  textSize = "5xl",
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  textSize?: string;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-white opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div
          className={` dark:text-white text-black text-2xl leading-snug tracking-wide`}
          style={{
            fontSize:
              textSize === "sm"
                ? "1rem"
                : textSize === "xl"
                ? "1.25rem"
                : textSize === "2xl"
                ? "1.5rem"
                : textSize === "3xl"
                ? "1.875rem"
                : textSize === "4xl"
                ? "2.25rem"
                : textSize === "5xl"
                ? "3rem"
                : textSize === "6xl"
                ? "3.75rem"
                : textSize === "7xl"
                ? "4.5rem"
                : textSize === "8xl"
                ? "6rem"
                : textSize === "9xl"
                ? "8rem"
                : "3rem",
          }}
        >
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
