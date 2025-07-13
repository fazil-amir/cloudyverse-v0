import { useState } from 'react';
import { Stack, Divider, Affix, Button, Dialog, Drawer, HoverCard, LoadingOverlay, Menu, Modal, Overlay, Popover, Tooltip, Text, Group, Paper } from '@mantine/core';

const OverlaysSection = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [tooltipOpened, setTooltipOpened] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [hoverCardOpened, setHoverCardOpened] = useState(false);

  return (
    <Stack gap="xl">
      <Text fw={700} size="xl">Overlay Components</Text>
      <Divider label="Modal" my="md" />
      <Button onClick={() => setModalOpened(true)}>Open Modal</Button>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Modal Title">Modal content</Modal>
      <Divider label="Drawer" my="md" />
      <Button onClick={() => setDrawerOpened(true)}>Open Drawer</Button>
      <Drawer opened={drawerOpened} onClose={() => setDrawerOpened(false)} title="Drawer Title">Drawer content</Drawer>
      <Divider label="Popover" my="md" />
      <Popover opened={popoverOpened} onChange={setPopoverOpened} position="bottom" withArrow>
        <Popover.Target>
          <Button onClick={() => setPopoverOpened((o) => !o)}>Toggle Popover</Button>
        </Popover.Target>
        <Popover.Dropdown>Popover content</Popover.Dropdown>
      </Popover>
      <Divider label="Tooltip" my="md" />
      <Tooltip label="Tooltip content" opened={tooltipOpened} onChange={setTooltipOpened}>
        <Button onClick={() => setTooltipOpened((o) => !o)}>Toggle Tooltip</Button>
      </Tooltip>
      <Divider label="Menu" my="md" />
      <Menu opened={menuOpened} onChange={setMenuOpened}>
        <Menu.Target>
          <Button onClick={() => setMenuOpened((o) => !o)}>Toggle Menu</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Menu Item 1</Menu.Item>
          <Menu.Item>Menu Item 2</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Divider label="Dialog" my="md" />
      <Button onClick={() => setDialogOpened(true)}>Open Dialog</Button>
      <Dialog opened={dialogOpened} withCloseButton onClose={() => setDialogOpened(false)}>Dialog content</Dialog>
      <Divider label="HoverCard" my="md" />
      <HoverCard opened={hoverCardOpened} onOpen={() => setHoverCardOpened(true)} onClose={() => setHoverCardOpened(false)}>
        <HoverCard.Target>
          <Button>Hover me</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>HoverCard content</HoverCard.Dropdown>
      </HoverCard>
      <Divider label="LoadingOverlay" my="md" />
      <Paper p="md" style={{ position: 'relative', minHeight: 60 }}>
        <LoadingOverlay visible zIndex={1000} />
        <Text>LoadingOverlay content</Text>
      </Paper>
      <Divider label="Overlay" my="md" />
      <Paper p="md" style={{ position: 'relative', minHeight: 60 }}>
        <Overlay opacity={0.6} color="#000" zIndex={5} />
        <Text>Overlay content</Text>
      </Paper>
      <Divider label="Affix" my="md" />
      <Affix position={{ bottom: 20, right: 20 }}><Button>Affixed Button</Button></Affix>
    </Stack>
  );
};

export default OverlaysSection; 