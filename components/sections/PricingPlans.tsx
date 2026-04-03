"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Clock, Calendar, Laptop, Users } from "lucide-react";
import Link from "next/link";

const PricingPlans = ({ dict }: { dict: any }) => {
  const plans = [
    {
      ...dict.plans.weekday,
      popular: false,
      gradient: "from-blue-500/20 to-cyan-500/20",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      ...dict.plans.weekend_morning,
      popular: true,
      gradient: "from-amber-400/20 to-orange-500/20",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      ...dict.plans.weekend_afternoon,
      popular: false,
      gradient: "from-purple-500/20 to-pink-500/20",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      ...dict.plans.private,
      popular: false,
      gradient: "from-green-500/20 to-emerald-500/20",
      icon: <Users className="w-6 h-6" />,
    },
    {
      ...dict.plans.online,
      popular: false,
      gradient: "from-red-500/20 to-rose-500/20",
      icon: <Laptop className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            {dict.title}{" "}
            <span className="text-4xl sm:text-6xl font-extrabold mb-6 font-serif bg-gradient-to-r from-amber-100 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              {dict.highlight}
            </span>
          </h2>
          <p className="mt-4 text-gray-200 max-w-xl mx-auto">
            {dict.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`
                relative p-8 rounded-3xl border backdrop-blur-xl flex flex-col h-full
                transition-all duration-300 shadow-[0_0_20px_#623F2F]
                ${
                  plan.popular
                    ? "bg-white/10 border-accent/50 scale-105 z-10"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-primary font-bold px-4 py-1 rounded-full text-sm shadow-lg uppercase">
                  {dict.popular}
                </div>
              )}

              {/* Header */}
              <div
                className={`
                w-12 h-12 rounded-2xl flex items-center justify-center mb-6
                bg-gradient-to-br ${plan.gradient} border border-white/10 text-white
              `}
              >
                {plan.icon}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                {plan.description}
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-gray-400 font-medium">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-gray-300 text-sm leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action */}
              <Link
                href="/admissions#admission-form"
                className={`
                  w-full py-4 rounded-xl font-bold text-center transition-all duration-300 shadow-md active:scale-95
                  ${
                    plan.popular
                      ? "bg-accent text-primary hover:bg-white"
                      : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                  }
                `}
                aria-label={`${dict.enrollNow || "Enroll Now"} in ${plan.name}`}
              >
                {dict.enrollNow || "Enroll Now"}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
