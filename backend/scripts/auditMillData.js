/*
 * Audit mill data fields to ensure stock dashboards are accurate.
 *
 * Usage:
 *   node scripts/auditMillData.js
 */

const db = require('../database');

const REQUIRED_TYPES = new Set(['private', 'government']);

const parseCapacity = (value) => {
  if (!value) return { raw: value, parsed: null, valid: false };
  const raw = String(value).trim();
  if (!raw) return { raw, parsed: null, valid: false };

  const normalised = raw.replace(/,/g, '');
  const match = normalised.match(/\d+(\.\d+)?/);
  if (!match) return { raw, parsed: null, valid: false };

  const parsed = parseFloat(match[0]);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return { raw, parsed: null, valid: false };
  }

  return { raw, parsed, valid: true };
};

(async () => {
  try {
    const [mills] = await db.execute(`
      SELECT id, business_name, business_type, mill_district, district, mill_capacity
      FROM users
      WHERE business_type IS NOT NULL
    `);

    if (!mills.length) {
      console.log('ℹ️ No mills found in the users table.');
      process.exit(0);
    }

    const report = {
      total: mills.length,
      typeIssues: [],
      districtIssues: [],
      capacityIssues: [],
    };

    mills.forEach((mill) => {
      const type = (mill.business_type || '').toLowerCase();
      const hasValidType = REQUIRED_TYPES.has(type);
      const hasDistrict = Boolean(mill.mill_district || mill.district);
      const capacityInfo = parseCapacity(mill.mill_capacity);

      if (!hasValidType) {
        report.typeIssues.push({
          id: mill.id,
          business_name: mill.business_name,
          business_type: mill.business_type,
        });
      }

      if (!hasDistrict) {
        report.districtIssues.push({
          id: mill.id,
          business_name: mill.business_name,
        });
      }

      if (!capacityInfo.valid) {
        report.capacityIssues.push({
          id: mill.id,
          business_name: mill.business_name,
          value: mill.mill_capacity,
        });
      }
    });

    console.log('📊 Mill Data Audit Report');
    console.log('────────────────────────');
    console.log(`Total mills evaluated: ${report.total}`);
    console.log(`Invalid business types: ${report.typeIssues.length}`);
    console.log(`Missing districts: ${report.districtIssues.length}`);
    console.log(`Invalid capacities: ${report.capacityIssues.length}`);

    if (report.typeIssues.length) {
      console.log('\n⚠️ Mills with unsupported business_type values:');
      report.typeIssues.forEach((issue) => {
        console.log(`  • [${issue.id}] ${issue.business_name} → ${issue.business_type || 'NULL'}`);
      });
      console.log('  Suggested action: update business_type to "private" or "government".');
    }

    if (report.districtIssues.length) {
      console.log('\n⚠️ Mills missing district information:');
      report.districtIssues.forEach((issue) => {
        console.log(`  • [${issue.id}] ${issue.business_name}`);
      });
      console.log('  Suggested action: set users.mill_district to the mill\'s operating district.');
    }

    if (report.capacityIssues.length) {
      console.log('\n⚠️ Mills with invalid mill_capacity values:');
      report.capacityIssues.forEach((issue) => {
        console.log(`  • [${issue.id}] ${issue.business_name} → "${issue.value ?? 'NULL'}"`);
      });
      console.log('  Suggested action: store numeric capacities (e.g. "1200" or "1200 MT").');
    }

    if (!report.typeIssues.length && !report.districtIssues.length && !report.capacityIssues.length) {
      console.log('\n✅ All mills have valid types, districts, and capacities.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to audit mill data:', error.message);
    process.exit(1);
  }
})();
