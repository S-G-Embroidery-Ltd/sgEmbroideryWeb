export class PasswordValidator {
  static validatePassword(password: string): { isValid: boolean; feedback: string[] } {
    const feedback: string[] = [];
    
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      feedback.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password must contain at least one special character');
    }
    
    return {
      isValid: feedback.length === 0,
      feedback
    };
  }
  
  static generatePasswordRequirements(): string[] {
    return [
      'At least 8 characters long',
      'Contains at least one uppercase letter',
      'Contains at least one lowercase letter', 
      'Contains at least one number',
      'Contains at least one special character'
    ];
  }
}
