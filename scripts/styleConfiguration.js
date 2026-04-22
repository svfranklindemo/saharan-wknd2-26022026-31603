window.styleConfiguration = {
 "metadata": {
    "brandName": "carvelo",
    "version": "1.0.0",
    "language": "en-US",
    "namespace": "brand-concierge"
  },
  "behavior": {
    "multimodalCarousel": {
      "cardClickAction": "openLink"
    },
    "input": {
      "enableVoiceInput": false,
      "disableMultiline": true,
      "showAiChatIcon": {
        "icon": "test"
      }
    },
    "chat": {
      "messageAlignment": "normal",
      "messageWidth": "100%"
    },
    "privacyNotice": {
      "title": "Privacy Notice",
      "text": "Your use of this automated chatbot constitutes your consent that the personal information you provide in the chat session \n      can be collected, used, disclosed, and retained by carvelo and service providers acting on carvelo's behalf \n      in accordance with the carvelo {Privacy Policy}. Please do not provide sensitive personal information \n      (such as financial or health information) in the chatbot.",
      "links": [
        {
          "text": "Privacy Policy",
          "url": "https://www.adobe.com/privacy/policy.html"
        }
      ]
    },
    "meetingForm": {
      "fieldsPerRow": 2,
      "fieldLayoutRules": {
        "textInputs": {
          "allowTwoColumns": true,
          "fieldTypes": [
            "string",
            "email",
            "tel",
            "number"
          ]
        },
        "dropdowns": {
          "allowTwoColumns": false,
          "fieldTypes": [
            "select"
          ],
          "identifyBy": "hasOptions"
        },
        "checkboxes": {
          "allowTwoColumns": false,
          "fieldTypes": [
            "boolean",
            "checkbox"
          ]
        }
      },
      "title": {
        "text": "Schedule meeting",
        "alignment": "left"
      },
      "subtitle": {
        "text": "I'd be happy to help you schedule a meeting! Please fill out the form below, and \n        we'll follow up with a calendar to confirm your day and time.",
        "alignment": "left"
      },
      "buttons": {
        "submit": {
          "text": "Schedule meeting",
          "alignment": "left"
        },
        "cancel": {
          "text": "Cancel",
          "alignment": "left"
        }
      }
    },
    "calendarWidget": {
      "title": {
        "text": "Book a meeting",
        "alignment": "left"
      },
      "subtitle": {
        "text": "Thanks! Here's a calendar where you can choose a time that works best for your schedule:",
        "alignment": "left"
      },
      "postTitle": {
        "text": "Once confirmed, you'll receive a calendar invite with all the details. The specialist will already have this conversation context, \n        so no need to repeat anything. Looking forward to connecting you with the right expert!",
        "alignment": "left"
      },
      "buttons": {
        "confirm": {
          "text": "Schedule a meeting",
          "alignment": "left"
        },
        "cancel": {
          "text": "Cancel",
          "alignment": "left"
        }
      }
    },
    "productCard": {
      "actionButtonSize": "S"
    }
  },
  "disclaimer": {
    "text": "AI responses may be inaccurate. Check answers and sources. {Terms}",
    "links": [
      {
        "text": "Terms",
        "url": "https://www.adobe.com/legal/licenses-terms/adobe-gen-ai-user-guidelines.html"
      }
    ]
  },
  "text": {
    "welcome.heading": "Explore what you can do with carvelo.",
    "welcome.subheading": "Choose an option or tell us what interests you and we'll point you in the right direction.",
    "input.placeholder": "Tell us what you'd like to do or create",
    "input.messageInput.aria": "Message input",
    "input.send.aria": "Send message",
    "input.aiChatIcon.tooltip": "Ask AI",
    "input.mic.aria": "Voice input",
    "card.aria.select": "Select example message",
    "carousel.prev.aria": "Previous cards",
    "carousel.next.aria": "Next cards",
    "scroll.bottom.aria": "Scroll to bottom",
    "error.network": "I'm sorry, I'm having trouble connecting to our services right now.",
    "loading.message": "Generating response from our knowledge base",
    "feedback.dialog.title.positive": "Your feedback is appreciated",
    "feedback.dialog.title.negative": "Your feedback is appreciated",
    "feedback.dialog.question.positive": "What went well? Select all that apply.",
    "feedback.dialog.question.negative": "What went wrong? Select all that apply.",
    "feedback.dialog.notes": "Notes",
    "feedback.dialog.submit": "Submit",
    "feedback.dialog.cancel": "Cancel",
    "feedback.dialog.notes.placeholder": "Additional notes (optional)",
    "feedback.toast.success": "Thank you for the feedback.",
    "feedback.thumbsUp.aria": "Thumbs up",
    "feedback.thumbsDown.aria": "Thumbs down"
  },
  "arrays": {
    "welcome.examples": [
      {
        "text": "Explore our vehicle lineup",
        "image": "https://carvelo.adobedemosystem.com/en/models/media_12fddf2e4fe309d58bebd165ca936d9169fb1df98.png?width=900&format=webply&optimize=medium",
        "backgroundColor": "#3A3A3E"
      },
      {
        "text": "Financing & leasing options",
        "image": "https://carvelo.adobedemosystem.com/en/media_1d6c9b590cebe19daf009f0ae4ccccedb368754a3.png?width=2000&format=webply&optimize=medium",
        "backgroundColor": "#3A3A3E"
      },
      {
        "text": "Schedule a test drive",
        "image": "https://carvelo.adobedemosystem.com/en/models/media_12d5bc10ec95f78c1de050f1aa2e2c70ee2081df8.png?width=900&format=webply&optimize=medium",
        "backgroundColor": "#3A3A3E"
      },
      {
        "text": "Accessories & parts",
        "image": "https://carvelo.adobedemosystem.com/en/accessory/media_15098d07f6b69517f4f9b132a647d651db4a436f4.jpg?width=900&format=webply&optimize=medium",
        "backgroundColor": "#3A3A3E"
      }
    ],
    "feedback.positive.options": [
      "Helpful and relevant recommendations",
      "Clear and easy to understand",
      "Friendly and conversational tone",
      "Visually appealing presentation",
      "Other"
    ],
    "feedback.negative.options": [
      "Not helpful or relevant",
      "Confusing or unclear",
      "Too formal or robotic",
      "Poor visual presentation",
      "Other"
    ]
  },
  "assets": {
    "icons": {
      "company": ""
    }
  },
  "theme": {
    "--welcome-heading-size-desktop": "28px",
    "--welcome-heading-size-mobile": "22px",
    "--welcome-heading-weight": "700",
    "--welcome-heading-text-align": "center",
    "--welcome-subheading-size-desktop": "16px",
    "--welcome-subheading-size-mobile": "14px",
    "--welcome-subheading-text-align": "center",
    "--welcome-padding": "24px",
    "--prompt-suggestion-background": "#F8F8F8",
    "--prompt-suggestion-background-hover": "#E1E1E1",
    "--prompt-suggestion-text-color": "#292929",
    "--prompt-suggestion-border-color": "transparent",
    "--welcome-input-order": "3",
    "--welcome-cards-order": "2",
    "--font-family": "'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif",
    "--color-primary": "#D4622A",
    "--color-text": "#FFFFFF",
    "--line-height-body": "1.75",
    "--main-container-background": "linear-gradient(165deg, #2C2C30 0%, #3D3D42 45%, #2A2A2E 100%)",
    "--card-text-background": "rgba(255, 255, 255, 0.12)",
    "--prompt-suggestion-button-text-color": "#2C2C2C",
    "--input-height": "52px",
    "--input-height-mobile": "52px",
    "--input-border-radius": "26px",
    "--input-border-radius-mobile": "26px",
    "--input-background": "#FFFFFF",
    "--input-outline-color": "#E0E0E0",
    "--input-outline-width": "1px",
    "--input-box-shadow": "0 2px 16px 0 rgba(0, 0, 0, 0.12)",
    "--input-focus-outline-width": "2px",
    "--input-focus-outline-color": "#D4622A",
    "--input-font-size": "15px",
    "--input-text-color": "#2C2C2C",
    "--input-button-height": "36px",
    "--input-button-width": "36px",
    "--submit-button-fill-color": "#FFFFFF",
    "--submit-button-fill-color-disabled": "#B0B0B0",
    "--color-button-submit": "#D4622A",
    "--color-button-submit-hover": "#B8521F",
    "--input-button-border-radius": "50%",
    "--button-disabled-background": "#F0F0F0",
    "--disclaimer-color": "#888888",
    "--disclaimer-font-size": "11px",
    "--disclaimer-font-weight": "400",
    "--message-user-background": "#D4622A",
    "--message-user-text": "#FFFFFF",
    "--message-border-radius": "18px",
    "--message-padding": "12px 18px",
    "--message-concierge-background": "#F5F5F7",
    "--message-concierge-text": "#1C1C1E",
    "--message-max-width": "100%",
    "--chat-interface-max-width": "768px",
    "--message-blocker-height": "105px",
    "--citations-text-font-weight": "600",
    "--citations-desktop-button-font-size": "13px",
    "--citations-text-color": "#D4622A",
    "--feedback-icon-btn-background": "#F5F5F7",
    "--feedback-icon-btn-hover-background": "#EAEAEC",
    "--feedback-icon-btn-size-desktop": "32px",
    "--feedback-container-gap": "6px",
    "--multimodal-card-box-shadow": "0 8px 28px 0 rgba(0, 0, 0, 0.18)",
    "--border-radius-card": "16px",
    "--button-height-s": "32px",
    "--button-primary-background": "#D4622A",
    "--button-primary-text": "#FFFFFF",
    "--button-primary-hover": "#B8521F",
    "--button-secondary-border": "#D4622A",
    "--button-secondary-text": "#D4622A",
    "--button-secondary-hover": "#D4622A",
    "--color-button-secondary-hover-text": "#FFFFFF",
    "--privacy-notice-background": "#F5F5F7",
    "--privacy-notice-padding": "14px 16px",
    "--privacy-notice-text-font-size": "12px",
    "--privacy-notice-title-font-size": "13px",
    "--privacy-notice-text-color": "#555555",
    "--privacy-notice-title-color": "#1C1C1E",
    "--privacy-notice-link-color": "#D4622A",
    "--privacy-notice-border": "1px solid #E8E8E8",
    "--message-concierge-link-decoration": "underline",
    "--message-concierge-link-color": "#D4622A",
    "--welcome-heading-color": "#FFFFFF",
    "--welcome-subheading-color": "rgba(255, 255, 255, 0.88)",
    "--welcome-card-text-color": "#FFFFFF",
    "--sources-text-color": "#D4622A",
    "--sources-icon-color": "#D4622A"
  }
};