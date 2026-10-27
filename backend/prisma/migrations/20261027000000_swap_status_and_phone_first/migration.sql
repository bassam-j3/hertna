-- Migration: SwapStatus enum and phone-first user model
-- Changes:
-- 1. Add SwapStatus enum to SwapItem.status
-- 2. Make User.email nullable/optional
-- 3. Change Post.type default from OFFER to REQUEST

-- Step 1: Add the SwapStatus enum type
CREATE TYPE "SwapStatus" AS ENUM ('PENDING', 'ACCEPTED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- Step 2: Make email nullable on users table
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;

-- Step 3: Convert SwapItem.status from text to SwapStatus enum
-- First update any existing text values to match enum values
UPDATE "swap_items" SET "status" = 'PENDING' WHERE "status" = 'pending';
UPDATE "swap_items" SET "status" = 'ACTIVE' WHERE "status" = 'active';
UPDATE "swap_items" SET "status" = 'COMPLETED' WHERE "status" = 'completed';
UPDATE "swap_items" SET "status" = 'CANCELLED' WHERE "status" = 'cancelled';
UPDATE "swap_items" SET "status" = 'PENDING' WHERE "status" IS NULL OR "status" = '';

-- Then alter the column type
ALTER TABLE "swap_items" ALTER COLUMN "status" TYPE "SwapStatus" USING "status"::"SwapStatus";

-- Step 4: Set default for Post.type to REQUEST (already enforced at app level)
ALTER TABLE "posts" ALTER COLUMN "type" SET DEFAULT 'REQUEST';
