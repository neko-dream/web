import type { Meta, StoryObj } from "@storybook/react";
import { OpinionCount } from "./index.ts";

const meta: Meta<typeof OpinionCount> = {
  component: OpinionCount,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 10,
  },
};

export const Over99: Story = {
  args: {
    count: 100,
  },
};
