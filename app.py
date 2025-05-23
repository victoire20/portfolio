from pathlib import Path

import streamlit as st
from PIL import Image


# --- PATH SETTINGS ---
current_dir = Path(__file__).parent if "__file__" in locals() else Path.cwd()
css_file = current_dir / "styles" / "main.css"
resume_file = current_dir / "assets" / "cv.pdf"
profile_pic = current_dir / "assets" / "profile-pic.png"


# --- GENERAL SETTINGS ---
PAGE_TITLE = "Digital CV | Yaba Louo Jean de Dieu"
PAGE_ICON = ":wave:"
NAME = "Yaba Louo Jean de Dieu"
DESCRIPTION = """
Web Developper, assisting enterprises by make digital solution to grow here enterprise
"""
EMAIL = "gauisyaba@gmail.com"
SOCIAL_MEDIA = {
    "Youtube": "https://youtube.com/c/codingisfun",
    "LinkedIn": "https://linkedin.com",
    "GitHub": "https://github.com",
    "Twitter": "https://twitter.com",
}
PROJECTS = {
    "🏆 Sale Dashboard - Comparing sales across three stores": "https://youtub.be/sdfdfsdfdssd",
    "🏆 Income and Expense Tracker - web app with NoSQL database": "https://youtu.be/ddfdfsd",
    "🏆 Desktop Application - Excel2CSV converter with user settings & menubar": "https://youtu.be/dffdfds",
    "🏆 MyToolBelt - Custom MS Excel add-in to combine Python & Excel": "https://youtu.be/dfdsfds",
}
ACADEMIC_PARCOURS = {
    "💼 **Technician Brevet | BTS | 2019-2020**": "",
    "💼 **Certification of CyberSecurity | CSCU | 2018-2019**": "",
    "💼 **Baccalaurea | BAC | 2017-2018**": "",
}

st.set_page_config(page_title=PAGE_TITLE, page_icon=PAGE_ICON)

# --- LOAD CSS, PDF & PROFIL PIC ---
with open(css_file) as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
with open(resume_file, "rb") as pdf_file:
    PDFbyte = pdf_file.read()
profile_pic = Image.open(profile_pic)

# --- HERO SECTION ---
col1, col2 = st.columns(2, gap="small")
with col1:
    st.image(profile_pic, width=230)

with col2:
    st.title(NAME)
    st.write(DESCRIPTION)
    st.download_button(
        label="📄 Download Resume",
        data=PDFbyte,
        file_name=resume_file.name,
        mime="application/octet-stream",
    )
    st.write("📬", EMAIL)


# --- SOCIAL LINKS ---
st.write("#")
cols = st.columns(len(SOCIAL_MEDIA))
for index, (platform, link) in enumerate(SOCIAL_MEDIA.items()):
    cols[index].write(f'[{platform}]({link})')


# --- EXPERIENCE & QUALIFICATIONS ---
st.write("#")
st.subheader("Experience & Qualifications")
st.write(
    """
- ✅ 7 Years experience actionable insights from data
- ✅ strong hands on experience and knowledge in Python and Excel
- ✅ Good understanding of statistical principales and their respective application
- ✅ Excellent team-player and displaying strong sense of initiative on tasks
"""
)


# -- SKILLS ---
st.write("#")
st.subheader("Hard Skills")
st.write(
    """
- 🧑🏻‍💻 Programming: Python (Scikit-learn, Pandas), SQL, VBA
- 📊 Data visualization: PowerBi, MS, Excel, Plotly
- 📚 Modeling: Logistic regression, linear regression, detection trees
- 🛢️ Databases: Postgres, MongoDB, MySQL
"""
)


# --- Academic Parcours ---
st.write("#")
st.subheader("Academic Parcours")
# for parc, link in ACADEMIC_PARCOURS.items():
#     st.write(f"[{parc}]({link})")
st.write(
    """
- 💼 **Technician Brevet | BTS | 2019-2020**
- 💼 **Certification of CyberSecurity | CSCU | 2018-2019**
- 💼 **Baccalaurea | BAC | 2017-2018**
"""
)


# --- WORK HISTORY ---
st.write("#")
st.subheader("Work History")
st.write("---")


# --- Job 1
st.write("💼", "**Senior Data Analyst | Ross Industries**")
st.write("02/2020 - Present")
st.write(
    """
- ▶ Used PowerBi and SQL to redefine and track surrounding marketing initiatives,
and supplied recommendations to boost landing page conversion rate by 38%
- ▶ Led a team of 4 analysts to brainstorm potential marketing and sales improvements,
and implemented A/B tests to generate 15% more client leads
- ▶ Redesigned data model through iterations that improved predictions by 12%
"""
)


# --- Job 2
st.write("💼", "**Senior Data Analyst | Liberty Mutual Insurance**")
st.write("01/2018 - 02/2022")
st.write(
    """
- ▶ Build data models and maps to generate meaningful insights from customer data,
boosting successful sales efforts by 12%
- ▶ Modeled targets likely to renew, and presented analysis to leadership, which led to
a YoY revenue increase of $300k
- ▶ Compiled, studied, and inferred large amounts of data, modeling information to drive
auto policy pricing
"""
)


# --- Job 3
st.write("💼", "**Senior Data Analyst | Chegg**")
st.write("04/2015 - 01/2018")
st.write(
    """
- ▶ Devised KPIs using SQL across company website in collaboration with cross-functional
teams to achieve a 12% jump in organic trafic
- ▶ Analyzed, documented, and reported user survey results to improve customer 
communication processes by 18%
- ▶ Collaborated with analyst team to oversee end-to-end process surrounding customers 
return data
"""
)


# --- Projects & Accomplishments ---
st.write("#")
st.subheader("Projects & Accomplishments")
st.write("---")
for project, link in PROJECTS.items():
    st.write(f"[{project}]({link})")
