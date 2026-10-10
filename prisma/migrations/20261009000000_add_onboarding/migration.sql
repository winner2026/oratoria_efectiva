CREATE TABLE "onboarding_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "objective" TEXT,
    "difficulty" TEXT,
    "profession" TEXT,
    "situation" TEXT,
    "interest" TEXT,
    "ageRange" TEXT,
    "gender" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "onboarding_profiles_user_id_key" ON "onboarding_profiles"("user_id");

ALTER TABLE "onboarding_profiles" ADD CONSTRAINT "onboarding_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
