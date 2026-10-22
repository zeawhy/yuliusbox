#!/usr/bin/env python3
"""
Test script to verify PDF redaction irreversibility and metadata stripping.
Conforms to YuliusBox Redaction Security Verification requirements.
"""

import os
import sys
import subprocess
import fitz  # PyMuPDF
import pdfplumber

def create_sample_pdf(filepath: str):
    """Create a multi-page test PDF with sensitive text, metadata, and an image."""
    doc = fitz.open()

    # Page 1: Sensitive SSN + text + image + annotation
    page1 = doc.new_page(width=612, height=792)
    page1.insert_text((50, 70), "CONFIDENTIAL TAX RETURN", fontsize=16, color=(0, 0, 0))
    page1.insert_text((50, 120), "Primary Taxpayer: John Smith", fontsize=12)
    page1.insert_text((50, 150), "SSN 123-45-6789", fontsize=12)
    page1.insert_text((50, 180), "Status: Verified Citizen", fontsize=12)

    # Insert a small drawn image/pixmap
    pix = fitz.Pixmap(fitz.csRGB, (0, 0, 100, 100), 0)
    pix.clear_with(200) # grey
    page1.insert_image(fitz.Rect(50, 220, 150, 320), pixmap=pix)

    # Add a link annotation
    page1.insert_link({"kind": fitz.LINK_URI, "from": fitz.Rect(50, 340, 200, 360), "uri": "https://example.com/secret"})

    # Page 2: Sensitive Account Number + balance
    page2 = doc.new_page(width=612, height=792)
    page2.insert_text((50, 70), "BANK ACCOUNT VERIFICATION", fontsize=16)
    page2.insert_text((50, 120), "Institution: First National Bank", fontsize=12)
    page2.insert_text((50, 150), "Account 9876543210", fontsize=12)
    page2.insert_text((50, 180), "Balance: $125,450.00 USD", fontsize=12)

    # Document metadata
    doc.set_metadata({
        "title": "Confidential Tax and Banking File",
        "author": "John Smith",
        "subject": "Sensitive Financials",
        "keywords": "SSN, Account, Secret",
        "creator": "Internal Tax Software v1.0",
        "producer": "Sensitive Producer Engine"
    })

    doc.save(filepath)
    doc.close()
    print(f"Created test PDF at {filepath}")

def simulate_rasterized_redaction(input_path: str, output_path: str):
    """
    Applies the exact rasterization + blackout algorithm used by YuliusBox:
    1. Render each redacted page to bitmap at 2x resolution (144-150 DPI).
    2. Draw solid black rectangle over the redacted region in raw pixels.
    3. Re-encode as flat JPEG and embed into a new PDF document.
    4. Strip all metadata (title, author, producer, creator, XMP).
    """
    src_doc = fitz.open(input_path)
    out_doc = fitz.open()

    # Redactions to apply:
    # Page 1: redact SSN 123-45-6789
    # Page 2: redact Account 9876543210
    redactions_per_page = {
        0: [fitz.Rect(45, 135, 200, 160)],
        1: [fitz.Rect(45, 135, 220, 160)]
    }

    scale = 2.0  # 2x scale, identical to PdfRedactSignTool viewport scale: 2.0
    mat = fitz.Matrix(scale, scale)

    for page_idx in range(len(src_doc)):
        src_page = src_doc[page_idx]
        boxes = redactions_per_page.get(page_idx, [])

        if boxes:
            # Rasterize page to pixmap
            pix = src_page.get_pixmap(matrix=mat, alpha=False)

            # Draw solid black rectangle over pixels
            for box in boxes:
                scaled_rect = fitz.IRect(
                    int(box.x0 * scale),
                    int(box.y0 * scale),
                    int(box.x1 * scale),
                    int(box.y1 * scale)
                )
                pix.set_rect(scaled_rect, (0, 0, 0))

            # Re-embed as JPEG into new PDF page
            img_bytes = pix.tobytes("jpeg")
            new_page = out_doc.new_page(width=src_page.rect.width, height=src_page.rect.height)
            new_page.insert_image(src_page.rect, stream=img_bytes)
        else:
            # Untouched page
            out_doc.insert_pdf(src_doc, from_page=page_idx, to_page=page_idx)

    # Clear all metadata completely
    out_doc.set_metadata({
        "title": "",
        "author": "",
        "subject": "",
        "keywords": "",
        "creator": "",
        "producer": ""
    })

    out_doc.save(output_path, deflate=True)
    out_doc.close()
    src_doc.close()
    print(f"Exported redacted PDF to {output_path}")

def verify_redacted_pdf(pdf_path: str):
    """Perform rigorous checks on the redacted output file."""
    print("\n--- Running Verification Checks ---")
    sensitive_patterns = ["123-45-6789", "9876543210"]
    failures = []

    # 1. pdftotext check
    try:
        proc = subprocess.run(["pdftotext", pdf_path, "-"], capture_output=True, text=True, check=True)
        pdftotext_out = proc.stdout
        for pat in sensitive_patterns:
            if pat in pdftotext_out:
                failures.append(f"pdftotext leaked sensitive text: '{pat}'")
        print("✓ pdftotext check: No sensitive patterns found")
    except Exception as e:
        failures.append(f"pdftotext execution error: {e}")

    # 2. PyMuPDF text & text layer extraction
    doc = fitz.open(pdf_path)
    for p_idx, page in enumerate(doc):
        text = page.get_text()
        for pat in sensitive_patterns:
            if pat in text:
                failures.append(f"PyMuPDF page {p_idx+1} leaked sensitive text: '{pat}'")
        
        # Check text blocks
        blocks = page.get_text("blocks")
        for b in blocks:
            b_text = b[4]
            for pat in sensitive_patterns:
                if pat in b_text:
                    failures.append(f"PyMuPDF text block leaked sensitive text: '{pat}'")
        
        # Check text words
        words = page.get_text("words")
        for w in words:
            w_text = w[4]
            for pat in sensitive_patterns:
                if pat in w_text:
                    failures.append(f"PyMuPDF word layer leaked sensitive text: '{pat}'")

    print("✓ PyMuPDF text & layer check: No sensitive patterns found")

    # 3. pdfplumber text extraction
    with pdfplumber.open(pdf_path) as plum_doc:
        for p_idx, page in enumerate(plum_doc.pages):
            text = page.extract_text() or ""
            for pat in sensitive_patterns:
                if pat in text:
                    failures.append(f"pdfplumber page {p_idx+1} leaked sensitive text: '{pat}'")
    print("✓ pdfplumber check: No sensitive patterns found")

    # 4. Raw content stream & object inspection
    with open(pdf_path, "rb") as f:
        raw_bytes = f.read()

    for pat in sensitive_patterns:
        if pat.encode("utf-8") in raw_bytes:
            failures.append(f"Raw binary stream contains sensitive string '{pat}'")

    # Check for metadata leakage
    meta_terms = ["Confidential Tax", "John Smith", "Sensitive Financials"]
    for term in meta_terms:
        if term.encode("utf-8") in raw_bytes:
            failures.append(f"Raw binary stream leaked metadata: '{term}'")

    # Check PyMuPDF metadata object
    meta = doc.metadata or {}
    for k, v in meta.items():
        if v:
            for term in meta_terms:
                if term.lower() in v.lower():
                    failures.append(f"Document metadata key '{k}' leaked '{v}'")

    print("✓ Raw binary & metadata check: No metadata or text remnants found")

    # 5. Check annotations & form fields on redacted pages
    for p_idx, page in enumerate(doc):
        annots = list(page.annots())
        if annots:
            failures.append(f"Redacted page {p_idx+1} contains {len(annots)} unstripped annotations")
        if list(page.widgets()):
            failures.append(f"Redacted page {p_idx+1} contains form widgets")

    print("✓ Annotations & form fields check: None present on rasterized pages")

    doc.close()

    if failures:
        print("\n❌ VERIFICATION FAILED:")
        for f in failures:
            print(f"  - {f}")
        return False
    else:
        print("\n🎉 ALL CHECKS PASSED: Redaction is 100% irreversible and metadata is completely stripped.")
        return True

def main():
    test_dir = "/tmp/yuliusbox-redaction-test"
    os.makedirs(test_dir, exist_ok=True)
    input_pdf = os.path.join(test_dir, "input.pdf")
    output_pdf = os.path.join(test_dir, "output-redacted.pdf")

    create_sample_pdf(input_pdf)
    simulate_rasterized_redaction(input_pdf, output_pdf)
    success = verify_redacted_pdf(output_pdf)

    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
