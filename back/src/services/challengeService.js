import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// the abbreviation for challenge: chl
class challengeService {
    // Challenge API
    static async getchls() {
        const challenges = await prisma.Challenge.findMany({
            select: {
                id: true,
                title: true,
                start_date: true,
                due_date: true,
                _count: { select: { Challenger: true } },
            },
        });
        await prisma.$disconnect();
        return challenges;
    }

    static async findchl({ nickname, challengeId = null }) {
        let findChallenge;

        if (challengeId) {
            findChallenge = await prisma.Challenge.findUniqueOrThrow({
                where: { id: Number(challengeId) },
                include: {
                    Challenger: { select: { nickname: true } },
                },
            });
        } else {
            findChallenge = await prisma.Challenger.findMany({
                where: { nickname },
                select: {
                    challenge_id: true,
                    Challenge: {
                        select: {
                            title: true,
                            start_date: true,
                            due_date: true,
                            _count: { select: { Challenger: true } },
                        },
                    },
                },
            });
        }
        await prisma.$disconnect();
        return findChallenge;
    }

    static async addchl(input) {
        input.start_date = new Date(input.start_date);
        input.due_date = new Date(input.due_date);

        const newChallenge = await prisma.Challenge.create({ data: { ...input } });
        await prisma.$disconnect();
        return newChallenge;
    }

    static async updatechl(challengeId = null, input) {
        input.start_date = new Date(input.start_date);
        input.due_date = new Date(input.due_date);

        const updateChallenge = await prisma.Challenge.update({
            where: { id: Number(challengeId) },
            data: { ...input },
        });

        await prisma.$disconnect();
        return updateChallenge;
    }

    static async deletechl(challengeId) {
        await prisma.Challenger.deleteMany({ where: { challenge_id: Number(challengeId) } });
        await prisma.ChallengeComment.deleteMany({ where: { challenge_id: Number(challengeId) } });
        await prisma.Challenge.delete({
            where: { id: Number(challengeId) },
        });

        await prisma.$disconnect();
        return "삭제 됐습니다";
    }
    // Challenge Join API
    static async joinchl({ nickname, challengeId }) {
        let joinChallenge = await prisma.Challenger.findUnique({
            where: {
                challenge_id_nickname: {
                    challenge_id: Number(challengeId),
                    nickname,
                },
            },
        });

        if (!joinChallenge) {
            joinChallenge = await prisma.Challenger.create({
                data: { challenge_id: Number(challengeId), nickname },
            });
            await prisma.$disconnect();
            return joinChallenge;
        }

        await prisma.Challenger.delete({
            where: {
                challenge_id_nickname: {
                    challenge_id: Number(challengeId),
                    nickname,
                },
            },
        });

        await prisma.$disconnect();
        return "cancel";
    }
    //Challenge Comment API
    static async findcomments({
        nickname,
        challengeId = null,
        pagination = { start: 1, end: 5, page: 4 },
    }) {
        let comments;
        const { start, end, page } = pagination;
        function chunk(data = [], start = 1, size = 1) {
            const items = [...data];
            let i = Number(start);
            const arr = {};

            while (items.length) {
                arr[i] = items.splice(0, size);
                i += 1;
            }
            return arr;
        }

        if (nickname && !challengeId) {
            comments = await prisma.ChallengeComment.findMany({
                where: { author: nickname },
                select: { challenge_id: true, description: true },
            });
        } else {
            comments = await prisma.ChallengeComment.findMany({
                skip: Number((start - 1) * page),
                take: Number((end - start + 1) * page),
                select: { id: true, author: true, description: true },
            });

            comments = chunk(comments, start, Number(page));
        }

        await prisma.$disconnect();
        return comments;
    }

    static async postcomment(input) {
        const newComment = await prisma.ChallengeComment.create({ data: { ...input } });
        await prisma.$disconnect();
        return newComment;
    }

    static async updatecomment(commentId = null, input) {
        const updateComment = await prisma.ChallengeComment.update({
            where: { id: Number(commentId) },
            data: { ...input },
        });
        await prisma.$disconnect();
        return updateComment;
    }

    static async deletecomment(commentId) {
        await prisma.ChallengeComment.delete({ where: { id: Number(commentId) } });
        await prisma.$disconnect();
        return "삭제 됐습니다";
    }
}

export { challengeService };
