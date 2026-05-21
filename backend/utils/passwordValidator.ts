// Password strength validation utilities

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  feedback: string[];
}

export class PasswordValidator {
  private static readonly MIN_LENGTH = 8;
  private static readonly REQUIREMENTS = {
    minLength: 8,
    hasUppercase: true,
    hasLowercase: true,
    hasNumbers: true,
    hasSpecialChars: true,
    noCommonPatterns: true,
    noSequentialChars: true
  };

  static validatePassword(password: string): PasswordStrengthResult {
    const feedback: string[] = [];
    let score = 0;

    // Length validation
    if (password.length < this.REQUIREMENTS.minLength) {
      feedback.push(`Password must be at least ${this.REQUIREMENTS.minLength} characters long`);
    } else {
      score += 1;
    }

    // Uppercase validation
    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    // Lowercase validation
    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    // Numbers validation
    if (!/\d/.test(password)) {
      feedback.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    // Special characters validation
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    // Common patterns check
    const commonPatterns = [
      /123456/, /password/i, /qwerty/i, /admin/i, /letmein/i,
      /abc123/i, /welcome/i, /monkey/i, /dragon/i
    ];

    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        feedback.push('Password contains common patterns that are easy to guess');
        score -= 1;
        break;
      }
    }

    // Sequential characters check
    if (this.hasSequentialChars(password)) {
      feedback.push('Password contains sequential characters');
      score -= 1;
    }

    // Repeated characters check
    if (this.hasRepeatedChars(password)) {
      feedback.push('Password contains too many repeated characters');
      score -= 1;
    }

    const isValid = score >= 4 && feedback.length === 0;

    return {
      isValid,
      score: Math.max(0, Math.min(5, score)),
      feedback
    };
  }

  private static hasSequentialChars(password: string): boolean {
    const sequences = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop'];
    
    for (const seq of sequences) {
      for (let i = 0; i <= seq.length - 3; i++) {
        const sequence = seq.substring(i, i + 3);
        if (password.toLowerCase().includes(sequence)) {
          return true;
        }
      }
    }
    return false;
  }

  private static hasRepeatedChars(password: string): boolean {
    // Check for 3 or more consecutive identical characters
    return /(.)\1\1/.test(password);
  }

  static getPasswordStrengthLabel(score: number): string {
    switch (score) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return 'Unknown';
    }
  }

  static generatePasswordRequirements(): string[] {
    return [
      `At least ${this.REQUIREMENTS.minLength} characters long`,
      'Contains at least one uppercase letter',
      'Contains at least one lowercase letter',
      'Contains at least one number',
      'Contains at least one special character',
      'Avoid common patterns like "password" or "123456"',
      'Avoid sequential characters like "abc" or "123"'
    ];
  }
}
