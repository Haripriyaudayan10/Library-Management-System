import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Action',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};
