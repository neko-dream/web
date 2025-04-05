import type { Meta, StoryObj } from "@storybook/react";
import Tip from "./index.ts";

const meta: Meta<typeof Tip> = {
  component: Tip,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Optional: Story = {
  args: {
    optional: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};
