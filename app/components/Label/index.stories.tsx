import type { Meta, StoryObj } from "@storybook/react";
import { Label } from ".";
import { Input } from "../Input";

const meta: Meta<typeof Label> = { component: Label };
export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {
  args: {
    required: true,
    title: "あなたの立場",
  },
};

export const Optional: Story = {
  args: {
    optional: true,
    title: "あなたの立場",
  },
};

export const Errors: Story = {
  args: {
    optional: true,
    title: "あなたの立場",
    children: <Input error />,
    errors: ["エラーが発生しました", "エラーが発生しました"],
  },
};
