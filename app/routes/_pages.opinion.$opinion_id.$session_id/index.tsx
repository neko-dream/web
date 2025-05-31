import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "conform-to-valibot";
import { useState } from "react";
import { Form, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { DeletedOpinionCard } from "~/components/features/deleted-opinion-card";
import { HintOpinionModal } from "~/components/features/hint-opinion-modal";
import { Card } from "~/components/features/opinion-card";
import { More } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Textarea } from "~/components/ui/textarea";
import { useVote } from "~/hooks/useVote";
import { api } from "~/libs/api";
import type { Route } from "~/react-router/_pages.opinion.$opinion_id.$session_id/+types";
import { createOpinionFormSchema } from "~/schemas/create-opinion";
import type { VoteType } from "~/types";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { CreateOpinionModal } from "./components/CreateOpinionModal";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { currentUser, root, opinions, sessionID },
}: Route.ComponentProps) {
  const [isCreateOpinionModal, setIsCreateOpinionModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { revalidate } = useRevalidator();
  const { vote } = useVote({ sessionID });
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

  const handleVote = async (opinionID: string, status: VoteType) => {
    const result = await vote({ opinionID, status });
    if (result === "success") {
      toast.success("意思表明を行いました");
      revalidate();
    } else if (result === "error") {
      toast.error("意思表明に失敗しました");
    }
  };

  const [form, fields] = useForm({
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, {
        schema: createOpinionFormSchema,
      });
    },
    onSubmit: async (e, { submission }) => {
      e.preventDefault();
      if (isSubmitting || submission?.status !== "success") {
        return;
      }
      setIsSubmitting(true);
      try {
        const { data, error } = await api.POST("/opinions", {
          credentials: "include",
          body: {
            parentOpinionID: root.opinion.id,
            ...submission.value,
          },
        });
        if (data) {
          toast.success("意見を投稿しました");
          setIsCreateOpinionModalOpen(false);
          setIsSubmitting(false);
          revalidate();
        } else {
          toast.error(error.message);
          setIsSubmitting(false);
        }
      } catch {
        toast.error("エラーが発生しました");
        setIsSubmitting(false);
      }
    },
    shouldValidate: "onInput",
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
          className="mx-auto w-full max-w-2xl"
          isAllText={true}
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
            <div key={i} className="mx-auto w-full max-w-2xl">
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
                isAllText={true}
              />
            </div>
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
        onHintTextCLick={() => setIsHintModalOpen(true)}
      >
        <Form {...getFormProps(form)}>
          <Textarea
            {...getInputProps(fields.opinionContent, { type: "text" })}
            className="h-[270px]"
            placeholder="この意見についてどう思うか書いてみよう！"
          />
          <Button
            color="primary"
            type="submit"
            disabled={isSubmitting}
            className="!mt-8 mx-auto block"
          >
            <img src="" alt="" />
            <span>コメントを投稿する</span>
          </Button>
        </Form>
      </CreateOpinionModal>

      <HintOpinionModal
        isOpen={isHintModalOpen}
        onOpenChange={setIsHintModalOpen}
      />
    </>
  );
}
