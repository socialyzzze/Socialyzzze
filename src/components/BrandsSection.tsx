import React from 'react';
import { MarqueeLogoScroller } from '@/components/ui/marquee-logo-scroller';

export function BrandsSection() {
  const partners = [
    {
      src: '/brands/urbanix.png',
      alt: 'Urbanix Unisex Salon',
      gradient: { from: '#58111A', via: '#7A1825', to: '#3A0A10' },
    },
    {
      src: '/brands/diya-studio.png',
      alt: 'Diya Studio',
      gradient: { from: '#F4E8D7', via: '#E2D1B8', to: '#FBF5ED' },
    },
    {
      src: '/brands/diva-studios.png',
      alt: 'Diva Studios',
      gradient: { from: '#8E1D2E', via: '#58111A', to: '#1C1217' },
    },
    {
      src: '/brands/lm.png',
      alt: 'LM',
      gradient: { from: '#8BADC8', via: '#6890AD', to: '#A4C2D8' },
    },
  ];

  return (
    <div className="bg-[#0E090B] w-full flex items-center justify-center border-b border-buttercream/10">
      <div className="max-w-7xl mx-auto w-full">
        <MarqueeLogoScroller
          title="Brands We've Amplified"
          description="Founders, creators, and business leaders across the globe chose us for their digital asset operations."
          logos={partners}
          speed="normal"
        />
      </div>
    </div>
  );
};

export default BrandsSection;