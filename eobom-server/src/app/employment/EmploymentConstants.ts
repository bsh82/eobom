export enum JobSearchState {
  MATCHINGWAITNG = "매칭대기",
  MATCHINGREQUEST = "매칭요청",
  MATCHINGCOORDINATE = "매칭조율",
  MATCHINGACCEPT = "매칭완료",
}

export enum MatchingState {
  MATCHINGREQUEST = "매칭요청",
  MATCHINGCOORDINATE = "매칭조율",
  MATCHINGACCEPT = "매칭완료",
}

export enum JobOfferState {
  MATCHINGWAITNG = "매칭중",
  MATCHINGCOMPLETE = "모집완료",
}

export enum MatchingType {
  GENERAL = "일반",
  URGENT = "긴급",
}
