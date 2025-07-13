import { Stack, Divider, Alert, Loader, Progress, RingProgress, Skeleton, Text, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const FeedbackSection = () => (
  <Stack gap="xl">
    <Text fw={700} size="xl">Feedback Components</Text>
    <Divider label="Alert" my="md" />
    <Alert icon={<IconAlertCircle size={16} />} title="Alert!" color="red">This is an alert</Alert>
    <Divider label="Loader" my="md" />
    <Group><Loader /></Group>
    <Divider label="Progress" my="md" />
    <Progress value={60} />
    <Divider label="RingProgress" my="md" />
    <RingProgress sections={[{ value: 40, color: 'blue' }]} label={<Text size="xs">40%</Text>} />
    <Divider label="Skeleton" my="md" />
    <Skeleton height={40} radius="md" />
  </Stack>
);

export default FeedbackSection; 