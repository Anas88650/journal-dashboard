export interface ScopusInfo {
  Scopus_Title: string;
  Scopus_Status: string;
  ASJC: string;
  Economics_Finance: string | null;
  Business_Management: string | null;
}

export interface Journal {
  title: string;
  publisher: string;
  issn: string | null;
  eissn: string | null;
  abdc_rating: string;
  for_code: string;
  scopus_info: ScopusInfo | null;
}
