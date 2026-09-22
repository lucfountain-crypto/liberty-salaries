#!/usr/bin/env python3
"""
Liberty Towers Monthly Salary Data Generator
--------------------------------------------
Synthesizes market salary benchmarks across sectors and regions,
then updates src/data/salaries.json for deployment.
"""

import json
import os
import sys
from datetime import datetime

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "salaries.json")

def generate_monthly_dataset():
    current_month_year = datetime.now().strftime("%B %Y")
    
    data = {
        "meta": {
            "title": "Liberty Towers Compensation & Market Intelligence",
            "updated_at": current_month_year,
            "version": "1.2.1",
            "total_roles_benchmarked": 47,
            "sectors": [
                "Audit, Governance & Risk",
                "Insurance & Reinsurance",
                "Quant & Quantitative Finance",
                "Investment Banking & Capital Markets",
                "Tech & Software Engineering",
                "Legal, Risk & Compliance",
                "Media, Journalism & Publishing",
                "Property & Real Estate Services",
                "Healthcare & Clinical Medicine",
                "Graduates & Operations"
            ],
            "regions": [
                { "id": "london", "name": "London & Lloyd's Market", "multiplier": 1.0 },
                { "id": "south_east", "name": "South East England", "multiplier": 0.88 },
                { "id": "midlands", "name": "Midlands & Central UK (Birmingham/Nottingham/Northampton)", "multiplier": 0.82 },
                { "id": "north_uk", "name": "North UK (Manchester/Leeds)", "multiplier": 0.80 },
                { "id": "scotland", "name": "Scotland & Regional Hubs", "multiplier": 0.82 },
                { "id": "offshore", "name": "US / Offshore & Remote", "multiplier": 1.25 }
            ]
        },
        "sector_summaries": {
            "Audit, Governance & Risk": {
                "macro_trend": "Demand remains focused on qualified ACA/ACCA candidates, part-qualified trainees, and specialists in financial services, IT audit, cyber, and model risk.",
                "scarcity_index": "Moderate overall; constrained for specialists",
                "hot_roles": ["Internal Auditor", "External Auditor", "Part Qualified Auditor", "IT Auditor", "Audit Manager"]
            },
            "Insurance & Reinsurance": {
                "macro_trend": f"Specialty lines and Lloyd's syndicates see steady base increments in {current_month_year} due to MGA capital growth.",
                "scarcity_index": "High",
                "hot_roles": ["Senior Specialty Underwriter", "Marine & Energy Class Underwriter", "Risk Modeling Actuary"]
            },
            "Quant & Quantitative Finance": {
                "macro_trend": f"Systematic funds driving performance bonuses up across alpha generation and high-frequency execution tiers in {current_month_year}.",
                "scarcity_index": "Critical Scarcity",
                "hot_roles": ["Senior Quant Researcher (Alpha)", "HFT C++ Core Developer", "Quantitative Risk Manager"]
            },
            "Investment Banking & Capital Markets": {
                "macro_trend": "Private equity revival and debt advisory expansion fueling compensation gains across VP and Director tiers.",
                "scarcity_index": "High",
                "hot_roles": ["M&A Vice President", "Debt Capital Markets Associate", "Structured Finance Lead"]
            },
            "Tech & Software Engineering": {
                "macro_trend": "AI infrastructure developers and platform engineering leads command premium packages as firms modernize core systems.",
                "scarcity_index": "High",
                "hot_roles": ["Principal AI Systems Engineer", "Lead DevOps / SRE Engineer", "Staff Full Stack Architect"]
            },
            "Legal, Risk & Compliance": {
                "macro_trend": "FCA regulatory mandates and Consumer Duty phase 2 driving sustained demand for senior compliance leads.",
                "scarcity_index": "Medium-High",
                "hot_roles": ["Head of Regulatory Compliance", "Senior Risk Manager (Market/Credit)", "Corporate Commercial Legal Counsel"]
            },
            "Media, Journalism & Publishing": {
                "macro_trend": "Specialist beats across financial markets, technology policy, and data journalism commanding premiums as digital monetization models evolve.",
                "scarcity_index": "High Scarcity for Specialist Correspondents; High Volume for General News",
                "hot_roles": ["Journalist & Digital Reporter", "City & Financial Correspondent", "News Editor", "Head of Digital Content"]
            },
            "Property & Real Estate Services": {
                "macro_trend": "Prime Central London and regional high-growth hubs driving strong commission upside for high-billing sales and lettings negotiators.",
                "scarcity_index": "High for Proven Top Billers",
                "hot_roles": ["Estate Agent & Property Valuer", "Senior Lettings Negotiator", "Branch Director", "Prime Residential Associate"]
            },
            "Healthcare & Clinical Medicine": {
                "macro_trend": "Severe specialist consultant and registrar shortages across NHS acute trusts and private pediatric clinics sustaining high demand.",
                "scarcity_index": "Critical Scarcity (Specialist GMC Registered Doctors)",
                "hot_roles": ["Paediatrician (Consultant Doctor)", "Specialty Registrar in Paediatrics", "Clinical Lead Paediatrician", "Consultant Neonatologist"]
            },
            "Graduates & Operations": {
                "macro_trend": f"Graduate scheme starting bases in London averaging £45k-£55k in competitive financial firms for {current_month_year}.",
                "scarcity_index": "Medium",
                "hot_roles": ["Graduate Quant Analyst", "Senior Trade Operations Specialist", "Graduate Underwriting Trainee"]
            }
        },
        "roles": [
            {
                "id": "audit-part-qualified",
                "title": "Part Qualified Auditor",
                "sector": "Audit, Governance & Risk",
                "category": "Public Practice & Audit",
                "description": "Delivers audit testing, control evaluations, and statutory reporting support while progressing ACA/ACCA professional qualification.",
                "regional_data": {
                    "london": { "p10": 37500, "p50": 45000, "p90": 52500, "base_pct": 95, "bonus_pct": 5, "demand": "High Demand for Qualified ACA/ACCA Trainees", "yoy": "1–4%" },
                    "south_east": { "p10": 33000, "p50": 39600, "p90": 46200, "base_pct": 95, "bonus_pct": 5, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 30000, "p50": 36000, "p90": 42000, "base_pct": 96, "bonus_pct": 4, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 30750, "p50": 36900, "p90": 43050, "base_pct": 95, "bonus_pct": 5, "demand": "Medium", "yoy": "1–4%" },
                    "offshore": { "p10": 46875, "p50": 56250, "p90": 65625, "base_pct": 90, "bonus_pct": 10, "demand": "High", "yoy": "1–4%" }
                },
                "key_insights": [
                    "London part-qualified external audit ranges approximately £30,000–£42,000 depending on exam passes (ACA/ACCA) and firm size (Big Four / Top 10 vs mid-tier).",
                    "Study support, exam leave packages, and first-time pass bonuses are standard features of competitive offers."
                ]
            },
            {
                "id": "audit-internal",
                "title": "Internal Auditor",
                "sector": "Audit, Governance & Risk",
                "category": "Internal Audit",
                "description": "Reviews internal controls, risk-management processes, financial governance and regulatory compliance. Identifies control weaknesses and recommends practical improvements.",
                "regional_data": {
                    "london": { "p10": 43750, "p50": 62500, "p90": 81250, "base_pct": 90, "bonus_pct": 10, "demand": "Moderate overall; constrained for specialists", "yoy": "1–4%" },
                    "south_east": { "p10": 38500, "p50": 55000, "p90": 71500, "base_pct": 92, "bonus_pct": 8, "demand": "Moderate", "yoy": "1–4%" },
                    "north_uk": { "p10": 35000, "p50": 50000, "p90": 65000, "base_pct": 93, "bonus_pct": 7, "demand": "Moderate", "yoy": "1–4%" },
                    "scotland": { "p10": 36000, "p50": 51250, "p90": 66600, "base_pct": 92, "bonus_pct": 8, "demand": "Moderate", "yoy": "1–4%" },
                    "offshore": { "p10": 54680, "p50": 78125, "p90": 101560, "base_pct": 88, "bonus_pct": 12, "demand": "High", "yoy": "1–4%" }
                },
                "key_insights": [
                    "Candidate availability is moderate overall, although newly qualified auditors and candidates with financial-services, IT audit, cyber, model-risk or regulatory experience remain harder to secure.",
                    "Typical bonuses range from 0–10%, with higher variable compensation possible in specialist financial-services positions."
                ]
            },
            {
                "id": "audit-external",
                "title": "External Auditor",
                "sector": "Audit, Governance & Risk",
                "category": "Public Practice",
                "description": "Delivers statutory financial statement audits, internal control assessments, and regulatory assurance for public practice clients across Big Four, Top 10, and mid-tier firms.",
                "regional_data": {
                    "london": { "p10": 50000, "p50": 66000, "p90": 80000, "base_pct": 92, "bonus_pct": 8, "demand": "High Scarcity (ACA / ACCA Qualified)", "yoy": "1–4%" },
                    "south_east": { "p10": 44000, "p50": 58000, "p90": 70400, "base_pct": 93, "bonus_pct": 7, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 40000, "p50": 52800, "p90": 64000, "base_pct": 94, "bonus_pct": 6, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 41000, "p50": 54000, "p90": 65600, "base_pct": 93, "bonus_pct": 7, "demand": "Medium", "yoy": "1–4%" },
                    "offshore": { "p10": 62500, "p50": 82500, "p90": 100000, "base_pct": 90, "bonus_pct": 10, "demand": "High", "yoy": "1–4%" }
                },
                "key_insights": [
                    "London part-qualified external audit ranges approximately £30,000–£42,000.",
                    "London newly qualified ACA/ACCA external audit averages £51,000–£56,000."
                ]
            },
            {
                "id": "audit-it",
                "title": "IT Auditor",
                "sector": "Audit, Governance & Risk",
                "category": "Technology Audit",
                "description": "Audits technology infrastructure, cyber security governance, cloud controls, and automated application systems.",
                "regional_data": {
                    "london": { "p10": 50000, "p50": 72500, "p90": 93750, "base_pct": 88, "bonus_pct": 12, "demand": "Constrained for IT & Cyber Specialists", "yoy": "1–4%" },
                    "south_east": { "p10": 44000, "p50": 63800, "p90": 82500, "base_pct": 90, "bonus_pct": 10, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 40000, "p50": 58000, "p90": 75000, "base_pct": 90, "bonus_pct": 10, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 41000, "p50": 59450, "p90": 76875, "base_pct": 90, "bonus_pct": 10, "demand": "High", "yoy": "1–4%" },
                    "offshore": { "p10": 62500, "p50": 90625, "p90": 117180, "base_pct": 85, "bonus_pct": 15, "demand": "High", "yoy": "1–4%" }
                },
                "key_insights": [
                    "Specialist skills in IT audit, cyber security, cloud controls, and model risk remain difficult to recruit.",
                    "CISA certification and hands-on cloud control auditing command salary premiums."
                ]
            },
            {
                "id": "audit-manager",
                "title": "Audit Manager",
                "sector": "Audit, Governance & Risk",
                "category": "Audit Management",
                "description": "Leads internal or external audit teams, manages risk reporting, and presents governance recommendations to executive audit committees.",
                "regional_data": {
                    "london": { "p10": 69000, "p50": 80250, "p90": 105000, "base_pct": 85, "bonus_pct": 15, "demand": "High Scarcity (Experienced Managers)", "yoy": "1–4%" },
                    "south_east": { "p10": 60720, "p50": 70620, "p90": 92400, "base_pct": 88, "bonus_pct": 12, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 55200, "p50": 64200, "p90": 84000, "base_pct": 88, "bonus_pct": 12, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 56580, "p50": 65805, "p90": 86100, "base_pct": 88, "bonus_pct": 12, "demand": "Medium", "yoy": "1–4%" },
                    "offshore": { "p10": 86250, "p50": 100310, "p90": 131250, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "1–4%" }
                },
                "key_insights": [
                    "London Internal Audit Manager ranges span £69,000–£80,250 in commercial industry.",
                    "Specialist financial-services Audit Manager roles reach £105,000 base with 15–20% variable bonus."
                ]
            },
            {
                "id": "ins-underwriter-sr",
                "title": "Specialty Underwriter",
                "sector": "Insurance & Reinsurance",
                "category": "Underwriting",
                "description": "Manages specialty portfolio risk, pricing, and broker syndicate relationships in Lloyd's and company markets.",
                "regional_data": {
                    "london": { "p10": 85000, "p50": 135000, "p90": 210000, "base_pct": 75, "bonus_pct": 25, "demand": "High Scarcity", "yoy": "1–4%" },
                    "south_east": { "p10": 75000, "p50": 118000, "p90": 185000, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 68000, "p50": 105000, "p90": 165000, "base_pct": 82, "bonus_pct": 18, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 70000, "p50": 110000, "p90": 170000, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "1–4%" },
                    "offshore": { "p10": 110000, "p50": 175000, "p90": 275000, "base_pct": 70, "bonus_pct": 30, "demand": "High Scarcity", "yoy": "1–4%" }
                },
                "key_insights": [
                    "Lloyd's syndicates expanding energy & cyber risk underwriting teams.",
                    "Retention packages for profitable portfolio managers include deferred bonus matching."
                ]
            },
            {
                "id": "ins-actuary-lead",
                "title": "Risk Modeling & Pricing Actuary",
                "sector": "Insurance & Reinsurance",
                "category": "Actuarial",
                "description": "Develops stochastic risk models, catastrophe pricing frameworks, and capital adequacy reserves.",
                "regional_data": {
                    "london": { "p10": 90000, "p50": 140000, "p90": 220000, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "1–4%" },
                    "south_east": { "p10": 78000, "p50": 122000, "p90": 192000, "base_pct": 82, "bonus_pct": 18, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 72000, "p50": 112000, "p90": 175000, "base_pct": 85, "bonus_pct": 15, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 74000, "p50": 115000, "p90": 180000, "base_pct": 83, "bonus_pct": 17, "demand": "High", "yoy": "1–4%" },
                    "offshore": { "p10": 120000, "p50": 185000, "p90": 290000, "base_pct": 75, "bonus_pct": 25, "demand": "High Scarcity", "yoy": "1–4%" }
                },
                "key_insights": [
                    "IFRS 17 regulatory experience commands a 15% salary premium across insurance hubs.",
                    "Python and machine learning pricing model experience increasingly mandatory."
                ]
            },
            {
                "id": "quant-researcher-sr",
                "title": "Quant Researcher (Alpha Generation)",
                "sector": "Quant & Quantitative Finance",
                "category": "Quantitative Research",
                "description": "Designs high-frequency, statistical arbitrage, or systematic futures trading models for prop shops and hedge funds.",
                "regional_data": {
                    "london": { "p10": 150000, "p50": 250000, "p90": 450000, "base_pct": 45, "bonus_pct": 55, "demand": "Critical Scarcity", "yoy": "5–10%" },
                    "south_east": { "p10": 130000, "p50": 215000, "p90": 380000, "base_pct": 50, "bonus_pct": 50, "demand": "Critical Scarcity", "yoy": "5–10%" },
                    "north_uk": { "p10": 110000, "p50": 185000, "p90": 320000, "base_pct": 55, "bonus_pct": 45, "demand": "High", "yoy": "1–4%" },
                    "scotland": { "p10": 115000, "p50": 190000, "p90": 335000, "base_pct": 52, "bonus_pct": 48, "demand": "High", "yoy": "1–4%" },
                    "offshore": { "p10": 200000, "p50": 350000, "p90": 650000, "base_pct": 40, "bonus_pct": 60, "demand": "Critical Scarcity", "yoy": "5–10%" }
                },
                "key_insights": [
                    "Total compensation regularly doubles via performance bonus pools for top 10% performers.",
                    "Proprietary strategy track records command sign-on buyouts and non-compete guarantees."
                ]
            },
            {
                "id": "quant-dev-cpp",
                "title": "HFT C++ Core Developer",
                "sector": "Quant & Quantitative Finance",
                "category": "Quant Development",
                "description": "Engineers ultra-low latency execution gateways, exchange protocols, and market data feeds.",
                "regional_data": {
                    "london": { "p10": 120000, "p50": 195000, "p90": 320000, "base_pct": 60, "bonus_pct": 40, "demand": "Critical Scarcity", "yoy": "5–10%" },
                    "south_east": { "p10": 105000, "p50": 168000, "p90": 275000, "base_pct": 65, "bonus_pct": 35, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 95000, "p50": 150000, "p90": 245000, "base_pct": 70, "bonus_pct": 30, "demand": "High", "yoy": "1–4%" },
                    "scotland": { "p10": 98000, "p50": 155000, "p90": 255000, "base_pct": 68, "bonus_pct": 32, "demand": "High", "yoy": "1–4%" },
                    "offshore": { "p10": 160000, "p50": 270000, "p90": 450000, "base_pct": 55, "bonus_pct": 45, "demand": "Critical Scarcity", "yoy": "5–10%" }
                },
                "key_insights": [
                    "Kernel bypass (Solarflare/onload) and FPGA programming expertise adds £30k-£50k base premium.",
                    "Direct market access (DMA) protocol experience in demand across Mayfair funds."
                ]
            },
            {
                "id": "ib-vp-ma",
                "title": "M&A Vice President",
                "sector": "Investment Banking & Capital Markets",
                "category": "Corporate Finance",
                "description": "Leads deal execution, valuation modeling, client pitch decks, and deal negotiation for buy-side/sell-side transactions.",
                "regional_data": {
                    "london": { "p10": 140000, "p50": 190000, "p90": 280000, "base_pct": 55, "bonus_pct": 45, "demand": "High", "yoy": "1–4%" },
                    "south_east": { "p10": 120000, "p50": 160000, "p90": 235000, "base_pct": 60, "bonus_pct": 40, "demand": "Medium", "yoy": "1–4%" },
                    "north_uk": { "p10": 105000, "p50": 142000, "p90": 210000, "base_pct": 65, "bonus_pct": 35, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 110000, "p50": 148000, "p90": 218000, "base_pct": 62, "bonus_pct": 38, "demand": "Medium", "yoy": "1–4%" },
                    "offshore": { "p10": 180000, "p50": 260000, "p90": 390000, "base_pct": 50, "bonus_pct": 50, "demand": "High", "yoy": "5–10%" }
                },
                "key_insights": [
                    "Private equity sponsors rebounding deal activity drives advisory fee pools.",
                    "Mid-market boutique advisory firms aggressively poaching VP tier talent."
                ]
            },
            {
                "id": "tech-ai-principal",
                "title": "Principal AI Systems Engineer",
                "sector": "Tech & Software Engineering",
                "category": "Artificial Intelligence",
                "description": "Architects enterprise LLM fine-tuning pipelines, RAG systems, and high-throughput GPU inference infrastructure.",
                "regional_data": {
                    "london": { "p10": 115000, "p50": 175000, "p90": 260000, "base_pct": 70, "bonus_pct": 30, "demand": "Critical Scarcity", "yoy": "5–10%" },
                    "south_east": { "p10": 98000, "p50": 150000, "p90": 225000, "base_pct": 75, "bonus_pct": 25, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 88000, "p50": 135000, "p90": 200000, "base_pct": 78, "bonus_pct": 22, "demand": "High", "yoy": "1–4%" },
                    "scotland": { "p10": 90000, "p50": 138000, "p90": 205000, "base_pct": 76, "bonus_pct": 24, "demand": "High", "yoy": "1–4%" },
                    "offshore": { "p10": 160000, "p50": 250000, "p90": 380000, "base_pct": 65, "bonus_pct": 35, "demand": "Critical Scarcity", "yoy": "5–10%" }
                },
                "key_insights": [
                    "Fintech and insurance institutions establishing dedicated AI innovation hubs in London.",
                    "Hands-on PyTorch, CUDA, and distributed training skills fetch top-band compensation packages."
                ]
            },
            {
                "id": "legal-compliance-head",
                "title": "Head of Regulatory Compliance",
                "sector": "Legal, Risk & Compliance",
                "category": "Compliance",
                "description": "Oversees FCA/PRA compliance frameworks, anti-money laundering (AML), and regulatory policy enforcement.",
                "regional_data": {
                    "london": { "p10": 105000, "p50": 160000, "p90": 230000, "base_pct": 80, "bonus_pct": 20, "demand": "High", "yoy": "1–4%" },
                    "south_east": { "p10": 90000, "p50": 138000, "p90": 198000, "base_pct": 82, "bonus_pct": 18, "demand": "High", "yoy": "1–4%" },
                    "north_uk": { "p10": 82000, "p50": 125000, "p90": 180000, "base_pct": 85, "bonus_pct": 15, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 85000, "p50": 128000, "p90": 185000, "base_pct": 83, "bonus_pct": 17, "demand": "Medium", "yoy": "1–4%" },
                    "offshore": { "p10": 135000, "p50": 210000, "p90": 310000, "base_pct": 75, "bonus_pct": 25, "demand": "High", "yoy": "1–4%" }
                },
                "key_insights": [
                    "FCA Consumer Duty and operational resilience mandates driving senior compliance hiring.",
                    "Dual legal and compliance qualifications attract senior leadership bonuses."
                ]
            },
            {
                "id": "grad-quant-analyst",
                "title": "Graduate Quant Analyst",
                "sector": "Graduates & Operations",
                "category": "Graduate Entry",
                "description": "Entry-level quantitative modeling, backtesting, and market data analysis for STEM top graduates.",
                "regional_data": {
                    "london": { "p10": 55000, "p50": 75000, "p90": 110000, "base_pct": 75, "bonus_pct": 25, "demand": "High", "yoy": "1–4%" },
                    "south_east": { "p10": 48000, "p50": 65000, "p90": 95000, "base_pct": 80, "bonus_pct": 20, "demand": "Medium", "yoy": "1–4%" },
                    "north_uk": { "p10": 42000, "p50": 58000, "p90": 85000, "base_pct": 82, "bonus_pct": 18, "demand": "Medium", "yoy": "1–4%" },
                    "scotland": { "p10": 44000, "p50": 60000, "p90": 88000, "base_pct": 80, "bonus_pct": 20, "demand": "Medium", "yoy": "1–4%" },
                    "offshore": { "p10": 75000, "p50": 105000, "p90": 150000, "base_pct": 70, "bonus_pct": 30, "demand": "High", "yoy": "5–10%" }
                },
                "key_insights": [
                    "Top-tier STEM graduates (Oxbridge, Imperial, Warwick) receiving competitive sign-on bonuses.",
                    "Python proficiency and contest math background highly valued."
                ]
            },
            {
                "id": "media-journalist",
                "title": "Journalist & Digital Reporter",
                "sector": "Media, Journalism & Publishing",
                "category": "Editorial & Publishing",
                "description": "Researches, investigates, writes, and produces breaking news, feature reporting, and multimedia analysis across digital, broadcast, and print platforms.",
                "regional_data": {
                    "london": { "p10": 34000, "p50": 44000, "p90": 62000, "base_pct": 95, "bonus_pct": 5, "demand": "High Competition; Constrained for Specialist Beats (Finance/Tech/Data)", "yoy": "2–4%" },
                    "south_east": { "p10": 29920, "p50": 38720, "p90": 54560, "base_pct": 95, "bonus_pct": 5, "demand": "Moderate", "yoy": "2–4%" },
                    "midlands": { "p10": 27880, "p50": 36080, "p90": 50840, "base_pct": 95, "bonus_pct": 5, "demand": "Moderate", "yoy": "2–4%" },
                    "north_uk": { "p10": 27200, "p50": 35200, "p90": 49600, "base_pct": 96, "bonus_pct": 4, "demand": "Moderate", "yoy": "2–4%" },
                    "scotland": { "p10": 27880, "p50": 36080, "p90": 50840, "base_pct": 95, "bonus_pct": 5, "demand": "Moderate", "yoy": "2–4%" },
                    "offshore": { "p10": 42500, "p50": 55000, "p90": 77500, "base_pct": 92, "bonus_pct": 8, "demand": "High", "yoy": "2–4%" }
                },
                "key_insights": [
                    "London national broadsheets, major broadcasters (BBC, Sky, Reuters), and City publications pay £4,000–£6,000 London weighting over regional newsrooms.",
                    "Specialist domain reporters covering City financial markets, technology policy, or data investigations command £15,000–£30,000 salary premiums."
                ]
            },
            {
                "id": "property-estate-agent",
                "title": "Estate Agent & Property Valuer",
                "sector": "Property & Real Estate Services",
                "category": "Residential & Commercial Property",
                "description": "Manages residential property sales, lettings negotiations, market valuations, vendor onboarding, and property conveyance progression.",
                "regional_data": {
                    "london": { "p10": 30000, "p50": 42000, "p90": 68000, "base_pct": 65, "bonus_pct": 35, "demand": "High Demand for Proven Billing Negotiators", "yoy": "3–6%" },
                    "south_east": { "p10": 26400, "p50": 36960, "p90": 59840, "base_pct": 68, "bonus_pct": 32, "demand": "High", "yoy": "3–6%" },
                    "midlands": { "p10": 24600, "p50": 34440, "p90": 55760, "base_pct": 70, "bonus_pct": 30, "demand": "Medium", "yoy": "3–6%" },
                    "north_uk": { "p10": 24000, "p50": 33600, "p90": 54400, "base_pct": 70, "bonus_pct": 30, "demand": "Medium", "yoy": "3–6%" },
                    "scotland": { "p10": 24600, "p50": 34440, "p90": 55760, "base_pct": 70, "bonus_pct": 30, "demand": "Medium", "yoy": "3–6%" },
                    "offshore": { "p10": 37500, "p50": 52500, "p90": 85000, "base_pct": 60, "bonus_pct": 40, "demand": "High", "yoy": "3–6%" }
                },
                "key_insights": [
                    "Estate agency compensation is heavily commission-geared: basic salaries (£25,000–£45,000) are combined with 25–40%+ variable OTE performance commissions.",
                    "Prime Central London (PCL - Mayfair, Chelsea, Kensington) brokers and branch directors achieve £120,000–£220,000+ total earnings on high-value transaction fee splits."
                ]
            },
            {
                "id": "medical-paediatrician-doctor",
                "title": "Paediatrician (Consultant Doctor)",
                "sector": "Healthcare & Clinical Medicine",
                "category": "Medical & Specialist Practice",
                "description": "Diagnoses, manages, and treats complex medical conditions, acute paediatric emergencies, and child healthcare in NHS Trusts and private clinics.",
                "regional_data": {
                    "london": { "p10": 99500, "p50": 122000, "p90": 165000, "base_pct": 95, "bonus_pct": 5, "demand": "Acute Scarcity (GMC Specialist Register)", "yoy": "3–6% (NHS Pay Review Body)" },
                    "south_east": { "p10": 87560, "p50": 107360, "p90": 145200, "base_pct": 95, "bonus_pct": 5, "demand": "High", "yoy": "3–6%" },
                    "midlands": { "p10": 81590, "p50": 100040, "p90": 135300, "base_pct": 95, "bonus_pct": 5, "demand": "High", "yoy": "3–6%" },
                    "north_uk": { "p10": 79600, "p50": 97600, "p90": 132000, "base_pct": 95, "bonus_pct": 5, "demand": "High", "yoy": "3–6%" },
                    "scotland": { "p10": 81590, "p50": 100040, "p90": 135300, "base_pct": 95, "bonus_pct": 5, "demand": "High", "yoy": "3–6%" },
                    "offshore": { "p10": 124375, "p50": 152500, "p90": 206250, "base_pct": 90, "bonus_pct": 10, "demand": "Critical Scarcity", "yoy": "3–6%" }
                },
                "key_insights": [
                    "Governed by the national NHS Consultant contract (£99,532–£150,569+), with on-call rota banding, EPAs, and Clinical Impact Awards increasing gross NHS remuneration.",
                    "Private practice sessions and Harley Street consulting provide established paediatric consultants with £30,000–£75,000+ supplemental income alongside the NHS defined-benefit pension scheme (~20.6% employer contribution)."
                ]
            },
            {
                "id": "legal-commercial-solicitor",
                "title": "Commercial Solicitor",
                "sector": "Legal, Risk & Compliance",
                "category": "Commercial Legal",
                "description": "Advises on corporate transactions, commercial contracts, IP licensing, and regulatory compliance across in-house and practice teams.",
                "regional_data": {
                    "london": { "p10": 58000, "p50": 75000, "p90": 95000, "base_pct": 88, "bonus_pct": 12, "demand": "High Demand for Experienced Counsel", "yoy": "+3% to +6%" },
                    "south_east": { "p10": 51000, "p50": 66000, "p90": 83500, "base_pct": 90, "bonus_pct": 10, "demand": "High", "yoy": "+3% to +5%" },
                    "midlands": { "p10": 47500, "p50": 61500, "p90": 78000, "base_pct": 90, "bonus_pct": 10, "demand": "Moderate-High", "yoy": "+3% to +5%" },
                    "north_uk": { "p10": 46500, "p50": 60000, "p90": 76000, "base_pct": 90, "bonus_pct": 10, "demand": "Moderate-High", "yoy": "+3% to +5%" },
                    "scotland": { "p10": 47500, "p50": 61500, "p90": 78000, "base_pct": 90, "bonus_pct": 10, "demand": "Moderate", "yoy": "+3% to +5%" },
                    "offshore": { "p10": 72500, "p50": 93750, "p90": 118750, "base_pct": 85, "bonus_pct": 15, "demand": "High", "yoy": "+3% to +6%" }
                },
                "tiers": {
                    "1-3": { "p10": 52000, "p50": 66000, "p90": 85000, "desc": "Junior Solicitor (1–2y PQE); commercial drafting & disclosure" },
                    "3-6": { "p10": 58000, "p50": 75000, "p90": 95000, "desc": "Commercial Solicitor (3–5y PQE); corporate contracts & advisory" },
                    "6-10": { "p10": 85000, "p50": 115000, "p90": 145000, "desc": "Senior Associate / Managing Counsel; high-value deals" },
                    "10+": { "p10": 120000, "p50": 175000, "p90": 260000, "desc": "Partner / General Counsel / Legal Director" }
                },
                "key_insights": [
                    "UK legal remuneration is benchmarked by Post-Qualification Experience (PQE).",
                    "Remuneration varies significantly between regional/in-house practices (£55k–£95k) and City/US elite firms (£110k–£180k+ base)."
                ]
            },
            {
                "id": "tech-software-engineer",
                "title": "Software Engineer",
                "sector": "Tech & Software Engineering",
                "category": "Software Engineering",
                "description": "Designs, develops, and maintains scalable backend services, web applications, microservices APIs, and cloud infrastructure.",
                "regional_data": {
                    "london": { "p10": 55000, "p50": 68000, "p90": 85000, "base_pct": 88, "bonus_pct": 12, "demand": "Strong Demand (Autonomous Mid-Level)", "yoy": "+2% to +5%" },
                    "south_east": { "p10": 48500, "p50": 60000, "p90": 75000, "base_pct": 90, "bonus_pct": 10, "demand": "High", "yoy": "+2% to +4%" },
                    "midlands": { "p10": 45000, "p50": 56000, "p90": 70000, "base_pct": 90, "bonus_pct": 10, "demand": "Steady", "yoy": "+2% to +4%" },
                    "north_uk": { "p10": 44000, "p50": 54500, "p90": 68000, "base_pct": 90, "bonus_pct": 10, "demand": "Steady", "yoy": "+2% to +4%" },
                    "scotland": { "p10": 45000, "p50": 56000, "p90": 70000, "base_pct": 90, "bonus_pct": 10, "demand": "Steady", "yoy": "+2% to +4%" },
                    "offshore": { "p10": 68750, "p50": 85000, "p90": 106250, "base_pct": 85, "bonus_pct": 15, "demand": "High", "yoy": "+3% to +6%" }
                },
                "tiers": {
                    "1-3": { "p10": 38000, "p50": 48000, "p90": 62000, "desc": "Junior Software Engineer; feature delivery and code maintenance" },
                    "3-6": { "p10": 55000, "p50": 68000, "p90": 85500, "desc": "Mid-Level Software Engineer; service design and API architecture" },
                    "6-10": { "p10": 78000, "p50": 98000, "p90": 125000, "desc": "Senior / Lead Software Engineer; distributed systems and tech leadership" },
                    "10+": { "p10": 105000, "p50": 135000, "p90": 175000, "desc": "Principal Engineer / Staff Architect / Engineering Manager" }
                },
                "key_insights": [
                    "Regional tech hubs (Birmingham, Manchester) provide high-calibre engineering talent at 15–20% lower cost baselines than London.",
                    "Specialist cloud, FinTech, and distributed systems experience command a 15–25% premium above general web platforms."
                ]
            },
            {
                "id": "tech-solutions-architect",
                "title": "Solutions Architect",
                "sector": "Tech & Software Engineering",
                "category": "Cloud & Enterprise Architecture",
                "description": "Designs, evaluates, and oversees enterprise IT systems, cloud platforms (AWS/Azure/GCP), microservices architectures, and technical integration roadmaps.",
                "regional_data": {
                    "london": { "p10": 82000, "p50": 110000, "p90": 155000, "base_pct": 85, "bonus_pct": 15, "demand": "High Demand (Senior Technical Architecture)", "yoy": "+4% to +7%" },
                    "south_east": { "p10": 72000, "p50": 96800, "p90": 136400, "base_pct": 88, "bonus_pct": 12, "demand": "High", "yoy": "+3% to +6%" },
                    "midlands": { "p10": 67200, "p50": 90200, "p90": 127100, "base_pct": 90, "bonus_pct": 10, "demand": "Steady", "yoy": "+3% to +5%" },
                    "north_uk": { "p10": 65600, "p50": 88000, "p90": 124000, "base_pct": 90, "bonus_pct": 10, "demand": "Steady", "yoy": "+3% to +5%" },
                    "scotland": { "p10": 67200, "p50": 90200, "p90": 127100, "base_pct": 90, "bonus_pct": 10, "demand": "Steady", "yoy": "+3% to +5%" },
                    "offshore": { "p10": 102500, "p50": 137500, "p90": 193750, "base_pct": 80, "bonus_pct": 20, "demand": "Critical Scarcity", "yoy": "+5% to +8%" }
                },
                "tiers": {
                    "1-3": { "p10": 55000, "p50": 68000, "p90": 82000, "desc": "Associate Solutions Architect; technical discovery, cloud design, and architectural documentation" },
                    "3-6": { "p10": 75000, "p50": 92000, "p90": 118000, "desc": "Solutions Architect; cloud solution design, microservices, and system integrations" },
                    "6-10": { "p10": 100000, "p50": 125000, "p90": 160000, "desc": "Senior Solutions Architect; multi-cloud architecture (AWS/Azure), enterprise platform design, and technical governance" },
                    "10+": { "p10": 130000, "p50": 165000, "p90": 215000, "desc": "Principal / Enterprise Solutions Architect / Chief Architect; enterprise roadmap, board-level technical advisory" }
                },
                "key_insights": [
                    "Solutions Architecture is a senior IT discipline bridging executive business strategy and hands-on engineering delivery.",
                    "AWS Certified Solutions Architect (Professional) or Microsoft Azure Solutions Architect Expert credentials command a 10–20% market premium.",
                    "Enterprise cloud migrations, FinTech scalability, and event-driven architectures sustain strong demand across London and regional UK tech hubs."
                ]
            }
        ]
    }
    data["meta"]["total_roles_benchmarked"] = len(data["roles"])
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully generated salary dataset -> {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_monthly_dataset()
