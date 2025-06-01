import { RichTextEditor } from "~/components/features/rich-text-editor";
import { Heading } from "~/components/ui/heading";
import type { Route } from "../_pages.make.$session_id.loadmap/+types";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { session },
}: Route.ComponentProps) {
  const handleImageUploader = async (file: File) => {
    await file;
    return "";
  };

  return (
    <div className="flex-1 bg-cs-gray-200">
      <Heading title="活動報告" to={`/${session.id}`} isLink={true} />

      <form className="mx-auto w-full max-w-xl p-4">
        <RichTextEditor
          onImageLoad={handleImageUploader}
          onUpdate={console.log}
        />
      </form>
    </div>
  );
}
