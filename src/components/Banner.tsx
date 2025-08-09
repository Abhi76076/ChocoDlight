import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

const slides: BannerSlide[] = [
  {
    id: 1,
    title: "Artisan Chocolates",
    subtitle: "Handcrafted with love and premium ingredients",
    image: "https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Shop Now"
  },
  {
    id: 2,
    title: "Valentine's Special",
    subtitle: "Express your love with our romantic chocolate collection",
    image: "https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "View Collection"
  },
  {
    id: 3,
    title: "Premium Gift Sets",
    subtitle: "Perfect for any occasion, elegantly packaged",
    image: "https://images.pexels.com/photos/3992139/pexels-photo-3992139.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Explore Gifts"
  }
];

interface BannerProps {
  onNavigate: (page: string) => void;
}

export const Banner: React.FC<BannerProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 font-light">
                  {slide.subtitle}
                </p>
                <button 
                  onClick={() => onNavigate('shop')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};