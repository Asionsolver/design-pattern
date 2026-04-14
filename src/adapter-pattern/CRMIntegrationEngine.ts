// --- Enterprise Interfaces ---
interface CustomerData {
  id: string;
  fullName: string;
  balance: number;
}

interface ModernCRM {
  syncCustomer(customer: CustomerData): Promise<void>;
}

// --- Legacy System (Adaptee) ---
// This system only understands XML and uses different field names
class LegacyMainframe {
  public fetchLegacyUser(legacyId: number): string {
    // Simulated XML response
    return `
            <USER_RECORD>
                <U_ID>${legacyId}</U_ID>
                <F_NAME>John</F_NAME>
                <L_NAME>Doe</L_NAME>
                <ACC_BAL>5500.50</ACC_BAL>
            </USER_RECORD>`;
  }
}

// --- The Ultra Complex Adapter ---
class MainframeToModernCRMAdapter implements ModernCRM {
  private legacySystem: LegacyMainframe;

  constructor(legacy: LegacyMainframe) {
    this.legacySystem = legacy;
  }

  async syncCustomer(customer: CustomerData): Promise<void> {
    console.log("Starting Complex Integration Mapping...");

    // 1. Fetch data from legacy system using the target ID
    const rawXml = this.legacySystem.fetchLegacyUser(parseInt(customer.id));

    // 2. Complex Logic: Parse XML (Simulated)
    const parsedData = this.parseXml(rawXml);

    // 3. Data Transformation & Mapping
    const transformedData: CustomerData = {
      id: `MODERN_${parsedData.U_ID}`,
      fullName: `${parsedData.F_NAME} ${parsedData.L_NAME}`,
      balance: parseFloat(parsedData.ACC_BAL),
    };

    // 4. Validation Logic
    if (transformedData.balance < 0) {
      throw new Error("Invalid Balance in Legacy System");
    }

    // 5. Final Sync to Modern API
    console.log("Data Transformed and Validated:", transformedData);
    console.log("Synchronizing with Modern REST API...");
  }

  private parseXml(xml: string): any {
    // Realistic complex logic to extract values from XML
    const extract = (tag: string) =>
      xml.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`))?.[1];
    return {
      U_ID: extract("U_ID"),
      F_NAME: extract("F_NAME"),
      L_NAME: extract("L_NAME"),
      ACC_BAL: extract("ACC_BAL"),
    };
  }
}

// --- Execution ---
async function runEnterpriseSync() {
  const mainframe = new LegacyMainframe();
  const adapter = new MainframeToModernCRMAdapter(mainframe);

  const targetCustomer: CustomerData = { id: "101", fullName: "", balance: 0 };

  try {
    await adapter.syncCustomer(targetCustomer);
    console.log("Integration Successful!");
  } catch (error) {
    console.error("Integration Failed:", error);
  }
}

runEnterpriseSync();
