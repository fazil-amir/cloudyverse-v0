import { Stack, Divider, Autocomplete, MultiSelect, Select, Text, Group } from '@mantine/core';
import { useState } from 'react';

const ComboboxSection = () => {
  const [autocomplete, setAutocomplete] = useState('');
  const [select, setSelect] = useState<string | null>(null);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);

  return (
    <Stack gap="xl">
      <Text fw={700} size="xl">Combobox Components</Text>
      <Divider label="Autocomplete" my="md" />
      <Autocomplete label="Autocomplete" data={["React", "Vue", "Svelte", "Angular"]} value={autocomplete} onChange={setAutocomplete} />
      <Divider label="Select" my="md" />
      <Select label="Select" data={["React", "Vue", "Svelte", "Angular"]} value={select} onChange={setSelect} />
      <Divider label="MultiSelect" my="md" />
      <MultiSelect label="MultiSelect" data={["React", "Vue", "Svelte", "Angular"]} value={multiSelect} onChange={setMultiSelect} />
      {/* PillsInput, Pill, TagsInput, Combobox can be added here if needed */}
    </Stack>
  );
};

export default ComboboxSection; 