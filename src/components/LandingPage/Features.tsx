"use client";

import Image from "next/image";
import { Brain, Shield, FileText, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-20 bg-rr-100">
      <div className="bg-white rounded-3xl max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 mb-2">Radiolo</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why choose radiolo?
          </h2>
          <p className="text-lg text-gray-600">
            Advanced medical insights powered by cutting-edge artificial intelligence
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            area="md:row-span-2"
            icon={<Brain className="h-5 w-5 text-rr-600" />}
            title="AI-powered analysis"
            description="Advanced AI analyzes complex medical documents in seconds with precision."
            imageUrl="phone-mockup.svg"
            primaryButton="Get Started"
            secondaryButton="Learn More"
          />

          <FeatureCard
            area=""
            icon={<Shield className="h-5 w-5 text-rr-600" />}
            title="Bank-level security"
            description="Protecting your medical data with military-grade encryption methods"
            primaryButton="View Security"
          />

          <FeatureCard
            area=""
            icon={<FileText className="h-5 w-5 text-rr-600" />}
            title="Multi-format support"
            description="Upload various medical documents seamlessly and securely."
            primaryButton="See Formats"
          />

          <FeatureCard
            area="md:col-span-2"
            icon={<Sparkles className="h-5 w-5 text-rr-600" />}
            title="Easy insights"
            description="Transform complex medical terminology into clear, understandable language for everyone."
            primaryButton="Learn More"
            secondaryButton="Try Demo"
          />
        </ul>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl?: string;
  primaryButton: string;
  secondaryButton?: string;
}

const FeatureCard = ({
  area,
  icon,
  title,
  description,
  imageUrl,
  primaryButton,
  secondaryButton,
}: FeatureCardProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-gray-200 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          variant="default"
          blur={10}
          borderWidth={2}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-rr-400 to-rr-500 p-6 md:p-8 shadow-xl">
          <div className="relative flex flex-1 flex-col justify-between gap-4">
            <div className="w-fit rounded-lg bg-white/20 backdrop-blur-sm p-2.5">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-2xl md:text-3xl font-bold text-white">
                {title}
              </h3>
              <p className="font-sans text-base md:text-lg text-white/90">
                {description}
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-6 py-2.5 bg-white text-rr-700 rounded-lg font-medium hover:bg-white/90 transition-colors">
                {primaryButton}
              </button>
              {secondaryButton && (
                <button className="px-6 py-2.5 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                  {secondaryButton}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {imageUrl && (
            <div className="absolute bottom-0 right-0 w-2/3 h-3/4 pointer-events-none">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-contain object-bottom-right"
              />
            </div>
          )}
        </div>
      </div>
    </li>
  );
};
