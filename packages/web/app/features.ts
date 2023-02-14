// This file is used to enable/disable features in the app

export const showCommunity = process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_PAGE === 'true';
export const showFaq = process.env.NEXT_PUBLIC_FEATURE_FAQ_PAGE === 'true';
export const showMission = process.env.NEXT_PUBLIC_FEATURE_MISSION_PAGE === 'true';