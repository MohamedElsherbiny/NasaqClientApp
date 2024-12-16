import { EvaluationStatus } from "./EvaluationStatus";

export interface Evaluation {
    evaluationId: number;
    languageLevel: string;
    languageLevelComment: string;
    theGeneralIdea: string;
    theGeneralIdeaComment: string;
    originalityAndCreativity: string;
    originalityAndCreativityComment: string;
    creativeAttraction: string;
    creativeAttractionComment: string;
    technologyAndCraftsmanship: string;
    technologyAndCraftsmanshipComment: string;
    objectiveContent: string;
    objectiveContentComment: string;
    impact: string;
    impactComment: string;
    accessibility: string;
    accessibilityComment: string;
    willInterestReaders: string;
    willInterestReadersComment: string;
    isSalesOrAwardsOrOther: string;
    isSalesOrAwardsOrOtherComment: string;
    isStolenOrOriginalOrCopied: string;
    isStolenOrOriginalOrCopiedComment: string;
    containProhibitedContents: string;
    containProhibitedContentsComment: string;
    prohibitedContents: string[];
    canWinAwards: string;
    canWinAwardsComment: string;
    howToIncreaseSales: string;
    howToIncreaseSalesComment: string;
    evaluationScore: string;
    evaluationScoreComment: string;
    bookFileNameIncludingEvaluationNotes: string;
    evaluationStatus: EvaluationStatus;
}
