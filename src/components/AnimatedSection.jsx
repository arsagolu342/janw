import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedSection: Wraps any section with IntersectionObserver to trigger
 * fluid fade-up, slide-in, and scale-up entrance animations on scroll.
 */
export default function AnimatedSection({ 
  children, 
  className = '', 
  animation = 'fade-up', // 'fade-up', 'fade-in', 'slide-left', 'slide-right', 'scale-up'
  delay = 0,
  style = {},
  id = undefined
}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once revealed, disconnect to keep performance high
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const getAnimationStyles = () => {
    const transition = `all 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { opacity: 0, transform: 'translateY(40px)', transition };
        case 'slide-left':
          return { opacity: 0, transform: 'translateX(-50px)', transition };
        case 'slide-right':
          return { opacity: 0, transform: 'translateX(50px)', transition };
        case 'scale-up':
          return { opacity: 0, transform: 'scale(0.92)', transition };
        case 'fade-in':
        default:
          return { opacity: 0, transition };
      }
    }

    return {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
      transition
    };
  };

  return (
    <div
      id={id}
      ref={sectionRef}
      className={`animated-section-wrapper ${className}`}
      style={{
        ...style,
        ...getAnimationStyles(),
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}
