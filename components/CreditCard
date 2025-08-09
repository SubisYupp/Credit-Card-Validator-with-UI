"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Props = {
  name?: string;
  number?: string;
  expiry?: string;
  brand?: "VISA" | "MASTERCARD" | "RUPAY" | "AMEX";
};

export default function CreditCard({
  name = "SUBHRANSU SAHU",
  number = "4242 4242 4242 4242",
  expiry = "12/29",
  brand = "VISA",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rsX = useSpring(useTransform(x, [-150, 150], [-12, 12]), { stiffness: 120, damping: 12 });
  const rsY = useSpring(useTransform(y, [-150, 150], [12, -12]), { stiffness: 120, damping: 12 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx);
    y.set(dy);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rsY, rotateY: rsX }}
      className="relative w-[360px] h-[220px] rounded-2xl glass overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute -inset-10 opacity-60 blur-2xl"
             style={{ background: "conic-gradient(from 180deg at 50% 50%, #06b6d4, #a78bfa, #22d3ee, #06b6d4)" }} />
      </div>
      <div className="relative z-10 p-6 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="text-sm uppercase tracking-widest text-cyan-200">credit</div>
          <div className="text-2xl font-bold">{brand}</div>
        </div>
        <div className="space-y-3">
          <div className="text-xl tracking-widest">{number}</div>
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div>
              <div className="uppercase text-[10px] tracking-wider text-gray-400">card holder</div>
              <div className="font-medium">{name}</div>
            </div>
            <div className="text-right">
              <div className="uppercase text-[10px] tracking-wider text-gray-400">expires</div>
              <div className="font-medium">{expiry}</div>
            </div>
          </div>
        </div>
      </div>
      {/* subtle shine */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.00) 40%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0.00) 75%)",
          transform: "translateX(-20%)",
        }}
      />
    </motion.div>
  );
}
