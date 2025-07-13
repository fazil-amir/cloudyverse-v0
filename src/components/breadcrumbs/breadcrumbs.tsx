import { Breadcrumbs as MantineBreadcrumbs, Text } from '@mantine/core';
// @ts-ignore
import styles from './breadcrumbs.module.css';

export interface BreadcrumbItem {
  title: string;
  href: string;
  onClick?: () => void;
}

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  return (
    <MantineBreadcrumbs className={styles.root}>
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
  );
} 