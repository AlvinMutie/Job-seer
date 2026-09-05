import os
import logging
from typing import List, Dict, Any, Tuple
import fitz  # PyMuPDF


class SpatialPdfParser:
    """
    Tier 1 Spatial PDF Coordinate Parser.
    Extracts text using geometric bounding-box coordinates (x0, y0, x1, y1)
    to accurately separate multi-column layouts, sidebars, and headers
    without interleaving lines across columns.
    """

    @classmethod
    def extract_structured_text(cls, file_path: str) -> str:
        """
        Extracts cleanly ordered, column-aware text from a PDF file.
        """
        if not os.path.exists(file_path):
            logging.error(f"File not found: {file_path}")
            return ""

        extracted_pages = []
        try:
            doc = fitz.open(file_path)
            for page_idx, page in enumerate(doc):
                page_text = cls._parse_page_spatially(page)
                if page_text:
                    extracted_pages.append(page_text)
            doc.close()
        except Exception as e:
            logging.error(f"Error in spatial PDF parsing for {file_path}: {e}")
            # Fallback to standard reading if spatial algorithm fails
            try:
                fallback_doc = fitz.open(file_path)
                fallback_text = "\n".join([p.get_text() for p in fallback_doc])
                fallback_doc.close()
                return fallback_text.strip()
            except Exception:
                return ""

        return "\n\n".join(extracted_pages).strip()

    @classmethod
    def _parse_page_spatially(cls, page: fitz.Page) -> str:
        """
        Extracts and sorts blocks on a single page using spatial layout heuristics.
        """
        # 1. Get raw text blocks: (x0, y0, x1, y1, text, block_no, block_type)
        raw_blocks = page.get_text("blocks")
        if not raw_blocks:
            return ""

        # Filter out image blocks (block_type != 0) and whitespace-only text
        text_blocks = []
        for b in raw_blocks:
            if len(b) >= 7 and b[6] == 0:  # block_type == 0 (text)
                text = b[4].strip()
                if text:
                    text_blocks.append({
                        "x0": b[0],
                        "y0": b[1],
                        "x1": b[2],
                        "y1": b[3],
                        "text": text,
                        "height": b[3] - b[1],
                        "width": b[2] - b[0]
                    })

        if not text_blocks:
            return ""

        page_width = page.rect.width

        # 2. Multi-Column / Sidebar Detection
        left_blocks = [b for b in text_blocks if b["x1"] <= (page_width * 0.48)]
        right_blocks = [b for b in text_blocks if b["x0"] >= (page_width * 0.40)]
        spanning_blocks = [b for b in text_blocks if b["x0"] < (page_width * 0.35) and b["x1"] > (page_width * 0.65)]

        is_multi_column = len(left_blocks) >= 2 and len(right_blocks) >= 2

        if is_multi_column:
            # Multi-column layout (e.g. Canva 2-column or sidebar resume)
            # Order: Top spanning header blocks -> Left column (top to bottom) -> Right column (top to bottom) -> Bottom spanning footer blocks
            top_spanning = sorted([b for b in spanning_blocks if b["y0"] < (page.rect.height * 0.25)], key=lambda b: b["y0"])
            bottom_spanning = sorted([b for b in spanning_blocks if b["y0"] >= (page.rect.height * 0.75)], key=lambda b: b["y0"])
            
            middle_left = sorted([b for b in left_blocks if b not in top_spanning and b not in bottom_spanning], key=lambda b: b["y0"])
            middle_right = sorted([b for b in right_blocks if b not in top_spanning and b not in bottom_spanning], key=lambda b: b["y0"])

            classified = set(id(b) for b in (top_spanning + bottom_spanning + middle_left + middle_right))
            remaining = sorted([b for b in text_blocks if id(b) not in classified], key=lambda b: (b["x0"], b["y0"]))

            sorted_blocks = top_spanning + middle_left + middle_right + remaining + bottom_spanning
        else:
            # Single-column layout: sort purely top-to-bottom by vertical y0 coordinate
            sorted_blocks = sorted(text_blocks, key=lambda b: b["y0"])

        # 3. Clean Text Reassembly & Hyphenation Normalization
        cleaned_paragraphs = []
        for b in sorted_blocks:
            paragraph = cls._clean_block_text(b["text"])
            if paragraph:
                cleaned_paragraphs.append(paragraph)

        return "\n\n".join(cleaned_paragraphs)

    @classmethod
    def _clean_block_text(cls, text: str) -> str:
        """
        Normalizes internal line wrapping and joins soft hyphenations.
        """
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if not lines:
            return ""

        cleaned_lines = []
        for line in lines:
            if cleaned_lines and cleaned_lines[-1].endswith("-") and len(cleaned_lines[-1]) > 2 and not cleaned_lines[-1].endswith(" -"):
                # Join hyphenated split words (e.g. "con-", "tainer" -> "container")
                cleaned_lines[-1] = cleaned_lines[-1][:-1] + line
            else:
                cleaned_lines.append(line)

        return "\n".join(cleaned_lines)


spatial_pdf_parser = SpatialPdfParser()
