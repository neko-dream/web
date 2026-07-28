import { type ReactNode, useState } from "react";
import { Input } from "~/components/ui/input";
import { CenterDialog } from "~/components/ui/modal";
import { Switch } from "~/components/ui/switch";
import type { SurveyQuestionDraft, SurveyQuestionType } from "../../types";

/**
 * 選択肢を持つ質問タイプ。ここに含まれないタイプはchoicesを送らない
 */
export const CHOICE_QUESTION_TYPES = [
  "single_choice",
  "multi_choice",
  "dropdown",
] as const;

export const isChoiceQuestion = (type: SurveyQuestionType): boolean =>
  (CHOICE_QUESTION_TYPES as readonly SurveyQuestionType[]).includes(type);

/** 自由記述の入力欄を持つか。maxLengthはこの場合だけ意味を持つ */
const hasFreeTextInput = (question: SurveyQuestionDraft): boolean =>
  question.type === "free_text" ||
  (isChoiceQuestion(question.type) && question.allowOther);

export const MAX_CHOICES: Record<SurveyQuestionType, number> = {
  single_choice: 5,
  multi_choice: 10,
  dropdown: 10,
  free_text: 0,
  rating: 0,
  date: 0,
};

export const MIN_CHOICES = 2;

/** 自由記述（free_text・その他）の最大文字数として設定できる上限 */
export const MAX_TEXT_LENGTH = 1000;

/** ratingの下限・上限として設定できる範囲。回答側はこの範囲をプルダウンで列挙する */
export const RATING_MIN = 0;
export const RATING_MAX = 10;
export const RATING_MAX_SPAN = 10;

const QUESTION_TYPE_LABELS: Record<SurveyQuestionType, string> = {
  single_choice: "ラジオボタン",
  multi_choice: "チェックボックス",
  dropdown: "プルダウン",
  free_text: "自由記述",
  rating: "評価（数値）",
  date: "日付",
};

const QUESTION_TYPE_OPTIONS = Object.keys(
  QUESTION_TYPE_LABELS,
) as SurveyQuestionType[];

export const createEmptyQuestion = (): SurveyQuestionDraft => ({
  text: "",
  type: "single_choice",
  isRequired: true,
  allowOther: false,
  containsPii: false,
  maxLength: null,
  minValue: null,
  maxValue: null,
  minLabel: null,
  maxLabel: null,
  choices: [{ text: "" }, { text: "" }],
});

/**
 * 質問タイプを変更したときに、そのタイプで意味を持たない設定を落とす。
 * 選択肢は選択肢系タイプの間では引き継ぎ、それ以外に変えたら空にする
 */
const applyQuestionType = (
  question: SurveyQuestionDraft,
  type: SurveyQuestionType,
): SurveyQuestionDraft => {
  const choices = isChoiceQuestion(type)
    ? question.choices.length > 0
      ? question.choices.slice(0, MAX_CHOICES[type])
      : [{ text: "" }, { text: "" }]
    : [];

  return {
    ...question,
    type,
    choices,
    allowOther: isChoiceQuestion(type) ? question.allowOther : false,
    maxLength:
      type === "free_text" || (isChoiceQuestion(type) && question.allowOther)
        ? question.maxLength
        : null,
    minValue: type === "rating" ? (question.minValue ?? 1) : null,
    maxValue: type === "rating" ? (question.maxValue ?? 5) : null,
    minLabel: type === "rating" ? question.minLabel : null,
    maxLabel: type === "rating" ? question.maxLabel : null,
  };
};

const validateChoices = (
  question: SurveyQuestionDraft,
  label: string,
): string | null => {
  if (question.choices.length < MIN_CHOICES) {
    return `${label}の項目は${MIN_CHOICES}つ以上必要です`;
  }
  if (question.choices.length > MAX_CHOICES[question.type]) {
    return `${label}の項目は${QUESTION_TYPE_LABELS[question.type]}の場合最大${MAX_CHOICES[question.type]}つまでです`;
  }
  if (question.choices.some((choice) => choice.text.trim() === "")) {
    return `${label}の項目をすべて入力してください`;
  }
  return null;
};

const validateRating = (
  question: SurveyQuestionDraft,
  label: string,
): string | null => {
  const { minValue: min, maxValue: max } = question;
  if (min === null || max === null) {
    return `${label}の下限値と上限値を入力してください`;
  }
  if (!(Number.isInteger(min) && Number.isInteger(max))) {
    return `${label}の下限値と上限値は整数で入力してください`;
  }
  if (min < RATING_MIN || max > RATING_MAX) {
    return `${label}の評価は${RATING_MIN}〜${RATING_MAX}の範囲で設定してください`;
  }
  if (min >= max) {
    return `${label}の上限値は下限値より大きくしてください`;
  }
  if (max - min > RATING_MAX_SPAN) {
    return `${label}の評価の幅は${RATING_MAX_SPAN}までにしてください`;
  }
  return null;
};

const validateMaxLength = (
  question: SurveyQuestionDraft,
  label: string,
): string | null => {
  const { maxLength } = question;
  if (maxLength === null) {
    return null;
  }
  if (!Number.isInteger(maxLength) || maxLength < 1) {
    return `${label}の最大文字数は1以上の整数で入力してください`;
  }
  if (maxLength > MAX_TEXT_LENGTH) {
    return `${label}の最大文字数は${MAX_TEXT_LENGTH}以下にしてください`;
  }
  return null;
};

const validateSurveyQuestion = (
  question: SurveyQuestionDraft,
  label: string,
): string | null => {
  if (question.text.trim() === "") {
    return `${label}の質問文を入力してください`;
  }
  if (isChoiceQuestion(question.type)) {
    const error = validateChoices(question, label);
    if (error) {
      return error;
    }
  }
  if (question.type === "rating") {
    const error = validateRating(question, label);
    if (error) {
      return error;
    }
  }
  if (hasFreeTextInput(question)) {
    return validateMaxLength(question, label);
  }
  return null;
};

export const validateSurveyQuestions = (
  questions: SurveyQuestionDraft[],
): string | null => {
  if (questions.length === 0) {
    return "アンケートの質問を1つ以上追加してください";
  }
  for (const [i, question] of questions.entries()) {
    const error = validateSurveyQuestion(question, `質問${i + 1}`);
    if (error) {
      return error;
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

/** 数値入力。空文字はnullとして扱う */
const toNumberOrNull = (value: string): number | null => {
  if (value.trim() === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

/** 空文字はnullとして扱う（APIのnullableな文字列項目に合わせる） */
const toTextOrNull = (value: string): string | null =>
  value.trim() === "" ? null : value;

type FieldProps = {
  label: string;
  children: ReactNode;
};

/**
 * Inputは独自コンポーネントでlabel紐付けができないため、
 * 見出しはspanで置きaria-label側で読み上げを担保する
 */
const Field = ({ label, children }: FieldProps) => (
  <div className="space-y-1">
    <span className="block text-cs-gray-600 text-xs">{label}</span>
    {children}
  </div>
);

type RatingSettingsProps = {
  question: SurveyQuestionDraft;
  questionNumber: number;
  onChange: (patch: Partial<SurveyQuestionDraft>) => void;
};

const RatingSettings = ({
  question,
  questionNumber,
  onChange,
}: RatingSettingsProps) => (
  <div className="grid grid-cols-2 gap-2">
    <Field label="下限値">
      <Input
        type="number"
        className="h-10"
        min={RATING_MIN}
        max={RATING_MAX}
        value={question.minValue ?? ""}
        onChange={(e) => {
          onChange({ minValue: toNumberOrNull(e.currentTarget.value) });
        }}
        aria-label={`質問${questionNumber}の下限値`}
      />
    </Field>
    <Field label="上限値">
      <Input
        type="number"
        className="h-10"
        min={RATING_MIN}
        max={RATING_MAX}
        value={question.maxValue ?? ""}
        onChange={(e) => {
          onChange({ maxValue: toNumberOrNull(e.currentTarget.value) });
        }}
        aria-label={`質問${questionNumber}の上限値`}
      />
    </Field>
    <Field label="下限のラベル（任意）">
      <Input
        type="text"
        className="h-10"
        placeholder="全く満足していない"
        value={question.minLabel ?? ""}
        onChange={(e) => {
          onChange({ minLabel: toTextOrNull(e.currentTarget.value) });
        }}
        aria-label={`質問${questionNumber}の下限のラベル`}
      />
    </Field>
    <Field label="上限のラベル（任意）">
      <Input
        type="text"
        className="h-10"
        placeholder="非常に満足している"
        value={question.maxLabel ?? ""}
        onChange={(e) => {
          onChange({ maxLabel: toTextOrNull(e.currentTarget.value) });
        }}
        aria-label={`質問${questionNumber}の上限のラベル`}
      />
    </Field>
  </div>
);

type SettingRowProps = {
  label: string;
  note?: string;
  /** 同じラベルが質問ごとに並ぶため、読み上げ名は質問番号で修飾する */
  questionNumber: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const SettingRow = ({
  label,
  note,
  questionNumber,
  checked,
  onChange,
}: SettingRowProps) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-sm">
      {label}
      {note && <span className="block text-cs-gray-600 text-xs">{note}</span>}
    </span>
    <Switch
      checked={checked}
      onChange={onChange}
      aria-label={`質問${questionNumber}の${label}`}
    />
  </div>
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

  const changeQuestionType = (index: number, type: SurveyQuestionType) => {
    onQuestionsChange(
      questions.map((q, i) => (i === index ? applyQuestionType(q, type) : q)),
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
                    changeQuestionType(
                      questionIndex,
                      e.currentTarget.value as SurveyQuestionType,
                    );
                  }}
                  aria-label={`質問${questionIndex + 1}の質問形式`}
                >
                  {QUESTION_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {QUESTION_TYPE_LABELS[type]}
                    </option>
                  ))}
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

              {isChoiceQuestion(question.type) && (
                <>
                  {question.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="flex items-center gap-1">
                      <span className="flex size-10 shrink-0 items-center justify-center text-cs-gray-600">
                        {question.type === "single_choice" ? (
                          <span className="size-5 rounded-full border-2 border-cs-gray-500" />
                        ) : question.type === "multi_choice" ? (
                          <span className="size-5 rounded border-2 border-cs-gray-500" />
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
                </>
              )}

              {question.type === "rating" && (
                <RatingSettings
                  question={question}
                  questionNumber={questionIndex + 1}
                  onChange={(patch) => updateQuestion(questionIndex, patch)}
                />
              )}

              <div className="space-y-2 rounded-md bg-cs-gray-200 p-3">
                <SettingRow
                  label="回答を必須にする"
                  questionNumber={questionIndex + 1}
                  checked={question.isRequired}
                  onChange={(isRequired) =>
                    updateQuestion(questionIndex, { isRequired })
                  }
                />
                {isChoiceQuestion(question.type) && (
                  <SettingRow
                    label="「その他」の自由記述を許可する"
                    questionNumber={questionIndex + 1}
                    checked={question.allowOther}
                    onChange={(allowOther) =>
                      updateQuestion(questionIndex, {
                        allowOther,
                        // 自由記述がなくなるなら文字数制限も落とす
                        maxLength: allowOther ? question.maxLength : null,
                      })
                    }
                  />
                )}
                {hasFreeTextInput(question) && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm">最大文字数（任意）</span>
                    <Input
                      type="number"
                      className="h-10 w-24"
                      min={1}
                      max={MAX_TEXT_LENGTH}
                      placeholder="制限なし"
                      value={question.maxLength ?? ""}
                      onChange={(e) => {
                        updateQuestion(questionIndex, {
                          maxLength: toNumberOrNull(e.currentTarget.value),
                        });
                      }}
                      aria-label={`質問${questionIndex + 1}の最大文字数`}
                    />
                  </div>
                )}
                <SettingRow
                  label="個人情報を含む質問"
                  note="回答を暗号化して保存します"
                  questionNumber={questionIndex + 1}
                  checked={question.containsPii}
                  onChange={(containsPii) =>
                    updateQuestion(questionIndex, { containsPii })
                  }
                />
              </div>
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
