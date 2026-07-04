import { useState } from "react";
import { Input } from "~/components/ui/input";
import { CenterDialog } from "~/components/ui/modal";
import { Switch } from "~/components/ui/switch";
import type { SurveyQuestionDraft, SurveyQuestionType } from "../../types";

export const MAX_CHOICES: Record<SurveyQuestionType, number> = {
  single_choice: 5,
  dropdown: 10,
};

export const MIN_CHOICES = 2;

const QUESTION_TYPE_LABELS: Record<SurveyQuestionType, string> = {
  single_choice: "ラジオボタン",
  dropdown: "プルダウン",
};

export const createEmptyQuestion = (): SurveyQuestionDraft => ({
  text: "",
  type: "single_choice",
  choices: [{ text: "" }, { text: "" }],
});

export const validateSurveyQuestions = (
  questions: SurveyQuestionDraft[],
): string | null => {
  if (questions.length === 0) {
    return "アンケートの質問を1つ以上追加してください";
  }
  for (const [i, question] of questions.entries()) {
    const label = `質問${i + 1}`;
    if (question.text.trim() === "") {
      return `${label}の質問文を入力してください`;
    }
    if (question.choices.length < MIN_CHOICES) {
      return `${label}の項目は${MIN_CHOICES}つ以上必要です`;
    }
    if (question.choices.length > MAX_CHOICES[question.type]) {
      return `${label}の項目は${QUESTION_TYPE_LABELS[question.type]}の場合最大${MAX_CHOICES[question.type]}つまでです`;
    }
    if (question.choices.some((choice) => choice.text.trim() === "")) {
      return `${label}の項目をすべて入力してください`;
    }
  }
  return null;
};

const TrashIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

type Props = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  questions: SurveyQuestionDraft[];
  onQuestionsChange: (questions: SurveyQuestionDraft[]) => void;
};

export const SurveyEditor = ({
  enabled,
  onEnabledChange,
  questions,
  onQuestionsChange,
}: Props) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const updateQuestion = (
    index: number,
    patch: Partial<SurveyQuestionDraft>,
  ) => {
    onQuestionsChange(
      questions.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    );
  };

  const addQuestion = () => {
    onQuestionsChange([...questions, createEmptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
  };

  const addChoice = (questionIndex: number) => {
    const question = questions[questionIndex];
    updateQuestion(questionIndex, {
      choices: [...question.choices, { text: "" }],
    });
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const question = questions[questionIndex];
    updateQuestion(questionIndex, {
      choices: question.choices.filter((_, i) => i !== choiceIndex),
    });
  };

  return (
    <div className="w-full space-y-6 rounded-md border border-gray-300 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="font-bold">アンケートを設定</span>
        <Switch
          checked={enabled}
          onChange={onEnabledChange}
          aria-label="アンケートを設定"
        />
      </div>

      {enabled && (
        <>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold">質問{questionIndex + 1}</span>
                <select
                  className="h-10 rounded-md border border-gray-300 bg-white px-2 text-sm"
                  value={question.type}
                  onChange={(e) => {
                    updateQuestion(questionIndex, {
                      type: e.currentTarget.value as SurveyQuestionType,
                    });
                  }}
                  aria-label={`質問${questionIndex + 1}の質問形式`}
                >
                  <option value="single_choice">
                    {QUESTION_TYPE_LABELS.single_choice}
                  </option>
                  <option value="dropdown">
                    {QUESTION_TYPE_LABELS.dropdown}
                  </option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={question.text}
                  onChange={(e) => {
                    updateQuestion(questionIndex, {
                      text: e.currentTarget.value,
                    });
                  }}
                  placeholder="質問を入力"
                  aria-label={`質問${questionIndex + 1}の質問文`}
                />
                <button
                  type="button"
                  onClick={() => setDeleteIndex(questionIndex)}
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center text-cs-caution"
                  aria-label={`質問${questionIndex + 1}を削除`}
                >
                  <TrashIcon />
                </button>
              </div>
              {question.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex items-center gap-1">
                  <span className="flex size-10 shrink-0 items-center justify-center text-cs-gray-600">
                    {question.type === "single_choice" ? (
                      <span className="size-5 rounded-full border-2 border-cs-gray-500" />
                    ) : (
                      <span className="text-sm">{choiceIndex + 1}.</span>
                    )}
                  </span>
                  <Input
                    type="text"
                    value={choice.text}
                    onChange={(e) => {
                      const text = e.currentTarget.value;
                      updateQuestion(questionIndex, {
                        choices: question.choices.map((c, i) =>
                          i === choiceIndex ? { ...c, text } : c,
                        ),
                      });
                    }}
                    placeholder="項目を入力"
                    aria-label={`質問${questionIndex + 1}の項目${choiceIndex + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeChoice(questionIndex, choiceIndex)}
                    className="flex size-10 shrink-0 cursor-pointer items-center justify-center text-cs-caution"
                    aria-label={`質問${questionIndex + 1}の項目${choiceIndex + 1}を削除`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              {question.choices.length < MAX_CHOICES[question.type] && (
                <div className="pr-11 pl-11">
                  <button
                    type="button"
                    onClick={() => addChoice(questionIndex)}
                    className="h-10 w-full cursor-pointer rounded-md bg-cs-gray-200 text-sm"
                  >
                    ＋ 項目を追加
                  </button>
                </div>
              )}
            </div>
          ))}
          <hr className="border-gray-300" />
          <button
            type="button"
            onClick={addQuestion}
            className="h-10 w-full cursor-pointer rounded-md bg-cs-gray-200 text-sm"
          >
            ＋ 質問を追加
          </button>
        </>
      )}

      <CenterDialog
        isOpen={deleteIndex !== null}
        onOpenChange={() => setDeleteIndex(null)}
      >
        <div className="space-y-4 p-4">
          <p className="font-bold text-lg">質問を削除しますか？</p>
          <p className="text-sm">項目も削除されます</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setDeleteIndex(null)}
              className="h-10 flex-1 cursor-pointer rounded-md bg-cs-gray-200"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteIndex !== null) {
                  removeQuestion(deleteIndex);
                }
                setDeleteIndex(null);
              }}
              className="h-10 flex-1 cursor-pointer rounded-md bg-cs-gray-200 font-bold text-cs-caution"
            >
              削除する
            </button>
          </div>
        </div>
      </CenterDialog>
    </div>
  );
};
