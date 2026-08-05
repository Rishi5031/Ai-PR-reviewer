from typing import List, Dict, Any

class PromptBuilder:
    @staticmethod
    def build_review_prompt(
        pr_title: str,
        pr_description: str,
        repository_full_name: str,
        changed_files: List[Dict[str, Any]]
    ) -> str:
        """
        Builds the prompt to send to Gemini for the PR review.
        """
        
        prompt = f"""You are a Senior AI Engineer, Backend Architect, and Expert Code Reviewer.
Your task is to review a Pull Request for the repository {repository_full_name}.

## PR Details
**Title**: {pr_title}
**Description**: {pr_description}

## Changed Files and Patches
"""
        for file in changed_files:
            filename = file.get("filename", "Unknown")
            patch = file.get("patch", "No patch available or file too large")
            prompt += f"\n### File: {filename}\n```diff\n{patch}\n```\n"

        prompt += """
## Review Instructions
Review the provided code changes for the following categories:
- Security
- Performance
- Code Quality
- Architecture
- Readability
- Maintainability
- Testing
- Potential Bugs
- Best Practices

You MUST return ONLY valid JSON matching the exact schema below. Do not include any conversational text or markdown blocks outside the JSON.

Expected JSON Schema:
{
  "overall_score": 92, // An integer score out of 100
  "summary": "...", // A summary of the review
  "recommendation": "Approve with Changes", // Recommendation (e.g., Approve, Request Changes, Comment)
  "security": [
    {
      "title": "...",
      "description": "...",
      "severity": "high", // low, medium, high, critical
      "file": "path/to/file.py",
      "line": 42 // integer line number or null if unknown
    }
  ],
  "performance": [],
  "bugs": [],
  "code_quality": [],
  "readability": [],
  "testing": [],
  "best_practices": []
}

Analyze the changes thoroughly and populate the JSON accordingly. If a category has no issues, provide an empty array [].
"""
        return prompt
