import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

const BASE_CLASSES =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-strong',
  secondary: 'border border-border bg-surface-raised text-ink hover:bg-surface',
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  /** Defaults to "button" so a Button never submits a form by accident. */
  submit?: boolean;
}

export function Button({ variant = 'primary', submit = false, className, ...props }: ButtonProps) {
  const classes = [BASE_CLASSES, VARIANT_CLASSES[variant], className].filter(Boolean).join(' ');

  return submit ? (
    <button type="submit" className={classes} {...props} />
  ) : (
    <button type="button" className={classes} {...props} />
  );
}
