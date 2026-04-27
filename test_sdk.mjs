import { SmartContractAuditor } from "@chaingpt/smartcontractauditor";

const smartcontractauditor = new SmartContractAuditor({
  apiKey: '181157db-13f4-4c63-b4db-e7c3701f94c9',
});

async function main() {
  try {
    const response = await smartcontractauditor.auditSmartContractBlob({
      question: `Audit the following contract: contract Test {}`,
      chatHistory: "off"
    });
    console.log(JSON.stringify(response, null, 2));
  } catch(e) {
    console.error("Error:", e);
  }
}
main();
