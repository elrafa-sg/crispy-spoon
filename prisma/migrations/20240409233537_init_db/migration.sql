-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CREDIT_CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'WATING_FUNDS');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "card_number" TEXT,
    "valid" TEXT,
    "cvv" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payable" (
    "id" SERIAL NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "Payable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payable_transactionId_key" ON "Payable"("transactionId");

-- AddForeignKey
ALTER TABLE "Payable" ADD CONSTRAINT "Payable_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
