"use client";

import React, { useEffect } from "react";
import { Users, BookOpen, Award, Globe } from "lucide-react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

// --- Reusable Stat Item Component ---
interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  delay: number;
  suffix?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  icon,
  value,
  label,
  delay,
  suffix = "",
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });

  const displayValue = useTransform(spring, (current) =>
    Math.floor(current).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center justify-center text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 hover:shadow-accent/10 hover:border-accent/30 hover:scale-105 transition-all"
    >
      <div className="p-4 rounded-full bg-accent/10 mb-4 text-accent">
        {icon}
      </div>
      <div className="text-4xl font-serif font-bold text-white flex items-center justify-center">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-gray-300 font-medium mt-2">{label}</p>
    </motion.div>
  );
};

// --- Main Section ---
export const StatCounter: React.FC<{
  dict: any;
  counts?: {
    students: number;
    teachers?: number;
    classes?: number;
    experience?: number;
  };
}> = ({ dict, counts }) => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative gradient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-secondary/20 opacity-70"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6 sm:px-10">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-serif font-bold text-center text-white mb-16"
        >
          {dict.impact ? dict.impact.split(" ")[0] : "Our"}{" "}
          <span className="text-accent italic">
            {dict.impact ? dict.impact.split(" ")[1] : "Impact"}
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <StatItem
            icon={<Users className="h-8 w-8" />}
            value={counts?.teachers || 15}
            label={dict.qualifiedTeachers}
            delay={0.1}
            suffix="+"
          />
          <StatItem
            icon={<BookOpen className="h-8 w-8" />}
            value={counts?.students || 0}
            label={dict.studentsEnrolled}
            delay={0.2}
            suffix="+"
          />
          <StatItem
            icon={<Award className="h-8 w-8" />}
            value={counts?.experience || 10}
            label={dict.yearsExperience}
            delay={0.3}
            suffix="+"
          />
          <StatItem
            icon={<Globe className="h-8 w-8" />}
            value={counts?.classes || 120}
            label={dict.onlineClasses}
            delay={0.4}
            suffix="/wk"
          />
        </div>
      </div>
    </section>
  );
};


export default StatCounter;
