import {PrismaClient} from "@prisma/client";

import {uuid} from "uuidv4";
import {buildUserClause} from "../helpers";

interface IUserObjectParams {
    id: string;
    username: string;
    displayName:string;
    avatar?: string;
}

interface ICreateCommentParams {
    authorUserId: string,
    postId: string,
    replyText: string,
    parentCommentId?: string
}

export default class DBController extends PrismaClient {
    private static instance: DBController;
    private constructor() {
        super();
    }
    public static getInstance(): DBController {
        if (!DBController.instance) {
            DBController.instance = new DBController()
        }
        return DBController.instance;
    }

    // Upsert User Object during authentication
    async insertOrRetrieveUser(userObject: IUserObjectParams) {
        await DBController.getInstance().profile.upsert({
            where: {
                id: userObject.id,
            },
            update: {
                displayName: userObject.displayName,
                avatar: userObject?.avatar,
            },
            create: userObject
        })
    }

    // Get Comments in a post (if a parentCommentId is sent, we get only the replies of that comment)
    async getComments(postId: string, parentCommentId?: string,) {
        try {
            return await DBController.instance.comment.findMany({
                where: {
                    postId: postId,
                    parentCommentId: parentCommentId ?? null
                },
                include: {
                    author: true
                },
                orderBy: [{createdAt: "desc"}]
            })
        } catch(err) {
            console.error("Err", err)
        }
    }

    // Create a comment
    async createComment({authorUserId, postId, replyText, parentCommentId}: ICreateCommentParams) {
        try {
            await DBController.instance.comment.create({
                data: {
                    id: uuid(),
                    authorUserId,
                    postId,
                    replyText,
                    parentCommentId,
                }
            })
            return
        } catch(err) {
            console.error("Error", err)
        }

    }

    // Gets followers and following
    async getFollowersAndFollowing(userId: string) {
        try {
            const followers = DBController.instance.follows.findMany({
                where: {
                    followerId: userId,
                },
            });

            const following = DBController.instance.follows.findMany({
                where: {
                    followerId: userId,
                },
            });

            const response = await Promise.all([followers, following]);
            return {
                followers: response[0],
                following: response[1],
            };
        } catch (err) {
            console.error("Error:", err);
        }
    }

    // Follows a user
    async followUser(userId: string, userIdToFollow: string) {
        try {
            const createFollowRecord = DBController.instance.follows.create({
                data: {
                    followerId: userId,
                    followingId: userIdToFollow,
                },
            });
            const updateFollowingCount =  DBController.instance.profile.update({
                where: {
                    id: userId,
                },
                data: {
                    followingCount: { increment: 1 },
                },
            });

            const updateFollowerCount = DBController.instance.profile.update({
                where: {
                    id: userIdToFollow,
                },
                data: {
                    followerCount: { increment: 1 },
                },
            });

            await Promise.all([createFollowRecord, updateFollowerCount, updateFollowingCount])
        } catch (err) {
            console.error("Error:", err);
        }
    }

    // Unfollow a user
    async unfollowUser(userId: string, userIdToUnfollow: string) {
        try {
            const removeFollowRecord = DBController.instance.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: userIdToUnfollow,
                    },
                },
            });

            const decrementFollowingCount = DBController.instance.profile.update({
                where: {
                    id: userId,
                },
                data: {
                    followingCount: { decrement: 1 },
                },
            });
            const decrementFollowerCount = DBController.instance.profile.update({
                where: {
                    id: userIdToUnfollow,
                },
                data: {
                    followerCount: { decrement: 1 },
                },
            });
            await Promise.all([decrementFollowerCount, decrementFollowingCount, removeFollowRecord])
        } catch (err) {
            console.error("Error:", err);
        }
    }

    // Get a profile
    async getProfile(userId: string, currentLoggedInUser?: string) {
        try {

            let isFollowingUser;
            const data = await DBController.instance.profile.findUnique({
                where: {
                    username: userId,
                },
                include:
                    {
                        comments: {
                            orderBy: [{createdAt: 'desc'}]
                        },
                    },
            });

            if (!!currentLoggedInUser) {
                isFollowingUser = await DBController.instance.follows.findUnique({
                    where: {
                        followerId_followingId: {
                            followerId: currentLoggedInUser,
                            followingId: userId
                        }
                    }
                }).then((data) => !!data)
                return {...data, isFollowing: isFollowingUser}
            }
            return {...data};
        } catch (err) {
            console.error("Err");
            return {};
        }
    }

    async createPost(
        authorUserId: string,
        title: string,
        body: string
    ) {
        const postId =
            title
                .replace(/[^a-z0-9\s]/gi, "")
                .toLowerCase()
                .split(/\s+/)
                .join("-")
                .slice(0, 15)
                .replace(/-$/, "") + `-${uuid()}`;

        const postObjectBody = {
            id: postId,
            authorUserId,
            title,
            body,
        };
        return await DBController.instance.post.create({
            data: postObjectBody,
        });
    }
    async getPosts(
        userId?: string,
        postId?: string,
        page?: Number,
        offset?: Number
    ) {
        const whereClause = buildUserClause([
            ['authorUserId', userId,],
            ['id', postId],
        ]);
        return await DBController.instance.post.findMany({
            where: whereClause,
            include: {
                author: true,
            },
            orderBy: [{createdAt: "desc"}]
        });
    }

}