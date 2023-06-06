import { describe, it, expect } from "vitest";
import { LetsSecureFactory } from "./factory";
import * as crypto from "node:crypto";

const iv = crypto.randomBytes(16);

describe("Factory Class General Tests", () => {
  const secretOtp = "testonesecret";
  const secret = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv("aes-256-cbc", secret, iv);
  const decipher = crypto.createDecipheriv("aes-256-cbc", secret, iv);
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
        secret: secretOtp,
      },
    ]
  );
  it("Should Return Initialising Ciph Pair", () => {
    const f = factory.ciphRetrive("testone");
    expect(f).toEqual({
      cipher,
      decipher,
    });
  });

  it("Should Return Initialising OTP Settings", () => {
    const f = factory.otpRetrive("testoneOTP");
    expect(f).toEqual({
      size: 4,
      type: "rand",
    });
  });

  it("Should Return Initialising TOTP Settings", () => {
    const f = factory.otpRetrive("testoneTOTP");
    expect(f).toEqual({
      size: 8,
      type: "totp",
      secret: secretOtp,
    });
  });

  it("Should Declare new Ciph Pair and Retrive it", () => {
    const ret = factory.ciphDeclare("testwo", cipher, decipher);
    const retrived = factory.ciphRetrive("testwo");

    expect(ret).toEqual({
      created: true,
      cipher,
      decipher,
    });

    expect(retrived).toEqual({
      cipher,
      decipher,
    });
  });

  it("Should Declare new OTP and Retrive its Settings", () => {
    const ret = factory.otpDeclare("testwoOTP", 8, "rand");
    const retrived = factory.otpRetrive("testwoOTP");

    expect(ret).toBe(true);

    expect(retrived).toEqual({
      size: 8,
      type: "rand",
    });
  });

  it("Should Declare new TOTP and Retrive its Settings", () => {
    const ret = factory.otpDeclare("testwoTOTP", 4, "totp", secretOtp);
    const retrived = factory.otpRetrive("testwoTOTP");

    expect(ret).toBe(true);

    expect(retrived).toEqual({
      size: 4,
      type: "totp",
      secret: secretOtp,
    });
  });

  it("Should Throw if TOTP does have a secret", () => {
    const ret = factory.otpDeclare("testwoTOTPThrow", 4, "totp");
    expect(ret).toThrow(Error);
  });
});

describe("Crypto Test", () => {
  const secret = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv("aes-256-cbc", secret, iv);
  const decipher = crypto.createDecipheriv("aes-256-cbc", secret, iv);
  const factory = new LetsSecureFactory(
    [
      {
        name: "testone",
        cipher,
        decipher,
      },
    ],
    []
  );
  it("Should Cypher and Decipher back", () => {
    const str = "my random 254887 string '#/|\\str";
    const crypted = factory.cipherStr("testone", str, "utf-8", "base64");
    expect(crypted).toBeDefined();
    const decrypted = factory.decipherStr("testone", crypted!, "base64", "utf-8");
    expect(decrypted).toBeDefined();
    expect(decrypted).toEqual(str);
  });
});

describe("OTP/TOTP Test", () => {
  const secretOtp = "testonesecret";
  const factory = new LetsSecureFactory(
    [],
    [
      {
        name: "4OTP",
        size: 4,
        type: "rand",
      },
      {
        name: "6OTP",
        size: 6,
        type: "rand",
      },
      {
        name: "8OTP",
        size: 8,
        type: "rand",
      },
      {
        name: "4TOTP",
        size: 4,
        type: "totp",
        secret: secretOtp,
      },
      {
        name: "6TOTP",
        size: 6,
        type: "totp",
        secret: secretOtp,
      },
      {
        name: "8TOTP",
        size: 8,
        type: "totp",
        secret: secretOtp,
      },
    ]
  );

  it("Should Create a Random OTP of Desired Lengths", () => {
    const OTP4 = factory.otpGenerate("4OTP");
    expect(OTP4).toHaveLength(4);

    const OTP6 = factory.otpGenerate("6OTP");
    expect(OTP6).toHaveLength(6);

    const OTP8 = factory.otpGenerate("8OTP");
    expect(OTP8).toHaveLength(8);
  });

  it("Should Create a Random TOTP of Desired Lengths", () => {
    const OTP4 = factory.otpGenerate("4TOTP");
    expect(OTP4).toHaveLength(4);

    const OTP6 = factory.otpGenerate("6TOTP");
    expect(OTP6).toHaveLength(6);

    const OTP8 = factory.otpGenerate("8TOTP");
    expect(OTP8).toHaveLength(8);
  });

  it("Should Create a Random TOTP and be the Same Again", () => {
    const OTP4 = factory.otpGenerate("4TOTP");
    const OTP4Again = factory.otpGenerate("4TOTP");

    expect(OTP4).toEqual(OTP4Again)
   
  });
});
