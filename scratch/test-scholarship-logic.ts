import { calculateScholarship, SCHOLARSHIP_TIERS } from "../src/lib/scholarship";

interface TestCase {
  cgpa: number | string | null | undefined;
  expectedPercentage: number;
  expectedStatus: "Eligible" | "Not Eligible";
  expectedTierId: string;
  description: string;
}

const testCases: TestCase[] = [
  { cgpa: 0.0, expectedPercentage: 0, expectedStatus: "Not Eligible", expectedTierId: "ineligible", description: "Zero CGPA" },
  { cgpa: 2.50, expectedPercentage: 0, expectedStatus: "Not Eligible", expectedTierId: "ineligible", description: "Below threshold (2.50)" },
  { cgpa: 3.49, expectedPercentage: 0, expectedStatus: "Not Eligible", expectedTierId: "ineligible", description: "Boundary: Just below 3.50 (3.49)" },
  { cgpa: 3.499, expectedPercentage: 20, expectedStatus: "Eligible", expectedTierId: "bronze", description: "Precision: 3.499 normalizes to 3.50 -> 20%" },
  { cgpa: 3.50, expectedPercentage: 20, expectedStatus: "Eligible", expectedTierId: "bronze", description: "Boundary: Exact Tier 4 Start (3.50) -> 20%" },
  { cgpa: 3.65, expectedPercentage: 20, expectedStatus: "Eligible", expectedTierId: "bronze", description: "Within Tier 4 (3.65) -> 20%" },
  { cgpa: 3.74, expectedPercentage: 20, expectedStatus: "Eligible", expectedTierId: "bronze", description: "Boundary: Exact Tier 4 End (3.74) -> 20%" },
  { cgpa: 3.75, expectedPercentage: 40, expectedStatus: "Eligible", expectedTierId: "silver", description: "Boundary: Exact Tier 3 Start (3.75) -> 40%" },
  { cgpa: 3.82, expectedPercentage: 40, expectedStatus: "Eligible", expectedTierId: "silver", description: "User Prompt Example (3.82) -> 40%" },
  { cgpa: 3.89, expectedPercentage: 40, expectedStatus: "Eligible", expectedTierId: "silver", description: "Boundary: Exact Tier 3 End (3.89) -> 40%" },
  { cgpa: 3.90, expectedPercentage: 60, expectedStatus: "Eligible", expectedTierId: "gold", description: "Boundary: Exact Tier 2 Start (3.90) -> 60%" },
  { cgpa: 3.95, expectedPercentage: 60, expectedStatus: "Eligible", expectedTierId: "gold", description: "Boundary: Exact Tier 2 Upper Reference (3.95) -> 60%" },
  { cgpa: 3.98, expectedPercentage: 60, expectedStatus: "Eligible", expectedTierId: "gold", description: "No Gap Test: 3.98 falls safely in 60% Gold Tier" },
  { cgpa: 3.99, expectedPercentage: 60, expectedStatus: "Eligible", expectedTierId: "gold", description: "No Gap Test: 3.99 falls safely in 60% Gold Tier" },
  { cgpa: 4.00, expectedPercentage: 85, expectedStatus: "Eligible", expectedTierId: "platinum", description: "Boundary: Exact Tier 1 Perfect 4.00 -> 85%" },
  { cgpa: null, expectedPercentage: 0, expectedStatus: "Not Eligible", expectedTierId: "ineligible", description: "Null check" },
  { cgpa: undefined, expectedPercentage: 0, expectedStatus: "Not Eligible", expectedTierId: "ineligible", description: "Undefined check" },
];

let failed = 0;
console.log("=== RUNNING SCHOLARSHIP BOUNDARY TESTS ===");

for (const tc of testCases) {
  const result = calculateScholarship(tc.cgpa);
  const pass =
    result.percentage === tc.expectedPercentage &&
    result.status === tc.expectedStatus &&
    result.tierId === tc.expectedTierId;

  if (pass) {
    console.log(`[PASS] ${tc.description}: input=${tc.cgpa} -> CGPA=${result.cgpa.toFixed(2)}, Award=${result.percentage}%, Status=${result.status}, Tier=${result.tier}`);
  } else {
    failed++;
    console.error(`[FAIL] ${tc.description}: input=${tc.cgpa} -> Got percentage=${result.percentage}, status=${result.status}, tierId=${result.tierId}. Expected percentage=${tc.expectedPercentage}, status=${tc.expectedStatus}, tierId=${tc.expectedTierId}`);
  }
}

if (failed === 0) {
  console.log(`\nALL ${testCases.length} BOUNDARY AND LOGIC TESTS PASSED SUCCESSFULLY!`);
} else {
  console.error(`\n${failed} TESTS FAILED!`);
  process.exit(1);
}
