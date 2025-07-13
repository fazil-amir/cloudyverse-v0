import { Stack, Divider, Box, Collapse, Paper, ScrollArea, Text, Transition, VisuallyHidden, Button } from '@mantine/core';
import { useState } from 'react';

const MiscellaneousSection = () => {
  const [opened, setOpened] = useState(false);

  return (
    <Stack gap="xl">
      <Text fw={700} size="xl">Miscellaneous Components</Text>
      <Divider label="Box" my="md" />
      <Box p="md" style={{ background: '#eee' }}>Box content</Box>
      <Divider label="Collapse" my="md" />
      <Button onClick={() => setOpened((o) => !o)}>Toggle Collapse</Button>
      <Collapse in={opened}><Paper p="md">Collapsed content</Paper></Collapse>
      <Divider label="ScrollArea" my="md" />
      <ScrollArea h={80}><Text>Scrollable content<br/>Line 2<br/>Line 3<br/>Line 4<br/>Line 5</Text></ScrollArea>
      <Divider label="Transition" my="md" />
      <Transition mounted={opened} transition="fade" duration={400} timingFunction="ease">
        {(styles) => <Paper p="md" style={styles}>Transitioned content</Paper>}
      </Transition>
      <Divider label="VisuallyHidden" my="md" />
      <VisuallyHidden>This text is visually hidden</VisuallyHidden>
    </Stack>
  );
};

export default MiscellaneousSection; 