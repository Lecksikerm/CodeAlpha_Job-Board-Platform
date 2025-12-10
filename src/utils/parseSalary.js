function parseSalaryRange(salaryStr) {
    // Example: "$2,000 - $3,000" -> { min: 2000, max: 3000 }
    if (!salaryStr) return null;

    const match = salaryStr.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
    if (!match) return null;

    const min = parseInt(match[1].replace(/,/g, ''));
    const max = parseInt(match[2].replace(/,/g, ''));

    return { min, max };
}

module.exports = parseSalaryRange;
