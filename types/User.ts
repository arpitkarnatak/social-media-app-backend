interface IAuthenticatedUser {
  id: string;
  displayName: string;
  username: string;
  avatar: string;
  posts: any[];
  comments: any[];
  createdAt: string;
  followerCount: number;
  followingCount: number;
}
