"use strict";

const express = require('express')
const router = express.Router();

const AuthController = require('../Controllers/Auth.Controller');
const { verifyAccessToken } = require('../helpers/jwt_helper');

/**
 * @swagger
 * 
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Login user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: username
 *         description: User's EMAIL-ID/Phone Number (username).
 *         required: true
 *         type: string
 *         format: email
 *       - in: formData
 *         name: password
 *         description: User's password.
 *         required: true
 *         type: string
 *         format: password
 *     responses:
 *       200:
 *         description: User has been logged-in successfully and a new token has been generated
 *       403: 
 *         description: You do not have necessary permissions to login
 */
router.post('/login', AuthController.login)

/**
 * @swagger
 *
 * /auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     description: Send the refresh token to get the new of AccessToken
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: New AccessToken has been generated successfully
 *       403: 
 *         description: You do not have necessary permissions to get token
 */
router.post('/refresh-token', AuthController.refreshToken);

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     description: Register the user in the Application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Email (Admin only has the access to create PM, Im & Client)
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: Password of the user
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *       - name: type
 *         description: Type of the user (2->Procure Manager(PM), 3->Inspection Manager(IM), 4-> Client)
 *         in: formData
 *         required: true
 *         type: number
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: New user has been successfully registered with Portal.
 *       403: 
 *         description: You do not have necessary permissions to create new user or register.
 */
router.post('/register', verifyAccessToken, AuthController.register);

/**
 * @swagger
 * 
 * /auth/logout:
 *   delete:
 *     tags:
 *       - Auth
 *     description: Logout user
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: User Logged out successfully
 *       400: 
 *         description: Something went wrong, unable to logout.
 */
 router.delete('/logout', AuthController.logout);





















//router.delete('/logout', AuthController.logout)

module.exports = router
