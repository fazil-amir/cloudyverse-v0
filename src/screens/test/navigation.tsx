import { Stack, Divider, Anchor, Breadcrumbs, Burger, NavLink, Pagination, Stepper, Tabs, Text, Group } from '@mantine/core';
import { useState } from 'react';

const NavigationSection = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [activeStep, setActiveStep] = useState(0);
  const items = [<Anchor href="#" key="1">Home</Anchor>, <Anchor href="#" key="2">Library</Anchor>, <Anchor href="#" key="3">Data</Anchor>];

  return (
    <Stack gap="xl">
      <Text fw={700} size="xl">Navigation Components</Text>
      <Divider label="Anchor & Breadcrumbs" my="md" />
      <Breadcrumbs>{items}</Breadcrumbs>
      <Divider label="Burger" my="md" />
      <Burger opened={true} />
      <Divider label="NavLink" my="md" />
      <NavLink label="NavLink" active />
      <Divider label="Pagination" my="md" />
      <Pagination total={10} value={1} />
      <Divider label="Stepper" my="md" />
      <Stepper active={activeStep} onStepClick={setActiveStep} breakpoint="sm">
        <Stepper.Step label="Step 1" description="Create account" />
        <Stepper.Step label="Step 2" description="Verify email" />
        <Stepper.Step label="Step 3" description="Get full access" />
      </Stepper>
      <Divider label="Tabs" my="md" />
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="first">First</Tabs.Tab>
          <Tabs.Tab value="second">Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="first">First tab content</Tabs.Panel>
        <Tabs.Panel value="second">Second tab content</Tabs.Panel>
      </Tabs>
      {/* TableOfContents, Tree can be added here if needed */}
    </Stack>
  );
};

export default NavigationSection; 