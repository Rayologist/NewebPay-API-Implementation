import { createCipheriv, createDecipheriv, createHash } from "crypto";

class Cryption {
    AES_ALGORITHM = "aes-256-cbc";
    constructor({ hashKey, hashIV }) {
      this.hashKey = hashKey;
      this.hashIV = hashIV;
    }
  
    _encrypt(rawString) {
      const cipher = createCipheriv(
        this.AES_ALGORITHM,
        this.hashKey,
        this.hashIV
      );
      const encrypted = cipher.update(rawString, "bin", "hex");
      return encrypted + cipher.final("hex");
    }
  
    _decrypt(encrypted) {
      const decipher = createDecipheriv(
        this.AES_ALGORITHM,
        this.hashKey,
        this.hashIV
      );
      decipher.setAutoPadding(false);
      const decrypted = decipher.update(encrypted, "hex", "utf8");
  
      return decrypted + decipher.final("utf8");
    }
  
    encrypt(string) {
      return this._encrypt(string);
    }
  
    hashSHA256(string) {
      const sha256 = createHash("sha256").update(string);
      return sha256.digest("hex").toUpperCase();
    }
  
    validateSha(encryptedString, SHA) {
      return this.hashSHA256(encryptedString) === SHA;
    }
  
    decrypt(encryptedString, SHA) {

      const isValid = this.validateSha(encryptedString, SHA);
  
      if (!isValid) {
        throw "ValueError: SHA256 does not match. Data received may be tampered with";
      }
  
      const decrypted = this._decrypt(tradeInfo).replace(/[\x00-\x20]/g, "");
  
      return decrypted;
    }
  }
  
export default Cryption;