import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: "primary",
    children: "セッションを作成する",
  },
};

export const Agree: Story = {
  args: {
    color: "agree",
    children: "セッションを作成する",
  },
};

export const Disagree: Story = {
  args: {
    color: "disagree",
    children: "セッションを作成する",
  },
};

export const Pass: Story = {
  args: {
    color: "pass",
    children: "セッションを作成する",
  },
};

export const MiniPrimary: Story = {
  args: {
    color: "primary",
    mini: true,
    children: "完了",
  },
};

export const MiniAgree: Story = {
  args: {
    color: "agree",
    mini: true,
    children: "完了",
  },
};

export const MiniDisagree: Story = {
  args: {
    color: "disagree",
    mini: true,
    children: "完了",
  },
};

export const MiniPass: Story = {
  args: {
    color: "pass",
    mini: true,
    children: "完了",
  },
};
