import API from "./index";
import {
    challengeData,
    challengeResult,
    addCommentData,
    addCommentResult,
    ChallengeJoinResult,
} from "@/types/challengesData";
import { Comments } from "@/recoil/commentState";
import { ChallengeBoardModel } from "@/recoil/ChallengeBoardRecoil";

export const challenge = async (challengeData: challengeData) => {
    const result = await API.post<challengeResult>(["challenge"], challengeData);
    return result;
};

export const challengeJoin = async (challengeId: number) => {
    const result = await API.post<ChallengeJoinResult>(
        ["challenge", challengeId.toString(), "join"],
        challengeId
    );
    return result;
};
export const addComment = async (challengeData: addCommentData, challengeId: number) => {
    // challenge
    const result = await API.post<addCommentResult>(
        ["challenge", challengeId.toString(), "comment"],
        challengeData
    );
    return result;
};

export const getComment = async (
    challengeId: number,
    start: number,
    end: number,
    count: number
) => {
    const result = await API.get<Comments>([
        "challenge",
        challengeId.toString(),
        `comment?start=${start}&end=${end}&count=${count}`,
    ]);
    return result;
};
export const getChallengeBoard = async (challengeId: number) => {
    const result = await API.get<ChallengeBoardModel>(["challenge", challengeId.toString()]);
    return result;
};
