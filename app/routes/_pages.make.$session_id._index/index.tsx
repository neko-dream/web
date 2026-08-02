import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Form, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { RichTextEditor } from "~/components/features/rich-text-editor";
import { Check } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { api } from "~/libs/openapi-fetch";
import type { Route } from "~/react-router/_pages.make.$session_id._index/+types";
import { isFieldsError } from "~/utils/form";
import {
  SurveyEditor,
  createEmptyQuestion,
  isChoiceQuestion,
  validateSurveyQuestions,
} from "./components/SurveyEditor";
import { createSessionFormSchema } from "./schemas";
import type { SurveyQuestionDraft } from "./types";

export { loader } from "./modules/loader";
export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";

const toSurveyQuestionInputs = (questions: SurveyQuestionDraft[]) =>
  questions.map((question, questionIndex) => ({
    questionID: question.questionID,
    text: question.text.trim(),
    type: question.type,
    isRequired: question.isRequired,
    allowOther: question.allowOther,
    containsPii: question.containsPii,
    maxLength: question.maxLength,
    minValue: question.minValue,
    maxValue: question.maxValue,
    minLabel: question.minLabel,
    maxLabel: question.maxLabel,
    displayOrder: questionIndex,
    // 選択肢を持たないタイプでは空配列を送る
    choices: isChoiceQuestion(question.type)
      ? question.choices.map((choice, choiceIndex) => ({
          choiceID: choice.choiceID,
          text: choice.text.trim(),
          displayOrder: choiceIndex,
        }))
      : [],
  }));

const toSurveyQuestionDrafts = (
  questions: NonNullable<
    Route.ComponentProps["loaderData"]["survey"]
  >["questions"],
): SurveyQuestionDraft[] =>
  [...questions]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((question) => ({
      questionID: question.questionID,
      text: question.text,
      type: question.type,
      isRequired: question.isRequired,
      allowOther: question.allowOther,
      containsPii: question.containsPii,
      maxLength: question.maxLength ?? null,
      minValue: question.minValue ?? null,
      maxValue: question.maxValue ?? null,
      minLabel: question.minLabel ?? null,
      maxLabel: question.maxLabel ?? null,
      choices: [...question.choices]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((choice) => ({
          choiceID: choice.choiceID,
          text: choice.text,
        })),
    }));

export default function Page({
  loaderData: { session, isEditMode, survey },
}: Route.ComponentProps) {
  const [isSurveyEnabled, setIsSurveyEnabled] = useState<boolean>(!!survey);
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestionDraft[]>(
    () =>
      survey && survey.questions.length > 0
        ? toSurveyQuestionDrafts(survey.questions)
        : [createEmptyQuestion()],
  );
  const thumbnailRef = useRef<string>(null);
  const navigate = useNavigate();

  /** 通信自体が失敗した場合も呼び出し元でエラー表示できるようfalseに倒す */
  const saveSurvey = (talkSessionID: string): Promise<boolean> =>
    saveSurveyRequest(talkSessionID).catch(() => false);

  const saveSurveyRequest = async (talkSessionID: string): Promise<boolean> => {
    if (!survey) {
      if (!isSurveyEnabled) {
        return true;
      }
      const { error } = await api.POST("/talksessions/{talkSessionID}/survey", {
        credentials: "include",
        params: { path: { talkSessionID } },
        body: { questions: toSurveyQuestionInputs(surveyQuestions) },
        // アンケートAPIはJSONを受け取るため、FormData変換を上書きする
        bodySerializer: (body) => JSON.stringify(body),
      });
      return !error;
    }

    // 既存アンケートの編集。OFFにした場合は全質問を削除する
    const nextQuestions = isSurveyEnabled ? surveyQuestions : [];
    const remainingQuestionIDs = new Set(
      nextQuestions.map((q) => q.questionID).filter((id) => id !== undefined),
    );
    const deletedQuestionIDs = survey.questions
      .filter((q) => !remainingQuestionIDs.has(q.questionID))
      .map((q) => q.questionID);
    const deletedChoiceIDs = survey.questions
      .filter((q) => remainingQuestionIDs.has(q.questionID))
      .flatMap((q) => {
        const remainingChoiceIDs = new Set(
          nextQuestions
            .find((next) => next.questionID === q.questionID)
            ?.choices.map((c) => c.choiceID) || [],
        );
        return q.choices
          .filter((c) => !remainingChoiceIDs.has(c.choiceID))
          .map((c) => c.choiceID);
      });

    const { error } = await api.PUT("/talksessions/{talkSessionID}/survey", {
      credentials: "include",
      params: { path: { talkSessionID } },
      body: {
        questions: toSurveyQuestionInputs(nextQuestions),
        deletedQuestionIDs,
        deletedChoiceIDs,
      },
      // アンケートAPIはJSONを受け取るため、FormData変換を上書きする
      bodySerializer: (body) => JSON.stringify(body),
    });
    return !error;
  };

  const [form, fields] = useForm({
    defaultValue: {
      theme: session?.theme || "",
      description: session?.description || "",
      scheduledEndTime: dayjs(session?.scheduledEndTime).format("YYYY-MM-DD"),
    },
    onValidate: ({ formData }) => {
      const parse = parseWithValibot(formData, {
        schema: createSessionFormSchema,
      });
      return parse;
    },
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    onSubmit: async (e, { submission }) => {
      e.preventDefault();

      if (submission?.status !== "success") {
        return;
      }

      if (isSurveyEnabled) {
        const surveyError = validateSurveyQuestions(surveyQuestions);
        if (surveyError) {
          toast.error(surveyError);
          return;
        }
      }

      const value = submission.value;

      if (isEditMode) {
        const { error } = await api.PUT("/talksessions/{talkSessionID}", {
          credentials: "include",
          params: {
            path: {
              talkSessionID: session.id,
            },
          },
          body: {
            ...value,
            scheduledEndTime: dayjs(value?.scheduledEndTime).toISOString(),
            thumbnailURL: thumbnailRef.current || "",
          },
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (!(await saveSurvey(session.id))) {
          toast.error("アンケートの保存に失敗しました");
          return;
        }

        toast.success("更新が完了しました");
        navigate(`/${session?.id}`);
        return;
      }

      const { data, error } = await api.POST("/talksessions", {
        credentials: "include",
        body: {
          ...value,
          scheduledEndTime: dayjs(value?.scheduledEndTime).toISOString(),
          thumbnailURL: thumbnailRef.current || "",
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data && !(await saveSurvey(data.id))) {
        toast.error(
          "セッションは作成されましたが、アンケートの作成に失敗しました",
        );
        navigate("/home");
        return;
      }

      toast.success("登録が完了しました");
      navigate("/home");
    },
  });

  const descriptionControl = useInputControl(fields.description);

  const handleImageUploader = async (file: File) => {
    const { data } = await api.POST("/images", {
      credentials: "include",
      body: {
        image: file,
      },
    });

    if (!thumbnailRef.current) {
      thumbnailRef.current = data?.url || null;
    }

    return data?.url || "";
  };

  return (
    <div className="flex flex-1 flex-col bg-cs-gray-200">
      <Heading
        title={isEditMode ? "セッションを編集する" : "セッションを作成する"}
        className="h-10"
        to={isEditMode ? `/${session.id}` : "/home"}
        isLink={true}
      />
      <Form
        {...getFormProps(form)}
        onSubmit={form.onSubmit}
        method="post"
        className="m-4 mx-auto mb-16 w-full max-w-xl space-y-4 px-4"
      >
        <Label
          title="タイトル"
          errors={fields.theme.errors}
          notes={["意見を聞きたいことを一行で書いてみよう"]}
        >
          <Input
            {...getInputProps(fields.theme, { type: "text" })}
            error={isFieldsError(fields.theme.errors)}
            className="h-12 w-full px-4"
            placeholder="記入する"
          />
        </Label>

        <Label
          title="ストーリー"
          notes={["どうして聞きたいと思ったのか、みんなに伝えよう"]}
        >
          <RichTextEditor
            defaultValue={session?.description}
            onImageLoad={handleImageUploader}
            onUpdate={descriptionControl.change}
          />
        </Label>

        <SurveyEditor
          enabled={isSurveyEnabled}
          onEnabledChange={setIsSurveyEnabled}
          questions={surveyQuestions}
          onQuestionsChange={setSurveyQuestions}
        />

        <Label
          title="募集期間"
          notes={["具体的な場所が決まっていたら入力しよう"]}
          errors={fields.scheduledEndTime.errors}
        >
          <Input
            {...getInputProps(fields.scheduledEndTime, {
              type: "date",
            })}
            type="date"
            className="h-12 w-full px-4"
            placeholder="記入する"
            defaultValue={
              session?.scheduledEndTime
                ? dayjs(session?.scheduledEndTime).format("YYYY-MM-DD")
                : dayjs().add(7, "day").format("YYYY-MM-DD")
            }
            min={dayjs().add(1, "day").format("YYYY-MM-DD")} // 今日の日付を最小値として設定
            error={(fields.scheduledEndTime.errors || []).length > 0}
          />
        </Label>

        <Label
          title="ホームの一覧に非表示するかどうか"
          notes={["※ プロフィール画面では表示されます"]}
        >
          <Select
            {...getSelectProps(fields.hideTop)}
            options={[
              {
                title: "はい",
                value: "true",
              },
              {
                title: "いいえ",
                value: "false",
              },
            ]}
            value={session?.hideTop === true ? "true" : "false"}
          />
        </Label>

        <Button
          color="primary"
          type="submit"
          className="!mt-12 mx-auto flex items-center space-x-4"
        >
          <Check />
          <span>
            {isEditMode ? "セッションを編集する" : "セッションを作成する"}
          </span>
        </Button>
      </Form>
    </div>
  );
}
