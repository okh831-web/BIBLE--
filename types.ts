
export interface SummaryCardData {
  date: string;
  subject: string;
  coreMessage: string[];
  scripture: string;
  actionPoints: string[];
  hashtags: string[];
}

export interface InfographicData {
  title: string;
  subtitle: string;
  scripture: string;
}

export interface SermonOutput {
  summaryCard: SummaryCardData;
  infographic: InfographicData;
}
