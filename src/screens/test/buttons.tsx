import { Stack, Divider, Button, ActionIcon, CloseButton, CopyButton, FileButton, UnstyledButton, Group, Text } from '@mantine/core';
import { IconCheck, IconCopy, IconUpload, IconX } from '@tabler/icons-react';

const ButtonsSection = () => (
  <Stack gap="xl">
    <Text fw={700} size="xl">Button Components</Text>
    <Divider label="Button" my="md" />
    <Group>
      <Button>Default</Button>
      <Button leftSection={<IconCheck size={16} />}>With Icon</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="light">Light</Button>
      <Button variant="subtle">Subtle</Button>
      <Button color="red">Red</Button>
    </Group>
    <Divider label="ActionIcon" my="md" />
    <Group>
      <ActionIcon variant="filled" color="blue"><IconCheck /></ActionIcon>
      <ActionIcon variant="outline" color="red"><IconX /></ActionIcon>
    </Group>
    <Divider label="CloseButton" my="md" />
    <CloseButton />
    <Divider label="CopyButton" my="md" />
    <CopyButton value="Copy me!">
      {({ copied, copy }) => (
        <Button color={copied ? 'teal' : 'blue'} onClick={copy} leftSection={<IconCopy size={16} />}>{copied ? 'Copied' : 'Copy'}</Button>
      )}
    </CopyButton>
    <Divider label="FileButton" my="md" />
    <FileButton onChange={() => {}} accept="image/png,image/jpeg">
      {(props) => <Button leftSection={<IconUpload size={16} />} {...props}>Upload file</Button>}
    </FileButton>
    <Divider label="UnstyledButton" my="md" />
    <UnstyledButton style={{ padding: 8, background: '#eee', borderRadius: 4 }}>Unstyled Button</UnstyledButton>
  </Stack>
);

export default ButtonsSection; 