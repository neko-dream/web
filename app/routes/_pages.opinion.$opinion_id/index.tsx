import { Form, useNavigate } from "react-router";
import { Heading } from "~/components/Heading";
import { loader } from "./modules/loader";
import type { Route } from "~/app/routes/_pages.opinion.$opinion_id/+types";
import { Card } from "~/components/Card";
import { RiMore2Fill } from "react-icons/ri";
import { Fragment } from "react/jsx-runtime";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { CreateOpinionModal } from "./components/CreateOpinionModal";
import { useState } from "react";
import { useCreateOpinionsForm } from "~/feature/opinion/hooks/useCreateOpinionForm";
import Textarea from "~/components/Textarea";
import { Button } from "~/components/Button";
import { getFormProps, getInputProps } from "@conform-to/react";
import { api } from "~/libs/api";
import { OpinionType } from "~/feature/opinion/types";

export { loader };

export default function Page({
  loaderData: { opinion, user, opinions },
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const [isCreateOpinionModal, setIsCreateOpinionModalOpen] = useState(false);

  const handleSubmitVote = async (opinionID: string, status: OpinionType) => {
    const { data } = await api.POST("/opinions/{opinionID}/votes", {
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
    console.log(data);
  };

  const { form, fields } = useCreateOpinionsForm({
    parentOpinionID: opinion.id,
    onFinishedProcess: () => {
      console.log("onFinishedProcess");
    },
  });

  return (
    <>
      <Heading title="コメント一覧" onClick={() => navigate(-1)} />
      <Card
        title={opinion.title}
        description={opinion.content}
        user={{
          displayID: "",
          displayName: user.displayName,
          iconURL: user.iconURL,
        }}
        // FIXME: ココアってる？
        // status={opinion.voteType}
        date={"2025/12/31 10:00"}
        onClickAgree={() => handleSubmitVote(opinion.id, "agree")}
        onClickDisagree={() => handleSubmitVote(opinion.id, "disagree")}
        onClickPass={() => handleSubmitVote(opinion.id, "pass")}
        onClickMore={() => {}}
        className="rounded-none"
        isJudgeButton
      />

      <div className="flex flex-1 flex-col bg-[#F2F2F7] p-4 pt-0">
        {opinions.map(({ opinion, user: opinionUser }, i) => {
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
                // status={myVoteType}
                date={"2025/12/31 10:00"}
                onClickAgree={() => handleSubmitVote(opinion.id, "agree")}
                onClickDisagree={() => handleSubmitVote(opinion.id, "disagree")}
                onClickPass={() => handleSubmitVote(opinion.id, "pass")}
                onClickMore={() => {}}
                isJudgeButton
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
          <Button color="primary" type="submit" className="mx-auto !mt-8 block">
            <img src="" alt="" />
            <span>コメントを投稿する</span>
          </Button>
        </Form>
      </CreateOpinionModal>
    </>
  );
}
