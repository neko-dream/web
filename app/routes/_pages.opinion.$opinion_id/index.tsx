import { getFormProps, getInputProps } from "@conform-to/react";
import { useState } from "react";
import { Form } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { DeletedOpinionCard } from "~/components/features/deleted-opinion-card";
import { Card } from "~/components/features/opinion-card";
import { More } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import Textarea from "~/components/ui/textarea";
import { useCreateOpinionsForm } from "~/hooks/useCreateOpinionForm";
import { api } from "~/libs/api";
import type { Route } from "~/react-router/_pages.opinion.$opinion_id/+types";
import type { VoteType } from "~/types";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { CreateOpinionModal } from "./components/CreateOpinionModal";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { currentUser, root, opinions },
}: Route.ComponentProps) {
  const [isCreateOpinionModal, setIsCreateOpinionModalOpen] = useState(false);

  const handleSubmitVote = async (opinionID: string, status: VoteType) => {
    await api.POST("/opinions/{opinionID}/votes", {
      credentials: "include",
      params: {
        path: {
          opinionID,
        },
      },
      body: {
        voteStatus: status,
      },
    });
  };

  const { form, fields } = useCreateOpinionsForm({
    parentOpinionID: root.opinion.id,
    onFinishedProcess: () => {},
  });

  return (
    <>
      {/* FIXME: 意見IDからセッションのIDが欲しい */}
      <Heading title="コメント一覧" />
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
          onClickAgree={() => handleSubmitVote(root.opinion.id, "agree")}
          onClickDisagree={() => handleSubmitVote(root.opinion.id, "disagree")}
          onClickPass={() => handleSubmitVote(root.opinion.id, "pass")}
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
                onClickAgree={() => handleSubmitVote(opinion.id, "agree")}
                onClickDisagree={() => handleSubmitVote(opinion.id, "disagree")}
                onClickPass={() => handleSubmitVote(opinion.id, "pass")}
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
