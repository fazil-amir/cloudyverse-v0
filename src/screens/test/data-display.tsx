import { Stack, Divider, Accordion, Avatar, Badge, Card, ColorSwatch, Image, Indicator, Kbd, Spoiler, ThemeIcon, Timeline, Text, Group, Paper } from '@mantine/core';

const DataDisplaySection = () => (
  <Stack gap="xl">
    <Text fw={700} size="xl">Data Display Components</Text>
    <Divider label="Accordion" my="md" />
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Control>Accordion 1</Accordion.Control>
        <Accordion.Panel>Panel 1</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Control>Accordion 2</Accordion.Control>
        <Accordion.Panel>Panel 2</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
    <Divider label="Avatar" my="md" />
    <Group>
      <Avatar radius="xl" />
      <Avatar color="cyan" radius="xl">CY</Avatar>
    </Group>
    <Divider label="Badge" my="md" />
    <Group>
      <Badge>Default</Badge>
      <Badge color="cyan">Cyan</Badge>
    </Group>
    <Divider label="Card" my="md" />
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text>Card content</Text>
    </Card>
    <Divider label="ColorSwatch" my="md" />
    <Group>
      <ColorSwatch color="#228be6" />
      <ColorSwatch color="#15aabf" />
    </Group>
    <Divider label="Image" my="md" />
    <Image src="https://mantine.dev/logo.svg" width={80} alt="Mantine logo" />
    <Divider label="Indicator" my="md" />
    <Indicator label="New">
      <Avatar radius="xl" />
    </Indicator>
    <Divider label="Kbd" my="md" />
    <Kbd>⌘ + K</Kbd>
    <Divider label="Spoiler" my="md" />
    <Spoiler maxHeight={40} showLabel="Show more" hideLabel="Hide">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
    </Spoiler>
    <Divider label="ThemeIcon" my="md" />
    <ThemeIcon color="blue" size="xl" radius="xl">T</ThemeIcon>
    <Divider label="Timeline" my="md" />
    <Timeline active={1} bulletSize={24} lineWidth={2}>
      <Timeline.Item title="Step 1">First step</Timeline.Item>
      <Timeline.Item title="Step 2">Second step</Timeline.Item>
    </Timeline>
  </Stack>
);

export default DataDisplaySection; 