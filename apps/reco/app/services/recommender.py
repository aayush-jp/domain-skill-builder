from typing import List, Dict

DOMAIN_TOPIC_ORDER = {
    "data-analyst": ["sql-basics", "python-pandas", "data-visualization", "statistics", "storytelling"],
    "full-stack": ["html-css", "javascript", "react-basics", "node-express", "mongodb"],
    "ai-engineer": ["python-advanced", "linear-algebra", "intro-to-ml", "neural-networks", "nlp-basics"],
}

def get_rule_based_recommendations(domain_slug: str, per_topic_accuracy: Dict[str, float]) -> List[Dict]:
    """
    Generates recommendations based on simple rules.
    1. Prioritize topics with accuracy < 60%.
    2. If all topics are > 60%, suggest the next topic in the learning path.
    """
    recommendations = []
    
    # Rule 1: Find topics with low accuracy for remedial practice.
    for topic_key, accuracy in per_topic_accuracy.items():
        if accuracy < 60:
            recommendations.append({
                "type": "topic",
                "refId": topic_key,
                "reason": f"Low accuracy ({int(accuracy)}%) in '{topic_key}'. Let's review this topic."
            })

    if recommendations:
        return recommendations

    # Rule 2: If no remedial topics, find the next topic to learn.
    domain_topics = DOMAIN_TOPIC_ORDER.get(domain_slug, [])
    if not domain_topics:
        return [] # Domain not found or has no topics

    attempted_topics = set(per_topic_accuracy.keys())
    last_attempted_index = -1

    for i, topic in enumerate(domain_topics):
        if topic in attempted_topics:
            last_attempted_index = i
    
    if last_attempted_index < len(domain_topics) - 1:
        next_topic = domain_topics[last_attempted_index + 1]
        recommendations.append({
            "type": "topic",
            "refId": next_topic,
            "reason": "Great work on the previous topics! The next step is to tackle this."
        })
    else:
        # User has completed all topics
        recommendations.append({
            "type": "quiz",
            "refId": f"{domain_slug}-mastery-quiz", # Placeholder for an advanced quiz
            "reason": "You've mastered the basics! Try a comprehensive mastery quiz."
        })
        
    return recommendations