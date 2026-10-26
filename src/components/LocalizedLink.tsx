import { Link, type LinkProps } from 'react-router';
import { useLanguage } from '@/i18n/context';
import { localizePath } from '@/i18n/editions';

export default function LocalizedLink({ to, ...props }: Omit<LinkProps, 'to'> & { to: string }) {
  const { lang } = useLanguage();
  return <Link {...props} to={localizePath(to, lang)} />;
}
