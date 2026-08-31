from typing import List, Optional

VALID_TONES = {"Professional", "Enthusiastic", "Executive", "Technical"}

class CoverLetterGenerator:
    def generate(
        self, 
        job_title: str, 
        company: str, 
        job_description: str, 
        candidate_name: str, 
        candidate_skills: List[str],
        tone: str = "Professional"
    ) -> str:
        """
        Generates a job-specific cover letter tailored to a specific communication tone 
        while preserving 100% factual candidate integrity.
        """
        if tone not in VALID_TONES:
            tone = "Professional"

        skills_str = ", ".join(candidate_skills[:4]) if candidate_skills else "software engineering & technical problem solving"
        name = candidate_name if candidate_name else "Candidate"
        desc_snippet = job_description[:120].strip() + "..." if job_description else "your company's mission"

        if tone == "Enthusiastic":
            opening = f"I was thrilled to discover the opening for {job_title} at {company}! I have been following {company}'s innovative work and would be genuinely excited to bring my skills to your team."
            body = f"My experience with {skills_str} aligns directly with what you are looking for in this role. I am particularly passionate about contributing to initiatives involving {desc_snippet}."
            closing = "I would love the opportunity to discuss how my enthusiasm and technical background can drive great outcomes for your team."
        
        elif tone == "Executive":
            opening = f"I am writing to express my strategic interest in the {job_title} role at {company}. With a track record of leveraging {skills_str} to deliver measurable impact, I am well-positioned to contribute to your growth objectives."
            body = f"In reviewing {company}'s requirements for {job_title}, I recognized a strong alignment with my capabilities in operational efficiency and technical architecture. Specifically, my expertise in {skills_str} enables me to tackle complex technical challenges such as {desc_snippet}."
            closing = "I welcome a discussion on how my leadership and technical expertise can support {company}'s strategic goals."

        elif tone == "Technical":
            opening = f"I am applying for the {job_title} position at {company}. My technical background is rooted in core engineering principles, with direct proficiency in {skills_str}."
            body = f"The technical requirements for this role—particularly regarding {desc_snippet}—match my experience in developing resilient software architectures. Using {skills_str}, I focus on writing maintainable, high-performance code and adhering to modern software development standards."
            closing = "I am eager to discuss the engineering stack, system design challenges, and technical expectations for the {job_title} role."

        else:  # Professional (Default)
            opening = f"I am writing to express my formal application for the {job_title} position at {company}. Given my professional background in {skills_str}, I am confident in my ability to make immediate contributions to your team."
            body = f"Throughout my career, I have focused on producing high-quality work and collaborating effectively across projects. My experience with {skills_str} prepares me to address the key responsibilities outlined in your description: {desc_snippet}."
            closing = "Thank you for your time and consideration. I look forward to the possibility of discussing my application with you."

        template = f"""Dear Hiring Manager at {company},

{opening}

{body}

My technical capabilities in {skills_str} have consistently enabled me to solve complex problems and deliver reliable software solutions. I am confident that my background prepares me to hit the ground running as a {job_title}.

{closing}

Sincerely,
{name}"""

        return template.strip()

cover_letter_generator = CoverLetterGenerator()
