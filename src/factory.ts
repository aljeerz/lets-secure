import { Authenticator } from "@otplib/core";
import { authenticator } from "otplib";
import {
  CryptoCipher,
  CryptoDecipher,
  CryptoEncoding,
} from "./types";

export class LetsSecureFactory {
  private ciphDictionary: {
    [name: string]: {
      cipher: CryptoCipher;
      decipher: CryptoDecipher;
    };
  } = {};

  private otpDictionary: {
    [name: string]: {
      size: 4 | 6 | 8;
      type: "totp" | "rand";
      secret?: string;
    };
  } = {};

  private static totpInstancesBySize: {
    4: Authenticator<any>;
    6: Authenticator<any>;
    8: Authenticator<any>;
  } = {
    4: authenticator.create({...authenticator.allOptions(),...{ digits: 4 }}),
    6: authenticator.create({...authenticator.allOptions(),...{ digits: 6 }}),
    8: authenticator.create({...authenticator.allOptions(),...{ digits: 8 }}),
  };

  constructor(
    initialCiphers: {
      name: string;
      cipher: CryptoCipher;
      decipher: CryptoDecipher;
    }[] = [],
    initialOTPs: { name: string; size: 4 | 6 | 8; type: "totp" | "rand"; secret?: string }[] = []
  ) {
    initialCiphers.forEach((cph) => {
      this.ciphDeclare(cph.name, cph.cipher, cph.decipher);
    });

    initialOTPs.forEach((otp) => {
      if (otp.type == "totp" && !otp.secret) throw new Error("TOTP Requires a Secret");
      this.otpDeclare(otp.name, otp.size, otp.type, otp.secret);
    });
  }

  otpDeclare(
    name: string,
    size: 4 | 6 | 8 = 6,
    type: "totp" | "rand" = "rand",
    secret?: string,
    override?: boolean
  ): boolean {
    const existed = Object.keys(this.otpDictionary).includes(name);
    if (!existed) {
      this.otpDictionary[name] = {
        size,
        type,
        secret,
      };
    }
    return !existed;
  }

  otpRetrive(name: string): {
    size: 4 | 6 | 8;
    type: "totp" | "rand";
    secret?: string;
  } | undefined {
    if (!Object.keys(this.otpDictionary).includes(name)) return undefined;
    return this.otpDictionary[name];
  }

  otpGenerate(name: string) {
    const options = this.otpRetrive(name);
    if (!options) return undefined;
    switch (options.type) {
      case "rand":
        return LetsSecureFactory.generateOTP(options.size);
      case "totp":
        return LetsSecureFactory.getTimeBasedOTP(options.size, options.secret!);
    }
  }

  ciphDeclare(
    name: string,
    cipher: CryptoCipher,
    decipher: CryptoDecipher,
    override: boolean = false
  ): {
    created: boolean;
    cipher: CryptoCipher;
    decipher: CryptoDecipher;
  } {
    const existed = Object.keys(this.ciphDictionary).includes(name);
    if (!override && existed)
      return {
        created: false,
        cipher: this.ciphDictionary[name].cipher,
        decipher: this.ciphDictionary[name].decipher,
      };

    this.ciphDictionary[name] = {
      cipher,
      decipher,
    };

    return {
      created: !existed,
      cipher,
      decipher,
    };
  }

  ciphRetrive(name: string): {
    cipher: CryptoCipher;
    decipher: CryptoDecipher;
  } | undefined {
    if (!Object.keys(this.ciphDictionary).includes(name)) return undefined;
    return this.ciphDictionary[name];
  }

  cipherStr(
    name: string,
    data: string,
    inputEncoding: CryptoEncoding = "utf-8",
    outputEncoding: CryptoEncoding = "base64"
  ): string | undefined {
    const cipher = this.ciphRetrive(name)?.cipher;
    if (!cipher) return undefined;
    let cip = cipher.update(data, inputEncoding, outputEncoding);
    cip += cipher.final(outputEncoding);

    return cip;
  }

  decipherStr(
    name: string,
    data: string,
    inputEncoding: CryptoEncoding = "base64",
    outputEncoding: CryptoEncoding = "utf-8"
  ): string | undefined {
    const decipher = this.ciphRetrive(name)?.decipher;
    if (!decipher) return undefined;
    let cip = decipher.update(data, inputEncoding, outputEncoding);
    cip += decipher.final(outputEncoding);
    return cip;
  }

  static generateSecret(bytes: number = 32): string {
    return authenticator.generateSecret(bytes);
  }

  static generateOTP(size: 4 | 6 | 8 = 6, avoid?: string[]): string {
    let min: number, max: number;
    switch (size) {
      case 4:
        min = 1000;
        max = 9000;
        break;
      case 6:
        min = 100000;
        max = 900000;
        break;
      case 8:
        min = 10000000;
        max = 90000000;
        break;
    }
    let newotp = Math.floor(min + Math.random() * max);
    let otp: string = `${newotp}`;
    if (avoid) {
      if (avoid.includes(otp)) otp = this.generateOTP(size, avoid);
    }
    return otp;
  }

  static generateManyOTP(size: 4 | 6 | 8 = 6, count: number): string[] {
    let codes: string[] = [];
    for (let index = 0; index < count; index++) {
      codes.push(this.generateOTP(size, codes));
    }

    return codes;
  }

  static getTimeBasedOTP(size: 4 | 6 | 8, secret: string) {
    const instance = this.totpInstancesBySize[size];
    return instance.generate(secret);
  }
}
