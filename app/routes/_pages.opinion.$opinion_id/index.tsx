import { getFormProps, getInputProps } from "@conform-to/react";
import { useState } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { Form, useNavigate } from "react-router";
import { Fragment } from "react/jsx-runtime";
import type { Route } from "~/app/routes/_pages.opinion.$opinion_id/+types";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Heading } from "~/components/Heading";
import Textarea from "~/components/Textarea";
import { useCreateOpinionsForm } from "~/features/opinion/hooks/useCreateOpinionForm";
import type { OpinionType } from "~/features/opinion/types";
import { api } from "~/libs/api";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { CreateOpinionModal } from "./components/CreateOpinionModal";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { currentUser, root, opinions },
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const [isCreateOpinionModal, setIsCreateOpinionModalOpen] = useState(false);

  const handleSubmitVote = async (opinionID: string, status: OpinionType) => {
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
      <Heading title="コメント一覧" onClick={() => navigate(-1)} />
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

      <div className="flex flex-1 flex-col bg-[#F2F2F7] p-4 pt-0">
        {opinions.map(({ opinion, user: opinionUser, myVoteType }, i) => {
          return (
            <Fragment key={i}>
              <RiMore2Fill size={24} className="ml-4 text-cyan-500" />
              <Card
                key={i}
                title={opinion.title}
                description={opinion.content}
                user={{
                  displayID: "",
                  displayName: opinionUser.displayName,
                  iconURL: opinionUser.iconURL,
                }}
                status={myVoteType}
                date={"2025/12/31 10:00"}
                isJudgeButton={currentUser?.displayID !== opinionUser.displayID}
                onClickAgree={() => handleSubmitVote(opinion.id, "agree")}
                onClickDisagree={() => handleSubmitVote(opinion.id, "disagree")}
                onClickPass={() => handleSubmitVote(opinion.id, "pass")}
              />
            </Fragment>
          );
        })}
      </div>

      <div className="fixed right-4 bottom-4 z-10">
        <CreateOpinionButton
          onClick={() => setIsCreateOpinionModalOpen(true)}
        />
      </div>

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
