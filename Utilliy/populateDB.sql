-- Create Employees table
CREATE TABLE public."Employees" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    "hashedPassword" VARCHAR(255) NOT NULL,
    "mobileNumber" BIGINT,
    salary DOUBLE PRECISION,
    designation VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL,
    "leavesLeft" INTEGER DEFAULT 20,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    "profilePictureURL" TEXT,
    "mfaEnabled" BOOLEAN DEFAULT FALSE,
    "mfaSettings" JSONB DEFAULT '{"emailOtp": false, "smsOtp": false, "totp": false}'
);

-- Create Leaves table
CREATE TABLE public."Leaves" (
    id SERIAL PRIMARY KEY,
    reason VARCHAR(255) NOT NULL,
    dates DATE[] NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'Under Process',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    "employeeId" INTEGER REFERENCES public."Employees"(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE public."Otps" (
    "employeeId" INT PRIMARY KEY,
    "emailOtp" VARCHAR(255),
    "emailOtpExpiry" TIMESTAMP,
    "smsOtp" VARCHAR(255),
    "smsOtpExpiry" TIMESTAMP,
    "emailOtpResendAttemptsCount" INTEGER DEFAULT 0,
    "emailOtpFirstResendAttempt" TIMESTAMP,
    "emailOtplastResendAttempt" TIMESTAMP,
    "smsOtpResendAttemptsCount" INTEGER DEFAULT 0,
    "smsOtpFirstResendAttempt" TIMESTAMP,
    "smsOtplastResendAttempt" TIMESTAMP
);






INSERT INTO "Employees" (id, name, email, "hashedPassword", "mobileNumber", salary,designation, role, "leavesLeft", "createdAt", "updatedAt", "deletedAt", "profilePictureURL")
VALUES 
(21, 'DummyName20', 'dummyname20@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5613145526', 1933,'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(82, 'Jibran Hussain Mir', 'jibran@gmail.com', '$2b$10$EaZTmuJYBXJ3ZhQUasXZCe0z2lbUhBeN6ntViLC3ZVlOBuvjiCTwG', '9229544576', 200020, 'Software Engineer' ,'employee', 20, '2024-02-06 17:24:09.042+05:30', '2024-02-06 17:24:09.042+05:30', NULL, ''),
(47, 'Admin 3', 'admin3@gmail.com', '$2b$10$VQAuQBdTHp5AzTAe9rTKj.0VlHUBPHVmlyx3qcvdkgn/CRQrI6ycu', '9999999999', 10000, 'Software Engineer' ,'admin', 20, '2024-01-20 22:51:16.776+05:30', '2024-01-20 22:51:16.776+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(4, 'DummyName3', 'dummyname3@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5402047589', 1556, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(5, 'DummyName4', 'dummyname4@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '3293916046', 1003, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(6, 'DummyName5', 'dummyname5@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '7903535030', 1288, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(7, 'DummyName6', 'dummyname6@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '6076601984', 1869, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(83, 'Employee 2', 'employee2@gmail.com', '$2b$10$QlytA.BMqTtCU3XUNikdAeG/cnvIaTwmN/AG56zqWZT8hXr/KZWPu', '9876543210', 45000, 'Software Engineer' ,'employee', 20, '2024-02-06 17:50:15.267+05:30', '2024-02-06 17:50:15.267+05:30', NULL, ''),
(15, 'DummyName14', 'dummyname14@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '4598365460', 1101,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(30, 'DummyName29', 'dummyname29@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '7416394721', 1938,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(35, 'DummyName34', 'dummyname34@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '1188968563', 1201, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(36, 'DummyName35', 'dummyname35@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5072051719', 1832, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(37, 'DummyName36', 'dummyname36@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '3349546709', 1126, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(38, 'DummyName37', 'dummyname37@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '6394812078', 1304, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(84, 'Employee 3', 'employee3@gmail.com', '$2b$10$CMHOy23jl0m2.gJM6GCzWeSd0/3Qrl94m40M3k53.Lm2qUbDOzzES', '7857375377', 12999, 'Software Engineer' ,'employee', 20, '2024-02-06 17:52:39.424+05:30', '2024-02-06 17:52:39.424+05:30', '2024-02-06 17:53:46.951+05:30', ''),
(22, 'DummyName21', 'dummyname21@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5374030618', 1114, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(23, 'DummyName22', 'dummyname22@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5091912742', 1745, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(24, 'DummyName23', 'dummyname23@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '3463567318', 1573,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(25, 'DummyName24', 'dummyname24@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '6375078872', 1143, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(29, 'DummyName28', 'dummyname28@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '6177935198', 1780, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(31, 'DummyName30', 'dummyname30@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5371252771', 1871,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(32, 'DummyName31', 'dummyname31@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '2908334537', 1467,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(33, 'DummyName32', 'dummyname32@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5908733336', 1190,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(34, 'DummyName33', 'dummyname33@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '4936488571', 1140, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(11, 'DummyName10', 'dummyname10@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5715592003', 1225,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(13, 'DummyName12', 'dummyname12@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '2714471575', 1716, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(8, 'DummyName7', 'dummyname7@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '7970919276', 1714, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(10, 'DummyName9', 'dummyname9@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '6434119002', 1573, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(14, 'DummyName13', 'dummyname13@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '8963141531', 1727, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(16, 'DummyName15', 'dummyname15@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '8638818075', 1265,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(17, 'DummyName16', 'dummyname16@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '3474144420', 1511, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(18, 'DummyName17', 'dummyname17@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '5042230167', 1533, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(19, 'DummyName18', 'dummyname18@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '6500001670', 1234, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(20, 'DummyName19', 'dummyname19@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '4420178343', 1794, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(85, 'Employee 4', 'employee4@gmail.com', '$2b$10$UhUfP2GYbkUSEeeHPvvH3.PztutGySgnqsSv2MXNRlIx3eznBu1sm', '6006345666', 15789,'Software Engineer' , 'employee', 20, '2024-02-06 17:53:25.297+05:30', '2024-02-06 17:53:25.297+05:30', '2024-02-06 17:53:48.939+05:30', NULL),
(28, 'DummyName27', 'dummyname27@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '9529303831', 1896,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', '2024-02-06 17:53:59.603+05:30', 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(39, 'DummyName38', 'dummyname38@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '4457687251', 1133,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(40, 'DummyName39', 'dummyname39@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '1236139508', 1640, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(41, 'DummyName40', 'dummyname40@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '8334844120', 1188, 'Software Engineer' ,'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(46, 'Suepradmin 2', 'superadmin2@gmail.com', '$2b$10$i2j2OOUnWgE2h/X1kd6rQ.RdL6H4lEEaMo79T9Vfsh8N6KrBFZj.e', '2346552122', 1000003,'Software Engineer' , 'superadmin', 20, '2024-01-20 22:45:04.668+05:30', '2024-01-20 22:45:04.668+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(2, 'DummyName1', 'dummyname1@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '3086058248', 1573,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(27, 'DummyName26', 'dummyname26@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '7514586952', 1584,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', '2024-02-06 17:53:58.04+05:30', 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(12, 'DummyName11', 'dummyname11@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '7612043492', 1208, 'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(9, 'DummyName8', 'dummyname8@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '9841494650', 1104, 'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(56, 'Employee 1', 'employee1@gmail.com', '$2b$10$/R2bfeKskUAZdsqSf97yJusNBbWb9IgbVpw2/a/Kr/agyFhNF.WV6', '2346552122', 50254,'Software Engineer' , 'employee', 20, '2024-01-22 10:29:46.295+05:30', '2024-02-06 16:34:58.018+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(3, 'DummyName2', 'dummyname2@example.com', '$2b$10$An28zw2UoQtUvpK46fSFiOrGcfHQOnrJzxPxGbMEEESHwzekkITCe', '8207108173', 1469,'Software Engineer' , 'admin', 20, '2024-01-19 12:42:27.744+05:30', '2024-01-19 12:42:27.744+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(44, 'Admin 1', 'admin1@gmail.com', '$2b$10$UuF2oMbU3xvWlm7cOT0Whe.wNWE1XtRIrIREC6QW/jgLoaIaNHOk2', '9226028117', 12000, 'Software Engineer' ,'admin', 20, '2024-01-19 12:57:28.506+05:30', '2024-02-06 17:33:23.977+05:30', NULL, 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'),
(1, 'Superadmin', 'superadmin@gmail.com', '$2b$10$fWB.DZsK69Qo35vPmDSJY.BaoWZ1NPE5ocXWrzLto8mCnLQGwAlI2', '9226028117', 1200, 'Chief Executive Officer' ,'superadmin', 20, '2024-01-19 12:36:52.589+05:30', '2024-02-06 13:00:55.362+05:30', NULL, 'https://dentalia.orionthemes.com/demo-1/wp-content/uploads/2016/10/dentalia-demo-deoctor-3-1-750x750.jpg');


INSERT INTO "Leaves" (id, reason, dates, status, "rejectionReason", "createdAt", "updatedAt", "deletedAt", "employeeId")
VALUES 
(53, 'Personal work.', '{2024-05-12,2024-05-13}', 'Under Process', NULL, '2024-02-07 11:04:58.904+05:30', '2024-02-07 11:04:58.904+05:30', NULL, 56),
(54, 'Home Visit', '{2024-05-14,2024-05-15}', 'Under Process', NULL, '2024-02-07 11:06:14.53+05:30', '2024-02-07 11:06:14.53+05:30', NULL, 56),
(55, 'Have to attend a hackathaon.', '{2024-05-22,2024-05-23}', 'Under Process', NULL, '2024-02-07 11:07:47.207+05:30', '2024-02-07 11:07:47.207+05:30', NULL, 56),
(56, 'I have to attend a family funciton.', '{2024-06-04,2024-06-05,2024-06-06,2024-03-07}', 'Under Process', NULL, '2024-02-07 11:10:11.763+05:30', '2024-02-07 11:10:11.763+05:30', NULL, 44),
(57, 'Personal work.', '{2024-06-22}', 'Under Process', NULL, '2024-02-07 11:10:47.618+05:30', '2024-02-07 11:10:47.618+05:30', NULL, 44),
(58, 'Have an appointment with doctor.', '{2024-06-23}', 'Under Process', NULL, '2024-02-07 11:11:35.475+05:30', '2024-02-07 11:11:35.475+05:30', NULL, 44);
