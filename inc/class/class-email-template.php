<?php

namespace ASTRALAB;

class Email_Template {
	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Email template image URLs
	 */
	private const EMAIL_LOGO_URL = ASTRALAB_DIR_URI . '/assets/images/astralab-email-logo.png';
	private const EMAIL_FOOTER_LOGO_URL = ASTRALAB_DIR_URI . '/assets/images/astralab-email-footer-logo.png';

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Class Constructor.
	 */
	private function __construct() {
		// Private constructor to prevent direct instantiation
	}

	/**
	 * Get the base email template HTML structure
	 * 
	 * @return string Base HTML template
	 */
	private function get_base_template(): string {
		return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s</title>
    <style>
        @import url(\'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500&display=swap\');
        body {
            font-family: \'Rajdhani\', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            margin-bottom: 40px;
        }
        .logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
            margin-left: auto;
            margin-right: auto;
            width: 120px;
        }
        .content {
            padding: 20px 0;
        }
        .login-box {
            border: 1px solid #ddd;
            padding: 20px;
            margin: 20px 0;
        }
        .login-info {
            margin-bottom: 15px;
        }
        .button {
            background-color: #f8f384;
            padding: 6px 20px;
            text-align: center;
            text-decoration: none;
            display: block;
            font-size: 16px;
            margin: 20px auto;
            width: 100px;
            color: #333333;
            border-radius: 3px;
        }
        .security-note {
            text-align: center;
            margin-bottom: 40px;
        }
        .help-section {
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
            margin-top: 20px;
        }
        .footer-logo {
            margin-bottom: 15px;
        }
        .disclaimer {
            font-size: 10px;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo"><img src="' . self::EMAIL_LOGO_URL . '" alt="Astra Lab Logo"></div>
            <h1>%s</h1>
        </div>
        
        <div class="content">
            %s
        </div>
        
        <div class="footer">
            <div class="footer-logo"><img src="' . self::EMAIL_FOOTER_LOGO_URL . '" alt="Astra Lab Logo"></div>
            <div class="disclaimer">
                %s
            </div>
        </div>
    </div>
</body>
</html>';
	}

	/**
	 * Get the welcome email template
	 * 
	 * @param array $data Template data
	 * @return string Formatted HTML email
	 */
	public function get_welcome_email( array $data ): string {
		$content = sprintf(
			'<p><strong>DEAR %s,</strong></p>
            <p>We\'re thrilled to have you as our newest partner.</p>
            
            <div class="login-box">
                <h3 style="margin-top: 0;">LOG IN INFO</h3>
                <div class="login-info">
                    <strong>USER NAME: </strong>%s<br>
                    <strong>PASSWORD: </strong>%s
                </div>
            </div>

            <p style="text-align: center;">Please click the button to login:</p>
            <a href="%s" class="button">LOG IN</a>
            
            <p class="security-note">For security, we encourage you to <a href="%s">create a new password</a>.</p>
        
            <div class="help-section">
                <h3>NEED HELP?</h3>
                <p>Contact us at: <a href="mailto:help@astralab.ai">help@astralab.ai</a></p>
                
                <p>Get started by logging in, exploring our data forms, and placing your first click-pay-ship order.<br>
                If you have any questions or need assistance, don\'t hesitate to reach out.</p>
                
                <p>Best regards,<br>
                The Astra Lab Team</p>
            </div>',
			$data['display_name'] ?: $data['user_login'],
			$data['user_login'],
			$data['password'],
			$data['login_url'],
			$data['reset_link']
		);

		return sprintf(
			$this->get_base_template(),
			'Welcome to Astra Lab!',
			'WELCOME TO ASTRA LAB!',
			$content,
			'This is an automated message. Please do not reply directly to this email.<br>
            For support, use the contact information provided above.'
		);
	}

	/**
	 * Get a custom email template
	 * 
	 * @param string $title Email title
	 * @param string $header Header text
	 * @param string $content Main content
	 * @param string $disclaimer Disclaimer text
	 * @return string Formatted HTML email
	 */
	public function get_custom_email(
		string $title,
		string $header,
		string $content,
		string $disclaimer = 'This is an automated message. Please do not reply directly to this email.<br>For support, use the contact information provided above.'
	): string {
		return sprintf(
			$this->get_base_template(),
			$title,
			$header,
			$content,
			$disclaimer
		);
	}
}