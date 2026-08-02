export type PrefectureCity = {
  prefecture: string;
  city: string;
};

import type { components } from "~/types/openapi";

export type SurveyQuestionType =
  components["schemas"]["TalkSessionSurveyQuestionType"];

export type SurveyChoiceDraft = {
  choiceID?: string;
  text: string;
};

export type SurveyQuestionDraft = {
  questionID?: string;
  text: string;
  type: SurveyQuestionType;
  isRequired: boolean;
  /** 「その他」自由記述を許可するか。選択肢系のみ有効 */
  allowOther: boolean;
  /** 個人情報を含む設問か。trueならAPI側で回答が暗号化される */
  containsPii: boolean;
  /** free_text / その他 の最大文字数。未設定はnull */
  maxLength: number | null;
  /** rating の下限値・上限値とそのラベル */
  minValue: number | null;
  maxValue: number | null;
  minLabel: string | null;
  maxLabel: string | null;
  choices: SurveyChoiceDraft[];
};
