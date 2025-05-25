// src/controllers/complete.swagger.ts

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 'Enter JWT token obtained from /api/auth/login'
 *
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: 'Error message'
 *       required:
 *         - success
 *         - error
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *         message:
 *           type: string
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPages:
 *               type: integer
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         fullName:
 *           type: string
 *           nullable: true
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         isAdmin:
 *           type: boolean
 *         isVerified:
 *           type: boolean
 *         reputationScore:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         neighborhood:
 *           $ref: '#/components/schemas/Neighborhood'
 *
 *     Neighborhood:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         city:
 *           type: string
 *         postalCode:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           enum: [SPORTS, CULTURAL, EDUCATIONAL, VOLUNTEER, SOCIAL, BUSINESS, HEALTH, ENVIRONMENT, TECHNOLOGY, OTHER]
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         location:
 *           type: string
 *         coordinates:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *             lng:
 *               type: number
 *         capacity:
 *           type: integer
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, COMPLETED, DRAFT]
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         isRecurring:
 *           type: boolean
 *         recurrencePattern:
 *           type: object
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           $ref: '#/components/schemas/User'
 *         neighborhood:
 *           $ref: '#/components/schemas/Neighborhood'
 *         _count:
 *           type: object
 *           properties:
 *             registrations:
 *               type: integer
 *
 *     EventRegistration:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         eventId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [REGISTERED, WAITLIST, CANCELLED, ATTENDED]
 *         registeredAt:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *           nullable: true
 *         event:
 *           $ref: '#/components/schemas/Event'
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *     MarketListing:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           nullable: true
 *         isFree:
 *           type: boolean
 *         condition:
 *           type: string
 *           enum: [NEW, LIKE_NEW, GOOD, USED, WORN]
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, RESERVED, SOLD, CLOSED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         seller:
 *           $ref: '#/components/schemas/User'
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         neighborhood:
 *           $ref: '#/components/schemas/Neighborhood'
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         icon:
 *           type: string
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *
 *     MarketRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         message:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, COMPLETED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         buyerId:
 *           type: string
 *           format: uuid
 *         listingId:
 *           type: string
 *           format: uuid
 *         buyer:
 *           $ref: '#/components/schemas/User'
 *         listing:
 *           $ref: '#/components/schemas/MarketListing'
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and registration endpoints
 *   - name: Events
 *     description: Community event management endpoints
 *   - name: Marketplace
 *     description: Marketplace listing and request management
 *   - name: Users
 *     description: User profile and management endpoints
 */

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "securePassword123!"
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 example: "newuser123"
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 example: "John Doe"
 *               neighborhoodId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: OpenAPI 3.0 specification document
 *       500:
 *         description: Failed to generate API documentation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// ============================================
// MARKETPLACE ENDPOINTS (Future Implementation)
// ============================================

/**
 * @swagger
 * /marketplace:
 *   get:
 *     summary: Get marketplace listings
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: isFree
 *         schema:
 *           type: boolean
 *         description: Filter by free items only
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [NEW, LIKE_NEW, GOOD, USED, WORN]
 *         description: Filter by item condition
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RESERVED, SOLD, CLOSED]
 *           default: ACTIVE
 *         description: Filter by listing status
 *       - in: query
 *         name: sellerId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by seller ID
 *       - in: query
 *         name: neighborhoodId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by neighborhood ID
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Listings retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MarketListing'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Create a new listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - isFree
 *               - images
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Vintage Bicycle"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *                 example: "Well-maintained vintage bicycle in excellent condition"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Price (required if isFree is false)
 *                 example: 150.00
 *               isFree:
 *                 type: boolean
 *                 description: Whether the item is free
 *                 example: false
 *               condition:
 *                 type: string
 *                 enum: [NEW, LIKE_NEW, GOOD, USED, WORN]
 *                 description: Item condition
 *                 example: "GOOD"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 minItems: 1
 *                 maxItems: 10
 *                 description: Array of image URLs
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: Category ID
 *                 example: "550e8400-e29b-41d4-a716-446655440010"
 *               neighborhoodId:
 *                 type: string
 *                 format: uuid
 *                 description: Neighborhood ID
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of tag IDs
 *                 example: ["550e8400-e29b-41d4-a716-446655440020"]
 *     responses:
 *       201:
 *         description: Listing created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Listing created successfully
 *                 data:
 *                   $ref: '#/components/schemas/MarketListing'
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/{id}:
 *   get:
 *     summary: Get a specific listing by ID
 *     tags: [Marketplace]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Successfully retrieved listing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Listing retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/MarketListing'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     summary: Update a listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *               price:
 *                 type: number
 *                 minimum: 0
 *               isFree:
 *                 type: boolean
 *               condition:
 *                 type: string
 *                 enum: [NEW, LIKE_NEW, GOOD, USED, WORN]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 minItems: 1
 *                 maxItems: 10
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               neighborhoodId:
 *                 type: string
 *                 format: uuid
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Listing updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/MarketListing'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the seller or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Delete a listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Listing deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the seller or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/{id}/status:
 *   put:
 *     summary: Change listing status
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, RESERVED, SOLD, CLOSED]
 *                 description: New listing status
 *                 example: "SOLD"
 *     responses:
 *       200:
 *         description: Listing status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Listing marked as sold successfully
 *                 data:
 *                   $ref: '#/components/schemas/MarketListing'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the seller or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/{id}/request:
 *   post:
 *     summary: Create a request for a listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 maxLength: 500
 *                 description: Optional message to the seller
 *                 example: "Is this item still available? Can we meet this weekend?"
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request created successfully
 *                 data:
 *                   $ref: '#/components/schemas/MarketRequest'
 *       400:
 *         description: Bad request (own listing or not active)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/{id}/requests:
 *   get:
 *     summary: Get all requests for a listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Successfully retrieved requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Requests retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MarketRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the seller or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/requests:
 *   get:
 *     summary: Get all requests made by current user
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, COMPLETED]
 *         description: Filter by request status
 *     responses:
 *       200:
 *         description: Successfully retrieved requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Requests retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MarketRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/{id}/request/{requestId}:
 *   put:
 *     summary: Update request status (accept/reject)
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Listing ID
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED, COMPLETED]
 *                 description: New request status
 *                 example: "ACCEPTED"
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request accepted successfully
 *                 data:
 *                   $ref: '#/components/schemas/MarketRequest'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the seller
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Listing or request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/request/{requestId}/cancel:
 *   delete:
 *     summary: Cancel a request (buyer only)
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request canceled successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the buyer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/categories:
 *   get:
 *     summary: Get marketplace categories
 *     tags: [Marketplace]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Categories retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/activity:
 *   get:
 *     summary: Get current user's marketplace activity
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved activity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User marketplace activity retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     listings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MarketListing'
 *                     buyRequests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MarketRequest'
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalListings:
 *                           type: integer
 *                           example: 15
 *                         activeListing:
 *                           type: integer
 *                           example: 3
 *                         soldItems:
 *                           type: integer
 *                           example: 12
 *                         totalRequests:
 *                           type: integer
 *                           example: 25
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketplace/search:
 *   get:
 *     summary: Search marketplace listings
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [NEW, LIKE_NEW, GOOD, USED, WORN]
 *         description: Filter by condition
 *       - in: query
 *         name: neighborhood
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Neighborhood ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, date_asc, date_desc]
 *           default: date_desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Search results retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MarketListing'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         description: Bad request - Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// ============================================
// ADDITIONAL SCHEMA DEFINITIONS
// ============================================

/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 20
 *         total:
 *           type: integer
 *           example: 100
 *         totalPages:
 *           type: integer
 *           example: 5
 *       required:
 *         - page
 *         - limit
 *         - total
 *         - totalPages
 *
 *     AuthTokenResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       required:
 *         - user
 *         - token
 *
 *     ListingStatistics:
 *       type: object
 *       properties:
 *         views:
 *           type: integer
 *           example: 150
 *         favorites:
 *           type: integer
 *           example: 12
 *         requests:
 *           type: integer
 *           example: 5
 *         lastViewed:
 *           type: string
 *           format: date-time
 *
 *     UserActivity:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [LISTING_CREATED, LISTING_SOLD, EVENT_CREATED, EVENT_REGISTERED, POST_CREATED]
 *         timestamp:
 *           type: string
 *           format: date-time
 *         details:
 *           type: object
 *         relatedId:
 *           type: string
 *           format: uuid
 */

// ============================================
// EXAMPLE REQUESTS AND RESPONSES
// ============================================

/**
 * @swagger
 * x-examples:
 *   LoginRequest:
 *     summary: Admin Login Request
 *     value:
 *       email: "admin@communityforum.com"
 *       password: "admin123"
 *
 *   LoginResponse:
 *     summary: Successful Login Response
 *     value:
 *       success: true
 *       message: "Login successful"
 *       data:
 *         user:
 *           id: "550e8400-e29b-41d4-a716-446655440000"
 *           email: "admin@communityforum.com"
 *           username: "admin"
 *           fullName: "Admin User"
 *           isAdmin: true
 *           neighborhood:
 *             id: "550e8400-e29b-41d4-a716-446655440001"
 *             name: "Centrum"
 *             city: "Amsterdam"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *   CreateEventRequest:
 *     summary: Create Event Request
 *     value:
 *       title: "Community Yoga in the Park"
 *       description: "Join us for a relaxing yoga session in Vondelpark. Suitable for all levels!"
 *       category: "HEALTH"
 *       startDate: "2025-06-01T09:00:00Z"
 *       endDate: "2025-06-01T10:30:00Z"
 *       location: "Vondelpark, Amsterdam"
 *       capacity: 20
 *       neighborhoodId: "550e8400-e29b-41d4-a716-446655440001"
 *       coordinates:
 *         lat: 52.3579946
 *         lng: 4.8686671
 *
 *   CreateListingRequest:
 *     summary: Create Marketplace Listing
 *     value:
 *       title: "Vintage Racing Bicycle"
 *       description: "Beautiful vintage racing bicycle from the 1980s. Recently serviced with new tires."
 *       price: 250.00
 *       isFree: false
 *       condition: "GOOD"
 *       images:
 *         - "https://example.com/bike-front.jpg"
 *         - "https://example.com/bike-side.jpg"
 *       categoryId: "550e8400-e29b-41d4-a716-446655440100"
 *       neighborhoodId: "550e8400-e29b-41d4-a716-446655440001"
 *       tagIds:
 *         - "550e8400-e29b-41d4-a716-446655440200"
 *         - "550e8400-e29b-41d4-a716-446655440201"
 *
 *   ErrorResponse:
 *     summary: Validation Error Response
 *     value:
 *       success: false
 *       error: "Validation error: title: Title must be at least 3 characters"
 */

// ============================================
// WEBHOOKS (Future Implementation)
// ============================================

/**
 * @swagger
 * webhooks:
 *   newListingCreated:
 *     post:
 *       summary: New listing created webhook
 *       description: Triggered when a new marketplace listing is created
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: string
 *                   example: "listing.created"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   $ref: '#/components/schemas/MarketListing'
 *       responses:
 *         200:
 *           description: Webhook processed successfully
 *
 *   eventRegistrationConfirmed:
 *     post:
 *       summary: Event registration confirmed webhook
 *       description: Triggered when a user successfully registers for an event
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: string
 *                   example: "event.registration.confirmed"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     registration:
 *                       $ref: '#/components/schemas/EventRegistration'
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       responses:
 *         200:
 *           description: Webhook processed successfully
 */

// ============================================
// API VERSIONING AND DEPRECATION NOTICES
// ============================================

/**
 * @swagger
 * x-api-versioning:
 *   currentVersion: "1.0.0"
 *   supportedVersions:
 *     - version: "1.0.0"
 *       status: "current"
 *       releaseDate: "2025-01-01"
 *   deprecationPolicy:
 *     notice: "6 months"
 *     sunset: "12 months"
 *
 * x-rate-limiting:
 *   default:
 *     windowMs: 900000  # 15 minutes
 *     max: 100
 *   endpoints:
 *     - path: "/api/auth/login"
 *       windowMs: 900000
 *       max: 5
 *     - path: "/api/auth/register"
 *       windowMs: 3600000  # 1 hour
 *       max: 3
 *     - path: "/api/events"
 *       method: "POST"
 *       windowMs: 3600000
 *       max: 10
 *
 * x-api-guidelines:
 *   pagination:
 *     defaultLimit: 20
 *     maxLimit: 100
 *   filtering:
 *     queryParameters: true
 *     operators: ["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"]
 *   sorting:
 *     parameter: "sortBy"
 *     format: "field_direction"
 *     example: "createdAt_desc"
 *   timestamps:
 *     format: "ISO 8601"
 *     timezone: "UTC"
 *   errors:
 *     format: "RFC 7807"
 *     localization: true
 */

// ============================================
// DEVELOPMENT AND TESTING INFORMATION
// ============================================

/**
 * @swagger
 * x-development:
 *   testEndpoints:
 *     - name: "Health Check"
 *       path: "/api/health"
 *       method: "GET"
 *       description: "Check if the API is running"
 *       response:
 *         status: "ok"
 *         timestamp: "2025-01-15T10:00:00Z"
 *         version: "1.0.0"
 *
 *   testAccounts:
 *     - role: "Admin"
 *       email: "admin@communityforum.com"
 *       password: "admin123"
 *       description: "Full administrative access"
 *     - role: "Regular User"
 *       email: "john.doe@example.com"
 *       password: "password123"
 *       description: "Standard user with verified status"
 *     - role: "Unverified User"
 *       email: "bob.wilson@example.com"
 *       password: "password123"
 *       description: "User without email verification"
 *
 *   postmanCollection:
 *     url: "https://api.communityforum.com/postman/collection.json"
 *     environment: "https://api.communityforum.com/postman/environment.json"
 *
 *   sdks:
 *     javascript:
 *       npm: "@communityforum/js-sdk"
 *       github: "https://github.com/communityforum/js-sdk"
 *     python:
 *       pip: "communityforum-sdk"
 *       github: "https://github.com/communityforum/python-sdk"
 */

// ============================================
// CHANGELOG AND MIGRATION GUIDES
// ============================================

/**
 * @swagger
 * x-changelog:
 *   - version: "1.0.0"
 *     date: "2025-01-15"
 *     changes:
 *       added:
 *         - "Initial API release"
 *         - "Authentication endpoints"
 *         - "Event management endpoints"
 *         - "User profile endpoints"
 *         - "Marketplace endpoints (documented for future implementation)"
 *       security:
 *         - "JWT-based authentication"
 *         - "Role-based access control"
 *         - "Input validation with Zod"
 *
 * x-migration-guides:
 *   fromVersion: "0.9.0"
 *   toVersion: "1.0.0"
 *   breakingChanges:
 *     - description: "Changed authentication header format"
 *       before: "X-Auth-Token: {token}"
 *       after: "Authorization: Bearer {token}"
 *     - description: "Renamed 'name' field to 'fullName' in User schema"
 *       migration: "Update all references from user.name to user.fullName"
 *   deprecations:
 *     - endpoint: "/api/events/list"
 *       replacement: "/api/events"
 *       sunset: "2025-07-01"
 */

// ============================================
// COMPLIANCE AND SECURITY INFORMATION
// ============================================

/**
 * @swagger
 * x-compliance:
 *   gdpr:
 *     dataRetention: "Users can request data deletion via support"
 *     dataExport: "Users can export their data via /api/users/export"
 *     privacyPolicy: "https://communityforum.com/privacy"
 *
 *   security:
 *     encryption:
 *       transport: "TLS 1.2+"
 *       storage: "AES-256"
 *     authentication:
 *       type: "JWT"
 *       expiration: "7 days"
 *       refresh: "Available via /api/auth/refresh"
 *     headers:
 *       required:
 *         - "Content-Type"
 *         - "Authorization"
 *       cors:
 *         origins: ["https://communityforum.com", "http://localhost:3000"]
 *         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
 *         headers: ["Content-Type", "Authorization"]
 *     rateLimit:
 *       strategy: "Token bucket"
 *       headers:
 *         - "X-RateLimit-Limit"
 *         - "X-RateLimit-Remaining"
 *         - "X-RateLimit-Reset"
 */

// ============================================
// END OF SWAGGER DOCUMENTATION
// ============================================

/**
 * This Swagger documentation covers all endpoints for the Community Forum API.
 *
 * Implemented Modules:
 * - Authentication (Login, Register)
 * - Events (Full CRUD + Registration)
 * - Users (Profile management)
 *
 * Documented for Future Implementation:
 * - Marketplace (Listings, Requests, Search)
 * - Community Posts
 * - Webhooks
 *
 * For the latest updates and additional resources, visit:
 * https://github.com/communityforum/api-docs
 *
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@communityforum.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// ============================================
// USER ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         eventRegistrations:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/EventRegistration'
 *                         events:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Event'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// ============================================
// EVENT ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [SPORTS, CULTURAL, EDUCATIONAL, VOLUNTEER, SOCIAL, BUSINESS, HEALTH, ENVIRONMENT, TECHNOLOGY, OTHER]
 *         description: Filter by event category
 *       - in: query
 *         name: neighborhoodId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by neighborhood ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events starting after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events starting before this date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - startDate
 *               - location
 *               - neighborhoodId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Community Yoga Session"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *                 example: "Join us for a relaxing yoga session in the park"
 *               category:
 *                 type: string
 *                 enum: [SPORTS, CULTURAL, EDUCATIONAL, VOLUNTEER, SOCIAL, BUSINESS, HEALTH, ENVIRONMENT, TECHNOLOGY, OTHER]
 *                 example: "HEALTH"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T09:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T10:30:00Z"
 *               location:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: "Vondelpark, Amsterdam"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 example: 20
 *               neighborhoodId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               isRecurring:
 *                 type: boolean
 *                 default: false
 *               recurrencePattern:
 *                 type: object
 *                 properties:
 *                   frequency:
 *                     type: string
 *                     enum: [daily, weekly, monthly]
 *                   interval:
 *                     type: integer
 *                     minimum: 1
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 52.3579946
 *                   lng:
 *                     type: number
 *                     example: 4.8686671
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Event created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Neighborhood not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Event'
 *                     - type: object
 *                       properties:
 *                         registrations:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/EventRegistration'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     summary: Update event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *               category:
 *                 type: string
 *                 enum: [SPORTS, CULTURAL, EDUCATIONAL, VOLUNTEER, SOCIAL, BUSINESS, HEALTH, ENVIRONMENT, TECHNOLOGY, OTHER]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Event updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Delete event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Looking forward to this event!"
 *     responses:
 *       201:
 *         description: Successfully registered for event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully registered for event"
 *                 data:
 *                   $ref: '#/components/schemas/EventRegistration'
 *       400:
 *         description: Already registered or event not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Unregister from an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Successfully unregistered from event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully unregistered from event"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Registration not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/events/categories:
 *   get:
 *     summary: Get all event categories
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of event categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: "SPORTS"
 *                       label:
 *                         type: string
 *                         example: "Sports"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

