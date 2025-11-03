'use client';

import { useState } from 'react';
import HeroCarousel from './HeroCarousel';
import HeroEventCards from './HeroEventCards';

const HeroWithCards = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <>
      <HeroCarousel onSlideChange={setActiveSlide} />
      <HeroEventCards activeSlide={activeSlide} />
    </>
  );
};

export default HeroWithCards;
