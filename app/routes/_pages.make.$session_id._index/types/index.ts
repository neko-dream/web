export type PrefectureCity = {
  prefecture: string;
  city: string;
};

export type SurveyQuestionType = "single_choice" | "dropdown";

export type SurveyChoiceDraft = {
  choiceID?: string;
  text: string;
};

export type SurveyQuestionDraft = {
  questionID?: string;
  text: string;
  type: SurveyQuestionType;
  choices: SurveyChoiceDraft[];
};
