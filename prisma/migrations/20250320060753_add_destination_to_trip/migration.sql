/*
  Warnings:

  - Added the required column `destination` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN "budget" DOUBLE PRECISION;

-- Add destination column with a default value first
ALTER TABLE "Trip" ADD COLUMN "destination" TEXT DEFAULT 'Unknown Destination';

-- Then make it NOT NULL after existing rows have a value
ALTER TABLE "Trip" ALTER COLUMN "destination" SET NOT NULL;

-- Finally remove the default constraint for future inserts
ALTER TABLE "Trip" ALTER COLUMN "destination" DROP DEFAULT;
