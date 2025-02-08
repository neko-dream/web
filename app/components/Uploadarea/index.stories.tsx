import type { Meta, StoryObj } from "@storybook/react";
import Uploadarea from ".";

const meta: Meta<typeof Uploadarea> = {
  component: Uploadarea,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Preview: Story = {
  args: {
    preview: "https://placehold.jp/300x300.png",
  },
};
