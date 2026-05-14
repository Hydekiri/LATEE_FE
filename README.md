
```
LATEE_FE
└─ FE
   ├─ .env
   ├─ eslint.config.mjs
   ├─ next-env.d.ts
   ├─ next.config.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.mjs
   ├─ PROJECT_STRUCTURE.md
   ├─ public
   │  ├─ file.svg
   │  ├─ globe.svg
   │  ├─ images
   │  │     ├─ VP7.jpeg
   │  │     ├─ VP8.jpeg
   │  │     └─ VP9.jpeg
   │  ├─ next.svg
   │  ├─ vercel.svg
   │  └─ window.svg
   ├─ README.md
   ├─ src
   │  ├─ app
   │  │  ├─ (auth)
   │  │  │  ├─ login
   │  │  │  │  └─ page.tsx
   │  │  │  └─ resgister
   │  │  │     └─ page.tsx
   │  │  ├─ (main)
   │  │  │  ├─ aboutUs
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ assessment
   │  │  │  │  ├─ page.tsx
   │  │  │  │  └─ [id]
   │  │  │  │     ├─ page.tsx
   │  │  │  │     └─ take
   │  │  │  │        └─ page.tsx
   │  │  │  ├─ blog
   │  │  │  │  ├─ page.tsx
   │  │  │  │  └─ [id]
   │  │  │  │     └─ page.tsx
   │  │  │  ├─ home
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ practice
   │  │  │  │  ├─ page.tsx
   │  │  │  │  └─ [id]
   │  │  │  │     ├─ page.tsx
   │  │  │  │     ├─ reasoning
   │  │  │  │     │  └─ page.tsx
   │  │  │  │     └─ take
   │  │  │  │        └─ page.tsx
   │  │  │  └─ progress
   │  │  │     └─ page.tsx
   │  │  ├─ admin
   │  │  │  ├─ layout.tsx
   │  │  │  ├─ page.tsx
   │  │  │  └─ users
   │  │  │     └─ page.tsx
   │  │  ├─ api
   │  │  │  └─ page.tsx
   │  │  ├─ authFilterChain.tsx
   │  │  ├─ expert
   │  │  │  ├─ clinicalcase
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ layout.tsx
   │  │  │  └─ page.tsx
   │  │  ├─ favicon.ico
   │  │  ├─ global-error.tsx
   │  │  ├─ globals.css
   │  │  ├─ layout.tsx
   │  │  ├─ page.tsx
   │  │  └─ test.txt
   │  ├─ assets
   │  │  ├─ fonts
   │  │  │  ├─ Inter-Black.otf
   │  │  │  ├─ Inter-BlackItalic.otf
   │  │  │  ├─ Inter-Bold.otf
   │  │  │  ├─ Inter-BoldItalic.otf
   │  │  │  ├─ Inter-ExtraBold.otf
   │  │  │  ├─ Inter-ExtraBoldItalic.otf
   │  │  │  ├─ Inter-ExtraLight.otf
   │  │  │  ├─ Inter-ExtraLightItalic.otf
   │  │  │  ├─ Inter-Italic.otf
   │  │  │  ├─ Inter-Light.otf
   │  │  │  ├─ Inter-LightItalic.otf
   │  │  │  ├─ Inter-Medium.otf
   │  │  │  ├─ Inter-MediumItalic.otf
   │  │  │  ├─ Inter-Regular.otf
   │  │  │  ├─ Inter-SemiBold.otf
   │  │  │  ├─ Inter-SemiBoldItalic.otf
   │  │  │  ├─ Inter-Thin.otf
   │  │  │  ├─ Inter-ThinItalic.otf
   │  │  │  ├─ Inter-V.ttf
   │  │  │  ├─ Lato-Black.ttf
   │  │  │  ├─ Lato-BlackItalic.ttf
   │  │  │  ├─ Lato-Bold.ttf
   │  │  │  ├─ Lato-BoldItalic.ttf
   │  │  │  ├─ Lato-Hairline.ttf
   │  │  │  ├─ Lato-HairlineItalic.ttf
   │  │  │  ├─ Lato-Heavy.ttf
   │  │  │  ├─ Lato-HeavyItalic.ttf
   │  │  │  ├─ Lato-Italic.ttf
   │  │  │  ├─ Lato-Light.ttf
   │  │  │  ├─ Lato-LightItalic.ttf
   │  │  │  ├─ Lato-Medium.ttf
   │  │  │  ├─ Lato-MediumItalic.ttf
   │  │  │  ├─ Lato-Regular.ttf
   │  │  │  ├─ Lato-Semibold.ttf
   │  │  │  ├─ Lato-SemiboldItalic.ttf
   │  │  │  ├─ Lato-Thin.ttf
   │  │  │  ├─ Lato-ThinItalic.ttf
   │  │  │  ├─ SpaceMono-Regular.ttf
   │  │  │  ├─ tahoma.ttf
   │  │  │  └─ tahomabd.ttf
   │  │  └─ icons
   │  ├─ components
   │  │  ├─ common
   │  │  │  └─ HeroSection.tsx
   │  │  ├─ layout
   │  │  │  ├─ AssessmentNavbar.tsx
   │  │  │  ├─ Footer.tsx
   │  │  │  ├─ footer_vta.jsx
   │  │  │  ├─ herosection.tsx
   │  │  │  ├─ Home_Header.tsx
   │  │  │  ├─ layout.tsx
   │  │  │  ├─ Login_Header.tsx
   │  │  │  ├─ navbarbasicpage.tsx
   │  │  │  ├─ NavLanding.tsx
   │  │  │  ├─ searchbar.tsx
   │  │  │  └─ testimonial.tsx
   │  │  ├─ providers
   │  │  │  └─ providers.tsx
   │  │  └─ ui
   │  │     └─ ui.tsx
   │  ├─ config
   │  │  ├─ env.ts
   │  │  └─ fonts.ts
   │  ├─ data
   │  │  ├─ assessmentData.ts
   │  │  ├─ blogData.ts
   │  │  ├─ mock-dashboard.ts
   │  │  ├─ mockAssessment.ts
   │  │  ├─ mockData.ts
   │  │  └─ patient.ts
   │  ├─ features
   │  │  ├─ admin
   │  │  │  ├─ components
   │  │  │  │  ├─ ActivityCharts.tsx
   │  │  │  │  ├─ KPICard.tsx
   │  │  │  │  ├─ LearnerTable.tsx
   │  │  │  │  ├─ MainAnalytics.tsx
   │  │  │  │  ├─ PartnerSession.tsx
   │  │  │  │  ├─ Sidebar.tsx
   │  │  │  │  └─ Topbar.tsx
   │  │  │  ├─ page.tsx
   │  │  │  └─ types
   │  │  │     └─ index.ts
   │  │  ├─ assessment
   │  │  │  ├─ components
   │  │  │  │  ├─ AssessmentDetail.tsx
   │  │  │  │  ├─ AssessmentList.tsx
   │  │  │  │  ├─ AssessmentOverview.tsx
   │  │  │  │  ├─ ContinueAssessment.tsx
   │  │  │  │  └─ subComponents
   │  │  │  │     ├─ AssessmentCreateForm.tsx
   │  │  │  │     ├─ CaseInfo.tsx
   │  │  │  │     ├─ CaseOverview.tsx
   │  │  │  │     └─ tabs
   │  │  │  │        ├─ AssessmentAbout.tsx
   │  │  │  │        ├─ Evaluation.tsx
   │  │  │  │        ├─ Expert.tsx
   │  │  │  │        ├─ FAQ.tsx
   │  │  │  │        └─ Results.tsx
   │  │  │  ├─ page.tsx
   │  │  │  └─ takeAssessment
   │  │  │     ├─ components
   │  │  │     │  ├─ QuestionCard.tsx
   │  │  │     │  ├─ SidebarOverview.tsx
   │  │  │     │  └─ subComponents
   │  │  │     │     ├─ ActionModal.tsx
   │  │  │     │     ├─ PauseModal.tsx
   │  │  │     │     └─ SubmitModal.tsx
   │  │  │     └─ TakeAssessmentPage.tsx
   │  │  ├─ auth
   │  │  │  ├─ components
   │  │  │  │  ├─ Login_Banner.tsx
   │  │  │  │  └─ Login_Form.tsx
   │  │  │  └─ page.tsx
   │  │  ├─ blog
   │  │  │  ├─ components
   │  │  │  │  ├─ BlogCard.tsx
   │  │  │  │  ├─ BlogList.tsx
   │  │  │  │  ├─ BlogPagination.tsx
   │  │  │  │  └─ BlogSidebar.tsx
   │  │  │  ├─ page.tsx
   │  │  │  └─ types
   │  │  │     └─ index.ts
   │  │  ├─ expert
   │  │  │  ├─ components
   │  │  │  │  ├─ ActivityCharts.tsx
   │  │  │  │  ├─ IssueManagement.tsx
   │  │  │  │  ├─ KPICard.tsx
   │  │  │  │  ├─ LearnerTable.tsx
   │  │  │  │  ├─ MainAnalytics.tsx
   │  │  │  │  ├─ Sidebar.tsx
   │  │  │  │  └─ Topbar.tsx
   │  │  │  ├─ page.tsx
   │  │  │  └─ types
   │  │  │     └─ dashboard.ts
   │  │  ├─ practice
   │  │  │  ├─ components
   │  │  │  │  ├─ Practice_Card.tsx
   │  │  │  │  ├─ Practice_Details.tsx
   │  │  │  │  └─ subComponents
   │  │  │  │     ├─ CaseOverview.tsx
   │  │  │  │     ├─ PatientInfo.tsx
   │  │  │  │     ├─ tabs
   │  │  │  │     │  ├─ AboutPatient.tsx
   │  │  │  │     │  ├─ Evaluation.tsx
   │  │  │  │     │  ├─ Expert.tsx
   │  │  │  │     │  ├─ FAQ.tsx
   │  │  │  │     │  ├─ Results copy.tsx
   │  │  │  │     │  └─ Results.tsx
   │  │  │  │     └─ types
   │  │  │  │        └─ submition.ts
   │  │  │  ├─ page.tsx
   │  │  │  └─ takePractice
   │  │  │     ├─ components
   │  │  │     │  ├─ AiAssistantSidebar.tsx
   │  │  │     │  ├─ ChatArea.tsx
   │  │  │     │  ├─ ChatMessage.tsx
   │  │  │     │  ├─ ConfirmModal.tsx
   │  │  │     │  ├─ Header.tsx
   │  │  │     │  ├─ PatientSidebar.tsx
   │  │  │     │  ├─ ReasoningChat.tsx
   │  │  │     │  ├─ ReasoningPage.tsx
   │  │  │     │  ├─ ReasoningSideBar.tsx
   │  │  │     │  ├─ subComponents
   │  │  │     │  │  └─ NoteChatContainer.tsx
   │  │  │     │  ├─ Submit.tsx
   │  │  │     │  ├─ TakePracticePage.tsx
   │  │  │     │  └─ WarningPanel.tsx
   │  │  │     └─ types
   │  │  │        ├─ index.ts
   │  │  │        └─ note.ts
   │  │  ├─ progress
   │  │  │  ├─ page.tsx
   │  │  │  ├─ progressPage.tsx
   │  │  │  ├─ roadmap.tsx
   │  │  │  └─ roadmapItemPopup.tsx
   │  │  └─ virtual-patient
   │  │     └─ page.tsx
   │  ├─ hooks
   │  │  ├─ dexieConfigurations
   │  │  │  ├─ AIAssistantChatMessages.table.ts
   │  │  │  ├─ ClinicalReasoningChatMessages.table.ts
   │  │  │  ├─ database.ts
   │  │  │  ├─ ValidationNotes.table.ts
   │  │  │  └─ VPChatMessages.table.ts
   │  │  └─ use-media-query.ts
   │  ├─ lib
   │  ├─ services
   │  │  ├─ aiAssistant-service.tsx
   │  │  ├─ assessment-servvice.ts
   │  │  ├─ auth-service.ts
   │  │  ├─ clinical-reasoning-service.ts
   │  │  ├─ patient-servvice.ts
   │  │  ├─ question-validation-service.ts
   │  │  ├─ roadmap-service.tsx
   │  │  ├─ submition-practice-session-ver1.ts
   │  │  ├─ submition-practice-session.ts
   │  │  ├─ user-service.ts
   │  │  └─ validate-question-service.tsx
   │  ├─ types
   │  │  ├─ api.d.ts
   │  │  ├─ assessment.ts
   │  │  ├─ next-auth.d.ts
   │  │  ├─ practice.ts
   │  │  └─ submition.ts
   │  └─ utils
   │     ├─ api-client.ts
   │     └─ cookies.tsx
   └─ tsconfig.json

```