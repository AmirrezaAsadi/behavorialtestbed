// Simplified scenario templates for security testing using GOMS framework

import { GOMSOperator, GOMSUIElement } from './types';

export interface UIElement {
  element_id: string;
  position: string;
  interaction_type: 'clickable' | 'hoverable' | 'scrollable' | 'input';
  security_level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  system_description: string;
  ui_elements: UIElement[];
  goms_flow: GOMSOperator[];
  tech_stack?: {
    security_features: string[];
    potential_threats: string[];
    stack: string[];
  };
}

// Email Management Template
export const EMAIL_SCENARIO: ScenarioTemplate = {
  id: "email_management",
  name: "Corporate Email Management",
  system_description: "Workplace email application for reading and managing messages",
  
  ui_elements: [
    {
      element_id: "inbox_list",
      position: "left-panel", 
      interaction_type: "clickable",
      security_level: "low",
      description: "List of received emails with sender, subject, time"
    },
    {
      element_id: "message_body",
      position: "main-area",
      interaction_type: "scrollable", 
      security_level: "high",
      description: "Email content with links and attachments"
    },
    {
      element_id: "action_buttons",
      position: "toolbar",
      interaction_type: "clickable",
      security_level: "medium", 
      description: "Reply, Forward, Delete, Mark Spam buttons"
    }
  ],

  goms_flow: [
    {
      id: "email_arrival",
      name: "EMAIL_ARRIVES",
      description: "New email appears in inbox",
      available_actions: ["open_email", "ignore", "quick_delete"],
      next_steps: ["content_review"],
      decision_point: "How to handle new message?",
      ui_context: {
        focused_elements: [
          {
            element_id: "inbox_list",
            position: "left-panel",
            interaction_type: "clickable",
            security_level: "low",
            description: "List of received emails"
          }
        ]
      }
    },
    {
      id: "content_review", 
      name: "REVIEW_CONTENT",
      description: "User reads email content and sender details",
      available_actions: ["reply", "forward", "delete", "mark_spam", "click_links", "download_attachments"],
      next_steps: [],
      decision_point: "What action to take after reading?", 
      ui_context: {
        focused_elements: [
          {
            element_id: "message_body",
            position: "main-area",
            interaction_type: "scrollable",
            security_level: "high",
            description: "Email content with links and attachments"
          },
          {
            element_id: "action_buttons",
            position: "toolbar",
            interaction_type: "clickable",
            security_level: "medium",
            description: "Reply, Forward, Delete, Mark Spam buttons"
          }
        ]
      }
    }
  ],

  tech_stack: {
    security_features: ["SPF validation", "Link scanning", "Attachment analysis"],
    potential_threats: ["Phishing links", "Malicious attachments", "Sender spoofing"],
    stack: ["SMTP", "HTML renderer", "JavaScript"]
  }
};

// Banking App Template
export const BANKING_SCENARIO: ScenarioTemplate = {
  id: "banking_app",
  name: "Mobile Banking Authentication",
  system_description: "Mobile banking application for account access and transactions",
  
  ui_elements: [
    {
      element_id: "login_form",
      position: "center-screen",
      interaction_type: "input",
      security_level: "critical",
      description: "Username and password input fields"
    },
    {
      element_id: "biometric_prompt",
      position: "overlay",
      interaction_type: "clickable",
      security_level: "high",
      description: "Fingerprint or face ID authentication option"
    },
    {
      element_id: "transaction_area",
      position: "main-area",
      interaction_type: "scrollable",
      security_level: "high",
      description: "Account balance and transaction options"
    },
    {
      element_id: "security_warnings",
      position: "top-banner",
      interaction_type: "clickable",
      security_level: "medium",
      description: "Security notifications and alerts"
    }
  ],

  goms_flow: [
    {
      id: "app_launch",
      name: "APP_LAUNCH",
      description: "User opens banking app and sees login screen",
      available_actions: ["enter_credentials", "use_biometric", "forgot_password", "cancel"],
      next_steps: ["credential_verification"],
      decision_point: "How to authenticate?",
      ui_context: {
        focused_elements: [
          {
            element_id: "login_form",
            position: "center-screen",
            interaction_type: "input",
            security_level: "critical",
            description: "Username and password input fields"
          },
          {
            element_id: "biometric_prompt",
            position: "overlay",
            interaction_type: "clickable",
            security_level: "high",
            description: "Biometric authentication option"
          }
        ]
      }
    },
    {
      id: "credential_verification",
      name: "CREDENTIAL_VERIFICATION",
      description: "System processes authentication attempt",
      available_actions: ["proceed_to_account", "retry_login", "contact_support", "enable_notifications"],
      next_steps: ["account_access"],
      decision_point: "Authentication successful - what to do next?",
      ui_context: {
        focused_elements: [
          {
            element_id: "security_warnings",
            position: "top-banner",
            interaction_type: "clickable",
            security_level: "medium",
            description: "Security notifications and alerts"
          }
        ]
      }
    },
    {
      id: "account_access",
      name: "ACCOUNT_ACCESS",
      description: "User views account information and transaction options",
      available_actions: ["check_balance", "transfer_money", "pay_bills", "view_statements", "logout"],
      next_steps: [],
      decision_point: "What banking operation to perform?",
      ui_context: {
        focused_elements: [
          {
            element_id: "transaction_area",
            position: "main-area",
            interaction_type: "scrollable",
            security_level: "high",
            description: "Account balance and transaction options"
          }
        ]
      }
    }
  ],

  tech_stack: {
    security_features: ["2FA", "Biometric authentication", "SSL encryption", "Session timeout"],
    potential_threats: ["Credential theft", "Session hijacking", "Man-in-the-middle", "Malware"],
    stack: ["React Native", "REST API", "OAuth 2.0", "TLS 1.3"]
  }
};

// Social Media Template
export const SOCIAL_MEDIA_SCENARIO: ScenarioTemplate = {
  id: "social_media",
  name: "Social Media Content Interaction",
  system_description: "Social media platform for viewing and interacting with user-generated content",
  
  ui_elements: [
    {
      element_id: "news_feed",
      position: "main-area",
      interaction_type: "scrollable",
      security_level: "medium",
      description: "Stream of posts, images, and videos from connections"
    },
    {
      element_id: "post_actions",
      position: "bottom-post",
      interaction_type: "clickable",
      security_level: "medium",
      description: "Like, Share, Comment, Save buttons"
    },
    {
      element_id: "external_links",
      position: "embedded",
      interaction_type: "clickable",
      security_level: "high",
      description: "Links to external websites within posts"
    },
    {
      element_id: "privacy_settings",
      position: "dropdown-menu",
      interaction_type: "clickable",
      security_level: "critical",
      description: "Post visibility and privacy controls"
    }
  ],

  goms_flow: [
    {
      id: "feed_browsing",
      name: "FEED_BROWSING",
      description: "User scrolls through social media feed",
      available_actions: ["scroll_down", "click_post", "ignore_content", "check_profile"],
      next_steps: ["content_interaction"],
      decision_point: "Which content catches attention?",
      ui_context: {
        focused_elements: [
          {
            element_id: "news_feed",
            position: "main-area",
            interaction_type: "scrollable",
            security_level: "medium",
            description: "Stream of posts and content"
          }
        ]
      }
    },
    {
      id: "content_interaction",
      name: "CONTENT_INTERACTION",
      description: "User engages with specific post or content",
      available_actions: ["like_post", "share_content", "click_external_link", "comment", "report_content"],
      next_steps: ["privacy_decision"],
      decision_point: "How to interact with this content?",
      ui_context: {
        focused_elements: [
          {
            element_id: "post_actions",
            position: "bottom-post",
            interaction_type: "clickable",
            security_level: "medium",
            description: "Interaction buttons"
          },
          {
            element_id: "external_links",
            position: "embedded",
            interaction_type: "clickable",
            security_level: "high",
            description: "External links in content"
          }
        ]
      }
    },
    {
      id: "privacy_decision",
      name: "PRIVACY_DECISION",
      description: "User makes decisions about content visibility and privacy",
      available_actions: ["adjust_privacy", "share_publicly", "share_privately", "save_for_later"],
      next_steps: [],
      decision_point: "What privacy level for this action?",
      ui_context: {
        focused_elements: [
          {
            element_id: "privacy_settings",
            position: "dropdown-menu",
            interaction_type: "clickable",
            security_level: "critical",
            description: "Privacy and visibility controls"
          }
        ]
      }
    }
  ],

  tech_stack: {
    security_features: ["Content moderation", "Privacy controls", "Link verification", "User reporting"],
    potential_threats: ["Malicious links", "Social engineering", "Privacy leaks", "Fake content"],
    stack: ["React", "GraphQL", "CDN", "AI content filters"]
  }
};

// File Sharing Template
export const FILE_SHARING_SCENARIO: ScenarioTemplate = {
  id: "file_sharing",
  name: "Cloud File Sharing System",
  system_description: "Cloud-based file storage and sharing platform for document collaboration",
  
  ui_elements: [
    {
      element_id: "file_browser",
      position: "main-area",
      interaction_type: "clickable",
      security_level: "medium",
      description: "Directory structure with files and folders"
    },
    {
      element_id: "download_button",
      position: "toolbar",
      interaction_type: "clickable",
      security_level: "high",
      description: "File download action button"
    },
    {
      element_id: "sharing_dialog",
      position: "modal",
      interaction_type: "input",
      security_level: "critical",
      description: "Sharing permissions and link generation"
    },
    {
      element_id: "security_scanner",
      position: "side-panel",
      interaction_type: "clickable",
      security_level: "high",
      description: "File security scan results and warnings"
    }
  ],

  goms_flow: [
    {
      id: "file_discovery",
      name: "FILE_DISCOVERY",
      description: "User browses files and identifies target document",
      available_actions: ["browse_folders", "search_files", "sort_by_date", "filter_by_type"],
      next_steps: ["file_evaluation"],
      decision_point: "Which file to access?",
      ui_context: {
        focused_elements: [
          {
            element_id: "file_browser",
            position: "main-area",
            interaction_type: "clickable",
            security_level: "medium",
            description: "File and folder listing"
          }
        ]
      }
    },
    {
      id: "file_evaluation",
      name: "FILE_EVALUATION",
      description: "User evaluates file safety and legitimacy",
      available_actions: ["check_file_details", "scan_for_malware", "verify_sender", "preview_content"],
      next_steps: ["download_decision"],
      decision_point: "Is this file safe to access?",
      ui_context: {
        focused_elements: [
          {
            element_id: "security_scanner",
            position: "side-panel",
            interaction_type: "clickable",
            security_level: "high",
            description: "Security scan results and warnings"
          }
        ]
      }
    },
    {
      id: "download_decision",
      name: "DOWNLOAD_DECISION",
      description: "User decides whether to download or share the file",
      available_actions: ["download_file", "share_with_others", "copy_link", "request_access", "report_suspicious"],
      next_steps: [],
      decision_point: "How to handle this file?",
      ui_context: {
        focused_elements: [
          {
            element_id: "download_button",
            position: "toolbar",
            interaction_type: "clickable",
            security_level: "high",
            description: "Download action button"
          },
          {
            element_id: "sharing_dialog",
            position: "modal",
            interaction_type: "input",
            security_level: "critical",
            description: "Sharing and permissions interface"
          }
        ]
      }
    }
  ],

  tech_stack: {
    security_features: ["Virus scanning", "Access controls", "Audit logging", "Encryption at rest"],
    potential_threats: ["Malware distribution", "Unauthorized access", "Data exfiltration", "Link sharing abuse"],
    stack: ["Next.js", "AWS S3", "Lambda functions", "AES-256 encryption"]
  }
};

// Export all templates
export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  EMAIL_SCENARIO,
  BANKING_SCENARIO,
  SOCIAL_MEDIA_SCENARIO,
  FILE_SHARING_SCENARIO
];

// Helper function to convert template to GOMS flow
export function templateToGOMSFlow(template: ScenarioTemplate): import('./types').GOMSFlow {
  return {
    id: template.id,
    name: template.name,
    description: template.system_description,
    goal: `Navigate and interact with ${template.name.toLowerCase()}`,
    operators: template.goms_flow
  };
}

// Helper function to get template by ID
export function getTemplateById(id: string): ScenarioTemplate | undefined {
  return SCENARIO_TEMPLATES.find(template => template.id === id);
}
