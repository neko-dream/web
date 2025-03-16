import { useNavigate } from "react-router";
import { Heading } from "~/components/Heading";

export default function Page() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col bg-[#F2F2F7]">
      <Heading title="セッションを作成" onClick={() => navigate(-1)} />
    </div>
  );
}
