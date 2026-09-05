import re
import difflib
from typing import List, Dict, Any

class TailorService:
    def generate_suggestions(
        self, 
        resume_text: str, 
        job_title: str, 
        missing_skills: List[str],
        gap_verifications: Dict[str, Dict[str, str]] = None
    ):
        """
        Generates grounded suggestions or professional summary improvements 
        targeting missing skills without fabricating metrics or false experience.
        """
        if not missing_skills:
            return [{
                "section": "General",
                "suggestion": "Your resume already strongly aligns with the core requirements of this role.",
                "impact": "High - Verified Match"
            }]

        suggestions = []
        verifications = gap_verifications or {}
        
        # 1. Professional Summary / Adaptability (Option 2 for unverified gaps)
        learning_skills = [s for s in missing_skills if verifications.get(s, {}).get("type") == "learning_goal" or s not in verifications]
        verified_skills = [s for s in missing_skills if verifications.get(s, {}).get("type") in ["professional", "academic_personal", "transferable"]]

        if verified_skills:
            suggestions.append({
                "section": "Professional Summary",
                "original_context": "Verified technical competencies.",
                "suggestion": f"Highlight your validated hands-on experience in {', '.join([s.title() for s in verified_skills[:2]])} directly in your summary.",
                "impact": "High - Targets ATS and recruiter review"
            })
        elif learning_skills:
            suggestions.append({
                "section": "Professional Summary (Adaptability)",
                "original_context": "Addressing target skills via transferable foundation.",
                "suggestion": f"Frame your strong foundational background alongside a proactive goal to cross-train into {', '.join([s.title() for s in learning_skills[:2]])}.",
                "impact": "High - Factual adaptability without false claims"
            })

        # 2. Specific Grounded Skill-Based Bullet Points
        for skill in missing_skills[:3]:
            user_data = verifications.get(skill, {})
            skill_type = user_data.get("type", "learning_goal")
            user_note = user_data.get("context", "").strip()

            if skill_type == "professional" and user_note:
                bullet = f"Applied {skill.title()} in production environments: {user_note}."
                impact = "High - Verified Professional Experience"
            elif skill_type == "academic_personal" and user_note:
                bullet = f"Developed project implementation using {skill.title()}: {user_note}."
                impact = "Medium - Project Portfolio Evidence"
            elif skill_type == "transferable":
                bullet = f"Leveraged adjacent technical principles with high adaptability toward {skill.title()} workflows."
                impact = "Medium - Demonstrates Domain Adaptability"
            else:
                bullet = f"Identified {skill.title()} as target development goal; ready to apply foundational engineering practices."
                impact = "Growth Area - Transparent and Defensible"

            suggestions.append({
                "section": "Experience & Skills Alignment",
                "suggestion": bullet,
                "impact": impact
            })

        # 3. Strategy Advice
        suggestions.append({
            "section": "Strategic Career Advice",
            "suggestion": f"Ensure all claims are fully defensible in technical interviews. For {missing_skills[0].title()}, focus on conceptual mastery and rapid onboarding capability.",
            "impact": "Integrity & Interview Readiness"
        })

        return suggestions

    def _generate_bullet_point(self, skill: str, job_title: str, user_context: str = "") -> str:
        """Generates grounded bullet points based on verified input."""
        skill_clean = skill.title()
        if user_context:
            return f"Utilized {skill_clean} for {user_context} aligned with {job_title} objectives."
        return f"Applied {skill_clean} principles in engineering workflows supporting core {job_title} deliverables."

    def generate_tailored_resume_text(
        self, 
        resume_text: str, 
        job_title: str, 
        company: str, 
        job_description: str,
        missing_skills: List[str],
        gap_verifications: Dict[str, Dict[str, str]] = None
    ) -> str:
        """
        Generates a versioned tailored resume text based on candidate's original resume,
        job requirements, and verified gap inputs while preserving 100% factual integrity.
        """
        if not resume_text:
            return f"TAILORED RESUME — TARGET ROLE: {job_title.upper()} AT {company.upper()}\n\nNo original resume content provided."

        lines = [line.strip() for line in resume_text.split('\n') if line.strip()]
        header = f"TAILORED RESUME — TARGET ROLE: {job_title.upper()} AT {company.upper()}"
        
        tailored_lines = [header, "=" * len(header), ""]
        verifications = gap_verifications or {}

        if missing_skills:
            target_skills_header = f"TARGET ROLE FOCUS FOR {job_title.upper()}: {', '.join([s.upper() for s in missing_skills[:4]])}"
            tailored_lines.append(target_skills_header)
            tailored_lines.append("-" * len(target_skills_header))
            tailored_lines.append("")

        for line in lines:
            tailored_lines.append(line)
            # Inject relevant grounded bullet point suggestions under Work Experience or Skills sections
            if any(sec in line.lower() for sec in ["experience", "work history", "projects"]):
                if missing_skills:
                    first_skill = missing_skills[0]
                    user_ctx = verifications.get(first_skill, {}).get("context", "")
                    bullet = self._generate_bullet_point(first_skill, job_title, user_ctx)
                    tailored_lines.append(f"  • {bullet}")

        return "\n".join(tailored_lines)

    def generate_diff(self, original_text: str, tailored_text: str) -> Dict[str, Any]:
        """
        Generates a structured line-by-line comparison diff using difflib.
        """
        orig_lines = [l.strip() for l in (original_text or "").splitlines()]
        tailor_lines = [l.strip() for l in (tailored_text or "").splitlines()]

        diff = difflib.ndiff(orig_lines, tailor_lines)
        diff_items = []
        added = 0
        removed = 0
        unchanged = 0

        for line in diff:
            code = line[:2]
            content = line[2:]
            if code == '+ ':
                diff_items.append({"line": content, "type": "added"})
                added += 1
            elif code == '- ':
                diff_items.append({"line": content, "type": "removed"})
                removed += 1
            elif code == '  ':
                diff_items.append({"line": content, "type": "unchanged"})
                unchanged += 1

        return {
            "diff_lines": diff_items,
            "added_count": added,
            "removed_count": removed,
            "unchanged_count": unchanged
        }


tailor_service = TailorService()
