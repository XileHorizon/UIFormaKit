import { Children, useEffect, useId, useState, type ReactNode } from "react";

export interface CarouselProps {
  children: ReactNode;
  label?: string;
  initialIndex?: number;
  autoPlayInterval?: number;
}

export function Carousel({ children, label = "Carousel", initialIndex = 0, autoPlayInterval }: CarouselProps) {
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(slides.length - 1, 0)));
  const id = useId();
  const goTo = (next: number) => setIndex((next + slides.length) % slides.length);

  useEffect(() => {
    if (!autoPlayInterval || slides.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), autoPlayInterval);
    return () => window.clearInterval(timer);
  }, [autoPlayInterval, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="uf-carousel" aria-roledescription="carousel" aria-label={label} onKeyDown={(event) => {
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
    }}>
      <div className="uf-carousel__viewport" aria-live="polite">
        {slides.map((slide, slideIndex) => (
          <div key={slideIndex} id={`${id}-slide-${slideIndex}`} className="uf-carousel__slide" role="group" aria-roledescription="slide" aria-label={`${slideIndex + 1} of ${slides.length}`} hidden={slideIndex !== index}>{slide}</div>
        ))}
      </div>
      {slides.length > 1 && <div className="uf-carousel__controls">
        <button type="button" aria-label="Previous slide" onClick={() => goTo(index - 1)}>←</button>
        <div className="uf-carousel__dots" aria-label="Choose slide">
          {slides.map((_, slideIndex) => <button key={slideIndex} type="button" aria-label={`Go to slide ${slideIndex + 1}`} aria-current={slideIndex === index ? "true" : undefined} aria-controls={`${id}-slide-${slideIndex}`} onClick={() => goTo(slideIndex)} />)}
        </div>
        <button type="button" aria-label="Next slide" onClick={() => goTo(index + 1)}>→</button>
      </div>}
    </section>
  );
}
