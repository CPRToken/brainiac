//src/layouts/dashboard/layout.tsx
import { FC, ReactNode } from 'react';
import { withAuthGuard } from 'src/hocs/with-auth-guard';
import { useSettings } from 'src/hooks/use-settings';

import { useSections } from './config';
import { HorizontalLayout } from './horizontal-layout';
import { VerticalLayout } from './vertical-layout';

interface LayoutProps {
  children?: ReactNode;  // TypeScript will handle this
}

export const Layout: FC<LayoutProps> = withAuthGuard((props) => {
  const settings = useSettings();
  const sections = useSections();

  if (settings.layout === 'horizontal') {
    return (
      <HorizontalLayout
        sections={sections}
        navColor={settings.navColor}
        {...props}
      />
    );
  }

  return (
    <VerticalLayout
      sections={sections}
      navColor={settings.navColor}
      {...props}
    />
  );
});
