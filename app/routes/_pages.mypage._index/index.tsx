import { Link, useLoaderData, useNavigate, useSearchParams } from "react-router";
import SettinIcon from "~/assets/setting.svg";
import Avator from "~/components/Avator";
import Card from "~/components/Card";
import Session from "~/components/Session";
import Tabs from "~/components/Tabs";
import { loader } from "./modules/loader";

export { loader };

export default function Page() {
  const { user, opinions, sessions } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const isMe = params.get("q") === "me";
  const navigate = useNavigate();

  return (
    <div className="mt-2 flex flex-1 flex-col items-center">
      <Link to={"/mypage/edit"} className="ml-auto mr-2">
        <img src={SettinIcon} alt="" />
      </Link>
      <Avator src={user.iconURL} className="mt-2 h-16 w-16" />
      <p className="text-2xl">{user.displayName}</p>
      <Tabs
        className="mt-4 w-full"
        items={[
          { label: "今まで投稿した意見", href: "/mypage" },
          {
            label: "自分が開いたセッション",
            href: "/mypage?q=me",
          },
        ]}
        active={isMe ? "自分が開いたセッション" : "今まで投稿した意見"}
      />

      <div className="box-border w-full flex-1 space-y-2 bg-gray-100 p-2">
        {isMe && (
          <>
            <select
              className="mb-2 mt-2 h-6 w-32 rounded-full border border-gray-300 px-2 py-0.5 text-xs"
              onChange={(e) => {
                console.log(e.currentTarget.value);
                if (e.currentTarget.value) {
                  if (isMe) {
                    navigate(`/mypage?q=me&status=${e.currentTarget.value}`);
                  } else {
                    navigate(`/mypage?status=${e.currentTarget.value}`);
                  }
                } else {
                  if (isMe) {
                    navigate(`/mypage?q=me`);
                  } else {
                    navigate(`/mypage`);
                  }
                }
              }}
            >
              <option value="">すべて</option>
              <option value="finished">終了</option>
              <option value="open">開催中</option>
            </select>

            {sessions?.map((session, i) => {
              return <Session {...session} key={i} />;
            })}
          </>
        )}

        {!isMe &&
          opinions?.map(({ opinion }, i) => {
            return (
              <Card
                key={i}
                title={opinion.title}
                description={opinion.content}
                user={{
                  displayID: "",
                  displayName: user.displayName,
                  iconURL: user.iconURL,
                }}
                opinionStatus={opinion.voteType!}
                className="bg-white"
              />
            );
          })}
      </div>
    </div>
  );
}
