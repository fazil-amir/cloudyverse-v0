import { Breadcrumbs as MantineBreadcrumbs, Text, Container } from '@mantine/core';

export interface BreadcrumbItem {
  title: string;
  href: string;
  onClick?: () => void;
}

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  return (
    <>
    <Container pt="md">
      <MantineBreadcrumbs>
        {breadcrumbs.map((b, i) => (
          <Text 
            key={i} 
            component="a" 
            href={b.href} 
            size="sm" 
            color="dimmed"
            onClick={(e) => {
              if (b.onClick) {
                e.preventDefault();
                b.onClick();
              }
            }}
            style={{ cursor: b.onClick ? 'pointer' : 'default' }}
          >
            {b.title}
          </Text>
        ))}
      </MantineBreadcrumbs>
    </Container>
    </>
  );
} 