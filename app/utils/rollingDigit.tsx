"use client";

import { motion } from "framer-motion";

export function RollingDigit({
  value,
  index,
}: {
  value: string;
  index: number;
}) {
  const numericValue = Number(value);
  const digitSequence = Array.from({ length: numericValue + 1 }, (_, i) => i);

  return (
    <span className="inline-flex w-[0.55em] justify-center">
      <span className="relative block h-[1em] overflow-hidden">
        <motion.span
          className="flex flex-col"
          initial={{ y: "1em" }}
          animate={{ y: `-${numericValue}em` }}
          transition={{
            duration: 0.9,
            delay: index * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {digitSequence.map((digit) => (
            <span
              key={digit}
              className="h-[1em] leading-[1em] flex items-center justify-center"
            >
              {digit}
            </span>
          ))}
        </motion.span>
      </span>
    </span>
  );
}
