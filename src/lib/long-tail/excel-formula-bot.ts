import type { LongTailContent } from "../long-tail-content";

/**
 * excel-formula-bot long-tail pages.
 * Shared component: ExcelFormulaBotTool (props: formulaExample, platform).
 *
 * Behavior to describe (do NOT claim anything else):
 * - AI formula generator: describe what you want in plain language, get a
 *   working formula plus an explanation of how it works.
 * - formulaExample prefills the question box with an EDITABLE example —
 *   the user can modify it and submit.
 * - platform ("excel" | "google-sheets") preselects the platform tab; both
 *   are supported and explanations adapt to the selected platform.
 * - Runs in the browser; no signup.
 */
const vlookupVsXlookupGenerator: LongTailContent = {
    id: "vlookup-vs-xlookup-generator",
    slug: "vlookup-vs-xlookup-generator",
    hubId: "excel-formula-bot",
    href: "/tools/excel-formula-bot/vlookup-vs-xlookup-generator/",
    crumb: "VLOOKUP vs XLOOKUP Generator",
    h1: "VLOOKUP vs XLOOKUP Formula Generator",
    subtitle:
        "Describe your lookup in plain English and get a working VLOOKUP or XLOOKUP formula — with an explanation of which one fits your Excel version.",
    metaTitle: "VLOOKUP vs XLOOKUP Formula Generator — Free AI | YuliusBox",
    metaDescription:
        "Generate VLOOKUP and XLOOKUP formulas from plain English. Free AI tool explains which lookup fits your Excel version — no signup.",
    keywords: [
        "vlookup vs xlookup",
        "xlookup formula generator",
        "vlookup formula generator",
        "excel lookup formula",
    ],
    preset: {
        formulaExample:
            "Look up 'Widget' in column A and return the matching price from column D",
    },
    howTo: [
        "Describe your lookup in the question box above — the example is editable, so tweak it to match your sheet.",
        "Submit and get a working formula plus a plain-English explanation of each part.",
        "Copy the formula into your spreadsheet and adjust the cell references to your data.",
    ],
    sections: [
        {
            heading: "The 30-second version: when to use each",
            paragraphs: [
                "VLOOKUP is the lookup function everyone learned first: it searches the leftmost column of a range and returns a value from a column to its right. XLOOKUP is its modern replacement (Excel 2021 and Microsoft 365): it searches any column, returns from any column, and defaults to exact matches instead of VLOOKUP's infamous approximate-match default.",
                "The practical rule: use XLOOKUP if everyone who will open the file has Excel 2021, Microsoft 365, or Google Sheets (which has XLOOKUP too). Use VLOOKUP if the file might be opened in Excel 2019 or older, where XLOOKUP simply doesn't exist and shows a #NAME? error. When in doubt, generate the VLOOKUP — compatibility beats elegance.",
            ],
        },
        {
            heading: "Why VLOOKUP breaks (and XLOOKUP doesn't)",
            paragraphs: [
                "VLOOKUP has three classic failure modes. First, the lookup column must be the leftmost column of your range — look up a value and return something to its left, and VLOOKUP can't do it without rearranging your data. Second, inserting a column inside the range silently shifts the column index number, so a formula that worked yesterday returns the wrong column today. Third, the default match mode is approximate, so a missing fourth argument returns the wrong row instead of an error.",
                "XLOOKUP fixes all three by design: =XLOOKUP(lookup_value, lookup_array, return_array) takes separate ranges, so columns can sit anywhere, inserted columns can't break it, and exact match is the default. It also has a built-in \"if not found\" argument, replacing the IFNA(VLOOKUP(...)) wrapper people used to write.",
            ],
        },
        {
            heading: "The compatibility caveat nobody mentions",
            paragraphs: [
                "XLOOKUP's only real weakness is version support. Excel 2019 and earlier, plus some enterprise installs frozen on older builds, don't have it — and unlike a new chart type, a missing function breaks the whole cell. If you email a workbook to a client or share it with a team on mixed Excel versions, XLOOKUP formulas will show errors on their machines.",
                "This is why the generator asks about your situation: describe who will use the file and it will recommend the safe choice. A good habit is noting the required Excel version in a comment or a README tab when you use XLOOKUP in a shared workbook.",
            ],
        },
        {
            heading: "What the generated formula includes",
            paragraphs: [
                "The tool doesn't just hand you a formula string — it explains each argument in plain language: what the lookup value is, which range it searches, which column or range it returns, and why the match mode was chosen. That explanation is the difference between a formula you can use once and one you can adapt next week.",
                "It also handles the common variations people actually need: lookups across sheets, two-way lookups (match on row and column), returning multiple columns at once (XLOOKUP's spill behavior), and graceful \"not found\" handling. Describe the variation in your own words — the example in the box is just a starting point.",
            ],
        },
        {
            heading: "Beyond both: INDEX/MATCH and the lookup family",
            paragraphs: [
                "Old-school Excel experts will tell you INDEX/MATCH is the real answer — it's the combination that does everything XLOOKUP does and works in Excel 2007 onward. They're right, and the generator can produce INDEX/MATCH formulas too if you ask for maximum compatibility with leftward lookups.",
                "The honest hierarchy: XLOOKUP for modern files, VLOOKUP for simple rightward lookups on old Excel, INDEX/MATCH for leftward lookups on old Excel. Describe your constraints (Excel version, lookup direction) and the tool picks the right member of the family instead of forcing one answer.",
            ],
        },
    ],
    faqs: [
        {
            question: "Should I still learn VLOOKUP in 2026?",
            answer: "Yes — not because it's better, but because you'll inherit a decade of spreadsheets written with it. You need to read VLOOKUP fluently even if you write XLOOKUP for everything new. The generator can also explain any VLOOKUP you paste in, which is the fastest way to learn it from real examples.",
        },
        {
            question: "Why does my XLOOKUP show #NAME?",
            answer: "Almost certainly an old Excel version: XLOOKUP needs Excel 2021, Microsoft 365, or Google Sheets. On Excel 2019 or earlier the function doesn't exist. Either upgrade, or regenerate the formula as VLOOKUP/INDEX-MATCH for compatibility.",
        },
        {
            question: "Can XLOOKUP return values to the left of the lookup column?",
            answer: "Yes — that's one of its main advantages over VLOOKUP. Since the lookup array and return array are separate arguments, the return column can be anywhere: left, right, or on another sheet entirely.",
        },
        {
            question: "Does Google Sheets support XLOOKUP?",
            answer: "Yes, Google Sheets added XLOOKUP support, and the generator's Google Sheets tab produces Sheets-compatible syntax. VLOOKUP works identically in both platforms, so it's the safe cross-platform choice.",
        },
    ],
    related: [
        {
            href: "/tools/excel-formula-bot",
            label: "Excel Formula Bot — generate any formula",
        },
        {
            href: "/tools/excel-formula-bot/sumifs-countifs-builder/",
            label: "Build SUMIFS and COUNTIFS formulas",
        },
        {
            href: "/tools/excel-formula-bot/excel-if-formula-multiple-conditions/",
            label: "IF formulas with multiple conditions",
        },
        {
            href: "/tools/excel-formula-bot/google-sheets-formula-generator/",
            label: "Google Sheets formula generator",
        },
    ],
};

const excelIfFormulaMultipleConditions: LongTailContent = {
    id: "excel-if-formula-multiple-conditions",
    slug: "excel-if-formula-multiple-conditions",
    hubId: "excel-formula-bot",
    href: "/tools/excel-formula-bot/excel-if-formula-multiple-conditions/",
    crumb: "IF Formula with Multiple Conditions",
    h1: "Excel IF Formula with Multiple Conditions — Generator",
    subtitle:
        "Nested IFs, IFS, or AND/OR? Describe your logic in plain English and get a working multi-condition formula with a clear explanation.",
    metaTitle: "Excel IF with Multiple Conditions — Formula Generator",
    metaDescription:
        "Generate Excel IF formulas with multiple conditions from plain English. Nested IF vs IFS vs AND/OR explained — free, no signup.",
    keywords: [
        "excel if multiple conditions",
        "nested if formula",
        "ifs function excel",
        "excel if and or formula",
    ],
    preset: {
        formulaExample:
            "If sales are over 10000 and the region is 'West', return 'Bonus', otherwise 'No bonus'",
    },
    howTo: [
        "Describe your conditions in the question box above — edit the example to match your real logic.",
        "Submit and get a working formula (nested IF, IFS, or AND/OR — whichever fits) with an explanation.",
        "Copy it into your spreadsheet and swap in your actual cell references.",
    ],
    sections: [
        {
            heading: "Three ways to write multi-condition logic",
            paragraphs: [
                "Excel offers three tools for \"if this and that, then...\" logic. Nested IFs — =IF(A1>10, IF(B1=\"West\", \"Bonus\", \"No\"), \"No\") — work in every Excel version ever made but become unreadable past two levels. IFS (Excel 2019+/365) flattens the nesting: =IFS(AND(A1>10,B1=\"West\"),\"Bonus\", TRUE, \"No\"). And AND/OR combine conditions inside a single IF, which is the cleanest choice when all conditions must be true (or any one of them).",
                "The generator picks based on your Excel version and the shape of your logic — you describe the rule in words, it chooses the structure. That's the real value: not just a formula, but the right formula shape for your situation.",
            ],
        },
        {
            heading: "Nested IFs: universal but dangerous",
            paragraphs: [
                "Nested IFs are the cockroach of spreadsheet formulas: they survive everywhere, including Excel 2007 files your company will never upgrade. For two conditions they're perfectly fine and everyone can read them. The danger starts at three or four levels, where a missing parenthesis breaks the whole chain and debugging means counting brackets.",
                "The classic nested-IF bug is condition order: =IF(score>90,\"A\",IF(score>80,\"B\",...)) works only because the highest threshold is tested first. Reverse the order and every score above 80 returns \"B\". The generator orders conditions correctly and explains the ordering, which is where hand-written nested IFs most often go wrong.",
            ],
        },
        {
            heading: "IFS: the modern flat alternative",
            paragraphs: [
                "IFS tests conditions in order and returns the result for the first true one: =IFS(A1>90,\"A\", A1>80,\"B\", TRUE,\"F\"). No nesting, no bracket-counting, and the TRUE-at-the-end acts as the \"otherwise\" case. For grading scales, tiered commissions, and status ladders, IFS is dramatically more readable than the nested equivalent.",
                "Two caveats: IFS needs Excel 2019 or Microsoft 365 (it errors on older versions), and it has no built-in \"else\" — you must remember the final TRUE condition or unmatched cases return #N/A. The generator includes the fallback automatically and warns you about the version requirement.",
            ],
        },
        {
            heading: "AND/OR: combining conditions cleanly",
            paragraphs: [
                "When your logic is \"all of these must be true,\" AND inside one IF is cleaner than any nesting: =IF(AND(sales>10000, region=\"West\"), \"Bonus\", \"No bonus\"). OR handles \"any of these\": =IF(OR(status=\"Urgent\", days>30), \"Escalate\", \"Normal\"). You can even nest them — AND(OR(...), ...) — for compound business rules.",
                "A subtle gotcha: AND/OR return TRUE/FALSE, and Excel treats any nonzero number as TRUE in some contexts but not others — don't compare their output with =TRUE text or mix them with string \"TRUE\" values from imported data. The generator's explanation flags these type traps when your description suggests them.",
            ],
        },
        {
            heading: "When IF logic outgrows formulas",
            paragraphs: [
                "There's a point where no IF structure is the right answer: lookup tables. A 12-tier commission schedule written as nested IFs or IFS is a maintenance nightmare; the same logic as a small table plus VLOOKUP or XLOOKUP is self-documenting and editable by non-experts. If your conditions are really \"find the row that matches,\" say so in your description and the generator will suggest the table approach.",
                "Similarly, if the same multi-condition logic repeats across dozens of rows with slight variations, that's a sign the logic belongs in a helper column (one condition per column, then a final simple IF) rather than one mega-formula. Readability is a feature — the next person to touch the sheet will thank you.",
            ],
        },
    ],
    faqs: [
        {
            question: "How many nested IFs can Excel handle?",
            answer: "Excel allows up to 64 nested IFs, but readability collapses around 3–4 levels. Past that, switch to IFS (Excel 2019+) for tiered logic, or better yet a lookup table with VLOOKUP/XLOOKUP — a 12-tier rule as a table is editable by anyone, as nested IFs it's editable by no one.",
        },
        {
            question: "What's the difference between IFS and nested IF?",
            answer: "They compute the same thing; IFS is just flat and readable where nested IF is deeply bracketed. IFS needs Excel 2019 or Microsoft 365, while nested IF works in every version. For shared files on old Excel, nested IF (or a lookup table) is the safe choice.",
        },
        {
            question: "How do I check two conditions in one IF?",
            answer: "Wrap them in AND or OR: =IF(AND(A1>10, B1=\"West\"), \"Yes\", \"No\") requires both; =IF(OR(A1>10, B1=\"West\"), \"Yes\", \"No\") requires either. Describe your rule in plain words and the generator writes the correct combination.",
        },
        {
            question: "Why does my nested IF return the wrong result?",
            answer: "Nine times out of ten it's condition order — a broader condition tested before a narrower one swallows it (e.g. testing >80 before >90). Check that thresholds run from highest to lowest, and that every IF has its FALSE branch where you expect it. Pasting your logic into the generator for a rebuild often surfaces the ordering bug instantly.",
        },
    ],
    related: [
        {
            href: "/tools/excel-formula-bot",
            label: "Excel Formula Bot — generate any formula",
        },
        {
            href: "/tools/excel-formula-bot/vlookup-vs-xlookup-generator/",
            label: "VLOOKUP vs XLOOKUP generator",
        },
        {
            href: "/tools/excel-formula-bot/sumifs-countifs-builder/",
            label: "Build SUMIFS and COUNTIFS formulas",
        },
        {
            href: "/tools/excel-formula-bot/count-unique-values-formula/",
            label: "Count unique values formula",
        },
    ],
};

const countUniqueValuesFormula: LongTailContent = {
    id: "count-unique-values-formula",
    slug: "count-unique-values-formula",
    hubId: "excel-formula-bot",
    href: "/tools/excel-formula-bot/count-unique-values-formula/",
    crumb: "Count Unique Values Formula",
    h1: "Count Unique Values in Excel — Formula Generator",
    subtitle:
        "Count distinct emails, customers, or SKUs without pivot tables. Describe your data and get the right unique-count formula for your Excel version.",
    metaTitle: "Count Unique Values in Excel — Formula Generator Free",
    metaDescription:
        "Generate formulas to count unique values in Excel from plain English. UNIQUE/COUNTA for modern Excel, SUMPRODUCT for older versions — free.",
    keywords: [
        "count unique values excel",
        "count distinct values formula",
        "excel unique count",
        "countif unique values",
    ],
    preset: {
        formulaExample: "Count how many unique email addresses are in column A",
    },
    howTo: [
        "Describe what you're counting in the question box above — edit the example to match your column and data.",
        "Submit and get a working unique-count formula matched to your Excel version, with an explanation.",
        "Copy it into your sheet, point it at your range, and get your distinct count.",
    ],
    sections: [
        {
            heading: "The modern answer: UNIQUE + COUNTA",
            paragraphs: [
                "If you have Microsoft 365 or Excel 2021, counting unique values is a two-function job: =COUNTA(UNIQUE(A2:A1000)). UNIQUE spills the distinct values into a temporary array, COUNTA counts the non-blank entries. It's readable, fast, and handles the common case — unique emails, unique customers, unique order IDs — in one line.",
                "Note the range choice: A2:A1000 excludes the header row, because UNIQUE would otherwise count \"Email Address\" as one of your unique values. And COUNTA (not COUNT) is deliberate — it counts text values like email addresses, where COUNT would return zero.",
            ],
        },
        {
            heading: "The legacy answer: SUMPRODUCT (Excel 2019 and older)",
            paragraphs: [
                "Without dynamic arrays, the classic formula is =SUMPRODUCT(1/COUNTIF(A2:A1000, A2:A1000)). It works by asking, for each value, \"how many times do you appear?\" and adding up the reciprocals — so a value appearing 3 times contributes ⅓ + ⅓ + ⅓ = 1. Clever, correct, and completely unreadable to anyone who didn't write it.",
                "Two warnings: it's slow on large ranges (tens of thousands of rows will lag), and blank cells break it — COUNTIF counts blanks too, producing division-by-zero errors. The generator produces the blank-safe variant when your description mentions empty cells, and tells you honestly when your data is big enough to prefer a pivot table instead.",
            ],
        },
        {
            heading: "Unique vs. distinct: the blank-cell trap",
            paragraphs: [
                "Here's the subtlety that ruins counts: most \"unique\" formulas count a blank cell as a value. If your column has 50 emails and 200 blanks, =COUNTA(UNIQUE(A2:A1000)) returns 51, not 50. Whether that's wrong depends on what you're measuring — but it's wrong often enough to mention.",
                "The fix is filtering blanks first: =COUNTA(UNIQUE(FILTER(A2:A1000, A2:A1000<>\"\"))). Mention empty cells when you describe your data and the generator includes the FILTER wrapper automatically. This is exactly the kind of detail people forget to Google and then debug for an hour.",
            ],
        },
        {
            heading: "Counting uniques with conditions",
            paragraphs: [
                "Real questions are rarely \"how many unique emails\" — they're \"how many unique customers bought in Q1\" or \"how many distinct products did the West region order.\" In modern Excel that's =COUNTA(UNIQUE(FILTER(A2:A1000, B2:B1000=\"Q1\"))) — filter first, then unique, then count. The pattern composes cleanly.",
                "On older Excel this gets painful fast (array SUMPRODUCT with multiple conditions), which is where a pivot table genuinely wins: drag the field to Rows, and the row count is your distinct count. The generator will tell you when your question has outgrown a single formula — that's not a failure, it's the right tool for the job.",
            ],
        },
        {
            heading: "Why not just use Remove Duplicates?",
            paragraphs: [
                "Excel's built-in Remove Duplicates (Data tab) does count uniques — sort of. It destructively deletes rows, which is fine for a one-off cleanup but useless for a living report that needs to recalculate when data changes. A formula keeps counting as new rows arrive; Remove Duplicates is a snapshot.",
                "The middle ground people forget: a pivot table with \"Distinct Count\" (available when data is added to the Data Model) gives you distinct counts that refresh with one click. For dashboards, that's often better than any formula. For a single cell in a report, the formula wins.",
            ],
        },
    ],
    faqs: [
        {
            question: "What's the simplest formula to count unique values?",
            answer: "On Microsoft 365 or Excel 2021: =COUNTA(UNIQUE(A2:A1000)). On Excel 2019 or older: =SUMPRODUCT(1/COUNTIF(A2:A1000,A2:A1000)). Describe your data to the generator and it picks the right one for your version, including blank-cell handling.",
        },
        {
            question: "Why does my unique count include blank cells?",
            answer: "UNIQUE treats blanks as a value, so COUNTA counts them. Wrap the range in FILTER to exclude blanks: =COUNTA(UNIQUE(FILTER(A2:A1000,A2:A1000<>\"\"))). Mention empty cells in your description and the generator adds this automatically.",
        },
        {
            question: "Can I count unique values with a condition, like per region?",
            answer: "Yes — filter first, then count uniques: =COUNTA(UNIQUE(FILTER(emails, regions=\"West\"))). For older Excel without FILTER, a pivot table with Distinct Count is usually the saner path; the generator will say so when it applies.",
        },
        {
            question: "Does COUNTIF count unique values?",
            answer: "Not directly — COUNTIF counts occurrences of one specific value. The SUMPRODUCT(1/COUNTIF(...)) trick inverts those occurrence counts to derive a unique count. It's the standard pre-2021 approach, but UNIQUE/COUNTA replaces it wherever dynamic arrays are available.",
        },
    ],
    related: [
        {
            href: "/tools/excel-formula-bot",
            label: "Excel Formula Bot — generate any formula",
        },
        {
            href: "/tools/excel-formula-bot/sumifs-countifs-builder/",
            label: "Build SUMIFS and COUNTIFS formulas",
        },
        {
            href: "/tools/excel-formula-bot/excel-if-formula-multiple-conditions/",
            label: "IF formulas with multiple conditions",
        },
        {
            href: "/tools/excel-formula-bot/vlookup-vs-xlookup-generator/",
            label: "VLOOKUP vs XLOOKUP generator",
        },
    ],
};

const sumifsCountifsBuilder: LongTailContent = {
    id: "sumifs-countifs-builder",
    slug: "sumifs-countifs-builder",
    hubId: "excel-formula-bot",
    href: "/tools/excel-formula-bot/sumifs-countifs-builder/",
    crumb: "SUMIFS / COUNTIFS Builder",
    h1: "SUMIFS and COUNTIFS Formula Builder",
    subtitle:
        "Sum or count rows matching multiple criteria — no pivot table needed. Describe your conditions and get a working SUMIFS or COUNTIFS formula.",
    metaTitle: "SUMIFS & COUNTIFS Formula Builder — Free AI Tool",
    metaDescription:
        "Build SUMIFS and COUNTIFS formulas from plain English. Multi-criteria sums and counts with correct syntax — free, no signup.",
    keywords: [
        "sumifs formula",
        "countifs formula",
        "sumifs multiple criteria",
        "excel sum if multiple conditions",
    ],
    preset: {
        formulaExample:
            "Sum column C where column A is 'Q1' and column B is 'Online'",
    },
    howTo: [
        "Describe your sum or count in the question box above — edit the example with your columns and criteria.",
        "Submit and get a working SUMIFS or COUNTIFS formula with each argument explained.",
        "Copy it into your spreadsheet and adjust the ranges to your data.",
    ],
    sections: [
        {
            heading: "What SUMIFS and COUNTIFS actually do",
            paragraphs: [
                "SUMIFS adds up numbers only for rows matching all your criteria: =SUMIFS(C2:C1000, A2:A1000, \"Q1\", B2:B1000, \"Online\") sums column C where column A is Q1 AND column B is Online. COUNTIFS is the same shape without a sum range — it counts matching rows: =COUNTIFS(A2:A1000, \"Q1\", B2:B1000, \"Online\").",
                "The mental model: they're a pivot table's sum and count, written as a single cell formula that recalculates live. For dashboards and summary rows, they replace a surprising amount of manual filtering and subtotaling.",
            ],
        },
        {
            heading: "The argument order trap",
            paragraphs: [
                "SUMIFS has a famously confusing signature: the sum range comes FIRST, then pairs of criteria-range and criteria. Its older sibling SUMIF puts the sum range LAST. Mixing them up is the #1 SUMIFS error — =SUMIFS(A2:A100, C2:C100, \">10\") sums the wrong column entirely and looks correct until someone audits the numbers.",
                "COUNTIFS is kinder (no sum range, just criteria pairs), but shares the second classic trap: every criteria range must be the same size and shape. =COUNTIFS(A2:A1000, \"Q1\", B2:B500, \"Online\") fails because the ranges differ — a mistake that's easy to make when columns grow at different rates. The generator keeps ranges aligned and explains each pair.",
            ],
        },
        {
            heading: "Criteria syntax: the part everyone Googles",
            paragraphs: [
                "Text criteria need quotes (\"Online\"), numbers don't (10000), and comparison operators go inside quotes as strings: \">10000\", \"<>West\", \"<=\"&TODAY(). Cell references concatenate with &: \">\"&D1 sums everything above the threshold in D1. Wildcards work too: \"*west*\" matches any text containing \"west\" (case-insensitive).",
                "Dates are the perennial headache: =COUNTIFS(D2:D1000, \">=2026-01-01\") works, but comparing against a date stored as text doesn't — and imported CSVs love storing dates as text. If your date criteria mysteriously match nothing, check with ISTEXT() on the date column. The generator flags this when your description mentions dates.",
            ],
        },
        {
            heading: "OR logic: the thing SUMIFS can't do alone",
            paragraphs: [
                "SUMIFS criteria are always AND — every condition must hold. For OR (\"Q1 or Q2\", \"Online or Retail\"), you add multiple SUMIFS together: =SUMIFS(C:C,A:A,\"Q1\")+SUMIFS(C:C,A:A,\"Q2\"). For many OR values, SUMPRODUCT with an array constant is cleaner: =SUMPRODUCT((A2:A1000={\"Q1\",\"Q2\"})*C2:C1000).",
                "Describe OR conditions in plain words (\"Q1 or Q2\") and the generator writes the correct structure instead of the broken =SUMIFS(...,\"Q1\",\"Q2\") people attempt first. This is one of the highest-value things the tool does — the OR workaround is genuinely non-obvious.",
            ],
        },
        {
            heading: "When to graduate to a pivot table",
            paragraphs: [
                "SUMIFS/COUNTIFS shine for fixed summary cells: \"total Q1 online revenue\" in a dashboard header. They strain when the question is exploratory — \"break revenue down by quarter AND channel AND region\" becomes a grid of a dozen hand-written formulas that break when someone inserts a row.",
                "That's pivot-table territory: drag fields, get every combination, refresh in one click. A good rule: one or two SUMIFS on a dashboard, pivot table for analysis. The generator builds the formula you asked for, but it'll nudge you toward the pivot when your description sounds like a cross-tab report.",
            ],
        },
    ],
    faqs: [
        {
            question: "What's the difference between SUMIF and SUMIFS?",
            answer: "SUMIF handles one condition with the sum range last: =SUMIF(A:A,\"Q1\",C:C). SUMIFS handles many conditions with the sum range first: =SUMIFS(C:C,A:A,\"Q1\",B:B,\"Online\"). Use SUMIFS always — it does everything SUMIF does, and the plural habits transfer to COUNTIFS and AVERAGEIFS.",
        },
        {
            question: "How do I do OR logic in SUMIFS?",
            answer: "SUMIFS is AND-only, so add separate SUMIFS calls: =SUMIFS(C:C,A:A,\"Q1\")+SUMIFS(C:C,A:A,\"Q2\"). For many OR values, =SUMPRODUCT((A2:A1000={\"Q1\",\"Q2\"})*C2:C1000) is cleaner. Describe the OR in words and the generator writes it correctly.",
        },
        {
            question: "Why is my SUMIFS returning 0?",
            answer: "Usual suspects: text-vs-number mismatch (criteria \"10000\" won't match the number 10000 in some locales), dates stored as text, trailing spaces in text criteria (\"Online \" ≠ \"Online\"), or criteria ranges of different sizes. Check ISTEXT()/ISNUMBER() on the column first.",
        },
        {
            question: "Can COUNTIFS count between two dates?",
            answer: "Yes — use two criteria on the same range: =COUNTIFS(D2:D1000,\">=2026-01-01\",D2:D1000,\"<2026-04-01\"). Same-range-twice is the standard pattern for between logic, and it works for numbers too.",
        },
    ],
    related: [
        {
            href: "/tools/excel-formula-bot",
            label: "Excel Formula Bot — generate any formula",
        },
        {
            href: "/tools/excel-formula-bot/count-unique-values-formula/",
            label: "Count unique values formula",
        },
        {
            href: "/tools/excel-formula-bot/excel-if-formula-multiple-conditions/",
            label: "IF formulas with multiple conditions",
        },
        {
            href: "/tools/excel-formula-bot/vlookup-vs-xlookup-generator/",
            label: "VLOOKUP vs XLOOKUP generator",
        },
    ],
};

const googleSheetsFormulaGenerator: LongTailContent = {
    id: "google-sheets-formula-generator",
    slug: "google-sheets-formula-generator",
    hubId: "excel-formula-bot",
    href: "/tools/excel-formula-bot/google-sheets-formula-generator/",
    crumb: "Google Sheets Formula Generator",
    h1: "Google Sheets Formula Generator — Free AI",
    subtitle:
        "Excel formulas don't always translate to Sheets. Get formulas written for Google Sheets — QUERY, ARRAYFORMULA, and the right syntax the first time.",
    metaTitle: "Google Sheets Formula Generator — Free AI | YuliusBox",
    metaDescription:
        "Generate Google Sheets formulas from plain English. Sheets-specific functions (QUERY, ARRAYFORMULA) with correct syntax — free, no signup.",
    keywords: [
        "google sheets formula generator",
        "google sheets query formula",
        "sheets arrayformula",
        "google sheets formula help",
    ],
    preset: {
        platform: "google-sheets",
        formulaExample:
            "Calculate the average of column B where column A contains 'Completed'",
    },
    howTo: [
        "Describe what you need in the question box above — the Google Sheets tab is preselected and the example is editable.",
        "Submit and get a Sheets-native formula (QUERY, ARRAYFORMULA, FILTER where they fit) with an explanation.",
        "Paste it into your sheet — syntax is already adapted for Google Sheets, not Excel.",
    ],
    sections: [
        {
            heading: "Sheets is not Excel with a different logo",
            paragraphs: [
                "Most formulas transfer between Excel and Sheets untouched — SUM, IF, VLOOKUP all work the same. But the differences cluster exactly where they hurt: array behavior, locale separators, and a set of powerful Sheets-only functions (QUERY, ARRAYFORMULA, IMPORTRANGE, GOOGLEFINANCE) with no Excel equivalent. An Excel-trained formula pasted into Sheets fails in confusing ways.",
                "This page preselects the Google Sheets tab, so every formula is generated against Sheets' actual function set and syntax rules — including your locale's argument separators. No more translating Excel answers from forums into something Sheets accepts.",
            ],
        },
        {
            heading: "QUERY: the function that replaces five others",
            paragraphs: [
                "QUERY is Sheets' superpower: =QUERY(A1:D1000, \"select A, avg(B) where C='Completed' group by A\", 1) filters, aggregates, and groups in one readable line using a SQL-like mini-language. The equivalent in Excel needs FILTER plus aggregation plus manual grouping — or a pivot table.",
                "The catch is the query string: column references become letters (A, B, C — not the header names), text values need single quotes inside the double-quoted string, and dates need the date'2026-01-01' literal format. QUERY's error messages are famously unhelpful, so the generator's explanation of each clause is doing real work — it tells you what to tweak when the query misbehaves.",
            ],
        },
        {
            heading: "ARRAYFORMULA and the fill-down problem",
            paragraphs: [
                "In Excel 365, =A2:A100+B2:B100 just spills. In Sheets, the same formula in one cell computes one row — you need =ARRAYFORMULA(A2:A100+B2:B100) to fill the column, or drag the fill handle like it's 2003. ARRAYFORMULA also can't be nested inside some functions, and it breaks inside others (notably QUERY and some IMPORT functions).",
                "The generator knows these rules: it wraps ranges in ARRAYFORMULA where Sheets requires it, warns when a function resists wrapping, and suggests the drag-fill alternative when that's genuinely simpler. Describe \"for every row\" in your words and the Sheets-correct structure comes out.",
            ],
        },
        {
            heading: "IMPORTRANGE, permissions, and cross-sheet workflows",
            paragraphs: [
                "IMPORTRANGE pulls live data from another spreadsheet: =IMPORTRANGE(\"spreadsheet_url\", \"Sheet1!A:D\"). It's the backbone of multi-sheet reporting in Sheets — and it has two quirks the generator handles: the first run in any destination shows a #REF! until you click \"Allow access,\" and the source range must be shared with the viewer's account or the import silently fails.",
                "Combined with QUERY, IMPORTRANGE becomes a lightweight data pipeline: =QUERY(IMPORTRANGE(...), \"select ...\") aggregates another team's sheet without copy-paste. The generator writes the nested form correctly — quotes inside quotes is where hand-written versions usually die — and reminds you about the access grant.",
            ],
        },
        {
            heading: "Locale traps: semicolons and decimal commas",
            paragraphs: [
                "In many European and Latin American locales, Sheets uses semicolons as argument separators and commas as decimal points: =IF(A1>10; \"big\"; \"small\") instead of =IF(A1>10, \"big\", \"small\"). Paste a comma-separated formula from an English tutorial and Sheets throws a parse error that looks like nonsense.",
                "The generator adapts separators to the Sheets locale convention in its explanations, and — more usefully — teaches the pattern: functions are the same, only the punctuation changes. Once you see it, every English-language formula answer becomes translatable in your head.",
            ],
        },
    ],
    faqs: [
        {
            question: "Why does my Excel formula give a parse error in Sheets?",
            answer: "Three usual causes: locale separators (semicolons vs commas), Excel-only functions (XLOOKUP exists in Sheets now, but older Excel functions like AGGREGATE may not), and array syntax differences. The generator's Sheets tab produces native Sheets syntax so you skip the translation step.",
        },
        {
            question: "What is QUERY in Google Sheets?",
            answer: "A function that runs SQL-like queries against a range: =QUERY(A1:D100, \"select A, sum(B) group by A\", 1). It filters, sorts, and aggregates in one formula. Column letters (A, B) replace header names inside the query string, and text values need single quotes.",
        },
        {
            question: "Why is my IMPORTRANGE showing #REF!?",
            answer: "First use in a destination sheet always needs a one-time 'Allow access' click on the #REF! cell. If it persists after allowing, the source spreadsheet isn't shared with your account — IMPORTRANGE can't bypass sharing permissions.",
        },
        {
            question: "Do I need ARRAYFORMULA in Google Sheets?",
            answer: "When you want one formula to compute across a whole column without dragging the fill handle: =ARRAYFORMULA(A2:A100*2). Some functions (like SUM) aggregate without it; others need the wrapper. The generator adds it where Sheets requires it and says so in the explanation.",
        },
    ],
    related: [
        {
            href: "/tools/excel-formula-bot",
            label: "Excel Formula Bot — generate any formula",
        },
        {
            href: "/tools/excel-formula-bot/vlookup-vs-xlookup-generator/",
            label: "VLOOKUP vs XLOOKUP generator",
        },
        {
            href: "/tools/excel-formula-bot/sumifs-countifs-builder/",
            label: "Build SUMIFS and COUNTIFS formulas",
        },
        {
            href: "/tools/audio-to-text/transcribe-meeting-recordings/",
            label: "Transcribe meeting recordings to text",
        },
    ],
};

export const excelFormulaBotPages: LongTailContent[] = [
    vlookupVsXlookupGenerator,
    excelIfFormulaMultipleConditions,
    countUniqueValuesFormula,
    sumifsCountifsBuilder,
    googleSheetsFormulaGenerator,
];
