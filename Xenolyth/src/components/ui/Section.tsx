import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  bg?: 'primary' | 'secondary';
  children: React.ReactNode;
  headingLeft?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  id,
  eyebrow,
  heading,
  subheading,
  bg = 'primary',
  children,
  headingLeft = false,
  className = '',
  ...props
}) => {
  const bgClasses = {
    primary: 'bg-bg-primary',
    secondary: 'bg-bg-secondary border-t border-b border-border'
  };

  return (
    <section
      id={id}
      className={`py-16 md:py-24 lg:py-32 xl:py-40 transition-colors duration-300 ${bgClasses[bg]} ${className}`}
      {...props}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        {(eyebrow || heading || subheading) && (
          <div className={`flex flex-col gap-3 mb-12 md:mb-16 max-w-[800px] ${headingLeft ? 'text-left' : 'text-center mx-auto'}`}>
            {eyebrow && (
              <span className="label-eyebrow text-accent font-semibold tracking-widest">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="h2-heading text-text-primary tracking-tight">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="body-text text-text-secondary max-w-[60ch] mx-auto leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
export default Section;
