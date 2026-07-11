import { useState } from "react";
import { toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/libs/openapi-fetch";
import type { components } from "~/types/openapi";
import "simplebar-react/dist/simplebar.min.css";

type Survey = components["schemas"]["TalkSessionSurvey"];
type Question = components["schemas"]["TalkSessionSurveyQuestion"];

/**
 * 回答の下書き。質問タイプによって使うフィールドが変わる
 * - single_choice / dropdown / multi_choice: choiceIDs
 * - free_text: text
 * - rating: text（数値文字列）
 * - date: text（YYYY-MM-DD）
 */
type AnswerDraft = {
  choiceIDs: string[];
  text: string;
};

const emptyAnswer: AnswerDraft = { choiceIDs: [], text: "" };

const isAnswered = (question: Question, answer: AnswerDraft): boolean => {
  switch (question.type) {
    case "single_choice":
    case "dropdown":
    case "multi_choice":
      return answer.choiceIDs.length > 0;
    default:
      return answer.text.trim() !== "";
  }
};

type Props = {
  sessionID: string;
  survey: Survey;
  onClose: () => void;
  onAnswered: () => void;
};

export const SurveyModalContent = ({
  sessionID,
  survey,
  onClose,
  onAnswered,
}: Props) => {
  const [answers, setAnswers] = useState<Record<string, AnswerDraft>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [...survey.questions].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const getAnswer = (questionID: string) => answers[questionID] || emptyAnswer;

  const updateAnswer = (questionID: string, patch: Partial<AnswerDraft>) => {
    setAnswers((prev) => ({
      ...prev,
      [questionID]: { ...(prev[questionID] || emptyAnswer), ...patch },
    }));
  };

  const answeredCount = questions.filter((q) =>
    isAnswered(q, getAnswer(q.questionID)),
  ).length;

  const canSubmit = questions
    .filter((q) => q.isRequired)
    .every((q) => isAnswered(q, getAnswer(q.questionID)));

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const body = {
      answers: questions
        .filter((q) => isAnswered(q, getAnswer(q.questionID)))
        .map((question) => {
          const answer = getAnswer(question.questionID);
          switch (question.type) {
            case "single_choice":
            case "dropdown":
            case "multi_choice":
              return {
                questionID: question.questionID,
                selectedChoiceIDs: answer.choiceIDs,
              };
            case "rating":
              return {
                questionID: question.questionID,
                rating: Number(answer.text),
              };
            case "date":
              return {
                questionID: question.questionID,
                date: answer.text,
              };
            default:
              return {
                questionID: question.questionID,
                text: answer.text.trim(),
              };
          }
        }),
    };

    const { error, response } = await api.POST(
      "/talksessions/{talkSessionID}/survey/submissions",
      {
        credentials: "include",
        params: { path: { talkSessionID: sessionID } },
        body,
        // アンケートAPIはJSONを受け取るため、FormData変換を上書きする
        bodySerializer: (b) => JSON.stringify(b),
      },
    );
    setIsSubmitting(false);

    // 1ユーザー1送信のため、回答済みなら409が返る
    if (response.status === 409) {
      toast.info("すでに回答済みです");
      onAnswered();
      return;
    }

    if (error) {
      toast.error(error.message || "回答の送信に失敗しました");
      return;
    }

    toast.success("アンケートに回答しました");
    onAnswered();
  };

  const renderQuestion = (question: Question, index: number) => {
    const answer = getAnswer(question.questionID);
    const choices = [...question.choices].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );

    return (
      <div key={question.questionID} className="space-y-2">
        <p className="font-bold">
          {index + 1}.{question.text}
        </p>
        {question.type === "single_choice" && (
          <div>
            {choices.map((choice) => (
              <label
                key={choice.choiceID}
                className="flex h-12 cursor-pointer items-center"
              >
                <input
                  type="radio"
                  name={question.questionID}
                  className="mx-3 size-5 shrink-0 cursor-pointer accent-cs-pass"
                  checked={answer.choiceIDs[0] === choice.choiceID}
                  onChange={() => {
                    updateAnswer(question.questionID, {
                      choiceIDs: [choice.choiceID],
                    });
                  }}
                />
                <span>{choice.text}</span>
              </label>
            ))}
          </div>
        )}
        {question.type === "multi_choice" && (
          <div className="space-y-2 px-3">
            {choices.map((choice) => (
              <Checkbox
                key={choice.choiceID}
                id={`${question.questionID}-${choice.choiceID}`}
                label={choice.text}
                checked={answer.choiceIDs.includes(choice.choiceID)}
                onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  updateAnswer(question.questionID, {
                    choiceIDs: checked
                      ? [...answer.choiceIDs, choice.choiceID]
                      : answer.choiceIDs.filter((id) => id !== choice.choiceID),
                  });
                }}
              />
            ))}
          </div>
        )}
        {question.type === "dropdown" && (
          <Select
            options={choices.map((choice) => ({
              value: choice.choiceID,
              title: choice.text,
            }))}
            value={answer.choiceIDs[0] || ""}
            onChange={(e) => {
              updateAnswer(question.questionID, {
                choiceIDs: e.currentTarget.value ? [e.currentTarget.value] : [],
              });
            }}
            aria-label={question.text}
          />
        )}
        {question.type === "rating" && (
          <Select
            options={Array.from(
              {
                length: (question.maxValue ?? 5) - (question.minValue ?? 1) + 1,
              },
              (_, i) => {
                const value = (question.minValue ?? 1) + i;
                const label =
                  value === (question.minValue ?? 1) && question.minLabel
                    ? `${value}：${question.minLabel}`
                    : value === (question.maxValue ?? 5) && question.maxLabel
                      ? `${value}：${question.maxLabel}`
                      : `${value}`;
                return { value: `${value}`, title: label };
              },
            )}
            value={answer.text}
            onChange={(e) => {
              updateAnswer(question.questionID, {
                text: e.currentTarget.value,
              });
            }}
            aria-label={question.text}
          />
        )}
        {question.type === "date" && (
          <Input
            type="date"
            className="px-4"
            value={answer.text}
            onChange={(e) => {
              updateAnswer(question.questionID, {
                text: e.currentTarget.value,
              });
            }}
            aria-label={question.text}
          />
        )}
        {question.type === "free_text" && (
          <Textarea
            rows={3}
            maxLength={question.maxLength ?? undefined}
            placeholder="回答を入力"
            value={answer.text}
            onChange={(e) => {
              updateAnswer(question.questionID, {
                text: e.currentTarget.value,
              });
            }}
            aria-label={question.text}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-[327px] p-2">
      <p className="font-bold text-[18px]">アンケート回答のお願い</p>
      <p className="mt-2">
        セッション参加者にアンケートをとっています。ご協力お願いいたします。
      </p>
      <p className="mt-2 inline-block rounded-md bg-[#d0e5f5] px-2 py-1 font-medium text-[#657a88] text-sm">
        アンケート項目：{answeredCount}/{questions.length}
      </p>
      <hr className="mt-2 border-gray-300" />
      <SimpleBar style={{ maxHeight: 320 }} className="mt-2" autoHide={false}>
        <div className="space-y-4 pr-3">
          {questions.map((question, i) => renderQuestion(question, i))}
        </div>
      </SimpleBar>
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="h-10 flex-1 cursor-pointer rounded-md bg-cs-gray-200"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="primary-gradient h-10 flex-1 cursor-pointer rounded-md font-bold text-white disabled:opacity-40"
        >
          回答を送信
        </button>
      </div>
    </div>
  );
};
