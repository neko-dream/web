import { getFormProps, getInputProps } from "@conform-to/react";
import { useState } from "react";
import { Form, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";
import { DeletedOpinionCard } from "~/components/features/deleted-opinion-card";
import { Card } from "~/components/features/opinion-card";
import { More } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import Textarea from "~/components/ui/textarea";
import { useCreateOpinionsForm } from "~/hooks/useCreateOpinionForm";
import { useVote } from "~/hooks/useVote";
import type { Route } from "~/react-router/_pages.opinion.$opinion_id.$session_id/+types";
import type { VoteType } from "~/types";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { CreateOpinionModal } from "./components/CreateOpinionModal";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { currentUser, root, opinions, sessionID },
}: Route.ComponentProps) {
  const { revalidate } = useRevalidator();
  // FIXME: 正しいセッションIDを渡す
  const { vote } = useVote({ sessionID });
  const [isCreateOpinionModal, setIsCreateOpinionModalOpen] = useState(false);

  const handleVote = async (opinionID: string, status: VoteType) => {
    const result = await vote({ opinionID, status });
    if (result === "success") {
      toast.success("意思表明を行いました");
      revalidate();
    } else if (result === "error") {
      toast.error("意思表明に失敗しました");
    }
  };

  const { form, fields } = useCreateOpinionsForm({
    parentOpinionID: root.opinion.id,
    onFinishedProcess: () => {},
  });

  return (
    <>
      {/* FIXME: 意見IDからセッションのIDが欲しい */}
      <Heading title="コメント一覧" to={`/${sessionID}`} isLink={true} />

      {root.opinion.isDeleted ? (
        <DeletedOpinionCard
          title={root.opinion.title}
          description={root.opinion.content}
          status={root.myVoteType}
          date={root.opinion.postedAt}
        />
      ) : (
        <Card
          title={root.opinion.title}
          description={root.opinion.content}
          user={root.user}
          status={root.myVoteType}
          date={root.opinion.postedAt}
          isJudgeButton={currentUser?.displayID !== root.user.displayID}
          onClickAgree={() => handleVote(root.opinion.id, "agree")}
          onClickDisagree={() => handleVote(root.opinion.id, "disagree")}
          onClickPass={() => handleVote(root.opinion.id, "pass")}
          className="rounded-none"
        />
      )}

      <div className="flex flex-1 flex-col bg-[#F2F2F7] p-4 pt-0">
        {opinions.map(({ opinion, user, myVoteType }, i) => {
          if (opinion.isDeleted) {
            return (
              <DeletedOpinionCard
                key={i}
                href={`/opinion/${opinion.id}`}
                title={opinion.title}
                description={opinion.content}
                status={myVoteType}
                date={opinion.postedAt}
              />
            );
          }
          return (
            <Fragment key={i}>
              <More className="ml-4 w-6 text-cyan-500" />
              <Card
                key={i}
                title={opinion.title}
                description={opinion.content}
                user={user}
                status={myVoteType}
                date={opinion.postedAt}
                isJudgeButton={currentUser?.displayID !== user.displayID}
                onClickAgree={() => handleVote(opinion.id, "agree")}
                onClickDisagree={() => handleVote(opinion.id, "disagree")}
                onClickPass={() => handleVote(opinion.id, "pass")}
              />
            </Fragment>
          );
        })}
      </div>

      {!root.opinion.isDeleted && (
        <div className="fixed right-4 bottom-4 z-10">
          <CreateOpinionButton
            onClick={() => setIsCreateOpinionModalOpen(true)}
          />
        </div>
      )}

      <CreateOpinionModal
        isOpen={isCreateOpinionModal}
        onClose={() => setIsCreateOpinionModalOpen(false)}
      >
        <Form {...getFormProps(form)}>
          <Textarea
            {...getInputProps(fields.opinionContent, { type: "text" })}
            className="h-[270px]"
            placeholder="この意見についてどう思うか書いてみよう！"
          />
          <Button color="primary" type="submit" className="!mt-8 mx-auto block">
            <img src="" alt="" />
            <span>コメントを投稿する</span>
          </Button>
        </Form>
      </CreateOpinionModal>
    </>
  );
}
