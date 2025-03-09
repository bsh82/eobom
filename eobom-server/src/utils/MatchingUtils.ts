import JobOffer from "src/app/employment/entity/JobOffer";
import JobSearch from "src/app/employment/entity/JobSearch";

// 상세 주소에서 "동" 단위까지만 추출
export function extractDong(address: string): string {
  const match = address.match(/(\S+동)/); // "XX동" 패턴 추출
  return match ? match[1] : address; // "XX동"이 있으면 반환, 없으면 전체 주소 반환
}

// 스케줄 유사도(0~1) 계산
export function calculateScheduleMatch(
  jobSearchSchedule: Record<string, {startTime: string; endTime: string}[]>,
  jobOfferSchedule: Record<string, {startTime: string; endTime: string}[]>,
): number {
  let totalOfferTime = 0,
    totalMatchTime = 0;

  for (const day in jobOfferSchedule) {
    if (!jobSearchSchedule[day]) continue; // 해당 요일 근무 불가능하면 패스

    const offerShifts = jobOfferSchedule[day];
    const searchShifts = jobSearchSchedule[day];

    for (const offerShift of offerShifts) {
      const offerTime = getTimeDiff(offerShift.startTime, offerShift.endTime);
      totalOfferTime += offerTime;

      for (const searchShift of searchShifts) {
        const matchTime = getOverlapTime(offerShift.startTime, offerShift.endTime, searchShift.startTime, searchShift.endTime);
        totalMatchTime += matchTime;
      }
    }
  }

  return totalOfferTime > 0 ? totalMatchTime / totalOfferTime : 0;
}

// 근무 조건 유사도(0~1) 계산
export function calculateConditionMatch(jobSearch: JobSearch, jobOffer: JobOffer): number {
  const conditions = [
    {needed: jobOffer.isOralCareAssistanceNeeded, available: jobSearch.canOralCareAssistance},
    {needed: jobOffer.isFeedingAssistanceNeeded, available: jobSearch.canFeedingAssistance},
    {needed: jobOffer.isGroomingAssistanceNeeded, available: jobSearch.canGroomingAssistance},
    {needed: jobOffer.isDressingAssistanceNeeded, available: jobSearch.canDressingAssistance},
    {needed: jobOffer.isHairWashingAssistanceNeeded, available: jobSearch.canHairWashingAssistance},
    {needed: jobOffer.isBodyWashingAssistanceNeeded, available: jobSearch.canBodyWashingAssistance},
    {needed: jobOffer.isToiletingAssistanceNeeded, available: jobSearch.canToiletingAssistance},
    {needed: jobOffer.isMobilityAssistanceNeeded, available: jobSearch.canMobilityAssistance},
    {needed: jobOffer.isPositionChangeAssistanceNeeded, available: jobSearch.canPositionChangeAssistance},
    {needed: jobOffer.isPhysicalFunctionSupportNeeded, available: jobSearch.canPhysicalFunctionSupport},
    {needed: jobOffer.isCognitiveStimulationNeeded, available: jobSearch.canCognitiveStimulation},
    {needed: jobOffer.isDailyLivingSupportNeeded, available: jobSearch.canDailyLivingSupport},
    {needed: jobOffer.isCognitiveBehaviorManagementNeeded, available: jobSearch.canCognitiveBehaviorManagement},
    {needed: jobOffer.isCommunicationSupportNeeded, available: jobSearch.canCommunicationSupport},
    {needed: jobOffer.isPersonalActivitySupportNeeded, available: jobSearch.canPersonalActivitySupport},
    {needed: jobOffer.isHousekeepingSupportNeeded, available: jobSearch.canHousekeepingSupport},
  ];

  const requiredConditions = conditions.filter(c => c.needed);
  const matchedConditions = requiredConditions.filter(c => c.available);

  return requiredConditions.length > 0 ? matchedConditions.length / requiredConditions.length : 1;
}

// 두 시간의 차이(분 단위)
function getTimeDiff(startTime: string, endTime: string): number {
  return parseTime(endTime) - parseTime(startTime);
}

// 겹치는 시간(분 단위) 계산
export function getOverlapTime(start1: string, end1: string, start2: string, end2: string): number {
  const overlapStart = Math.max(parseTime(start1), parseTime(start2));
  const overlapEnd = Math.min(parseTime(end1), parseTime(end2));
  return Math.max(overlapEnd - overlapStart, 0);
}

// HH:mm 형식의 시간을 분 단위 숫자로 변환
export function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
