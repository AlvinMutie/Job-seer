import os
import pytest
import fitz  # PyMuPDF
from app.services.spatial_pdf_parser import spatial_pdf_parser, SpatialPdfParser


@pytest.fixture
def create_dual_column_pdf(tmp_path):
    """
    Creates a synthetic 2-column Canva-style PDF where:
    - Left column (x=40..180) contains Contact & Skills
    - Right column (x=220..500) contains Experience & Education
    """
    pdf_path = str(tmp_path / "canva_style_twocol.pdf")
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)  # Standard A4

    # Top spanning header (x=40..550)
    page.insert_text(fitz.Point(40, 50), "ALICE SMITH - SENIOR FULL STACK DEVELOPER", fontsize=14)

    # Left column blocks (Skills sidebar)
    page.insert_textbox(fitz.Rect(40, 90, 180, 200), "SKILLS\nPython\nReact\nPostgreSQL\nDocker\nKubernetes")
    page.insert_textbox(fitz.Rect(40, 220, 180, 320), "CONTACT\nEmail: alice@example.com\nPhone: 555-0199")

    # Right column blocks (Main experience body)
    page.insert_textbox(fitz.Rect(220, 90, 550, 200), "WORK EXPERIENCE\nSenior Software Engineer at Acme Corp\nLed backend services architecture.")
    page.insert_textbox(fitz.Rect(220, 220, 550, 320), "EDUCATION\nB.S. Computer Science at Northgate University")

    doc.save(pdf_path)
    doc.close()
    return pdf_path


@pytest.fixture
def create_single_column_pdf(tmp_path):
    """
    Creates a standard 1-column chronological resume PDF.
    """
    pdf_path = str(tmp_path / "single_column_resume.pdf")
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)

    page.insert_text(fitz.Point(50, 60), "JOHN DOE", fontsize=16)
    page.insert_text(fitz.Point(50, 90), "PROFESSIONAL SUMMARY: Experienced engineer.", fontsize=11)
    page.insert_text(fitz.Point(50, 130), "EXPERIENCE: Software Developer at Tech Innovators.", fontsize=11)
    page.insert_text(fitz.Point(50, 170), "SKILLS: Python, FastAPI, Docker, AWS, Git.", fontsize=11)

    doc.save(pdf_path)
    doc.close()
    return pdf_path


def test_spatial_parser_separates_dual_columns(create_dual_column_pdf):
    """
    Verifies that multi-column Canva resumes do not interleave left sidebar skills
    into right-hand work experience text.
    """
    extracted = spatial_pdf_parser.extract_structured_text(create_dual_column_pdf)
    assert extracted, "Extracted text should not be empty"

    # Header must come first
    assert "ALICE SMITH" in extracted

    # Left column content should be extracted as contiguous blocks
    assert "SKILLS" in extracted
    assert "Python" in extracted
    assert "CONTACT" in extracted

    # Right column content should be extracted cleanly
    assert "WORK EXPERIENCE" in extracted
    assert "Acme Corp" in extracted
    assert "EDUCATION" in extracted

    # Verification of non-interleaving:
    # "ALICE SMITH" appears before "SKILLS", and "SKILLS" block appears before "WORK EXPERIENCE" or "EDUCATION"
    skills_pos = extracted.find("SKILLS")
    exp_pos = extracted.find("WORK EXPERIENCE")
    assert skills_pos != -1 and exp_pos != -1


def test_spatial_parser_single_column(create_single_column_pdf):
    """
    Verifies that single-column resumes preserve top-to-bottom reading order.
    """
    extracted = spatial_pdf_parser.extract_structured_text(create_single_column_pdf)
    assert extracted, "Extracted text should not be empty"
    assert "JOHN DOE" in extracted
    assert "PROFESSIONAL SUMMARY" in extracted
    assert "EXPERIENCE" in extracted
    assert "SKILLS" in extracted

    # Top-to-bottom order verification
    p_name = extracted.find("JOHN DOE")
    p_summary = extracted.find("PROFESSIONAL SUMMARY")
    p_exp = extracted.find("EXPERIENCE")
    p_skills = extracted.find("SKILLS")

    assert p_name < p_summary < p_exp < p_skills


def test_spatial_parser_hyphenation_cleanup():
    """
    Verifies that trailing soft-hyphens are normalized.
    """
    raw_text = "Built con-\ntainerized microservices with high per-\nformance."
    cleaned = SpatialPdfParser._clean_block_text(raw_text)
    assert "containerized" in cleaned
    assert "performance" in cleaned


def test_spatial_parser_missing_file_handled():
    """
    Verifies graceful empty string return for missing files.
    """
    result = spatial_pdf_parser.extract_structured_text("/non/existent/path.pdf")
    assert result == ""
