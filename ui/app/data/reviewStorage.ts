import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { APP_VERSION } from "../buildVersion";
import type { Mission, MissionReview, MissionReviewKind } from "../types/mission.types";

const REVIEW_DOCUMENT_TYPE = "intelops-review";

function currentReviewer() {
  const user = getCurrentUserDetails();
  return {
    reviewerId: user.id,
    reviewerName:
      (user.name && !user.name.includes("dt.missing") && user.name) ||
      (user.email && !user.email.includes("dt.missing") && user.email) ||
      user.id,
  };
}

export async function saveMissionReview(
  mission: Mission,
  review: Omit<MissionReview, "missionId" | "missionTitle" | "reviewerId" | "reviewerName" | "createdAt" | "appVersion">
): Promise<void> {
  const reviewer = currentReviewer();
  const payload: MissionReview = {
    ...review,
    missionId: mission.id,
    missionTitle: mission.title,
    ...reviewer,
    createdAt: new Date().toISOString(),
    appVersion: APP_VERSION,
  };

  const created = await documentsClient.createDocument({
    body: {
      name: `review-${mission.id}-${Date.now()}`,
      type: REVIEW_DOCUMENT_TYPE,
      content: new Blob([JSON.stringify(payload)], { type: "application/json" }),
    },
  });

  if (review.kind === "community") {
    try {
      await documentsClient.updateDocument({
        id: created.id,
        optimisticLockingVersion: created.version,
        body: {
          name: created.name,
          type: created.type,
          isPrivate: false,
          content: new Blob([JSON.stringify(payload)], { type: "application/json" }),
        },
      });
    } catch (error) {
      console.warn("Community review saved but could not be made public", error);
    }
  }
}

export async function loadMissionReviews(
  missionId: string,
  kind?: MissionReviewKind
): Promise<MissionReview[]> {
  const list = await documentsClient.listDocuments({
    filter: `type == '${REVIEW_DOCUMENT_TYPE}'`,
    pageSize: 100,
  });
  const reviews: MissionReview[] = [];
  for (const doc of list.documents) {
    try {
      const content = await documentsClient.downloadDocumentContent({ id: doc.id });
      const text: string = await content.get("text");
      const parsed = JSON.parse(text) as MissionReview;
      if (parsed.missionId === missionId && (!kind || parsed.kind === kind)) {
        reviews.push({ ...parsed, id: doc.id });
      }
    } catch (error) {
      console.warn(`Skipped malformed review document ${doc.id}`, error);
    }
  }
  return reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
