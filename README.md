[![CI](https://github.com/aljeerz/lets-secure/actions/workflows/main.yml/badge.svg)](https://github.com/aljeerz/lets-secure/actions/workflows/main.yml) [![Publish](https://github.com/aljeerz/lets-secure/actions/workflows/publish.yml/badge.svg)](https://github.com/aljeerz/lets-secure/actions/workflows/publish.yml)

# `@aljeerz/lets-secure`

This Repository Provides Utility Factory for NodeJS Native Crypto, OTPLib

## Features

Head to [OTPLib](https://github.com/yeojz/otplib) for more details

This Package offers :

- Query Transformer using Objects as Parameters and Internal Functions
- Multi Client Support (Multi Space Usecase)

Security Features :

- Auto Escape Parameters ( Avoid Diret String Concatination )

Quality Of Life :

- Provides an interface for Generator Functions (Example Below)

## Installation

```
npm install @aljeerz/lets-secure otplib @otplib/core
```

## Usage

- Initialisation

```typescript
/******** Example Initialisation Data ********/
const totpSecret = "secureSecret";
const secret = crypto.randomBytes(32);
const cipher = crypto.createCipheriv("aes-256-cbc", secret, iv);
const decipher = crypto.createDecipheriv("aes-256-cbc", secret, iv);
/*********************************************/

// Declare In Constructor
const factory = new LetsSecureFactory(
  [
    {
      name: "testone",
      cipher,
      decipher,
    },
  ],
  [
    {
      name: "testoneOTP",
      size: 4,
      type: "rand",
    },
    {
      name: "testoneTOTP",
      size: 8,
      type: "totp",
      secret: totpSecret,
    },
  ]
);

// Add Aditional Declarations On

factory.ciphDeclare("newCipher", newCipher, newCecipher);
const ret = factory.otpDeclare("newOTP", 4, "rand");
const ret = factory.otpDeclare("newTOTP", 6, "totp", totpSecret);
```

- Encrypt String

```typescript
const myEncryptedStr = factory.cipherStr("newCipher", myString, "utf-8", "base64");
const myDecrptedStr = factory.decipherStr("newCipher", myEncryptedStr, "base64", "utf-8");
```
- Generate Random OTP
```typescript
const OTPCode = factory.otpGenerate("newOTP");
```
- Generate Time Based OTP (TOTP)
```typescript
const TOTPCode = factory.otpGenerate("newTOTP");
```
