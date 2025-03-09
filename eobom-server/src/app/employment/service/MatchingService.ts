import {txProcess} from "@lib/db";
import manager from "@routes/api/manager";
import JobOffer from "../entity/JobOffer";
import JobSearch from "../entity/JobSearch";
import {calculateConditionMatch, extractDong, calculateScheduleMatch} from "@utils/MatchingUtils";
import {JobSearchState, MatchingState, MatchingType} from "../EmploymentConstants";
import Matching from "../entity/Matching";
import {sendPushNotification} from "@utils/FirebaseUtils";

export async function matchingRecommend(jobOfferId: number) {
  return await txProcess(async manager => {
    const jobOfferRepository = manager.getRepository(JobOffer);
    const jobSearchRepository = manager.getRepository(JobSearch);

    const jobOffer = await jobOfferRepository.findOne({
      where: {jobOfferId},
      relations: {senior: true},
    });

    if (!jobOffer) {
      throw new Error("Job offer not found");
    }

    const address = extractDong(jobOffer.senior.seniorAddress); // 동(구역) 추출
    const schedule = jobOffer.jobOfferSchedule;
    const pay = jobOffer.offerPay;

    let jobSearches = await jobSearchRepository.find({
      where: {jobSearchState: JobSearchState.MATCHINGWAITNG},
    });

    // 필터링 적용
    jobSearches = jobSearches.filter(jobSearch => {
      // 1. 지역 필터링
      if (!jobSearch.coverRegion.some(region => extractDong(region) === address)) return false;

      // 2. 스케줄 유사도 계산 (0~1)
      const scheduleScore = calculateScheduleMatch(jobSearch.jobSearchSchedule, schedule);
      if (scheduleScore < 0.8) return false;

      // 3. 근무 조건 유사도 계산 (0~1)
      const conditionScore = calculateConditionMatch(jobSearch, jobOffer);
      if (conditionScore < 0.8) return false;

      // 4. 보수 조건
      if (jobSearch.wantPay > pay * 1.2) return false;

      return true;
    });

    return jobSearches;
  });
}

export async function sendUrgentMatching(jobOfferId: number) {
  return await txProcess(async manager => {
    const jobOfferRepository = manager.getRepository(JobOffer);
    const matchingRepository = manager.getRepository(Matching);

    const jobOffer = await jobOfferRepository.findOne({where: {jobOfferId}});
    if (!jobOffer) {
      throw new Error("해당 구인이 존재하지 않습니다.");
    }

    const recommendedJobSearches = await matchingRecommend(jobOfferId);
    if (recommendedJobSearches.length === 0) {
      throw new Error("추천할 구직자가 없습니다.");
    }

    // 매칭 엔티티 생성 및 저장
    const newMatchings = recommendedJobSearches.map((jobSearch: JobSearch) =>
      matchingRepository.create({
        jobSearch: jobSearch, // ✅ 개별 jobSearch 지정
        jobOffer: jobOffer,
        matchingType: MatchingType.URGENT,
        matchingState: MatchingState.MATCHINGREQUEST,
      }),
    );

    await matchingRepository.save(newMatchings);

    await Promise.all(
      recommendedJobSearches
        .map((jobSearch: JobSearch) => jobSearch.caregiver?.caregiverId) // ✅ JobSearch 타입 추가
        .filter((caregiverId: string): caregiverId is string => Boolean(caregiverId)) // ✅ caregiverId가 string임을 명확히 지정
        .map(
          (
            caregiverId: string, // ✅ caregiverId 타입 추가
          ) => sendPushNotification(caregiverId, "긴급 매칭 요청", "센터에서 귀하에게 긴급 구인 요청을 보냈습니다. 이어봄에서 확인해보세요!"),
        ),
    );

    return newMatchings;
  });
}
