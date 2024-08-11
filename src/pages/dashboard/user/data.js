const userProfile = {
    personalInfo: {
        userId: "uniqueUserId123",  // Unique identifier for the user
        username: "user123",        // Username/handle
        email: "user@example.com",  // Email address
        phoneNumber: "+1234567890", // Phone number
        password: "hashedPassword", // Hashed password
        profilePicture: "url/to/profile/picture.jpg", // URL to profile picture
        coverPhoto: "url/to/cover/photo.jpg",         // URL to cover photo
        bio: "This is my bio.",    // Short bio or description
        dateOfBirth: "1990-01-01", // Date of birth
        gender: "male",            // Gender
        location: {
            city: "New York",
            state: "NY",
            country: "USA"
        },
        website: "https://userwebsite.com", // Personal or professional website
        language: "English",      // Preferred language
    },
    socialInfo: {
        followersCount: 1000,    // Number of followers
        followingCount: 150,     // Number of accounts the user follows
        postsCount: 300,         // Number of posts made by the user
        likesCount: 5000,        // Number of likes received by the user
        groups: ["Group1", "Group2"],  // Groups the user is a member of
        friendsList: ["friend1Id", "friend2Id"], // List of friend IDs
    },
    accountSettings: {
        privacySettings: {
            profileVisibility: "public", // Public, private, or custom
            messageSettings: "friendsOnly", // Who can send messages
            postVisibility: "friendsOnly", // Who can see posts
            tagApproval: true,  // Whether tags require approval
        },
        notificationSettings: {
            emailNotifications: true,     // Receive email notifications
            smsNotifications: false,      // Receive SMS notifications
            pushNotifications: true,      // Receive push notifications
            frequency: "daily",           // Frequency of notifications
        },
        accountStatus: "active",  // Active, deactivated, or banned
        twoFactorAuth: true,      // Two-factor authentication enabled or not
        linkedAccounts: {
            facebook: "linkedFacebookAccountId",
            google: "linkedGoogleAccountId",
            twitter: "linkedTwitterAccountId"
        },
        dataSharingConsent: true,  // Whether the user consents to data sharing
    },
    activityInfo: {
        lastLogin: "2024-08-10T12:34:56Z", // Last login time
        accountCreationDate: "2010-05-15T09:00:00Z", // Account creation date
        recentActivity: [
            { type: "post", content: "Just posted a new photo!", timestamp: "2024-08-09T15:20:00Z" },
            { type: "like", content: "Liked a post by user123", timestamp: "2024-08-08T12:10:00Z" },
            // More recent activities
        ],
        loginHistory: [
            { ipAddress: "192.168.1.1", location: "New York, USA", timestamp: "2024-08-10T12:34:56Z" },
            { ipAddress: "192.168.1.2", location: "Los Angeles, USA", timestamp: "2024-08-09T09:21:43Z" },
            // More login records
        ]
    },
    contentPreferences: {
        interests: ["Technology", "Music", "Travel"], // User's interests
        preferredContent: ["videos", "articles"],     // Preferred content types
        mutedWords: ["spoilers", "politics"], // Words the user has muted
        blockedUsers: ["blockedUser1Id", "blockedUser2Id"], // List of blocked user IDs
    },
    subscriptions: {
        plan: "premium",          // Plan type (e.g., free, premium)
        renewalDate: "2024-09-10", // Subscription renewal date
        paymentMethod: "creditCard", // Payment method
        paymentHistory: [
            { amount: 9.99, date: "2024-08-10", method: "creditCard" },
            { amount: 9.99, date: "2024-07-10", method: "creditCard" },
            // More payment records
        ]
    }
};
