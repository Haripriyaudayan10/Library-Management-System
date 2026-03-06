import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/ui/Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  args: {
    children: 'Status',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { tone: 'neutral' } };
export const Positive: Story = { args: { tone: 'positive', children: 'Available' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Reserved' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Overdue' } };
