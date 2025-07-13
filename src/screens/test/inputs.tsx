import { Stack, Divider, TextInput, PasswordInput, NumberInput, Textarea, Checkbox, Radio, RadioGroup, Switch, ColorInput, FileInput, Rating, SegmentedControl, NativeSelect, JsonInput } from '@mantine/core';
import { useState } from 'react';

const InputsSection = () => {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [textarea, setTextarea] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [radio, setRadio] = useState('option1');
  const [switchValue, setSwitchValue] = useState(false);
  const [color, setColor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [rating, setRating] = useState(2);
  const [segment, setSegment] = useState('React');
  const [nativeSelect, setNativeSelect] = useState('apple');
  const [json, setJson] = useState('{"hello": "world"}');

  return (
    <Stack gap="xl">
      <TextInput label="Text Input" value={text} onChange={e => setText(e.currentTarget.value)} />
      <Divider label="PasswordInput" my="md" />
      
      <PasswordInput label="Password Input" value={password} onChange={e => setPassword(e.currentTarget.value)} />
      <Divider label="NumberInput" my="md" />
      
      <NumberInput label="Number Input" value={number} onChange={val => setNumber(val === '' ? '' : Number(val))} />
      <Divider label="Textarea" my="md" />
      
      <Textarea label="Textarea" value={textarea} onChange={e => setTextarea(e.currentTarget.value)} />
      <Divider label="Checkbox" my="md" />
      
      <Checkbox label="Checkbox" checked={checkbox} onChange={e => setCheckbox(e.currentTarget.checked)} />
      <Divider label="RadioGroup" my="md" />
      
      <RadioGroup label="Radio Group" value={radio} onChange={setRadio}>
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>
      <Divider label="Switch" my="md" />
      
      <Switch label="Switch" checked={switchValue} onChange={e => setSwitchValue(e.currentTarget.checked)} />
      <Divider label="ColorInput" my="md" />
      
      <ColorInput label="Color Input" value={color} onChange={setColor} />
      <Divider label="FileInput" my="md" />
      
      <FileInput label="File Input" value={file} onChange={setFile} />
      <Divider label="Rating" my="md" />
      
      <Rating value={rating} onChange={setRating} />
      <Divider label="SegmentedControl" my="md" />
      
      <SegmentedControl value={segment} onChange={setSegment} data={["React", "Vue", "Svelte"]} />
      <Divider label="NativeSelect" my="md" />
      
      <NativeSelect label="Native Select" value={nativeSelect} onChange={e => setNativeSelect(e.currentTarget.value)} data={[{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }, { value: 'orange', label: 'Orange' }]} />
      <Divider label="JsonInput" my="md" />
      
      <JsonInput label="Json Input" value={json} onChange={setJson} autosize minRows={2} maxRows={6} />
    </Stack>
  );
};

export default InputsSection; 