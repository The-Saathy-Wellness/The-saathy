import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'nav';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  ...props
}) => {
  const classes = [styles.btn, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
