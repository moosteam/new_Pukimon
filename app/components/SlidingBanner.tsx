import React from 'react';

interface SlidingBannerProps {
  title: string;
  subtitle?: string;
  bgColor?: string;       // Tailwind color class, e.g. 'bg-green-500'
  textColor?: string;     // Tailwind text color class, e.g. 'text-white'
  tiltAngle?: string;     // CSS angle, e.g. '-10deg'
  bottomOffset?: string;  // Tailwind bottom offset, e.g. 'bottom-8'
  isReverse?: boolean;
}

const SlidingBanner: React.FC<SlidingBannerProps> = ({
  title,
  subtitle,
  bgColor = 'bg-black',
  textColor = 'text-white',
  tiltAngle = '-8deg',
  bottomOffset = 'bottom-20',
  isReverse = false
}) => {
  return (
    <div className={`absolute ${isReverse ? 'right-0' : 'left-0'} ${bottomOffset} w-[500px] overflow-hidden pointer-events-none z-100000000`}>
      <div
        className={`bg-neutral-200 inline-block ${textColor} font-bold text-3xl transform w-[500px] ${isReverse ? 'banner-slide-reverse' : 'banner-slide'}`}
        style={{ '--tilt-angle': isReverse ? (tiltAngle.startsWith('-') ? tiltAngle.substring(1) : `-${tiltAngle}`) : tiltAngle } as React.CSSProperties}
      >
        <span className={`inline-block transform w-[500px] ${bgColor} [skew-x:var(--tilt-angle)] p-2`}>
          {title}
        </span>
        {subtitle && (
          <span className={` block text-xl mt-1 transform w-[500px] bg-neutral-700 [skew-x:var(--tilt-angle)] p-2`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default SlidingBanner;
