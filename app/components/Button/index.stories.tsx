import type { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variation: "primary",
    children: "hello world!!",
  },
};

export const Outline: Story = {
  args: {
    variation: "agree",
    outline: true,
    children: "hello world!!",
  },
};

export const Agree: Story = {
  args: {
    variation: "agree",
    children: "hello world!!",
  },
};

export const Disagree: Story = {
  args: {
    variation: "disagree",
    children: "hello world!!",
  },
};

export const Pass: Story = {
  args: {
    variation: "pass",
    children: "hello world!!",
  },
};
