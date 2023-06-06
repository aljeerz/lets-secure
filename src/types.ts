import * as crypto from "node:crypto";
//import * as stream from "node:stream";

export type CryptoCipher = crypto.CipherCCM | crypto.CipherOCB | crypto.CipherGCM | crypto.Cipher;

export type CryptoDecipher = crypto.DecipherCCM | crypto.DecipherOCB | crypto.DecipherGCM | crypto.Decipher;

export type CryptoEncoding = crypto.Encoding;

/*
export type CryptoAlgo =
  | crypto.CipherCCMTypes
  | crypto.CipherOCBTypes
  | crypto.CipherGCMTypes
  | string;

export type CryptoOptions =
  | crypto.CipherCCMOptions
  | crypto.CipherOCBOptions
  | crypto.CipherGCMOptions
  | stream.TransformOptions;


export type CryptoCipherKey = crypto.CipherKey;

export type CryptoBinary = crypto.BinaryLike;


export type Snowflake = string | number*/
