import type { Meta, StoryObj } from "@storybook/react";
import ErrorView from ".";

const meta: Meta<typeof ErrorView> = {
  component: ErrorView,
};
export default meta;
type Story = StoryObj<typeof ErrorView>;

export const Default: Story = {};
