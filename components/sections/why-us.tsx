"use client";
import React from "react";
import {
  CheckCircle2,
  Heart,
  Shield,
  GraduationCap,
  MapPin,
} from "lucide-react";

export default function WhyUs({ dict }: { dict: any }) {
  const icons = [
    <GraduationCap key="grad" className="w-6 h-6" />,
    <CheckCircle2 key="check" className="w-6 h-6" />,
    <Heart key="heart" className="w-6 h-6" />,
    <Shield key="shield" className="w-6 h-6" />,
    <MapPin key="map" className="w-6 h-6" />,
  ];

  const reasons = dict.reasons.map((reason: any, idx: number) => ({
    ...reason,
    icon: icons[idx],
  }));

  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#006D5F 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="relative z-10 mx-auto lg:max-w-7xl px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white sm:text-4xl md:text-5xl leading-tight">
              {dict.title}{" "}
              <span className="text-primary">{dict.highlight}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-sans">
              {dict.description}
            </p>

            <div className="space-y-6 pt-4">
              {reasons.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Decorative Elements around video */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white bg-gray-100 z-10 transform transition-transform hover:scale-[1.01] duration-500">
              <iframe
                className="w-full h-full"
                src={dict.videoUrl}
                title="Aisha Academy - Providing Excellence in Quranic Education"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
