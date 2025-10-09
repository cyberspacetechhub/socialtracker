import { useState } from 'react';
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    id: 1,
    title: "Track Your Social Media Usage",
    description: "Monitor time spent on Facebook, Twitter, Instagram, TikTok, LinkedIn, and YouTube automatically.",
    icon: "📊",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Set Healthy Limits",
    description: "Define daily time limits for each platform and receive notifications when you exceed them.",
    icon: "⏰",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Stay Focused & Productive",
    description: "Get insights into your digital habits and take control of your social media consumption.",
    icon: "🎯",
    gradient: "from-green-500 to-emerald-500"
  }
];

export default function Onboarding({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Skip Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={skipOnboarding}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="text-sm mr-1">Skip</span>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="text-center">
          {/* Icon */}
          <div className={`w-24 h-24 mx-auto mb-8 bg-gradient-to-r ${slide.gradient} rounded-full flex items-center justify-center transform transition-all duration-500 hover:scale-105`}>
            <span className="text-4xl">{slide.icon}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed mb-12 px-4">
            {slide.description}
          </p>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 bg-blue-500'
                    : index < currentSlide
                    ? 'w-2 bg-blue-300'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="w-20">
              {currentSlide > 0 && (
                <button
                  onClick={() => setCurrentSlide(currentSlide - 1)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
            </div>

            <button
              onClick={nextSlide}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            <div className="w-20 text-right">
              <span className="text-sm text-gray-400">
                {currentSlide + 1}/{slides.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}