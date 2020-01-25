const { KmsKeyringNode, encrypt, decrypt } = require("@aws-crypto/client-node");

const generatorKeyId = "arn:aws:kms:us-east-1:885121665536:key/beee76a1-bd25-4d57-81d8-38ff2b26468a";

const keyIds = ["arn:aws:kms:us-east-1:885121665536:key/24dd8981-2f43-4780-9468-19ceda21a86b"];

const keyring = new KmsKeyringNode({ generatorKeyId, keyIds });

encryptData = async (plainText, context) => {
  try {
    const { result } = await encrypt(keyring, plainText, { encryptionContext: context });
    return result;
  } catch (e) {
    console.log(e);
  }
};

decryptData = async (encryptedData, context) => {
  try {
    const { plaintext, messageHeader } = await decrypt(keyring, encryptedData);
    console.log("===== Message Header =======");
    console.log(JSON.stringify(messageHeader.encryptionContext));

    Object.entries(context).forEach(([key, value]) => {
      if (messageHeader.encryptionContext[key] === value) {
        console.log("it matched..");
      }
      if (messageHeader.encryptionContext[key] !== value)
        throw new Error("Encryption Context does not match expected values");
    });

    return plaintext.toString();
  } catch (e) {
    console.log(e);
  }
};

async function init() {
  let plainText = "My passwords for senstive data";
  console.log("====== Original Text ======");
  console.log(plainText);

  const context = {
    stage: "youtube",
    purpose: "youtube demo",
    origin: "us-east-1"
  };

  // Encrypting
  let encryptedData = await encryptData(plainText, context);
  console.log("===== Encrypted Data ======");
  console.log(encryptedData);

  // Decrypting
  let decryptedData = await decryptData(encryptedData, context);
  console.log("===== Decrypted Data ======");
  console.log(decryptedData);
}

init();
