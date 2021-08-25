export interface SchoolParam {
  records: {
    학교명: string;
    학교급구분: string;
    시도교육청명: string;
    소재지도로명주소: string;
  }[];
}

export interface SearchParam {
  searchWord: string;
  division?: string;
}
