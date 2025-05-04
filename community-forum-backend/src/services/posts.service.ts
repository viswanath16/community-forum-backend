// src/services/posts.service.ts
import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';

export interface PostFilters {
    categoryId?: string;
    authorId?: string;
    isPinned?: boolean;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REMOVED';
    query?: string;
}

export interface CreatePostInput {
    title: string;
    content: string;
    isAnonymous?: boolean;
    categoryId: string;
    tagIds?: string[];
    media?: {
        url: string;
        type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
        title?: string;
        description?: string;
    }[];
}

export interface CommentInput {
    postId: string;
    authorId: string;
    content: string;
    isAnonymous?: boolean;
    parentId?: string | null;
}

export interface ReactionInput {
    postId: string;
    userId: string;
    type: 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY' | 'USEFUL';
}

export interface ReportInput {
    postId: string;
    reporterId: string;
    reason: string;
    description?: string;
}

export interface SearchParams {
    query?: string;
    categoryId?: string;
}

/**
 * Get all posts with optional filters and pagination
 */
export const getPosts = async (filters: PostFilters = {}, page = 1, limit = 10) => {
    const where: Prisma.PostWhereInput = {};

    // Apply filters
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.authorId) where.authorId = filters.authorId;
    if (filters.isPinned !== undefined) where.isPinned = filters.isPinned;
    if (filters.status) where.status = filters.status;

    // Full text search if query provided
    if (filters.query) {
        where.OR = [
            { title: { contains: filters.query, mode: 'insensitive' } },
            { content: { contains: filters.query, mode: 'insensitive' } },
        ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get posts with count
    const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                displayName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                category: true,
                tags: true,
                media: true,
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                    },
                },
                reactions: {
                    select: {
                        type: true,
                    },
                    take: 100, // Limit for performance
                },
            },
            orderBy: [
                {
                    isPinned: 'desc',
                },
                {
                    createdAt: 'desc',
                },
            ],
            skip,
            take: limit,
        }),
        prisma.post.count({ where }),
    ]);

    // Group reactions by type for each post
    const postsWithReactionCounts = posts.map(post => {
        const reactionCounts = post.reactions.reduce((acc, reaction) => {
            acc[reaction.type] = (acc[reaction.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Remove the reactions array and add counts
        const { reactions, ...postWithoutReactions } = post;
        return {
            ...postWithoutReactions,
            reactionCounts,
        };
    });

    return {
        posts: postsWithReactionCounts,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: page < Math.ceil(totalCount / limit),
        },
    };
};

/**
 * Get a specific post by ID
 */
export const getPostById = async (id: string) => {
    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            tags: true,
            media: true,
            comments: {
                where: {
                    parentId: null, // Only get top-level comments
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    displayName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            replies: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 5, // Limit for performance
            },
            _count: {
                select: {
                    comments: true,
                },
            },
            reactions: {
                select: {
                    type: true,
                    user: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    if (!post) {
        throw new Error('Post not found');
    }

    // Group reactions by type
    const reactionCounts = post.reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Format the response
    const { reactions, ...postData } = post;

    return {
        ...postData,
        reactionCounts,
        // Add a userReactions field to know which reactions the user has made
        userReactions: post.reactions.reduce((acc, reaction) => {
            acc[reaction.type] = reaction.user.id;
            return acc;
        }, {} as Record<string, string>),
    };
};

/**
 * Create a new post
 */
export const createPost = async (data: CreatePostInput, authorId: string) => {
    const { tagIds, media, ...postData } = data;

    // Fix for createPost function
    return prisma.post.create({
        data: {
            ...postData,
            authorId: authorId,
            ...(tagIds && tagIds.length > 0
                ? {
                    tags: {
                        connect: tagIds.map((id) => ({ id })),
                    },
                }
                : {}),
            ...(media && media.length > 0
                ? {
                    media: {
                        create: media,
                    },
                }
                : {}),
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            tags: true,
            media: true,
        },
    });
};

/**
 * Update an existing post
 */
export const updatePost = async (id: string, data: Partial<CreatePostInput>) => {
    const { tagIds, media, ...postData } = data;

    // First get the existing post to handle media properly
    const existingPost = await prisma.post.findUnique({
        where: { id },
        include: {
            media: true,
        },
    });

    if (!existingPost) {
        throw new Error('Post not found');
    }

    // Handle tag updates if provided
    const tagUpdates = tagIds
        ? {
            tags: {
                set: tagIds.map((id) => ({ id })),
            },
        }
        : {};

    // Handle media updates if provided
    let mediaUpdates = {};
    if (media) {
        // Delete existing media first
        await prisma.media.deleteMany({
            where: { postId: id },
        });

        // Then create new media
        mediaUpdates = {
            media: {
                create: media,
            },
        };
    }

    return prisma.post.update({
        where: { id },
        data: {
            ...postData,
            ...tagUpdates,
            ...mediaUpdates,
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            tags: true,
            media: true,
        },
    });
};

/**
 * Delete a post
 */
export const deletePost = async (id: string) => {
    return prisma.post.delete({
        where: { id },
    });
};

/**
 * Toggle pin status of a post
 */
export const togglePinPost = async (id: string, isPinned: boolean) => {
    return prisma.post.update({
        where: { id },
        data: { isPinned },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                        },
                    },
                },
            },
            category: true,
        },
    });
};

/**
 * Add a comment to a post
 */
export const addComment = async (data: CommentInput) => {
    const { postId, authorId, content, isAnonymous, parentId } = data;

    // Check if post exists
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        throw new Error('Post not found');
    }

    // If this is a reply, check if parent comment exists
    if (parentId) {
        const parentComment = await prisma.comment.findUnique({
            where: { id: parentId },
        });

        if (!parentComment) {
            throw new Error('Parent comment not found');
        }
    }

    return prisma.comment.create({
        data: {
            content,
            isAnonymous: isAnonymous || false,
            author: {
                connect: { id: authorId },
            },
            post: {
                connect: { id: postId },
            },
            ...(parentId
                ? {
                    parent: {
                        connect: { id: parentId },
                    },
                }
                : {}),
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });
};

/**
 * Get comments for a post
 */
export const getComments = async (postId: string) => {
    // First get all top-level comments
    const topLevelComments = await prisma.comment.findMany({
        where: {
            postId,
            parentId: null, // Only get top-level comments
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            replies: {
                include: {
                    author: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    displayName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
            _count: {
                select: {
                    replies: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return topLevelComments;
};

/**
 * Get a specific comment by ID
 */
export const getCommentById = async (id: string) => {
    return prisma.comment.findUnique({
        where: { id },
        include: {
            author: true,
            post: true,
            parent: true,
        },
    });
};

/**
 * Update a comment
 */
export const updateComment = async (id: string, content: string) => {
    return prisma.comment.update({
        where: { id },
        data: {
            content,
            updatedAt: new Date(),
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });
};

/**
 * Delete a comment
 */
export const deleteComment = async (id: string) => {
    return prisma.comment.delete({
        where: { id },
    });
};

/**
 * Add a reaction to a post
 */
// Fix the type issue with the reaction type
export const addReaction = async (data: ReactionInput) => {
    const { postId, userId, type } = data;

    // Define a mapping from your API types to Prisma's enum types
    const reactionTypeMap: Record<string, any> = {
        'LIKE': 'LIKE',
        'LOVE': 'LOVE',
        'HAHA': 'HAHA',
        'WOW': 'WOW',
        'SAD': 'SAD',
        'ANGRY': 'ANGRY',
        'USEFUL': 'USEFUL'
    };

    // Check if the user has already reacted with this type
    const existingReaction = await prisma.reaction.findFirst({
        where: {
            postId,
            userId,
            type: reactionTypeMap[type],
        },
    });

    if (existingReaction) {
        throw new Error(`User has already reacted with ${type}`);
    }

    return prisma.reaction.create({
        data: {
            type: reactionTypeMap[type],
            userId,
            postId,
        },
    });
};
/**
 * Remove a reaction from a post
 */
export const removeReaction = async (postId: string, userId: string, type: string) => {
    const reaction = await prisma.reaction.findFirst({
        where: {
            postId,
            userId,
            type,
        },
    });

    if (!reaction) {
        throw new Error('Reaction not found');
    }

    return prisma.reaction.delete({
        where: { id: reaction.id },
    });
};

/**
 * Get post categories
 */
export const getCategories = async () => {
    return prisma.category.findMany({
        where: {
            type: 'POST',
        },
        orderBy: {
            name: 'asc',
        },
    });
};

/**
 * Search posts
 */
export const searchPosts = async (params: SearchParams, page = 1, limit = 10) => {
    const { query, categoryId } = params;

    const where: Prisma.PostWhereInput = {
        status: 'PUBLISHED', // Only search published posts
    };

    // Apply text search
    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
        ];
    }

    // Apply category filter
    if (categoryId) {
        where.categoryId = categoryId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get posts with count
    const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                displayName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                category: true,
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        }),
        prisma.post.count({ where }),
    ]);

    return {
        posts,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: page < Math.ceil(totalCount / limit),
        },
    };
};

/**
 * Report a post
 */
export const reportPost = async (data: ReportInput) => {
    const { postId, reporterId, reason, description } = data;

    return prisma.report.create({
        data: {
            type: 'INAPPROPRIATE', // Default type
            reason,
            description,
            reporter: {
                connect: { id: reporterId },
            },
            postId,
        },
    });
};

/**
 * Get trending posts
 */
export const getTrendingPosts = async (limit = 5) => {
    // This requires more complex logic to determine trending posts
    // Here's a simple implementation based on reaction and comment count
    const trendingPosts = await prisma.post.findMany({
        where: {
            status: 'PUBLISHED',
            createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            _count: {
                select: {
                    comments: true,
                    reactions: true,
                },
            },
        },
        orderBy: [
            {
                comments: {
                    _count: 'desc',
                },
            },
            {
                reactions: {
                    _count: 'desc',
                },
            },
        ],
        take: limit,
    });

    return trendingPosts;
};

/**
 * Get recent activity for a user (posts, comments)
 */
export const getUserPostActivity = async (userId: string) => {
    const [posts, comments] = await Promise.all([
        prisma.post.findMany({
            where: {
                authorId: userId,
                status: 'PUBLISHED',
            },
            include: {
                category: true,
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        }),
        prisma.comment.findMany({
            where: {
                authorId: userId,
            },
            include: {
                post: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                        author: {
                            select: {
                                profile: {
                                    select: {
                                        displayName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        }),
    ]);

    return {
        posts,
        comments,
    };
};

/**
 * Get popular tags for posts
 */
export const getPopularTags = async () => {
    // This requires a raw SQL query for efficient tag counting
    const tags = await prisma.$queryRaw`
    SELECT t.id, t.name, COUNT(p.id) as count
    FROM tags t
    JOIN "_PostToTag" pt ON t.id = pt."B"
    JOIN posts p ON pt."A" = p.id
    WHERE p.status = 'PUBLISHED'
    GROUP BY t.id, t.name
    ORDER BY count DESC
    LIMIT 10
  `;

    return tags;
};

/**
 * Get related posts based on category and tags
 */
export const getRelatedPosts = async (postId: string, limit = 3) => {
    // First get the current post to find its category and tags
    const currentPost = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            tags: true,
        },
    });

    if (!currentPost) {
        throw new Error('Post not found');
    }

    // Get tag IDs
    const tagIds = currentPost.tags.map(tag => tag.id);

    // Find related posts
    const relatedPosts = await prisma.post.findMany({
        where: {
            id: { not: postId }, // Exclude current post
            status: 'PUBLISHED',
            OR: [
                { categoryId: currentPost.categoryId }, // Same category
                {
                    tags: {
                        some: {
                            id: { in: tagIds }, // Has at least one common tag
                        },
                    },
                },
            ],
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
            _count: {
                select: {
                    comments: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
    });

    return relatedPosts;
};

/**
 * Save draft post
 */
export const saveDraft = async (data: CreatePostInput, authorId: string) => {
    const { tagIds, media, ...postData } = data;

    // Use Prisma's unchecked create input type
    return prisma.post.create({
        data: {
            ...postData,
            authorId, // Use authorId directly instead of a connect object
            status: 'DRAFT',
            ...(tagIds && tagIds.length > 0
                ? {
                    tags: {
                        connect: tagIds.map((id) => ({ id })),
                    },
                }
                : {}),
            ...(media && media.length > 0
                ? {
                    media: {
                        create: media,
                    },
                }
                : {}),
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                        },
                    },
                },
            },
            category: true,
            tags: true,
            media: true,
        },
    });
};

/**
 * Get user drafts
 */
export const getUserDrafts = async (userId: string) => {
    return prisma.post.findMany({
        where: {
            authorId: userId,
            status: 'DRAFT',
        },
        include: {
            category: true,
            tags: true,
            media: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
};

/**
 * Publish a draft
 */
export const publishDraft = async (id: string) => {
    return prisma.post.update({
        where: { id },
        data: {
            status: 'PUBLISHED',
            updatedAt: new Date(),
        },
    });
};

/**
 * Archive a post
 */
export const archivePost = async (id: string) => {
    return prisma.post.update({
        where: { id },
        data: {
            status: 'ARCHIVED',
            updatedAt: new Date(),
        },
    });
};

/**
 * Get all posts for moderation (admin only)
 */
// Fix the issues with the Report queries
export const getPostsForModeration = async (page = 1, limit = 20) => {
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get reports with associated posts
    const [reports, totalCount] = await Promise.all([
        prisma.report.findMany({
            where: {
                postId: { not: null },
                status: 'PENDING',
            },
            include: {
                reporter: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                displayName: true,
                            },
                        },
                    },
                },
                // Remove the post include since it's not in your schema
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        }),
        prisma.report.count({
            where: {
                postId: { not: null },
                status: 'PENDING',
            },
        }),
    ]);

    // Fetch posts separately
    const postIds = reports
        .filter(report => report.postId !== null)
        .map(report => report.postId as string);

    const posts = await prisma.post.findMany({
        where: {
            id: { in: postIds },
        },
        include: {
            author: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            avatar: true,
                        },
                    },
                },
            },
            category: true,
        },
    });

    // Create a map for quick post lookup
    const postMap = posts.reduce((map, post) => {
        map[post.id] = post;
        return map;
    }, {} as Record<string, any>);

    // Merge posts with reports
    const reportsWithPosts = reports.map(report => ({
        ...report,
        post: report.postId ? postMap[report.postId] : null
    }));

    return {
        reports: reportsWithPosts,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: page < Math.ceil(totalCount / limit),
        },
    };
};

/**
 * Resolve a post report (admin only)
 */
export const resolvePostReport = async (reportId: string, action: 'APPROVE' | 'REMOVE' | 'DISMISS') => {
    // Get the report and associated post
    const report = await prisma.report.findUnique({
        where: { id: reportId },
        // Remove the post include
    });

    if (!report || !report.postId) {
        throw new Error('Report not found or not associated with a post');
    }

    // Fetch the post separately
    const post = await prisma.post.findUnique({
        where: { id: report.postId },
    });

    if (!post) {
        throw new Error('Associated post not found');
    }

    // Perform the appropriate action
    if (action === 'REMOVE') {
        // Update post status to REMOVED
        await prisma.post.update({
            where: { id: report.postId },
            data: { status: 'REMOVED' },
        });
    }

    // Mark the report as resolved
    return prisma.report.update({
        where: { id: reportId },
        data: {
            status: 'RESOLVED',
            resolvedAt: new Date(),
        },
    });
};