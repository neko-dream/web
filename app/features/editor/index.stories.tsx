import type { Meta, StoryObj } from "@storybook/react";
import { Editor } from ".";
const meta: Meta<typeof Editor> = {
  component: Editor,
};
export default meta;
type Story = StoryObj<typeof meta>;

const uploader = (file: File) => {
  const reader = new FileReader();
  const promise = new Promise<string>((resolve) => {
    reader.onload = function () {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      }
      return "";
    };
    if (file !== null) {
      reader.readAsDataURL(file);
    }
  });
  return promise;
};

export const Default: Story = {
  args: {
    onUpdate: console.log,
    onImageLoad: uploader,
    // onSave: console.log,
  },
};
