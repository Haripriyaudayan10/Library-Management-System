import type { Meta, StoryObj } from '@storybook/react';
import { BookOpen } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';

const meta = {
  title: 'UI/StatCard',
  component: StatCard,
  args: {
    label: 'Total Books',
    value: '24,512',
    icon: BookOpen,
  },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NegativeTrend: Story = {
  args: {
    label: 'Pending Returns',
    value: '142',
    trend: '+5 overdue',
    negative: true,
  },
};
