import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./index.ts";

const meta: Meta<typeof Card> = { component: Card };
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description:
      "確かにいい感じだが、完全に習得するのに学習コストがかかるので、すべてのアプリに適応するのは難しいかも",
    user: {
      displayID: "fa",
      displayName: "山田太郎マン",
      iconURL: "",
    },
    href: "#",
    status: "disagree",
    date: "2022-01-01 00:00",
    onClickAgree: () => {},
    onClickDisagree: () => {},
    onClickPass: () => {},
  },
};

export default meta;
