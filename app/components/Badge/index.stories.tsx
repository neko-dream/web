import type { Meta, StoryObj } from "@storybook/react";
import Badge from ".";

const meta: Meta<typeof Badge> = {
  component: Badge,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Agree: Story = {
  args: {
    status: "agree",
  },
};

export const Disagree: Story = {
  args: {
    status: "disagree",
  },
};

export const Pass: Story = {
  args: {
    status: "pass",
  },
};

export const IsSelect: Story = {
  args: {
    status: "pass",
    isSelectStyle: true,
  },
};
