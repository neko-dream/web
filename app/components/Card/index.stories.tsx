import type { Meta, StoryObj } from "@storybook/react";
import { Card } from ".";

const meta: Meta<typeof Card> = { component: Card };
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description:
      "確かにいい感じだが、完全に習得するのに学習コストがかかるので、すべてのアプリに適応するのは難しいかも",
    user: {
      displayID: "",
      displayName: "山田太郎マン",
      iconURL: "",
    },
    href: "#",
    status: "disagree",
    date: "2022-01-01 00:00",
    onClickAgree: () => console.log("agree"),
    onClickDisagree: () => console.log("disagree"),
    onClickPass: () => console.log("pass"),
    onClickMore: () => console.log("more"),
  },
};

export default meta;
