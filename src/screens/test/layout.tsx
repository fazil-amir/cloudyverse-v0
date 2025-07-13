import { AppShell, AspectRatio, Center, Container, Flex, Grid, Group, SimpleGrid, Space, Stack, Paper, Text, Divider } from '@mantine/core';

const LayoutSection = () => (
  <Stack gap="xl">
    <Text fw={700} size="xl">Layout Components</Text>
    <Divider label="Container" my="md" />
    <Container p="md" style={{ background: 'var(--mantine-color-body)' }}>
      <Text>Container content</Text>
    </Container>
    <Divider label="Group" my="md" />
    <Group>
      <Paper p="md">Group 1</Paper>
      <Paper p="md">Group 2</Paper>
      <Paper p="md">Group 3</Paper>
    </Group>
    <Divider label="Stack" my="md" />
    <Stack>
      <Paper p="md">Stack 1</Paper>
      <Paper p="md">Stack 2</Paper>
      <Paper p="md">Stack 3</Paper>
    </Stack>
    <Divider label="Flex" my="md" />
    <Flex gap="md">
      <Paper p="md">Flex 1</Paper>
      <Paper p="md">Flex 2</Paper>
      <Paper p="md">Flex 3</Paper>
    </Flex>
    <Divider label="Grid" my="md" />
    <Grid>
      <Grid.Col span={4}><Paper p="md">Grid 1</Paper></Grid.Col>
      <Grid.Col span={4}><Paper p="md">Grid 2</Paper></Grid.Col>
      <Grid.Col span={4}><Paper p="md">Grid 3</Paper></Grid.Col>
    </Grid>
    <Divider label="SimpleGrid" my="md" />
    <SimpleGrid cols={3} spacing="md">
      <Paper p="md">SimpleGrid 1</Paper>
      <Paper p="md">SimpleGrid 2</Paper>
      <Paper p="md">SimpleGrid 3</Paper>
    </SimpleGrid>
    <Divider label="Center" my="md" />
    <Center style={{ minHeight: 80, background: 'var(--mantine-color-body)' }}>
      <Text>Centered content</Text>
    </Center>
    <Divider label="AspectRatio" my="md" />
    <AspectRatio ratio={16 / 9} maw={400} mx="auto">
      <Paper p="md">16:9 Aspect Ratio</Paper>
    </AspectRatio>
    <Divider label="Space" my="md" />
    <Text>Above space</Text>
    <Space h="xl" />
    <Text>Below space</Text>
  </Stack>
);

export default LayoutSection; 