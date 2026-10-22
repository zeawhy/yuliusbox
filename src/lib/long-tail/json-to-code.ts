import type { LongTailContent } from "../long-tail-content";

export const jsonToTypescript: LongTailContent = {
    id: "json-to-typescript",
    slug: "json-to-typescript",
    hubId: "json-to-code",
    href: "/tools/json-to-code/json-to-typescript",
    crumb: "JSON to TypeScript",
    h1: "JSON to TypeScript Converter — Interfaces & Type Aliases",
    subtitle:
        "Convert JSON payloads into clean, idiomatic TypeScript interfaces or type aliases with customizable optional fields. Runs 100% locally in your browser.",
    metaTitle: "JSON to TypeScript Converter Online Free | YuliusBox",
    metaDescription:
        "Generate clean TypeScript interfaces and type aliases from JSON. Handles nested objects and optional fields. 100% private in-browser.",
    keywords: [
        "json to typescript",
        "json to ts interface",
        "json to type alias",
        "typescript type generator",
        "convert json to typescript online",
    ],
    howTo: [
        "Paste your raw JSON object or API response into the input code editor on the left.",
        "Select your preferred declaration style: \u201Cinterface\u201D for extensible object shapes, or \u201Ctype alias\u201D for functional types.",
        "Optionally check \u201COptional (?)\u201D if your payload fields may be missing or nullable in production.",
        "Click \u201CConvert\u201D to inspect the generated code, then click \u201CCopy Code\u201D to paste directly into your TypeScript project.",
    ],
    sections: [
        {
            heading: "Interface vs Type Alias in TypeScript: Which should you use?",
            paragraphs: [
                "TypeScript offers two primary ways to define object types: interfaces (interface User { ... }) and type aliases (type User = { ... }). While both behave identically for standard object structures, their ecosystem semantics differ.",
                "Interfaces support declaration merging (multiple declarations of the same interface automatically combine) and OOP extends inheritance, making them standard for public libraries and domain entity models. Type aliases are more flexible, capable of expressing unions (string | number), intersections, tuples, and mapped types. This tool lets you switch between both with a single click.",
            ],
        },
        {
            heading: "Handling optional, missing, and nullable API fields",
            paragraphs: [
                "Real-world backend APIs rarely guarantee that every field will always be present. A user profile might lack a middleName, or an audit record might omit deletedAt until soft deletion occurs.",
                "Enabling the Optional (?) flag appends the ? modifier to all generated properties (e.g. email?: string). This ensures your TypeScript compiler with strictNullChecks enabled will force consumers to handle potential undefined values safely, preventing runtime Cannot read properties of undefined exceptions.",
            ],
        },
        {
            heading: "Decomposing nested JSON objects into clean models",
            paragraphs: [
                "Instead of dumping deeply nested structures into awkward any types, our converter recursively analyzes nested objects and multidimensional arrays. It identifies primitive data types (string, number, boolean) and maintains clean PascalCase naming for nested structures.",
            ],
        },
        {
            heading: "100% in-browser processing for confidential API data",
            paragraphs: [
                "Developer payloads frequently contain confidential schema details, proprietary database field names, or mock production data. Unlike cloud-based converters, YuliusBox parses your JSON completely in your browser's V8/SpiderMonkey engine. You can verify in DevTools that zero bytes are sent across the network.",
            ],
        },
    ],
    faqs: [
        {
            question: "Should I choose TypeScript interface or type alias?",
            answer: "For standard API response objects, either is fine. Use 'interface' if you want declaration merging or OOP class implementation. Use 'type alias' if you prefer functional composition or union types.",
        },
        {
            question: "How does the tool handle nested objects and arrays?",
            answer: "Nested objects are recursively typed with structured indentation. Arrays with uniform elements are typed as T[] (e.g. string[] or number[]), while empty or mixed arrays safely default to any[].",
        },
        {
            question: "What does the 'Optional (?)' toggle do?",
            answer: "It adds a question mark to every property name (e.g. name?: string). This marks fields as optional, helping you satisfy TypeScript strict null-checking when working with partial API responses.",
        },
        {
            question: "Is my JSON data uploaded or stored on your servers?",
            answer: "Never. All JSON parsing and code transformation executes locally in your browser memory using client-side JavaScript. Zero bytes of your data leave your computer.",
        },
    ],
    related: [
        {
            href: "/tools/json-to-code",
            label: "Convert JSON to Go & Dart structs",
        },
        {
            href: "/tools/jwt-decoder",
            label: "Inspect and decode JWT claims",
        },
        {
            href: "/tools/regex-generator",
            label: "Generate regular expressions with AI",
        },
    ],
};

export const jsonToCodePages: LongTailContent[] = [
    jsonToTypescript,
];
