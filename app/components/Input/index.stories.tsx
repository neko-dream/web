import type { Meta, StoryObj } from "@storybook/react";
import { Input } from ".";

const meta: Meta<typeof Input> = {
  component: Input,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "意見を一言で(タイトル)",
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "意見を一言で(タイトル)",
    icon: "📝",
  },
};

export const Error: Story = {
  args: {
    placeholder: "意見を一言で(タイトル)",
    error: true,
  },
};
