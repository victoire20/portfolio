from pathlib import Path

import streamlit as st
from PIL import Image


# --- PATH SETTINGS ---
current_dir = Path(__file__).parent if "__file__" in locals() else Path.cwd()
css_file = current_dir / "styles" / "main.css"
resume_file = current_dir / "assets" / "cv.pdf"
profile_pic = current_dir / "assets" / "profile-pic.png"


# --- GENERAL SETTINGS ---
PAGE_TITLE = "Digital CV | YABA LOUO JEAN DE DIEU"
PAGE_ICON = ":wave:"
NAME = "YABA LOUO JEAN DE DIEU"
DESCRIPTION = """
A web developer with 4 years' experience, I started with PHP and its Laravel framework before 
turning to the Python ecosystem. Today, I work mainly with the FastAPI and Django frameworks to design 
robust APIs and high-performance web applications. Curious, autonomous and solution-oriented, 
I combine technical expertise and practical sense to deliver efficient, well-structured projects.
"""
EMAIL = "gauisyaba@gmail.com"
CONTACT = "+225 0749485326 / +225 0101617238"
SOCIAL_MEDIA = {
    "Youtube": "https://youtube.com/c/codingisfun",
    "LinkedIn": "https://linkedin.com",
    "GitHub": "https://github.com/victoire20",
    "Twitter": "https://twitter.com",
}
PROJECTS = {
    "🏆 Javascript Gaming platform - Platform qui me sert pour des entrainement Javascript": "https://youtub.be/sdfdfsdfdssd",
    "🏆 Telegram Get Subscriber and File - Platform que j'ai fais pour exploiter l'API de telegram": "https://youtub.be/sdfdfsdfdssd",
    "🏆 Mini Task App - Plateforme de mise en relation employer client": "https://youtub.be/sdfdfsdfdssd",
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
    st.write("📞", CONTACT)

# --- SOCIAL LINKS ---
# st.write("#")
# cols = st.columns(len(SOCIAL_MEDIA))
# for index, (platform, link) in enumerate(SOCIAL_MEDIA.items()):
#     cols[index].write(f'[{platform}]({link})')

# --- EXPERIENCE & QUALIFICATIONS ---
st.write("#")
st.subheader("Experience & Qualifications")
st.write(
    """
- ✅ 2 Years experience Django framework to make fullstack application
- ✅ 1 Years experience in API integration with tools that FastAPI and OpenAPI Documentation
- ✅ 1 Years experience with laravel framework to make fullstack and API application
- ✅ 6 month experience with Windev and Windev Mobile (School experience)
"""
)

# -- SKILLS ---
st.write("#")
st.subheader("Hard Skills")
st.write(
    """
- 🧑🏻‍💻 Backend Programming: Python, FastAPI, Django, SQL, PHP, Laravel
- 🧑🏻‍💻 Frontend Programming: HTML, CSS
- 📚 Cross Platform App: Windev, Windev Mobile
- 🛢️ Databases: Postgres, MySQL
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
st.write("💼", "**Web Developer | Double Clic Technologie (Some projects)**")
st.write("12/2020 - Present")
st.write(
    """
- ▶ Design and integration of an inventory management API for a real estate developer in FastAPI
- ▶ Design and integration of Mobile Money API into a FastAPI application
- ▶ Design and integration of an SMS API in a business application 
- ▶ Design of a school card recognition application for a school in FastAPI and jQuery
- ▶ Design of an insurance agency management platform in Django and JQuery
- ▶ Design of an information site (blog) for a regional council in Laravel
"""
)

# --- Projects & Accomplishments ---
# st.write("#")
# st.subheader("Some Personal Projects & Accomplishments")
# st.write("---")
# for project, link in PROJECTS.items():
#     st.write(f"[{project}]({link})")
