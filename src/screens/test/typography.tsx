import { Stack, Divider, Blockquote, Code, Highlight, List, Mark, Table, Text, Title, TypographyStylesProvider } from '@mantine/core';

const TypographySection = () => (
  <Stack gap="xl">
    <Title order={2}>Typography Components</Title>
    <Divider label="Title & Text" my="md" />
    <Title order={1}>Title 1</Title>
    <Title order={2}>Title 2</Title>
    <Text size="lg">Large text</Text>
    <Text size="sm">Small text</Text>
    <Divider label="Blockquote" my="md" />
    <Blockquote cite="– Mantine">This is a blockquote</Blockquote>
    <Divider label="Code & Highlight" my="md" />
    <Code>npm install mantine</Code>
    <Highlight highlight="Mantine">Install Mantine for React</Highlight>
    <Divider label="List & Mark" my="md" />
    <List>
      <List.Item>First item</List.Item>
      <List.Item>Second item</List.Item>
    </List>
    <Mark>Highlighted text</Mark>
    <Divider label="Table" my="md" />
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Header 1</Table.Th>
          <Table.Th>Header 2</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Cell 1</Table.Td>
          <Table.Td>Cell 2</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
    <Divider label="TypographyStylesProvider" my="md" />
    <TypographyStylesProvider>
      <div>
        <h1>h1 heading</h1>
        <h2>h2 heading</h2>
        <p>Paragraph text</p>
      </div>
    </TypographyStylesProvider>
  </Stack>
);

export default TypographySection; 