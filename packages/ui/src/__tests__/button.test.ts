import { describe, expect, it } from 'vitest';
import { buttonVariants } from '../components/button';

describe('buttonVariants', () => {
  it('generates default button classes', () => {
    const classes = buttonVariants({ variant: 'default', size: 'default' });
    expect(classes).toContain('bg-primary');
    expect(classes).toContain('text-primary-foreground');
  });

  it('generates accent variant classes', () => {
    const classes = buttonVariants({ variant: 'accent' });
    expect(classes).toContain('bg-amber-500');
  });

  it('generates destructive variant classes', () => {
    const classes = buttonVariants({ variant: 'destructive' });
    expect(classes).toContain('bg-destructive');
  });
});
