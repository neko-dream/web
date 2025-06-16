import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from ".";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "あなたの意見を書こう！",
  },
};
