// src/models/swagger.schemas.ts - Complete schema definitions for Swagger

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         role:
 *           type: string
 *           enum: [USER, MODERATOR, ADMIN, SUPER_ADMIN]
 *           description: User role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         profile:
 *           $ref: '#/components/schemas/Profile'
 *
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Profile ID
 *         userId:
 *           type: string
 *           description: User ID
 *         displayName:
 *           type: string
 *           description: Display name
 *         firstName:
 *           type: string
 *           description: First name
 *         lastName:
 *           type: string
 *           description: Last name
 *         bio:
 *           type: string
 *           description: User bio
 *         avatar:
 *           type: string
 *           description: Avatar URL
 *         neighborhood:
 *           type: string
 *           description: Neighborhood name
 *         city:
 *           type: string
 *           description: City name
 *         postalCode:
 *           type: string
 *           description: Postal code
 *         interests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Interest'
 *
 *     Interest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Interest ID
 *         name:
 *           type: string
 *           description: Interest name
 *
 *     MarketListing:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Listing ID
 *         title:
 *           type: string
 *           description: Listing title
 *         description:
 *           type: string
 *           description: Listing description
 *         price:
 *           type: number
 *           description: Listing price
 *         isFree:
 *           type: boolean
 *           description: Whether the item is free
 *         condition:
 *           type: string
 *           enum: [NEW, LIKE_NEW, GOOD, USED, WORN]
 *           description: Item condition
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         status:
 *           type: string
 *           enum: [ACTIVE, RESERVED, SOLD, CLOSED]
 *           description: Listing status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         sellerId:
 *           type: string
 *           description: Seller ID
 *         categoryId:
 *           type: string
 *           description: Category ID
 *         neighborhoodId:
 *           type: string
 *           description: Neighborhood ID
 *         seller:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 displayName:
 *                   type: string
 *                 avatar:
 *                   type: string
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *
 *     MarketRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Request ID
 *         message:
 *           type: string
 *           description: Optional message to the seller
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, COMPLETED]
 *           description: Request status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         buyerId:
 *           type: string
 *           description: Buyer ID
 *         listingId:
 *           type: string
 *           description: Listing ID
 *         buyer:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 displayName:
 *                   type: string
 *                 avatar:
 *                   type: string
 *         listing:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             title:
 *               type: string
 *             status:
 *               type: string
 *
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Post ID
 *         title:
 *           type: string
 *           description: Post title
 *         content:
 *           type: string
 *           description: Post content
 *         isAnonymous:
 *           type: boolean
 *           description: Whether the post is anonymous
 *         isPinned:
 *           type: boolean
 *           description: Whether the post is pinned
 *         status:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED, REMOVED]
 *           description: Post status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         authorId:
 *           type: string
 *           description: Author ID
 *         categoryId:
 *           type: string
 *           description: Category ID
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 displayName:
 *                   type: string
 *                 avatar:
 *                   type: string
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *         media:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *         _count:
 *           type: object
 *           properties:
 *             comments:
 *               type: integer
 *             reactions:
 *               type: integer
 *
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Comment ID
 *         content:
 *           type: string
 *           description: Comment content
 *         isAnonymous:
 *           type: boolean
 *           description: Whether the comment is anonymous
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         authorId:
 *           type: string
 *           description: Author ID
 *         postId:
 *           type: string
 *           description: Post ID
 *         parentId:
 *           type: string
 *           description: Parent comment ID for replies
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 displayName:
 *                   type: string
 *                 avatar:
 *                   type: string
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Event ID
 *         title:
 *           type: string
 *           description: Event title
 *         description:
 *           type: string
 *           description: Event description
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Event start date and time
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Event end date and time
 *         location:
 *           type: string
 *           description: Event location
 *         address:
 *           type: string
 *           description: Event address
 *         isOnline:
 *           type: boolean
 *           description: Whether the event is online
 *         meetingUrl:
 *           type: string
 *           description: URL for online meeting
 *         capacity:
 *           type: integer
 *           description: Maximum attendees capacity
 *         isFree:
 *           type: boolean
 *           description: Whether the event is free
 *         price:
 *           type: number
 *           description: Event price
 *         image:
 *           type: string
 *           description: Event image URL
 *         isPublished:
 *           type: boolean
 *           description: Whether the event is published
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         creatorId:
 *           type: string
 *           description: Creator ID
 *         categoryId:
 *           type: string
 *           description: Category ID
 *         neighborhoodId:
 *           type: string
 *           description: Neighborhood ID
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 displayName:
 *                   type: string
 *                 avatar:
 *                   type: string
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         neighborhood:
 *           $ref: '#/components/schemas/Neighborhood'
 *         interests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Interest'
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Category ID
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *         icon:
 *           type: string
 *           description: Category icon
 *         type:
 *           type: string
 *           enum: [EVENT, MARKET, POST]
 *           description: Category type
 *         parentId:
 *           type: string
 *           description: Parent category ID
 *
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Tag ID
 *         name:
 *           type: string
 *           description: Tag name
 *
 *     Media:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Media ID
 *         url:
 *           type: string
 *           description: Media URL
 *         type:
 *           type: string
 *           enum: [IMAGE, VIDEO, DOCUMENT, AUDIO]
 *           description: Media type
 *         title:
 *           type: string
 *           description: Media title
 *         description:
 *           type: string
 *           description: Media description
 *
 *     Neighborhood:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Neighborhood ID
 *         name:
 *           type: string
 *           description: Neighborhood name
 *         city:
 *           type: string
 *           description: City name
 *         description:
 *           type: string
 *           description: Neighborhood description
 *         postalCodes:
 *           type: array
 *           items:
 *             type: string
 *           description: Postal codes in this neighborhood
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *         error:
 *           type: object
 *           example: { details: 'Error details' }
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - displayName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *         displayName:
 *           type: string
 *           description: Display name
 *         firstName:
 *           type: string
 *           description: First name
 *         lastName:
 *           type: string
 *           description: Last name
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Login successful
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               description: JWT token
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation successful
 *         data:
 *           type: object
 *           description: Response data
 */