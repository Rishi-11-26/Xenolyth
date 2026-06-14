import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card from './Card';
import Badge from './Badge';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  return (
    <Card interactive className="flex flex-col h-full justify-between gap-8 p-8 overflow-hidden group">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <Badge variant={product.status === 'live' ? 'live' : 'coming-soon'}>
            {product.status === 'live' ? 'Live' : 'Coming Soon'}
          </Badge>
          <span 
            className="text-xs font-semibold tracking-wider text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-hidden="true"
          >
            Flagship ↗
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="h3-heading text-text-primary tracking-tight font-semibold flex items-center gap-2">
            {product.name}
            {product.status === 'live' && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            )}
          </h3>
          <p className="text-sm font-medium text-accent opacity-90">
            {product.tagline}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mt-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Visual Mockup */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border bg-bg-secondary flex items-center justify-center">
        {/* Device Frame Mockup */}
        <div className="w-[95%] h-[90%] border border-border bg-bg-primary rounded-t-md overflow-hidden shadow-md flex flex-col">
          {/* Browser Header Bar */}
          <div className="h-6 bg-surface border-b border-border flex items-center px-3 gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-border" />
            <span className="w-2 h-2 rounded-full bg-border" />
            <span className="w-2 h-2 rounded-full bg-border" />
            <div className="mx-auto w-[60%] h-3.5 bg-bg-secondary rounded border border-border text-[7px] text-text-secondary/40 flex items-center justify-center font-mono">
              sentinel.xenolyth.ai/dashboard
            </div>
          </div>
          {/* Screenshot */}
          <div className="relative grow bg-bg-secondary">
            <Image
              src={product.image || '/images/sentinel-screenshot.png'}
              alt="Sentinel Platform Dashboard"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover object-top opacity-90 group-hover:scale-[1.02] transition-transform duration-500 ease-[0.16,1,0.3,1]"
              priority={true}
            />
          </div>
        </div>
      </div>

      {/* Button CTA Link */}
      <Link href={product.ctaHref} className="w-full mt-2">
        <span
          className="w-full py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer bg-accent/10 hover:bg-accent border-accent/25 hover:border-accent text-accent hover:text-text-primary"
        >
          {product.ctaLabel}
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </Card>
  );
};
export default ProductCard;
