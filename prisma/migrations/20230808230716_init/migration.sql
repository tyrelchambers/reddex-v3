-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "setToDelete" BOOLEAN NOT NULL DEFAULT false,
    "customerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactedWriters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ContactedWriters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "greeting" TEXT,
    "recurring" TEXT,
    "words_per_minute" INTEGER,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentlySearched" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "profileId" TEXT,

    CONSTRAINT "RecentlySearched_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditPost" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "flair" TEXT,
    "num_comments" INTEGER NOT NULL,
    "post_id" TEXT NOT NULL,
    "story_length" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "ups" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "subreddit" TEXT NOT NULL,
    "permission" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "reading_time" INTEGER NOT NULL,
    "upvote_ratio" DOUBLE PRECISION NOT NULL,
    "created" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RedditPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnStories" (
    "RedditPostId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TagsOnStories_pkey" PRIMARY KEY ("RedditPostId","tagId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedStory" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "author" TEXT,
    "sent_to_others" BOOLEAN,
    "body" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SubmittedStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT true,
    "subdomain" TEXT,
    "name" TEXT,
    "description" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "patreon" TEXT,
    "youtube" TEXT,
    "podcast" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "colour" TEXT NOT NULL DEFAULT '#000',
    "banner" TEXT,
    "thumbnail" TEXT,
    "userId" TEXT NOT NULL,
    "submissionPageId" TEXT NOT NULL,
    "youtubeIntegrationId" TEXT,
    "canBeEnabled" BOOLEAN,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionPage" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubmissionPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionFormModule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "submissionPageId" TEXT,

    CONSTRAINT "SubmissionFormModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "posts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RecentlySearched_text_key" ON "RecentlySearched"("text");

-- CreateIndex
CREATE UNIQUE INDEX "Website_subdomain_key" ON "Website"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Website_userId_key" ON "Website"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Website_submissionPageId_key" ON "Website"("submissionPageId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactedWriters" ADD CONSTRAINT "ContactedWriters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentlySearched" ADD CONSTRAINT "RecentlySearched_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditPost" ADD CONSTRAINT "RedditPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnStories" ADD CONSTRAINT "TagsOnStories_RedditPostId_fkey" FOREIGN KEY ("RedditPostId") REFERENCES "RedditPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnStories" ADD CONSTRAINT "TagsOnStories_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedStory" ADD CONSTRAINT "SubmittedStory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_submissionPageId_fkey" FOREIGN KEY ("submissionPageId") REFERENCES "SubmissionPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionFormModule" ADD CONSTRAINT "SubmissionFormModule_submissionPageId_fkey" FOREIGN KEY ("submissionPageId") REFERENCES "SubmissionPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
