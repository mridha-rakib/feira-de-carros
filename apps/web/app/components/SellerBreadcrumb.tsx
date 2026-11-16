import Link from 'next/link';
import { IconHome } from './SellerIcons';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface SellerBreadcrumbProps {
  items: BreadcrumbItem[];
  mobileShortLabel?: string;
}

export function SellerBreadcrumb({ items, mobileShortLabel }: SellerBreadcrumbProps) {
  return (
    <>
      {/* Desktop Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="hidden md:flex items-center gap-2 text-[14px] text-[#566273] font-normal py-4"
      >
        <Link href="/" className="flex items-center hover:text-[#111827] transition-colors">
          <IconHome className="size-[18px] text-[#566273]" />
        </Link>
        {items.map((item, index) => (
          <div key={`bc-${item.label}-${index}`} className="flex items-center gap-2">
            <span className="text-[#8e98a8]">›</span>
            {item.href && !item.active ? (
              <Link href={item.href} className="hover:text-[#111827] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={item.active ? 'text-[#111827] font-medium' : ''}>{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Breadcrumb (matching 673:278, 719:474) */}
      <div className="flex md:hidden bg-[#f3f6f9] items-center gap-2 h-[38px] px-3 rounded-[8px] w-full my-2">
        <IconHome className="size-[16px] text-[#5e697d] shrink-0" />
        <span className="text-[11px] text-[#4b5563] font-medium truncate">
          {mobileShortLabel || (
            <>Feira de Carros › {items[items.length - 1]?.label || 'Meu cadastro'}</>
          )}
        </span>
      </div>
    </>
  );
}
