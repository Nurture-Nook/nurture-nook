import sys
import os
from faker import Faker

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import User, Category, ContentWarning
from db import SessionLocal
from dotenv import load_dotenv

load_dotenv()

faker = Faker()
db = SessionLocal()

if db.query(User).count() == 0:
    users = [
        User(
            username=faker.user_name(),
            hashed_pass=faker.password(),
            email=faker.email()
        )
        for _ in range(10)
    ]
    db.add_all(users)
    db.commit()

categories = [
    Category(
        title="Relationship Advice",
        description="Topics about dating, friendships, family dynamics, and other personal relationships."
    ),
    Category(
        title="Mental Health & Wellness",
        description="Discussions about self-care, therapy, stress management, emotional well-being, and mental health resources."
    ),
    Category(
        title="Communication & Conflict Resolution",
        description="Tips on improving communication skills, conflict resolution strategies, and handling tough conversations."
    ),
    Category(
        title="Self-Improvement & Personal Growth",
        description="Content focused on self-reflection, goal-setting, overcoming challenges, and boosting self-esteem."
    ),
    Category(
        title="Life Transitions",
        description="Topics related to major life changes (e.g., moving to a new city, changing careers, grieving a loss)."
    ),
    Category(
        title="Parenting & Family Dynamics",
        description="Advice and stories related to managing family life, parenting, and navigating familial relationships."
    ),
    Category(
        title="Workplace & Career Relationships",
        description="Discussions about managing workplace dynamics, dealing with colleagues, career growth, and work-life balance."
    ),
    Category(
        title="Social Anxiety & Coping Mechanisms",
        description="Topics around social fears, dealing with anxiety in social situations, and managing isolation."
    ),
    Category(
        title="Respect & Consent",
        description="Focus on setting healthy boundaries in various areas of life, including friendships, family, and romantic relationships."
    ),
    Category(
        title="Mindfulness and Meditation",
        description="Content about practicing mindfulness, meditation techniques, and using relaxation methods to improve mental health."
    ),
    Category(
        title="Body Image and Self Acceptance",
        description="Topics surrounding body image issues, self-worth, and embracing self-acceptance and confidence."
    ),
    Category(
        title="Dating and Relationships in the Digital Age",
        description="Guidance on navigating online dating, maintaining healthy relationships in a digital world, and understanding social media's impact on relationships."
    ),
    Category(
        title="Support for Grief & Loss",
        description="Resources and discussions for those coping with the death of a loved one or experiencing significant loss."
    ),
    Category(
        title="Personal Boundaries & Violations",
        description="Addressing violations of personal space, trust, or consent"
    ),
    Category(
        title="Other",
        description="Sharing personal experiences or topics that don't fall under the predefined categories. Unique, niche, or evolving topics related to interpersonal issues. Enables users to suggest new categories that could be added to the app, ensuring that all experiences are respected and included."
    ),
]

content_warnings = [
    ContentWarning(
        title="Mental Health Struggles",
        description="Depression, anxiety, panic attacks, or other mental health crises."
    ),
    ContentWarning(
        title="Abuse",
        description="Emotional, physical, sexual, or psychological abuse in any context."
    ),
    ContentWarning(
        title="Violence",
        description="Physical harm, assault, fighting, or graphic depictions of violence."
    ),
    ContentWarning(
        title="Self-Harm & Suicide",
        description="Self-harm, suicidal ideation, or suicide attempts."
    ),
    ContentWarning(
        title="Trauma",
        description="Past trauma, traumatic events, or PTSD triggers."
    ),
    ContentWarning(
        title="Sensitive Family Issues",
        description="Parental conflicts, childhood abuse, estrangement, or toxic family dynamics."
    ),
    ContentWarning(
        title="Grief & Loss",
        description="Death of loved ones, mourning, or bereavement."
    ),
    ContentWarning(
        title="Body Image & Eating Disorders",
        description="Body image struggles, dieting, or eating disorders."
    ),
    ContentWarning(
        title="Relationship Breakups & Divorce",
        description="Breakups, separation, divorce, or infidelity."
    ),
    ContentWarning(
        title="Toxic Positivity",
        description="Dismissive or overly positive language that invalidates experiences."
    ),
    ContentWarning(
        title="Cyberbullying",
        description="Online harassment, bullying, or cyber-victimization."
    ),
    ContentWarning(
        title="Rape / Sexual Violence",
        description="Sexual assault, rape, harassment, or sexual coercion."
    ),
    ContentWarning(
        title="Substance Use / Addiction",
        description="Substance use, abuse, addiction struggles, or recovery."
    ),
    ContentWarning(
        title="Religion",
        description="Faith, religious practices, or religious conflict."
    ),
    ContentWarning(
        title="Politics",
        description="Sensitive political topics or political conflict."
    ),
    ContentWarning(
        title="Discrimination",
        description="Prejudice or unfair treatment based on identity or background."
    ),
    ContentWarning(
        title="Hate Speech",
        description="Content promoting hatred or violence against specific groups."
    ),
    ContentWarning(
        title="Race & Racism",
        description="Discussions involving racial identity, racism, or race-related trauma."
    ),
    ContentWarning(
        title="Homophobia / Transphobia",
        description="Prejudice, discrimination, or violence against LGBTQ+ people."
    ),
    ContentWarning(
        title="Childbirth & Pregnancy",
        description="Pregnancy, labor, childbirth, or pregnancy loss."
    ),
    ContentWarning(
        title="Stalking / Kidnapping",
        description="Experiences or threats of stalking, abduction, or unlawful confinement."
    ),
    ContentWarning(
        title="Medical Procedures / Injury",
        description="Surgeries, hospitalizations, or descriptions of injury."
    ),
    ContentWarning(
        title="Animal Harm / Death",
        description="Injury to or death of animals, including pets."
    ),
    ContentWarning(
        title="Financial Hardship",
        description="Debt, eviction, bankruptcy, or extreme poverty."
    ),
    ContentWarning(
        title="Legal Trouble",
        description="Arrests, trials, imprisonment, or legal disputes."
    )
]

try:
    for category in categories:
        if not db.query(Category).filter_by(title=category.title).first():
            db.add(category)

    for content_warning in content_warnings:
        if not db.query(ContentWarning).filter_by(title=content_warning.title).first():
            db.add(content_warning)
    print("Database seeded successfully!")
    db.commit()
finally:
    db.close()
