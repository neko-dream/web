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
 *
 * allowOther=trueの選択肢系では、選択肢の代わり（single/dropdown）または
 * 選択肢に加えて（multi）「その他」を選べる。otherSelected + other を使う
 */
type AnswerDraft = {
  choiceIDs: string[];
  text: string;
  otherSelected: boolean;
  other: string;
};

const emptyAnswer: AnswerDraft = {
  choiceIDs: [],
  text: "",
  otherSelected: false,
  other: "",
};

/** プルダウンで「その他」を表すsentinel。choiceIDと衝突しない値にする */
const OTHER_VALUE = "__other__";

const isChoiceQuestion = (question: Question): boolean =>
  question.type === "single_choice" ||
  question.type === "dropdown" ||
  question.type === "multi_choice";

/** 「その他」が選ばれていて、かつ自由記述が埋まっているか */
const hasOtherAnswer = (question: Question, answer: AnswerDraft): boolean =>
  question.allowOther && answer.otherSelected && answer.other.trim() !== "";

const isAnswered = (question: Question, answer: AnswerDraft): boolean => {
  if (isChoiceQuestion(question)) {
    return answer.choiceIDs.length > 0 || hasOtherAnswer(question, answer);
  }
  return answer.text.trim() !== "";
};

const sortedChoices = (question: Question) =>
  [...question.choices].sort((a, b) => a.displayOrder - b.displayOrder);

type FieldProps = {
  question: Question;
  answer: AnswerDraft;
  onChange: (patch: Partial<AnswerDraft>) => void;
};

const SingleChoiceField = ({ question, answer, onChange }: FieldProps) => (
  <div>
    {sortedChoices(question).map((choice) => (
      <label
        key={choice.choiceID}
        className="flex h-12 cursor-pointer items-center"
      >
        <input
          type="radio"
          name={question.questionID}
          className="mx-3 size-5 shrink-0 cursor-pointer accent-cs-pass"
          checked={
            !answer.otherSelected && answer.choiceIDs[0] === choice.choiceID
          }
          onChange={() => {
            onChange({ choiceIDs: [choice.choiceID], otherSelected: false });
          }}
        />
        <span>{choice.text}</span>
      </label>
    ))}
    {question.allowOther && (
      <label className="flex h-12 cursor-pointer items-center">
        <input
          type="radio"
          name={question.questionID}
          className="mx-3 size-5 shrink-0 cursor-pointer accent-cs-pass"
          checked={answer.otherSelected}
          onChange={() => {
            onChange({ choiceIDs: [], otherSelected: true });
          }}
        />
        <span>その他</span>
      </label>
    )}
  </div>
);

const MultiChoiceField = ({ question, answer, onChange }: FieldProps) => (
  <div className="space-y-2 px-3">
    {sortedChoices(question).map((choice) => (
      <Checkbox
        key={choice.choiceID}
        id={`${question.questionID}-${choice.choiceID}`}
        label={choice.text}
        checked={answer.choiceIDs.includes(choice.choiceID)}
        onChange={(e) => {
          onChange({
            choiceIDs: e.currentTarget.checked
              ? [...answer.choiceIDs, choice.choiceID]
              : answer.choiceIDs.filter((id) => id !== choice.choiceID),
          });
        }}
      />
    ))}
    {question.allowOther && (
      <Checkbox
        id={`${question.questionID}-other`}
        label="その他"
        checked={answer.otherSelected}
        onChange={(e) => {
          onChange({ otherSelected: e.currentTarget.checked });
        }}
      />
    )}
  </div>
);

const DropdownField = ({ question, answer, onChange }: FieldProps) => (
  <Select
    options={[
      ...sortedChoices(question).map((choice) => ({
        value: choice.choiceID,
        title: choice.text,
      })),
      ...(question.allowOther ? [{ value: OTHER_VALUE, title: "その他" }] : []),
    ]}
    value={answer.otherSelected ? OTHER_VALUE : answer.choiceIDs[0] || ""}
    onChange={(e) => {
      const value = e.currentTarget.value;
      onChange({
        choiceIDs: value && value !== OTHER_VALUE ? [value] : [],
        otherSelected: value === OTHER_VALUE,
      });
    }}
    aria-label={question.text}
  />
);

const RatingField = ({ question, answer, onChange }: FieldProps) => {
  const min = question.minValue ?? 1;
  const max = question.maxValue ?? 5;

  const toTitle = (value: number) => {
    if (value === min && question.minLabel) {
      return `${value}：${question.minLabel}`;
    }
    if (value === max && question.maxLabel) {
      return `${value}：${question.maxLabel}`;
    }
    return `${value}`;
  };

  return (
    <Select
      options={Array.from({ length: max - min + 1 }, (_, i) => {
        const value = min + i;
        return { value: `${value}`, title: toTitle(value) };
      })}
      value={answer.text}
      onChange={(e) => {
        onChange({ text: e.currentTarget.value });
      }}
      aria-label={question.text}
    />
  );
};

const DateField = ({ question, answer, onChange }: FieldProps) => (
  <Input
    type="date"
    className="px-4"
    value={answer.text}
    onChange={(e) => {
      onChange({ text: e.currentTarget.value });
    }}
    aria-label={question.text}
  />
);

const FreeTextField = ({ question, answer, onChange }: FieldProps) => (
  <Textarea
    rows={3}
    maxLength={question.maxLength ?? undefined}
    placeholder="回答を入力"
    value={answer.text}
    onChange={(e) => {
      onChange({ text: e.currentTarget.value });
    }}
    aria-label={question.text}
  />
);

const QuestionField = (props: FieldProps) => {
  switch (props.question.type) {
    case "single_choice":
      return <SingleChoiceField {...props} />;
    case "multi_choice":
      return <MultiChoiceField {...props} />;
    case "dropdown":
      return <DropdownField {...props} />;
    case "rating":
      return <RatingField {...props} />;
    case "date":
      return <DateField {...props} />;
    default:
      return <FreeTextField {...props} />;
  }
};

const QuestionItem = ({
  question,
  answer,
  index,
  onChange,
}: FieldProps & { index: number }) => (
  <div className="space-y-2">
    <p className="font-bold">
      {index + 1}.{question.text}
      <span
        className={`ml-2 rounded px-1 py-0.5 font-medium text-xs ${
          question.isRequired
            ? "bg-cs-caution text-white"
            : "bg-cs-gray-200 text-cs-gray-600"
        }`}
      >
        {question.isRequired ? "必須" : "任意"}
      </span>
    </p>
    <QuestionField question={question} answer={answer} onChange={onChange} />
    {isChoiceQuestion(question) &&
      question.allowOther &&
      answer.otherSelected && (
        <Input
          type="text"
          className="px-4"
          maxLength={question.maxLength ?? undefined}
          placeholder="その他の内容を入力"
          value={answer.other}
          onChange={(e) => {
            onChange({ other: e.currentTarget.value });
          }}
          aria-label={`${question.text}のその他`}
        />
      )}
  </div>
);

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
                ...(hasOtherAnswer(question, answer)
                  ? { other: answer.other.trim() }
                  : {}),
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
          {questions.map((question, i) => (
            <QuestionItem
              key={question.questionID}
              question={question}
              answer={getAnswer(question.questionID)}
              index={i}
              onChange={(patch) => updateAnswer(question.questionID, patch)}
            />
          ))}
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
