import { getTeamFlag } from '../../utils/helpers';

export default function TeamFlag({ code, name, size = 'md' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  return (
    <span className={sizes[size] || sizes.md} role="img" title={name} aria-label={name}>
      {getTeamFlag(code)}
    </span>
  );
}
