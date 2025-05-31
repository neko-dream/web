import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "conform-to-valibot";
import { useState } from "react";
import { Form, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { DeletedOpinionCard } from "~/components/features/deleted-opinion-card";
import { HintOpinionModal } from "~/components/features/hint-opinion-modal";
import { Card } from "~/components/features/opinion-card";
import { InfoCircle, More } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Label } from "~/components/ui/label";
import { HalfBottomDialog } from "~/components/ui/modal";
import { Textarea } from "~/components/ui/textarea";
import { useVote } from "~/hooks/useVote";
import { api } from "~/libs/api";
import type { Route } from "~/react-router/_pages.$session_id.opinions.$opinion_id/+types";
import { createOpinionFormSchema } from "~/schemas/create-opinion";
import type { VoteType } from "~/types";
import { isEnd } from "~/utils/format-date";
import { CreateOpinionButton } from "./components/CreateOpinionButton";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { currentUser, root, opinions, session },
}: Route.ComponentProps) {
  const [isCreateOpinionModal, setIsCreateOpinionModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { revalidate } = useRevalidator();
  const { vote } = useVote({ sessionID: session.id });
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
    shouldRevalidate: "onSubmit",
  });

  return (
    <>
      {/* FIXME: 意見IDからセッションのIDが欲しい */}
      <Heading title="コメント一覧" to={`/${session.id}`} isLink={true} />

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
          isJudgeButtonDisabled={isEnd(session.scheduledEndTime)}
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

      {!(root.opinion.isDeleted || isEnd(session.scheduledEndTime)) && (
        <div className="fixed right-4 bottom-4 z-10">
          <CreateOpinionButton
            onClick={() => setIsCreateOpinionModalOpen(true)}
          />
        </div>
      )}

      <HalfBottomDialog
        isOpen={isCreateOpinionModal}
        onOpenChange={() => setIsCreateOpinionModalOpen(false)}
      >
        <div className="flex items-center justify-between">
          <h2 className="mx-auto font-bold text-lg">コメント</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsHintModalOpen(true)}
          className="mt-1 flex items-center space-x-1 font-bold text-blue-500 text-sm"
        >
          <InfoCircle />
          <p>投稿のルール</p>
        </button>
        <div className="mt-4">
          <Form {...getFormProps(form)}>
            <Label
              title="あなたの意見"
              className="mt-4"
              notes={["注意：個人情報は入力しないでください"]}
              errors={fields.opinionContent.errors}
            >
              <Textarea
                {...getInputProps(fields.opinionContent, { type: "text" })}
                className="h-[200px]"
                error={(fields.opinionContent.errors || []).length > 0}
              />
            </Label>
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
        </div>
      </HalfBottomDialog>

      <HintOpinionModal
        isOpen={isHintModalOpen}
        onOpenChange={setIsHintModalOpen}
      />
    </>
  );
}
