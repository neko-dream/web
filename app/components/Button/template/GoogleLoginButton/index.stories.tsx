import type { Meta, StoryObj } from "@storybook/react";
import GoogleLoginButton from ".";

const meta: Meta<typeof GoogleLoginButton> = {
  component: GoogleLoginButton,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
